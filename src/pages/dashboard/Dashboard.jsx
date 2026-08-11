import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import KpiCard from '../../components/common/KpiCard';
import ChartCard from '../../components/common/ChartCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { formatDateTime } from '../../utils/dateUtils';
import {
  Ticket,
  AlertTriangle,
  Laptop,
  FolderKanban,
  FileCheck2,
  KeyRound,
  Package,
  Receipt,
  Bell,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const { tickets, assets, projects, agreements, licenses, stationery, expenses, notifications, auditLogs } = useAppData();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  // Dynamic Metrics
  const openTicketsCount = tickets.filter(t => t.computedStatus !== 'Closed' && t.computedStatus !== 'Resolved').length;
  const breachedTicketsCount = tickets.filter(t => t.slaEvaluation && t.slaEvaluation.isOverdue).length;
  const activeAssetsCount = assets.filter(a => a.status === 'In Use' || a.status === 'Allocated').length;
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const expiringAgreementsCount = agreements.filter(a => a.daysUntilExpiry <= 60 && a.daysUntilExpiry >= 0).length;
  const totalExpenseSum = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const lowStockItemsCount = stationery.filter(s => s.status === 'Low Stock' || s.status === 'Out of Stock').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Chart Data Formatting
  const categoryData = [
    { name: 'Hardware', value: tickets.filter(t => t.category === 'Hardware').length },
    { name: 'Software', value: tickets.filter(t => t.category === 'Software').length },
    { name: 'Network', value: tickets.filter(t => t.category === 'Network / WiFi').length },
    { name: 'Facilities', value: tickets.filter(t => t.category === 'Facilities').length },
    { name: 'AC / HVAC', value: tickets.filter(t => t.category === 'AC / HVAC').length }
  ];

  const priorityData = [
    { name: 'Critical', count: tickets.filter(t => t.priority === 'Critical').length, color: '#e11d48' },
    { name: 'High', count: tickets.filter(t => t.priority === 'High').length, color: '#f97316' },
    { name: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length, color: '#3b82f6' },
    { name: 'Low', count: tickets.filter(t => t.priority === 'Low').length, color: '#10b981' }
  ];

  const expenseModuleData = [
    { name: 'Maintenance', total: expenses.filter(e => e.module === 'Maintenance').reduce((s, e) => s + e.amount, 0) },
    { name: 'Stationery', total: expenses.filter(e => e.module === 'Stationery').reduce((s, e) => s + e.amount, 0) },
    { name: 'Projects', total: expenses.filter(e => e.module === 'Projects').reduce((s, e) => s + e.amount, 0) },
    { name: 'Courier', total: expenses.filter(e => e.module === 'Courier').reduce((s, e) => s + e.amount, 0) }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dynamic calculation from current React state & localStorage ({activeRole} view)
          </p>
        </div>
      </div>

      {/* KPI Cards Grid (2 cols on phone, 4 cols on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <KpiCard
          title="Open Tickets"
          value={openTicketsCount}
          subtitle={`${breachedTicketsCount} breached SLA`}
          icon={Ticket}
          color="blue"
          onClick={() => navigate('/tickets')}
        />
        <KpiCard
          title="SLA Breached"
          value={breachedTicketsCount}
          subtitle="Requires immediate escalation"
          icon={AlertTriangle}
          color="red"
          onClick={() => navigate('/tickets')}
        />
        <KpiCard
          title="Active Assets"
          value={activeAssetsCount}
          subtitle={`${assets.length} total registered`}
          icon={Laptop}
          color="emerald"
          onClick={() => navigate('/assets')}
        />
        <KpiCard
          title="Active Projects"
          value={activeProjectsCount}
          subtitle="In progress milestones"
          icon={FolderKanban}
          color="indigo"
          onClick={() => navigate('/projects')}
        />
        <KpiCard
          title="Expiring AMC / Contracts"
          value={expiringAgreementsCount}
          subtitle="Within next 60 days"
          icon={FileCheck2}
          color="amber"
          onClick={() => navigate('/agreements')}
        />
        <KpiCard
          title="Low Stock Stationery"
          value={lowStockItemsCount}
          subtitle="Below reorder threshold"
          icon={Package}
          color="violet"
          onClick={() => navigate('/stationery')}
        />
        <KpiCard
          title="Total Recorded Expenses"
          value={`₹${totalExpenseSum.toLocaleString('en-IN')}`}
          subtitle="Across operational modules"
          icon={Receipt}
          color="emerald"
          onClick={() => navigate('/expenses')}
        />
        <KpiCard
          title="Unread Alerts"
          value={unreadNotifsCount}
          subtitle="Idempotent alert log"
          icon={Bell}
          color="blue"
          onClick={() => navigate('/notifications')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <ChartCard title="Tickets by Category" subtitle="Distribution across departments" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ticket Priorities" subtitle="Urgency classification">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Activity & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Tickets Table */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Recent Urgent Tickets</h3>
            <button onClick={() => navigate('/tickets')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {tickets.slice(0, 4).map(t => (
              <div key={t.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs gap-2">
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-blue-600">{t.ticketNumber}</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{t.subject}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.computedStatus || t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Activity Stream */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">System Activity Stream</h3>
            <button onClick={() => navigate('/audit-logs')} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Audit Logs <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{log.user} ({log.role})</span>
                  <span>{formatDateTime(log.timestamp)}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium truncate">{log.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
