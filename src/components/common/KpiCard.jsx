import React from 'react';
import clsx from 'clsx';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue', onClick, className }) {
  const getColorStyle = (c) => {
    switch (c) {
      case 'rose':
      case 'red':
        return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900';
      case 'amber':
      case 'yellow':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900';
      case 'emerald':
      case 'green':
        return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900';
      case 'indigo':
      case 'purple':
        return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100 dark:border-blue-900';
    }
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transform hover:-translate-y-0.5',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={clsx('p-2.5 rounded-lg border', getColorStyle(color))}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
