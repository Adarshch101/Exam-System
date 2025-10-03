import React, { useState } from 'react';
import { useAuth } from '../../store/auth.js';
import { api } from '../../services/api.js';

export default function Profile() {
  const { user, updateUser } = useAuth();
  if (!user) return <div className="text-center text-gray-600 dark:text-gray-300">Loading profile…</div>;
  const initials = (user.name || user.email || '?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [error, setError] = useState('');
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-2xl" />
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {!editing ? (
            <button className="btn btn-primary" onClick={()=>{ setForm({ name: user.name, email: user.email }); setEditing(true); }}>Edit Profile</button>
          ) : (
            <>
              <button className="btn btn-primary" disabled={saving} onClick={async()=>{
                try {
                  setSaving(true); setError('');
                  const updated = await api('/me', { method: 'PATCH', body: form, successMessage: 'Profile updated' });
                  updateUser(updated);
                  setEditing(false);
                } catch (e) {
                  setError(e.message);
                } finally { setSaving(false); }
              }}>Save</button>
              <button className="btn" onClick={()=>{ setEditing(false); setForm({ name: user.name, email: user.email }); }}>Cancel</button>
            </>
          )}
        </div>
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center text-lg font-semibold">{initials}</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Profile</h1>
            <div className="text-sm text-gray-600 dark:text-gray-300">Manage your account details</div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}

      <form className="grid md:grid-cols-2 gap-6" onSubmit={(e)=>e.preventDefault()}>
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Name</label>
            <input className={`input ${!editing ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed' : ''}`} value={editing ? form.name : user.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} readOnly={!editing} />
            <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
            <input className={`input ${!editing ? 'bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed' : ''}`} value={editing ? form.email : user.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} readOnly={!editing} />
          </div>
        </div>
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Role & Access</h2>
          <div className="grid grid-cols-1 gap-3">
            <label className="text-sm text-gray-600 dark:text-gray-300">Role</label>
            <input className="input capitalize" value={user.role} readOnly />
            <label className="text-sm text-gray-600 dark:text-gray-300">Member Since</label>
            <input className="input" value={user.created_at ? new Date(user.created_at).toLocaleString() : '—'} readOnly />
          </div>
        </div>
        <div className="card p-5 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Password changes can be handled by your administrator or via a dedicated flow.</p>
        </div>
      </form>
    </div>
  );
}
