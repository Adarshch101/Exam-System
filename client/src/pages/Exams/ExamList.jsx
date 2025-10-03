import React, { useEffect, useState } from 'react';
import Reveal from '../../components/Reveal.jsx';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api('/exams');
        setExams(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <Reveal>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Exams</h1>
      </Reveal>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {exams.map((ex, i) => (
          <Reveal key={ex.id} delay={i * 80}>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{ex.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{ex.description || 'No description'}</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Duration: {ex.duration_minutes} minutes</div>
            <div className="mt-4 flex gap-2">
              <Link to={`/exams/${ex.id}/attempt`} className="btn btn-primary">Attempt</Link>
              <Link to={`/exams/${ex.id}/leaderboard`} className="btn">Leaderboard</Link>
            </div>
          </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
