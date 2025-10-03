import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/requireAuth.js';
import { createUser, findUserByEmail } from '../lib/auth.js';

const router = express.Router();

// Admin-only endpoints
router.use(requireAuth, requireRole('admin'));

// GET /api/admin/users -> manage users (list)
router.get('/users', async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/users -> create a user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
    if (!['student','instructor','admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const user = await createUser({ name, email, password, role });
    res.status(201).json(user);
  } catch (e) {
    console.error('admin create user error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/users/:id/role -> change role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body || {};
    if (!['student','instructor','admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    if (Number(id) === req.user.id && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot change your own role away from admin' });
    }
    const user = await db.get('SELECT id FROM users WHERE id = ?', id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await db.run('UPDATE users SET role = ? WHERE id = ?', role, id);
    const updated = await db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', id);
    res.json(updated);
  } catch (e) {
    console.error('admin change role error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/users/:id -> delete user (not self)
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (Number(id) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    const user = await db.get('SELECT id FROM users WHERE id = ?', id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await db.run('DELETE FROM users WHERE id = ?', id);
    res.json({ ok: true });
  } catch (e) {
    console.error('admin delete user error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/exams -> manage exams (list)
router.get('/exams', async (req, res) => {
  try {
    const exams = await db.all(
      `SELECT e.*, u.name as instructor_name
       FROM exams e JOIN users u ON e.instructor_id = u.id
       ORDER BY e.created_at DESC`
    );
    res.json(exams);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/stats -> overview counts and simple trends
router.get('/stats', async (req, res) => {
  try {
    const usersTotal = await db.get('SELECT COUNT(*) AS total FROM users');
    const roles = await db.get(
      `SELECT 
         SUM(role='student') AS students,
         SUM(role='instructor') AS instructors,
         SUM(role='admin') AS admins
       FROM users`
    );
    const examsTotal = await db.get('SELECT COUNT(*) AS total FROM exams');
    const submissionsTotal = await db.get('SELECT COUNT(*) AS total FROM submissions');

    const exams7d = await db.all(
      `SELECT DATE(created_at) AS day, COUNT(*) AS count
       FROM exams
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(created_at)
       ORDER BY day`
    );
    const subs7d = await db.all(
      `SELECT DATE(submitted_at) AS day, COUNT(*) AS count
       FROM submissions
       WHERE submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
       GROUP BY DATE(submitted_at)
       ORDER BY day`
    );

    res.json({
      users: { total: usersTotal?.total ?? 0, ...roles },
      exams: { total: examsTotal?.total ?? 0 },
      submissions: { total: submissionsTotal?.total ?? 0 },
      last7d: { exams: exams7d, submissions: subs7d }
    });
  } catch (e) {
    console.error('admin/stats error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
