import React from 'react';

export default function Toolbar({ children, className = '' }) {
  return (
    <div className={`sticky top-0 z-10 mb-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 rounded-md p-2 border border-gray-100 dark:border-gray-800 ${className}`}>
      <div className="grid md:grid-cols-3 gap-2">
        {children}
      </div>
    </div>
  );
}
