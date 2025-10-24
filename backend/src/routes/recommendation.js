// src/routes/recommendation.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = Router();

// Создать рекомендацию (admin/use-case: предзаполняем справочник)
router.post('/', auth, async (req, res) => {
  const { title, description, category, linkUrl } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });

  const rec = await prisma.recommendationItem.create({
    data: { title, description, category, linkUrl }
  });
  res.json(rec);
});

// Получить список
router.get('/', auth, async (_req, res) => {
  const list = await prisma.recommendationItem.findMany({ orderBy: { id: 'desc' } });
  res.json(list);
});

export default router;
