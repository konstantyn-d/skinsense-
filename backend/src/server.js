// src/server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import scanRoutes from './routes/scan.js';
import recommendationRoutes from './routes/recommendation.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- CORS (любой localhost/127.0.0.1 + preflight) ----
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman/curl
    const ok = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    return ok ? cb(null, true) : cb(new Error('CORS blocked'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};
app.use(cors(corsOptions));
// Вариант, не ломающий path-to-regexp:
app.options(/.*/, cors(corsOptions)); // вместо '*' используем regex

// ------------------------------------------------------
app.use(express.json({ limit: '10mb' }));

// статика для загруженных файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ping
app.get('/', (_, res) => res.send('SkinSense API is running'));
app.get('/health', (_, res) => res.json({ ok: true }));

// API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/recommendations', recommendationRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));
