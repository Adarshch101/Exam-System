import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, actionLabel, actionTo, icon }) {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg text-gray-600 dark:text-gray-300">
      <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        )}
      </div>
      <div className="font-semibold text-gray-900 dark:text-gray-100">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{message}</div>
      {actionTo && (
        <div className="mt-3">
          <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>
        </div>
      )}
    </div>
  );
}
