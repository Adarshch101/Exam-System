import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import { api } from '../../services/api.js';

export default function ResultPage() {
  const { id, studentId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await api(`/submissions/${id}/results/${studentId}`);
        setData(res);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id, studentId]);

  if (error) return <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Results</h1>
        <BackButton />
      </div>
      <div className="card">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Score: {data.score}</div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Answers</h3>
          <ul className="text-sm divide-y divide-gray-100 dark:divide-gray-800">
            {data.details.map((d, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span className="text-gray-900 dark:text-gray-100">Q{d.question_id}</span>
                <span className={d.is_correct? 'text-green-600':'text-red-600'}>
                  {d.is_correct ? 'Correct' : `Your: ${d.chosen_option || '-'} | Correct: ${d.correct_option}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
