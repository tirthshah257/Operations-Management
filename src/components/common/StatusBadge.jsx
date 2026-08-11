import React from 'react';
import clsx from 'clsx';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const getStyle = (val) => {
    switch (val.toLowerCase()) {
      case 'open':
      case 'active':
      case 'within sla':
      case 'verified':
      case 'in stock':
      case 'approved':
      case 'normal':
      case 'compliant':
      case 'achieved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'in progress':
      case 'planned':
      case 'dispatched':
      case 'in transit':
      case 'approaching':
      case 'received':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'on hold':
      case 'expiring soon':
      case 'low stock':
      case 'pending':
      case 'under repair':
      case 'at capacity':
      case 'pending verification':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'breached':
      case 'expired':
      case 'critical':
      case 'rejected':
      case 'cancelled':
      case 'issue found':
      case 'compliance issue (overallocated)':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      case 'resolved':
      case 'closed':
      case 'completed':
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        getStyle(status)
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {status}
    </span>
  );
}
