import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../../components/Reveal.jsx';
import { useAuth } from '../../store/auth.js';
import { api } from '../../services/api.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [u, r] = await Promise.all([
          api('/me/upcoming-exams'),
          api('/me/results')
        ]);
        setUpcoming(u);
        setResults(r);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = upcoming.length;
  const scheduled = upcoming.filter(e => !!e.scheduled_at).length;
  const unscheduled = Math.max(0, total - scheduled);

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-brand-50 via-white to-brand-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-200/30 dark:bg-brand-900/20 blur-2xl" />
          <div className="absolute -bottom-12 -left-6 w-48 h-48 rounded-full bg-brand-300/20 dark:bg-brand-900/10 blur-2xl" />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Role: {user?.role ?? 'student'}</div>
              {user?.email && <div className="text-sm text-gray-600 dark:text-gray-300">Email: {user.email}</div>}
            </div>
            <Link to="/exams" className="btn btn-primary shadow hover:shadow-md transition">Browse Exams</Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-md bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"/></svg>
              </span>
              <div>
                <div className="text-sm text-gray-500">Upcoming Exams</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{total}</div>
              </div>
            </div>
          </div>
          <div className="card p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.59l4.3-4.3a1 1 0 10-1.41-1.41L12 13.76l-1.89-1.88a1 1 0 10-1.41 1.41L11 16.59a1 1 0 001.41 0z"/></svg>
              </span>
              <div>
                <div className="text-sm text-gray-500">Scheduled</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{scheduled}</div>
              </div>
            </div>
          </div>
          <div className="card p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5 3a2 2 0 00-2 2v14l5-3 5 3 5-3 5 3V5a2 2 0 00-2-2H5z"/></svg>
              </span>
              <div>
                <div className="text-sm text-gray-500">Recent Results</div>
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{results.length}</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="card hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upcoming Exams</h2>
            <Link to="/exams" className="link">View all</Link>
          </div>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <ul className="divide-y">
            {upcoming.slice(0,6).map(ex => (
              <li key={ex.id} className="py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{ex.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{ex.duration_minutes} mins · {ex.scheduled_at ? new Date(ex.scheduled_at).toLocaleString() : 'Not scheduled'}</div>
                </div>
                <Link to={`/exams/${ex.id}/attempt`} className="btn btn-primary">Attempt</Link>
              </li>
            ))}
            {!loading && upcoming.length === 0 && <div className="text-gray-500 dark:text-gray-400">No upcoming exams.</div>}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="card hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Results</h2>
          </div>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <ul className="divide-y">
            {results.map(r => (
              <li key={r.submission_id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{r.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Score: {r.score} · {new Date(r.submitted_at).toLocaleString()}</div>
                </div>
                <Link to={`/exams/${r.exam_id}/leaderboard`} className="btn">Leaderboard</Link>
              </li>
            ))}
            {!loading && results.length === 0 && <div className="text-gray-500 dark:text-gray-400">No recent results.</div>}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
