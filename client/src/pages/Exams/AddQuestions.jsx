import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api.js';
import BackButton from '../../components/BackButton.jsx';

export default function AddQuestions() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([emptyQ()]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [startIndex, setStartIndex] = useState(0); // existing questions count for numbering

  function emptyQ() {
    return { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', marks: 1, negative_marks: 0 };
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await api(`/exams/${id}/questions`);
        setExam(data.exam);
        const existing = Array.isArray(data.questions) ? data.questions.length : 0;
        setStartIndex(existing);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  const addRow = () => setQuestions(qs => [...qs, emptyQ()]);
  const updateQ = (idx, field, value) => setQuestions(qs => qs.map((q,i) => i===idx?{...q, [field]: value}:q));
  const removeQ = (idx) => setQuestions(qs => qs.filter((_,i)=>i!==idx));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg(''); setLoading(true);
    try {
      await api(`/exams/${id}/questions`, { method: 'POST', body: { questions }, successMessage: 'Questions added successfully' });
      // After successful save: increment base index and reset to a fresh empty question
      setStartIndex((s) => s + questions.length);
      setQuestions([emptyQ()]);
      setMsg('Questions added');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Add Questions {exam ? `· ${exam.title}` : ''}</h1>
        <BackButton />
      </div>
      {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
      {msg && <div className="text-green-600 dark:text-green-400 text-sm">{msg}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        {questions.map((q, idx) => (
          <div className="card" key={idx}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Question {startIndex + idx + 1}</h3>
              <button type="button" className="link" onClick={()=>removeQ(idx)}>Remove</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Text</label>
                <textarea className="input" value={q.text} onChange={e=>updateQ(idx,'text',e.target.value)} required />
              </div>
              <div>
                <label className="label">Correct Option</label>
                <select className="input" value={q.correct_option} onChange={e=>updateQ(idx,'correct_option',e.target.value)}>
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </div>
              {['a','b','c','d'].map(k => (
                <div key={k}>
                  <label className="label">Option {k.toUpperCase()}</label>
                  <input className="input" value={q[`option_${k}`]} onChange={e=>updateQ(idx,`option_${k}`,e.target.value)} required />
                </div>
              ))}
              <div>
                <label className="label">Marks</label>
                <input className="input" type="number" min="0" value={q.marks} onChange={e=>updateQ(idx,'marks',Number(e.target.value))} />
              </div>
              <div>
                <label className="label">Negative Marks</label>
                <input className="input" type="number" step="0.25" min="0" value={q.negative_marks} onChange={e=>updateQ(idx,'negative_marks',Number(e.target.value))} />
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <button type="button" className="btn" onClick={addRow}>Add another</button>
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Questions'}</button>
        </div>
      </form>
    </div>
  );
}
