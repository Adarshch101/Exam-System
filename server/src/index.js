import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './lib/db.js';  // make sure db uses a pool for MySQL
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exams.js';
import submissionRoutes from './routes/submissions.js';
import adminRoutes from './routes/admin.js';
import meRoutes from './routes/me.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS (adjust allowed origins if needed)
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

// Health check route
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ ok: rows?.[0]?.ok === 1, db: "mysql" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "DB check failed" });
  }
});

// TODO: attach your routes here
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/me", meRoutes);



initDb()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 API running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to initialize DB", err);
    process.exit(1);
  });
