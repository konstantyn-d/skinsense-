// src/routes/user.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middlewares/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/me', auth, async (req, res) => {
  const me = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { profile: true }
  });
  res.json(me);
});

router.put('/profile', auth, async (req, res) => {
  const { skinType, skinHealthProblems, otherHealthProblems, recommendationsNote } = req.body || {};
  const updated = await prisma.userProfile.upsert({
    where: { userId: req.user.id },
    create: { userId: req.user.id, skinType, skinHealthProblems, otherHealthProblems, recommendationsNote },
    update: { skinType, skinHealthProblems, otherHealthProblems, recommendationsNote }
  });
  res.json(updated);
});

export default router;
