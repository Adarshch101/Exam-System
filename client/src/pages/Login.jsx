import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../store/auth.js';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', body: { email, password }, successMessage: 'Logged in successfully' });
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Log in to access your dashboard.</p>
          {error && <div className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</div>}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 dark:text-gray-500">@</span>
                <input className="input pl-8" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPwd(v=>!v)}
                  className="absolute inset-y-0 right-2 px-2 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M21 12s-3.5 6-9 6-9-6-9-6 3.5-6 9-6c1.63 0 3.13.45 4.44 1.2"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <button type="button" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">Forgot password?</button>
              </div>
            </div>
            <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          </form>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">No account? <Link className="link" to="/signup">Create one</Link></p>
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            Tip: roles available are <span className="font-medium">student</span>, <span className="font-medium">instructor</span>, and <span className="font-medium">admin</span>.
          </div>
        </div>
        {/* Illustration side */}
        <div className="hidden md:block bg-gradient-to-br from-brand-600 to-brand-700">
          <div className="h-full w-full relative">
            <img
              src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600&auto=format&fit=crop"
              alt="Learning"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 p-8 text-white flex items-end">
              <div>
                <div className="text-sm uppercase tracking-wide text-white/80">Secure & Fast</div>
                <div className="text-2xl font-semibold leading-tight">Your learning companion for exams</div>
                <div className="mt-2 text-white/80 text-sm">Timed exams, autosave answers and instant results.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
