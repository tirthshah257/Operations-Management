import React from 'react';

export default function ChartCard({ title, subtitle, action, children }) {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="w-full flex-1 min-h-[240px]">
        {children}
      </div>
    </div>
  );
}
