import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../store/auth.js';
import { api } from '../../services/api.js';
import StatusChip from '../../components/StatusChip.jsx';
import Toolbar from '../../components/Toolbar.jsx';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await api('/me/exams');
        setExams(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = exams.length;
  const scheduled = exams.filter(e => !!e.scheduled_at).length;

  const filteredExams = exams.filter(ex => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || String(ex.title || '').toLowerCase().includes(q);
    const isScheduled = !!ex.scheduled_at;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'scheduled' && isScheduled) || (statusFilter === 'unscheduled' && !isScheduled);
    return matchesQuery && matchesStatus;
  });

  const loadAnalysis = async (id) => {
    try {
      setSelectedId(id);
      const data = await api(`/exams/${id}/analysis`);
      setAnalysis(data);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-6 w-48 h-48 rounded-full bg-indigo-300/20 dark:bg-indigo-900/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Hello{user?.name ? `, ${user.name}` : ''}</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Role: {user?.role ?? 'instructor'}</div>
            {user?.email && <div className="text-sm text-gray-600 dark:text-gray-300">Email: {user.email}</div>}
          </div>
          <Link className="btn btn-primary shadow hover:shadow-md transition" to="/instructor/exams/create">Create Exam</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 hover:shadow-md transition">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3 5h18v2H3V5zm0 6h12v2H3v-2zm0 6h18v2H3v-2z"/></svg>
            </span>
            <div>
              <div className="text-sm text-gray-500">My Exams</div>
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
            <span className="p-2 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 22a1 1 0 01-.6-.2l-9-6.5a1 1 0 010-1.6l9-6.5a1 1 0 011.2 0l9 6.5a1 1 0 010 1.6l-9 6.5a1 1 0 01-.6.2z"/></svg>
            </span>
            <div>
              <div className="text-sm text-gray-500">Unscheduled</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{total - scheduled}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Exams</h2>
            <Link className="link" to="/instructor/exams/create">New exam</Link>
          </div>
          <Toolbar>
            <input className="input col-span-2" placeholder="Search exams" value={query} onChange={e=>setQuery(e.target.value)} />
            <select className="input" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="unscheduled">Unscheduled</option>
            </select>
          </Toolbar>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <ul className="divide-y">
            {filteredExams.map(ex => (
              <li key={ex.id} className="py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="truncate">{ex.title}</span>
                    <StatusChip status={ex.scheduled_at ? 'scheduled' : 'unscheduled'} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{ex.duration_minutes} mins · {ex.scheduled_at ? `Scheduled: ${new Date(ex.scheduled_at).toLocaleString()}` : 'Not scheduled'}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={() => loadAnalysis(ex.id)}>Analytics</button>
                  <Link to={`/instructor/exams/${ex.id}/questions`} className="btn">Add Questions</Link>
                  <Link to={`/exams/${ex.id}/leaderboard`} className="btn">Leaderboard</Link>
                </div>
              </li>
            ))}
            {!loading && filteredExams.length === 0 && <div className="text-gray-500 dark:text-gray-400">No exams match your filters.</div>}
          </ul>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Score Distribution{selectedId ? ` · Exam #${selectedId}` : ''}</h2>
          </div>
          {!analysis && <div className="text-gray-500 dark:text-gray-400 text-sm">Select an exam to view analytics.</div>}
          {analysis && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="card p-3"><div className="text-xs text-gray-500">Attempts</div><div className="text-lg font-semibold">{analysis.summary?.attempts ?? 0}</div></div>
                <div className="card p-3"><div className="text-xs text-gray-500">Avg</div><div className="text-lg font-semibold">{analysis.summary?.avg_score ?? 0}</div></div>
                <div className="card p-3"><div className="text-xs text-gray-500">Min</div><div className="text-lg font-semibold">{analysis.summary?.min_score ?? 0}</div></div>
                <div className="card p-3"><div className="text-xs text-gray-500">Max</div><div className="text-lg font-semibold">{analysis.summary?.max_score ?? 0}</div></div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Buckets (0-100 by 10)</div>
                <ul className="text-sm space-y-1">
                  {(analysis.buckets || []).map(b => (
                    <li key={b.bucket} className="flex items-center gap-3">
                      <div className="w-16 text-gray-600 dark:text-gray-400">{b.bucket}-{b.bucket + 9}</div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded overflow-hidden">
                        <div className="h-2 bg-indigo-600 dark:bg-indigo-500 rounded" style={{ width: `${Math.min(100, (b.count || 0) * 12)}%` }}></div>
                      </div>
                      <div className="w-8 text-right">{b.count}</div>
                    </li>
                  ))}
                  {(analysis.buckets || []).length === 0 && <div className="text-gray-500 dark:text-gray-400">No submissions yet.</div>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
