import React from 'react';
import { Link } from 'react-router-dom';
import { languages, databases, frameworks, palette, shadowPalette } from '../../data/languages.js';

export default function Study() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Study Resources</h1>
      <p className="text-gray-600 dark:text-gray-300">Browse resources by category: programming languages, databases, and frameworks.</p>

      {/* Languages */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Languages</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((l) => (
            <Link
              key={l.id}
              to={`/study/${l.id}`}
              className={`relative overflow-hidden rounded-xl p-5 text-left shadow-2xl focus:outline-none bg-gradient-to-br ${palette[l.id]} text-white h-full min-h-[140px] ${shadowPalette[l.id]}`}
              title={`Study ${l.title}`}
            >
              <div className="text-sm font-semibold text-black">{l.title}</div>
              <div className="mt-1 text-xs opacity-80">{l.desc}</div>
              <span className="mt-3 inline-block text-[11px] bg-black/70 text-white rounded px-2 py-1 font-mono">Snippet</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Databases */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Databases</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {databases.map((d) => (
            <Link
              key={d.id}
              to={`/study/${d.id}`}
              className={`relative overflow-hidden rounded-xl p-5 text-left shadow-2xl focus:outline-none bg-gradient-to-br ${palette[d.id]} text-white h-full min-h-[140px] ${shadowPalette[d.id]}`}
              title={`Study ${d.title}`}
            >
              <div className="text-sm font-semibold text-black">{d.title}</div>
              <div className="mt-1 text-xs opacity-80">{d.desc}</div>
              <span className="mt-3 inline-block text-[11px] bg-black/70 text-white rounded px-2 py-1 font-mono">Snippet</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Frameworks */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Frameworks</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((f) => (
            <Link
              key={f.id}
              to={`/study/${f.id}`}
              className={`relative overflow-hidden rounded-xl p-5 text-left shadow-2xl focus:outline-none bg-gradient-to-br ${palette[f.id]} text-white h-full min-h-[140px] ${shadowPalette[f.id]}`}
              title={`Study ${f.title}`}
            >
              <div className="text-sm font-semibold text-black">{f.title}</div>
              <div className="mt-1 text-xs opacity-80">{f.desc}</div>
              <span className="mt-3 inline-block text-[11px] bg-black/70 text-white rounded px-2 py-1 font-mono">Snippet</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
