import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { languages, databases, frameworks } from '../../data/languages.js';

export default function StudyLanguage() {
  const { id } = useParams();
  const all = [...languages, ...databases, ...frameworks];
  const lang = all.find(l => l.id === id);

  if (!lang) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Not found</h1>
        <p className="text-gray-600 dark:text-gray-300">We couldn't find that study item.</p>
        <Link to="/study" className="btn">Back to Study</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{lang.title} study guide</h1>
        <Link to="/study" className="btn">All resources</Link>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{lang.desc}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Basics</h2>
          <ul className="mt-2 list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
            {lang.detail.basics.map((s,i)=>(<li key={i}>{s}</li>))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Intermediate</h2>
          <ul className="mt-2 list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
            {lang.detail.intermediate.map((s,i)=>(<li key={i}>{s}</li>))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Advanced</h2>
          <ul className="mt-2 list-disc ml-5 text-sm text-gray-700 dark:text-gray-300">
            {lang.detail.advanced.map((s,i)=>(<li key={i}>{s}</li>))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Example</h2>
          <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-md overflow-auto text-xs">{lang.detail.snippet}</pre>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Quick snippet</h3>
        <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded-md overflow-auto text-xs">{lang.snippet}</pre>
      </div>
    </div>
  );
}
