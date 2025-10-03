import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';
import BackButton from '../../components/BackButton.jsx';

export default function CreateExam() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ex = await api('/exams', { method: 'POST', body: { title, description, duration_minutes: Number(duration), scheduled_at: scheduledAt || null }, successMessage: 'Exam created successfully' });
      navigate(`/instructor/exams/${ex.id}/questions`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create Exam</h1>
          <BackButton />
        </div>
        {error && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" value={description} onChange={(e)=>setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Duration (minutes)</label>
            <input className="input" type="number" min="1" value={duration} onChange={(e)=>setDuration(e.target.value)} required />
          </div>
          <div>
            <label className="label">Scheduled At (optional)</label>
            <input className="input" type="datetime-local" value={scheduledAt} onChange={(e)=>setScheduledAt(e.target.value)} />
          </div>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </form>
      </div>
    </div>
  );
}
