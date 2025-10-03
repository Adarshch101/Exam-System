import React from 'react';

export default function StatusChip({ status, className = '' }) {
  const map = {
    scheduled: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
    unscheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
  };
  const label = String(status || '').toLowerCase();
  const cls = map[label] || map.draft;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls} ${className}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  );
}
