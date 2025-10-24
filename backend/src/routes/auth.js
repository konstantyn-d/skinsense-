// src/routes/auth.js
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt.js';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email exists' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name: name || 'User', email, passwordHash, profile: { create: {} } },
    select: { id: true, name: true, email: true }
  });

  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid creds' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid creds' });

  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
