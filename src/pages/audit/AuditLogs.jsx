import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDateTime } from '../../utils/dateUtils';
import { History, Lock } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs } = useAppData();

  const columns = [
    {
      header: 'Timestamp',
      key: 'timestamp',
      render: (row) => <span className="font-mono text-[11px] text-slate-500">{formatDateTime(row.timestamp)}</span>
    },
    {
      header: 'User & Role',
      key: 'user',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.user}</p>
          <p className="text-[10px] text-blue-600 font-semibold">{row.role}</p>
        </div>
      )
    },
    {
      header: 'Module & Action',
      key: 'module',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">{row.module}</p>
          <span className="text-[10px] font-extrabold uppercase text-slate-500">{row.action}</span>
        </div>
      )
    },
    {
      header: 'Record ID',
      key: 'recordId',
      render: (row) => <span className="font-bold text-blue-600 font-mono">{row.recordId}</span>
    },
    {
      header: 'Action Description',
      key: 'description',
      render: (row) => <span className="truncate max-w-sm block text-slate-700 dark:text-slate-300">{row.description}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Append-only Audit Log Simulation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Read-only system activity log capturing all CRUD, status transitions, transfers & configurations
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          Read-Only Log Mode
        </div>
      </div>

      <DataTable columns={columns} data={auditLogs} itemsPerPage={10} emptyMessage="No audit logs recorded yet." />
    </div>
  );
}
