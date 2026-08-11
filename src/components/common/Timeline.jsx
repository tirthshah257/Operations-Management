import React from 'react';
import { Clock } from 'lucide-react';
import { formatDateTime } from '../../utils/dateUtils';

export default function Timeline({ events = [] }) {
  if (!events || events.length === 0) {
    return <p className="text-xs text-slate-400 italic">No timeline activity logged.</p>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {events.map((evt, idx) => (
        <div key={idx} className="relative group">
          <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {evt.action || evt.status}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {formatDateTime(evt.timestamp)}
              </span>
            </div>
            {evt.user && (
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mb-1">
                By {evt.user}
              </p>
            )}
            {(evt.notes || evt.location) && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {evt.notes || `Location: ${evt.location}`}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
