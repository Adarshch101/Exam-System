import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initDb, db } from '../lib/db.js';

// Idempotent seed helper: run a SELECT and only insert if missing
async function ensureUser({ name, email, password, role }) {
  const existing = await db.get('SELECT id FROM users WHERE email = ?', email);
  if (existing) return existing.id;
  const hash = await bcrypt.hash(password, 10);
  const res = await db.run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    name,
    email,
    hash,
    role
  );
  const row = await db.get('SELECT id FROM users WHERE email = ?', email);
  return row?.id || res.lastID;
}

async function ensureExam({ title, description, duration_minutes, instructor_id, scheduled_at = null }) {
  const existing = await db.get('SELECT id FROM exams WHERE title = ? AND instructor_id = ?', title, instructor_id);
  if (existing) return existing.id;
  const res = await db.run(
    'INSERT INTO exams (title, description, duration_minutes, instructor_id, scheduled_at) VALUES (?, ?, ?, ?, ?)',
    title,
    description,
    duration_minutes,
    instructor_id,
    scheduled_at
  );
  const row = await db.get('SELECT id FROM exams WHERE title = ? AND instructor_id = ?', title, instructor_id);
  return row?.id || res.lastID;
}

async function ensureQuestion(exam_id, q) {
  const existing = await db.get(
    'SELECT id FROM questions WHERE exam_id = ? AND text = ? LIMIT 1',
    exam_id,
    q.text
  );
  if (existing) return existing.id;
  const res = await db.run(
    'INSERT INTO questions (exam_id, text, option_a, option_b, option_c, option_d, correct_option, marks, negative_marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    exam_id,
    q.text,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_option,
    q.marks ?? 1,
    q.negative_marks ?? 0
  );
  const row = await db.get('SELECT id FROM questions WHERE exam_id = ? AND text = ?', exam_id, q.text);
  return row?.id || res.lastID;
}

async function main() {
  dotenv.config();
  await initDb();

  // Create users
  const adminId = await ensureUser({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  });
  const instructorId = await ensureUser({
    name: 'Instructor One',
    email: 'instructor@example.com',
    password: 'instructor123',
    role: 'instructor',
  });
  const studentId = await ensureUser({
    name: 'Student One',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
  });

  // Create a sample exam
  const examId = await ensureExam({
    title: 'Sample MCQ Exam',
    description: 'A short multiple-choice exam to verify the system works.',
    duration_minutes: 30,
    instructor_id: instructorId,
  });

  // Create sample questions
  await ensureQuestion(examId, {
    text: 'What is 2 + 2?',
    option_a: '3',
    option_b: '4',
    option_c: '5',
    option_d: '22',
    correct_option: 'B',
    marks: 1,
  });

  await ensureQuestion(examId, {
    text: 'Capital of France?',
    option_a: 'Berlin',
    option_b: 'Madrid',
    option_c: 'Paris',
    option_d: 'Rome',
    correct_option: 'C',
    marks: 1,
  });

  console.log('Seed complete:', { adminId, instructorId, studentId, examId });
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
