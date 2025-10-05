import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './lib/db.js';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import submissionRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';
import meRoutes from './routes/me.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PORT = process.env.DB_PORT;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://loaclhost:8080',
  'https://exam-system-omega.vercel.app',
  'https://exam-system-y9fx.vercel.app',
  process.env.CORS_ORIGIN // still allow single-origin override
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: ${origin} not allowed`), false);
  },
  credentials: false
}));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const client = (process.env.DB_CLIENT || 'sqlite').toLowerCase();
    if (client === 'mysql') {
      const [rows] = await db.query('SELECT 1 AS ok');
      return res.json({ ok: rows?.[0]?.ok === 1, db: 'mysql' });
    } else {
      const row = await db.get('SELECT 1 AS ok');
      return res.json({ ok: row?.ok === 1, db: 'sqlite' });
    }
  } catch (err) {
    console.error('Health check failed:', err);
    return res.status(500).json({ ok: false, error: 'DB check failed' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/me', meRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT} and db connected successfully on ${DB_PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  });

export { app, db };
