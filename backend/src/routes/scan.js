// src/routes/scan.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeImageWithAI } from '../services/aiAnalysis.js';

const prisma = new PrismaClient();
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const t = Date.now();
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${t}_${safe}`);
  }
});
const upload = multer({ storage });

// Получить список сканов пользователя
router.get('/', auth, async (req, res) => {
  const scans = await prisma.skinScan.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(scans);
});

// Загрузка файла (камерой или через input[type=file]) — multipart/form-data, field name: image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });

  const relPath = path.relative(path.join(__dirname), req.file.path).replace(/\\/g, '/');
  const scan = await prisma.skinScan.create({
    data: { userId: req.user.id, imagePath: relPath }
  });

  res.json({ scan });
});

// Альтернатива: загрузка base64 (если когда-то понадобится)
router.post('/upload-base64', auth, async (req, res) => {
  const { dataUrl, filename = `capture_${Date.now()}.png` } = req.body || {};
  if (!dataUrl?.startsWith('data:')) return res.status(400).json({ error: 'Invalid dataUrl' });

  const base64 = dataUrl.split(',')[1];
  const buf = Buffer.from(base64, 'base64');
  const outPath = path.join(uploadDir, filename);
  fs.writeFileSync(outPath, buf);

  const relPath = path.relative(path.join(__dirname), outPath).replace(/\\/g, '/');
  const scan = await prisma.skinScan.create({
    data: { userId: req.user.id, imagePath: relPath }
  });

  res.json({ scan });
});

// Анализ скана -> сохраняем метрики
router.post('/:scanId/analyze', auth, async (req, res) => {
  const scanId = Number(req.params.scanId);
  const scan = await prisma.skinScan.findUnique({ where: { id: scanId } });
  if (!scan || scan.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });

  const result = await analyzeImageWithAI(path.join(__dirname, scan.imagePath));
  const updated = await prisma.skinScan.update({
    where: { id: scanId },
    data: {
      rawResultJson: JSON.stringify(result),
      scoreAcne: result.acne ?? null,
      scoreWrinkles: result.wrinkles ?? null,
      scoreRedness: result.redness ?? null,
      scoreDarkSpots: result.darkSpots ?? null,
      scorePores: result.pores ?? null,
      summary: result.summary ?? null
    }
  });

  res.json(updated);
});

// Удалить скан + физический файл
router.delete('/:scanId', auth, async (req, res) => {
  const scanId = Number(req.params.scanId);
  const scan = await prisma.skinScan.findUnique({ where: { id: scanId } });
  if (!scan || scan.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });

  const full = path.join(__dirname, scan.imagePath);
  if (fs.existsSync(full)) fs.unlinkSync(full);

  await prisma.scanRecommendation.deleteMany({ where: { scanId } }).catch(()=>{});
  await prisma.skinScan.delete({ where: { id: scanId } });

  res.json({ ok: true });
});

export default router;
