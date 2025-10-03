import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../store/auth.js';
import RoleBadge from '../../components/RoleBadge.jsx';
import Toolbar from '../../components/Toolbar.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const [st, he, u, e] = await Promise.all([
          api('/admin/stats'),
          fetch((import.meta.env.VITE_API_URL || 'http://localhost:4001/api') + '/health').then(r => r.json()).catch(() => null),
          api('/admin/users'),
          api('/admin/exams')
        ]);
        setStats(st);
        setHealth(he);
        setUsers(u);
        setExams(e);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const refreshUsers = async () => {
    try {
      const u = await api('/admin/users', { showErrorToast: false });
      setUsers(u);
    } catch (_) {}
  };

  const onCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api('/admin/users', { method: 'POST', body: form, successMessage: 'User created' });
      setForm({ name: '', email: '', password: '', role: 'student' });
      await refreshUsers();
    } catch (_) {
    } finally {
      setCreating(false);
    }
  };

  const onChangeRole = async (id, role) => {
    try {
      await api(`/admin/users/${id}/role`, { method: 'PATCH', body: { role }, successMessage: 'Role updated' });
      setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
    } catch (_) {}
  };

  const onDeleteUser = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api(`/admin/users/${id}`, { method: 'DELETE', successMessage: 'User deleted' });
      setUsers(us => us.filter(u => u.id !== id));
    } catch (_) {}
  };

  const filteredUsers = users.filter(u => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || `${u.name} ${u.email}`.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const totalUsers = stats?.users?.total ?? users.length;
  const admins = stats?.users?.admins ?? users.filter(u => u.role === 'admin').length;
  const instructors = stats?.users?.instructors ?? users.filter(u => u.role === 'instructor').length;
  const students = stats?.users?.students ?? users.filter(u => u.role === 'student').length;
  const totalExams = stats?.exams?.total ?? exams.length;
  const totalSubs = stats?.submissions?.total ?? 0;

  const ok = health?.ok;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-6 w-48 h-48 rounded-full bg-emerald-300/20 dark:bg-emerald-900/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Admin Overview{user?.name ? ` · ${user.name}` : ''}</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Role: {user?.role ?? 'admin'}</div>
            {user?.email && <div className="text-sm text-gray-600 dark:text-gray-300">Email: {user.email}</div>}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm shadow ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            Health: {ok ? 'OK' : 'Down'} {health?.db ? `· DB: ${health.db}` : ''}
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}

      {/* KPI cards (simple) */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="card p-5 hover:shadow-md transition"><div className="text-sm text-gray-500">Users</div><div className="text-2xl font-semibold">{totalUsers}</div></div>
        <div className="card p-5 hover:shadow-md transition"><div className="text-sm text-gray-500">Admins</div><div className="text-2xl font-semibold">{admins}</div></div>
        <div className="card p-5 hover:shadow-md transition"><div className="text-sm text-gray-500">Instructors</div><div className="text-2xl font-semibold">{instructors}</div></div>
        <div className="card p-5 hover:shadow-md transition"><div className="text-sm text-gray-500">Students</div><div className="text-2xl font-semibold">{students}</div></div>
        <div className="card p-5 hover:shadow-md transition"><div className="text-sm text-gray-500">Submissions</div><div className="text-2xl font-semibold">{totalSubs}</div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Users card */}
        <div className="card hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Users</h2>
            <div className="text-sm text-gray-500">Total: {totalUsers}</div>
          </div>
          <form onSubmit={onCreateUser} className="mb-4 grid md:grid-cols-5 gap-2">
            <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
            <input className="input" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
            <select className="input" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
          </form>

          <Toolbar>
            <input className="input col-span-2" placeholder="Search by name or email" value={query} onChange={e=>setQuery(e.target.value)} />
            <select className="input" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
              <option value="all">All roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
          </Toolbar>

          <ul className="max-h-96 overflow-auto divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {filteredUsers.length === 0 && !error && (
              <EmptyState title="No users" message="Create your first user to get started." actionLabel="Create User" actionTo="#" />
            )}
            {filteredUsers.length === 0 && !error ? null : filteredUsers.map(u => {
              const initials = (u.name || u.email || '?').split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
              return (
                <li key={u.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 text-xs font-semibold">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-gray-900 dark:text-gray-100 truncate">{u.name}</div>
                      <div className="text-xs text-gray-500 truncate">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={u.role} />
                    <select className="input" value={u.role} onChange={e=>onChangeRole(u.id, e.target.value)} disabled={user?.id===u.id}>
                      <option value="student">student</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                    </select>
                    <button className="btn" onClick={()=>onDeleteUser(u.id)} disabled={user?.id===u.id}>Delete</button>
                  </div>
                </li>
              );
            })}
            {filteredUsers.length === 0 && error && <div className="text-gray-500 dark:text-gray-400 py-3">No users found.</div>}
          </ul>
        </div>

        {/* Exams card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Exams</h2>
            <div className="text-sm text-gray-500">Total: {totalExams}</div>
          </div>
          <ul className="max-h-96 overflow-auto divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {exams.length === 0 && !error && (
              <EmptyState title="No exams" message="Create an exam to see it listed here." actionLabel="Create Exam" actionTo="/instructor/exams/create" />
            )}
            {exams.length === 0 && !error ? null : exams.map(ex => (
              <li key={ex.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-gray-900 dark:text-gray-100 truncate">{ex.title}</div>
                  <div className="text-xs text-gray-500 truncate">ID: {ex.id}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">{ex.instructor_name}</span>
              </li>
            ))}
            {exams.length === 0 && error && <div className="text-gray-500 dark:text-gray-400 py-3">No exams found.</div>}
          </ul>
        </div>
      </div>
    </div>
  );
}