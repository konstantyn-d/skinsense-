// src/middlewares/auth.js
import { verifyToken } from '../utils/jwt.js';

export default function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = verifyToken(token); // { id, email }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
