import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ label = 'Back' }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10.53 19.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L3.81 10.5H21a.75.75 0 010 1.5H3.81l6.72 6.72a.75.75 0 010 1.06z" clipRule="evenodd" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
