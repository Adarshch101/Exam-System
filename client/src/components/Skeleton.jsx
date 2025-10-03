import React from 'react';

export default function Skeleton({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2 last:mb-0"></div>
      ))}
    </div>
  );
}
