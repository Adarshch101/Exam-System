import React from 'react';

export default function RoleBadge({ role, className = '' }) {
  const styles = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200',
    instructor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200',
    student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
  };
  const base = 'px-2 py-0.5 rounded-full text-xs font-medium';
  return (
    <span className={`${base} ${styles[role] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'} ${className}`}>
      {role}
    </span>
  );
}
