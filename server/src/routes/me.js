import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/requireAuth.js';

const router = express.Router();

// All endpoints under /api/me require auth
router.use(requireAuth);

// GET /api/me/upcoming-exams
router.get('/upcoming-exams', async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT id, title, scheduled_at, duration_minutes
       FROM exams
       WHERE scheduled_at IS NOT NULL AND scheduled_at > datetime('now')
       ORDER BY scheduled_at ASC
       LIMIT 20`
    );
    res.json(rows);
  } catch (e) {
    console.error('me/upcoming-exams error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/me/results (latest submissions for the authenticated student)
router.get('/results', async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT s.id AS submission_id, s.exam_id, e.title, s.score, s.submitted_at
       FROM submissions s
       JOIN exams e ON e.id = s.exam_id
       WHERE s.student_id = ?
       ORDER BY s.submitted_at DESC
       LIMIT 10`,
      req.user.id
    );
    res.json(rows);
  } catch (e) {
    console.error('me/results error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/me/exams (exams created by the instructor/admin)
router.get('/exams', requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT * FROM exams WHERE instructor_id = ? ORDER BY created_at DESC`,
      req.user.id
    );
    res.json(rows);
  } catch (e) {
    console.error('me/exams error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/me -> update current user's name/email
router.patch('/', async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name && !email) return res.status(400).json({ error: 'Nothing to update' });

    if (email) {
      const existing = await db.get('SELECT id FROM users WHERE email = ? AND id <> ?', email, req.user.id);
      if (existing) return res.status(409).json({ error: 'Email already in use' });
    }

    const current = await db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', req.user.id);
    if (!current) return res.status(404).json({ error: 'User not found' });

    const nextName = name !== undefined ? name : current.name;
    const nextEmail = email !== undefined ? email : current.email;

    await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', nextName, nextEmail, req.user.id);
    const updated = await db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', req.user.id);
    res.json(updated);
  } catch (e) {
    console.error('me PATCH error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/me -> delete current user account
router.delete('/', async (req, res) => {
  try {
    const current = await db.get('SELECT id FROM users WHERE id = ?', req.user.id);
    if (!current) return res.status(404).json({ error: 'User not found' });

    try { await db.run('DELETE FROM submissions WHERE student_id = ?', req.user.id); } catch (_) {}
    try { await db.run('DELETE FROM exams WHERE instructor_id = ?', req.user.id); } catch (_) {}

    await db.run('DELETE FROM users WHERE id = ?', req.user.id);
    return res.json({ ok: true });
  } catch (e) {
    console.error('me DELETE error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
