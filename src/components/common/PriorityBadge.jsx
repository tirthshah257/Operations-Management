import React from 'react';
import clsx from 'clsx';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  if (!priority) return null;

  const getConfig = (val) => {
    switch (val.toLowerCase()) {
      case 'critical':
        return {
          icon: AlertCircle,
          className: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
        };
      case 'high':
        return {
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800'
        };
      case 'medium':
        return {
          icon: ArrowUp,
          className: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800'
        };
      case 'low':
      default:
        return {
          icon: ArrowDown,
          className: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        };
    }
  };

  const config = getConfig(priority);
  const IconComponent = config.icon;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
        config.className
      )}
    >
      <IconComponent className="w-3 h-3 shrink-0" />
      {priority}
    </span>
  );
}
