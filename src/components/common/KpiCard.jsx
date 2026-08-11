import React from 'react';
import clsx from 'clsx';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue', onClick }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800/60',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    red: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 border-violet-200 dark:border-violet-800/60'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-3.5 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs transition-all duration-200 flex flex-col justify-between',
        onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.98]' : ''
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider line-clamp-1">
          {title}
        </span>
        {Icon && (
          <div className={clsx('p-2 rounded-xl border shrink-0', colorMap[color] || colorMap.blue)}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
