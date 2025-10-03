import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton.jsx';
import { api } from '../../services/api.js';
import { useAuth } from '../../store/auth.js';

export default function AttemptExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(0); // seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const storageKey = useMemo(() => `exam_${id}_answers_${user?.id}`, [id, user]);
  const storageTimeKey = useMemo(() => `exam_${id}_start_${user?.id}`, [id, user]);

  useEffect(() => {
    (async () => {
      try {
        const { exam, questions } = await api(`/exams/${id}/questions`);
        setExam(exam); setQuestions(questions);
        const saved = localStorage.getItem(storageKey);
        if (saved) setAnswers(JSON.parse(saved));
        const start = localStorage.getItem(storageTimeKey);
        const now = Date.now();
        const startTime = start ? Number(start) : now;
        if (!start) localStorage.setItem(storageTimeKey, String(startTime));
        // Enforce fixed 90-minute duration (in seconds) regardless of server value
        const total = 90 * 60;
        const elapsed = Math.floor((now - startTime) / 1000);
        const rem = Math.max(0, total - elapsed);
        setRemaining(rem);
        // If time already elapsed (e.g., on reload), auto-submit immediately
        if (rem === 0) {
          // Yield to let state settle and avoid blocking
          setTimeout(() => onSubmit(), 0);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, storageKey, storageTimeKey]);

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          onSubmit();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  const onSelect = (qid, opt) => setAnswers(a => ({ ...a, [qid]: opt }));

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([question_id, chosen_option]) => ({ question_id: Number(question_id), chosen_option }));
      const res = await api(`/submissions/${id}/submit`, { method: 'POST', body: { answers: payload }, successMessage: 'Submission successful' });
      localStorage.removeItem(storageKey);
      localStorage.removeItem(storageTimeKey);
      navigate(`/exams/${id}/results/${user.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>;
  if (!exam) return null;

  const q = questions[idx];
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{exam.title}</h1>
        </div>
        <div className="text-lg font-mono text-gray-900 dark:text-gray-100">⏱ {mm}:{ss}</div>
      </div>
      {q && (
        <div className="card">
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Question {idx+1} of {questions.length} · {q.marks} marks</div>
          <div className="font-medium mb-4 text-gray-900 dark:text-gray-100">{q.text}</div>
          <div className="grid md:grid-cols-2 gap-3">
            {['A','B','C','D'].map(opt => (
              <label key={opt} className={`border rounded-md p-3 cursor-pointer ${answers[q.id]===opt? 'border-brand-600 bg-brand-50 dark:bg-brand-950/30':'border-gray-200 dark:border-gray-700'}`}>
                <input type="radio" className="mr-2" name={`q_${q.id}`} checked={answers[q.id]===opt} onChange={()=>onSelect(q.id, opt)} />
                <span className="font-semibold mr-2 text-gray-900 dark:text-gray-100">{opt}.</span>
                <span className="text-gray-900 dark:text-gray-100">{q[`option_${opt.toLowerCase()}`]}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button className="btn" disabled={idx===0} onClick={()=>setIdx(i=>i-1)}>Previous</button>
            <div className="flex gap-2">
              <button className="btn" disabled={idx===questions.length-1} onClick={()=>setIdx(i=>i+1)}>Next</button>
              <button className="btn btn-primary" onClick={onSubmit} disabled={submitting}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
