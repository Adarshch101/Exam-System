import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../store/auth.js';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api('/auth/signup', { method: 'POST', body: { name, email, password, role }, successMessage: 'Account created successfully' });
      login(user, token);
      navigate(`/${user.role}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        {/* Form side */}
        <div className="p-8">
          <div className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Join us</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Join as a student, instructor, or admin.</p>
          {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
          <form onSubmit={onSubmit} className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Name</label>
              <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">@</span>
                <input className="input pl-8" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">We’ll never share your email.</div>
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 8 characters" required />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use 8+ chars with letters and numbers.</div>
            </div>
            <div className="md:col-span-2">
              <label className="label">Role</label>
              <select className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
            </div>
          </form>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Have an account? <Link className="link" to="/login">Log in</Link></p>
        </div>
        {/* Illustration side */}
        <div className="hidden md:block bg-gradient-to-br from-brand-600 to-brand-700">
          <div className="h-full w-full relative">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
              alt="Create account"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 p-8 text-white flex items-end">
              <div>
                <div className="text-sm uppercase tracking-wide text-white/80">Get started</div>
                <div className="text-2xl font-semibold leading-tight">All-in-one exam system</div>
                <div className="mt-2 text-white/80 text-sm">Create exams, add questions, attempt and see results.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
