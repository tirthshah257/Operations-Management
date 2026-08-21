import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import KpiCard from '../../components/common/KpiCard';
import { Clock, ShieldAlert, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function SlaManagement() {
  const { tickets, complaintMatrix } = useAppData();

  const withinSlaCount = tickets.filter(t => t.slaEvaluation && !t.slaEvaluation.isOverdue).length;
  const breachedCount = tickets.filter(t => t.slaEvaluation && t.slaEvaluation.isOverdue).length;
  const total = tickets.length || 1;
  const complianceRate = Math.round((withinSlaCount / total) * 100);

  const columns = [
    {
      header: 'Category & Subcategory',
      key: 'category',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.category}</p>
          <p className="text-[10px] text-slate-500">{row.subcategory}</p>
        </div>
      )
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.priority}</span>
    },
    {
      header: 'SLA Target Duration',
      key: 'slaHours',
      render: (row) => <span className="font-bold text-blue-600 dark:text-blue-400">{row.slaHours} Hours</span>
    },
    {
      header: 'Responsible Team',
      key: 'teamId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{row.teamId}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            SLA Management & Policy Calibration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard resolution targets, SLA progress monitoring, and escalation matrix calibration
          </p>
        </div>
      </div>

      {/* SLA Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="SLA Compliance Rate" value={`${complianceRate}%`} subtitle="Target >90% compliance" icon={CheckCircle2} color="emerald" />
        <KpiCard title="Within SLA Target" value={withinSlaCount} subtitle="Active tickets on schedule" icon={Clock} color="blue" />
        <KpiCard title="SLA Breached" value={breachedCount} subtitle="Requires escalation intervention" icon={AlertTriangle} color="red" />
      </div>

      {/* Escalation Matrix Simulation Cards */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          Configured SLA Escalation Levels (Level 1 to Level 4)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-blue-600">Level 1</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">Assigned Technician</p>
            <p className="text-[10px] text-slate-400 mt-1">Trigger: Immediate ticket logging</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-amber-600">Level 2</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">Team Lead</p>
            <p className="text-[10px] text-slate-400 mt-1">Trigger: SLA Approaching (50% Elapsed)</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-orange-600">Level 3</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">Department Manager</p>
            <p className="text-[10px] text-slate-400 mt-1">Trigger: SLA Breached (100% Elapsed)</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-rose-600">Level 4</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">Meteoric 360</p>
            <p className="text-[10px] text-slate-400 mt-1">Trigger: Overdue by +12 Hours</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Configured Category SLA Policy Registry</h3>
        <DataTable columns={columns} data={complaintMatrix} itemsPerPage={6} />
      </div>
    </div>
  );
}
