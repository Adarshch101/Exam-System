import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api.js';
import BackButton from '../components/BackButton.jsx';

export default function Leaderboard() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api(`/exams/${id}/leaderboard`);
        setRows(data);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Leaderboard</h1>
        <BackButton />
      </div>
      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="py-2">Rank</th>
              <th className="py-2">Name</th>
              <th className="py-2">Score</th>
              <th className="py-2">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                <td className="py-2 text-gray-900 dark:text-gray-100">{i+1}</td>
                <td className="py-2 text-gray-900 dark:text-gray-100">{r.name}</td>
                <td className="py-2 text-gray-900 dark:text-gray-100">{r.score}</td>
                <td className="py-2 text-gray-900 dark:text-gray-100">{new Date(r.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
