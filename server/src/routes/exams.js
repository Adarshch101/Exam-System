import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/requireAuth.js';

const router = express.Router();

// GET /api/exams -> list all exams
router.get('/', requireAuth, async (req, res) => {
  try {
    const exams = await db.all(
      `SELECT e.*, u.name AS instructor_name
       FROM exams e
       LEFT JOIN users u ON e.instructor_id = u.id
       ORDER BY e.created_at DESC`
    );
    if(exams.length === 0){
      return res.status(404).json({ error: 'No exams found' });
    }
    res.json(exams);
  } catch (e) {
    console.error('Failed to list exams:', e);
    res.status(500).json({ error: 'Server error', code: e.code, msg: e.sqlMessage || e.message });
  }
});

// POST /api/exams -> create exam (instructor only)
router.post('/', requireAuth, requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const { title, description, duration_minutes, scheduled_at} = req.body;
    if (!title || !duration_minutes) return res.status(400).json({ error: 'Missing fields' });
    const dur = Number(duration_minutes);
    if (!Number.isFinite(dur) || dur <= 0) return res.status(400).json({ error: 'Invalid duration' });

    // Verify current user still exists (prevents FK errors if DB was reset)
    const me = await db.get('SELECT id, role FROM users WHERE id = ?', req.user.id);
    if (!me) return res.status(401).json({ error: 'User not found. Please re-login.' });
    if (me.role !== 'instructor' && me.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    // Normalize scheduled_at (HTML datetime-local emits YYYY-MM-DDTHH:MM)
    let sched = null;
    if (scheduled_at) {
      const s = String(scheduled_at).trim();
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) {
        sched = s.replace('T', ' ') + ':00';
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(s)) {
        sched = s + ':00';
      } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(s)) {
        sched = s;
      } else {
        return res.status(400).json({ error: 'Invalid scheduled_at format. Use YYYY-MM-DDTHH:MM' });
      }
    }

    const result = await db.run(
      `INSERT INTO exams (title, description, duration_minutes, instructor_id, scheduled_at)
       VALUES (?, ?, ?, ?, ?)`,
      title,
      description || null,
      dur,
      req.user.id,
      sched
    );
    const exam = await db.get('SELECT * FROM exams WHERE id = ?', result.lastID);
    res.status(201).json(exam);
  } catch (e) {
    console.error('Failed to create exam:', e);
    if (e.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Instructor user missing. Please re-login.' });
    }
    if (e.code === 'ER_TRUNCATED_WRONG_VALUE' || e.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      return res.status(400).json({ error: 'Invalid date/time format for scheduled_at' });
    }
    res.status(500).json({ error: 'Server error', code: e.code, msg: e.sqlMessage || e.message });
  }
});

// POST /api/exams/:id/questions -> add question(s)
router.post('/:id/questions', requireAuth, requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { questions } = req.body; // array of {text, option_a..d, correct_option, marks?, negative_marks?}
    if (!Array.isArray(questions) || questions.length === 0) return res.status(400).json({ error: 'No questions' });

    const exam = await db.get('SELECT * FROM exams WHERE id = ?', id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    if (req.user.role === 'instructor' && exam.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your exam' });
    }

    const stmt = await db.prepare(
      `INSERT INTO questions (exam_id, text, option_a, option_b, option_c, option_d, correct_option, marks, negative_marks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    try {
      for (const q of questions) {
        const { text, option_a, option_b, option_c, option_d, correct_option, marks = 1, negative_marks = 0 } = q;
        if (!text || !option_a || !option_b || !option_c || !option_d || !['A','B','C','D'].includes(correct_option)) {
          return res.status(400).json({ error: 'Invalid question format' });
        }
        await stmt.run(id, text, option_a, option_b, option_c, option_d, correct_option, marks, negative_marks);
      }
    } finally {
      await stmt.finalize();
    }

    const inserted = await db.all('SELECT * FROM questions WHERE exam_id = ? ORDER BY id ASC', id);
    res.status(201).json(inserted);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/exams/:id/questions -> get exam questions
router.get('/:id/questions', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.get('SELECT * FROM exams WHERE id = ?', id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    const qs = await db.all(
      `SELECT id, text, option_a, option_b, option_c, option_d, marks FROM questions WHERE exam_id = ? ORDER BY id ASC`,
      id
    );
    res.json({ exam, questions: qs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/exams/:id/leaderboard -> top scorers
router.get('/:id/leaderboard', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await db.all(
      `SELECT s.student_id, u.name, s.score, s.submitted_at
       FROM submissions s
       JOIN users u ON s.student_id = u.id
       WHERE s.exam_id = ?
       ORDER BY s.score DESC, s.submitted_at ASC
       LIMIT 50`,
      id
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/exams/:id/analysis -> score distribution and summary (instructor/admin)
router.get('/:id/analysis', requireAuth, requireRole('instructor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.get('SELECT * FROM exams WHERE id = ?', id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    if (req.user.role === 'instructor' && exam.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your exam' });
    }

    // Score summary
    const summary = await db.get(
      `SELECT COUNT(*) as attempts,
              ROUND(AVG(score),2) as avg_score,
              MIN(score) as min_score,
              MAX(score) as max_score
       FROM submissions WHERE exam_id = ?`,
      id
    );

    // Score distribution buckets of 10
    const buckets = await db.all(
      `SELECT FLOOR(score/10)*10 AS bucket, COUNT(*) AS count
       FROM submissions WHERE exam_id = ?
       GROUP BY bucket ORDER BY bucket`,
      id
    );

    // Per-question accuracy (if answers exist)
    const perQuestion = await db.all(
      `SELECT q.id, q.text, ROUND(AVG(a.is_correct)*100,2) AS accuracy_percent,
              COUNT(a.id) AS responses
       FROM questions q
       LEFT JOIN answers a ON a.question_id = q.id
       LEFT JOIN submissions s ON s.id = a.submission_id AND s.exam_id = q.exam_id
       WHERE q.exam_id = ?
       GROUP BY q.id, q.text
       ORDER BY q.id ASC`,
      id
    ).catch(() => []);

    res.json({ summary, buckets, perQuestion });
  } catch (e) {
    console.error('exam analysis error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
