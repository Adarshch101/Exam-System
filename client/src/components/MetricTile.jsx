import React from 'react';

export default function MetricTile({ icon, label, value, accent = 'indigo' }) {
  const accentMap = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  };
  return (
    <div className="card p-5 hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <span className={`p-2 rounded-md ${accentMap[accent] || accentMap.indigo}`}>
          {icon}
        </span>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
        </div>
      </div>
    </div>
  );
}
