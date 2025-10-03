import express from 'express';
import { db } from '../lib/db.js';
import { requireAuth, requireRole } from '../middleware/requireAuth.js';

const router = express.Router();

// POST /api/submissions/:examId/submit -> submit exam
router.post('/:examId/submit', requireAuth, requireRole('student', 'admin'), async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body; // array of { question_id, chosen_option }
    if (!Array.isArray(answers)) return res.status(400).json({ error: 'Invalid answers' });

    const exam = await db.get('SELECT * FROM exams WHERE id = ?', examId);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // enforce 24-hour cooldown since last submission by this student for this exam
    const last = await db.get(
      'SELECT submitted_at FROM submissions WHERE exam_id = ? AND student_id = ? ORDER BY submitted_at DESC LIMIT 1',
      examId,
      req.user.id
    );
    if (last && last.submitted_at) {
      const lastTime = new Date(last.submitted_at).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - lastTime) / 1000);
      const COOLDOWN = 24 * 60 * 60; // seconds
      if (elapsed < COOLDOWN) {
        const retryAfter = COOLDOWN - elapsed;
        const hours = Math.floor(retryAfter / 3600);
        const minutes = Math.floor((retryAfter % 3600) / 60);
        const seconds = retryAfter % 60;
        return res.status(429).json({
          error: 'Cooldown active',
          retry_after_seconds: retryAfter,
          message: `You can reattempt this exam in ${hours}h ${minutes}m ${seconds}s`,
        });
      }
    }

    // fetch questions
    const qs = await db.all('SELECT * FROM questions WHERE exam_id = ?', examId);
    const qMap = new Map(qs.map(q => [q.id, q]));

    // calculate score
    let score = 0;
    for (const ans of answers) {
      const q = qMap.get(ans.question_id);
      if (!q) continue;
      const marks = Number(q.marks) || 0;
      const neg = Number(q.negative_marks) || 0;
      if (ans.chosen_option === q.correct_option) {
        score += marks;
      } else {
        score -= neg;
      }
    }

    // create submission
    const sub = await db.run('INSERT INTO submissions (exam_id, student_id, score) VALUES (?, ?, ?)', examId, req.user.id, score);
    const submissionId = sub.lastID;

    // insert answers
    const stmt = await db.prepare('INSERT INTO answers (submission_id, question_id, chosen_option, is_correct) VALUES (?, ?, ?, ?)');
    try {
      for (const ans of answers) {
        const q = qMap.get(ans.question_id);
        if (!q) continue;
        const isCorrect = ans.chosen_option === q.correct_option ? 1 : 0;
        await stmt.run(submissionId, ans.question_id, ans.chosen_option || null, isCorrect);
      }
    } finally {
      await stmt.finalize();
    }

    res.status(201).json({ submission_id: submissionId, score });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/submissions/:examId/results/:studentId -> get student's score
router.get('/:examId/results/:studentId', requireAuth, async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    // Only the student or admin/instructor (for their exams) can view
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const submission = await db.get(
      'SELECT * FROM submissions WHERE exam_id = ? AND student_id = ? ORDER BY submitted_at DESC LIMIT 1',
      examId,
      studentId
    );
    if (!submission) return res.status(404).json({ error: 'Result not found' });

    const details = await db.all(
      `SELECT a.question_id, a.chosen_option, a.is_correct, q.correct_option
       FROM answers a JOIN questions q ON a.question_id = q.id
       WHERE a.submission_id = ?
       ORDER BY a.id ASC`,
      submission.id
    );

    res.json({ score: submission.score, details });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
