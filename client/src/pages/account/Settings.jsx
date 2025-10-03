import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth.js';
import { api } from '../../services/api.js';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [prefs, setPrefs] = useState({
    compact: false,
    emailNotifications: true,
    weeklySummary: false,
    language: 'en',
    timezone: 'Asia/Kolkata',
  });

  // Load saved preferences
  useEffect(() => {
    try {
      const raw = localStorage.getItem('app:prefs');
      if (raw) {
        const saved = JSON.parse(raw);
        setPrefs((p) => ({ ...p, ...saved }));
      }
    } catch (_) {}
  }, []);

  const savePrefs = () => {
    try {
      localStorage.setItem('app:prefs', JSON.stringify(prefs));
      toast.success('Preferences saved');
    } catch (_) {
      toast.error('Failed to save preferences');
    }
  };

  const onDelete = () => setShowDelete(true);
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await api('/me', { method: 'DELETE', successMessage: 'Account deleted' });
      logout();
      navigate('/');
    } catch (_) {
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Customize your preferences</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Preferences */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Preferences</h2>
          <div className="space-y-4 text-sm">
            <label className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Compact mode</div>
                <div className="text-gray-600 dark:text-gray-300">Reduce paddings and spacing across UI.</div>
              </div>
              <input type="checkbox" className="toggle" checked={prefs.compact} onChange={(e)=>setPrefs(p=>({...p, compact: e.target.checked}))} />
            </label>
            <div className="flex items-center justify-end">
              <button className="btn btn-primary" onClick={savePrefs}>Save</button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Notifications</h2>
          <div className="space-y-4 text-sm">
            <label className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Email notifications</div>
                <div className="text-gray-600 dark:text-gray-300">Get important updates about your exams.</div>
              </div>
              <input type="checkbox" className="toggle" checked={prefs.emailNotifications} onChange={(e)=>setPrefs(p=>({...p, emailNotifications: e.target.checked}))} />
            </label>
            <label className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">Weekly summary</div>
                <div className="text-gray-600 dark:text-gray-300">A weekly digest of activity and results.</div>
              </div>
              <input type="checkbox" className="toggle" checked={prefs.weeklySummary} onChange={(e)=>setPrefs(p=>({...p, weeklySummary: e.target.checked}))} />
            </label>
            <div className="flex items-center justify-end">
              <button className="btn btn-primary" onClick={savePrefs}>Save</button>
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Localization</h2>
          <div className="grid gap-3 text-sm">
            <label className="text-gray-600 dark:text-gray-300">Language</label>
            <select className="input" value={prefs.language} onChange={(e)=>setPrefs(p=>({...p, language: e.target.value}))}>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
            <label className="text-gray-600 dark:text-gray-300">Time zone</label>
            <select className="input" value={prefs.timezone} onChange={(e)=>setPrefs(p=>({...p, timezone: e.target.value}))}>
              <option value="UTC">UTC</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
              <option value="Europe/London">Europe/London (UK)</option>
            </select>
            <div className="flex items-center justify-end">
              <button className="btn btn-primary" onClick={savePrefs}>Save</button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Security</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">Two-factor authentication (2FA) support is coming soon.</div>
          <div className="mt-3">
            <button className="btn" disabled>Enable 2FA (coming soon)</button>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Data & Privacy</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <button className="btn" onClick={()=> toast.success('Data export started (demo)')}>Export my data</button>
          <button className="btn" onClick={()=>{ localStorage.removeItem('app:prefs'); toast.success('Preferences cleared'); }}>Clear saved preferences</button>
        </div>
      </div>

      <div className="card p-5 border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10">
        <h2 className="text-lg font-semibold text-rose-700 dark:text-rose-300 mb-2">Danger Zone</h2>
        <p className="text-sm text-rose-700/90 dark:text-rose-300/90 mb-3">Deleting your account is irreversible. All your data, exams and submissions will be removed.</p>
        <button className="btn bg-rose-600 text-white hover:bg-rose-700" onClick={onDelete}>Delete my account</button>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowDelete(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Delete account?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">This action cannot be undone. All your data will be permanently removed.</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="btn" onClick={()=>setShowDelete(false)} disabled={deleting}>Cancel</button>
              <button className="btn bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
