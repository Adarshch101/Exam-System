import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from './db.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key_change_me';

export function signToken(user) {
  const payload = { id: user.id, role: user.role, name: user.name, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function findUserByEmail(email) {
  return db.get('SELECT * FROM users WHERE email = ?', email);
}

export async function createUser({ name, email, password, role }) {
  const hash = await bcrypt.hash(password, 10);
  const result = await db.run(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    name,
    email,
    hash,
    role
  );
  return db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', result.lastID);
}

export async function validatePassword(password, password_hash) {
  return bcrypt.compare(password, password_hash);
}
