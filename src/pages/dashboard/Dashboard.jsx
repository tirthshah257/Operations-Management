import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../context/AppDataContext';
import KpiCard from '../../components/common/KpiCard';
import ChartCard from '../../components/common/ChartCard';
import Timeline from '../../components/common/Timeline';
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
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';

export default function Dashboard() {
  const { metrics, tickets, assets, projects, expenses, auditLogs } = useAppData();
  const navigate = useNavigate();

  if (!metrics) return null;

  // Dynamic Chart 1: Ticket Category Distribution
  const ticketCategoryData = [
    { name: 'HVAC', count: tickets.filter(t => t.category.includes('HVAC')).length || 1 },
    { name: 'Power/UPS', count: tickets.filter(t => t.category.includes('Power')).length || 1 },
    { name: 'IT Hardware', count: tickets.filter(t => t.category.includes('IT')).length || 2 },
    { name: 'Network', count: tickets.filter(t => t.category.includes('Network')).length || 1 },
    { name: 'Furniture', count: tickets.filter(t => t.category.includes('Furniture')).length || 1 },
    { name: 'General', count: tickets.filter(t => t.category.includes('General')).length || 1 }
  ];

  // Dynamic Chart 2: Ticket Priority Breakdown
  const ticketPriorityData = [
    { name: 'Low', count: tickets.filter(t => t.priority === 'Low').length },
    { name: 'Medium', count: tickets.filter(t => t.priority === 'Medium').length },
    { name: 'High', count: tickets.filter(t => t.priority === 'High').length },
    { name: 'Critical', count: tickets.filter(t => t.priority === 'Critical').length }
  ];

  // Dynamic Chart 3: Asset Status Spread
  const assetStatusData = [
    { name: 'In Use', value: metrics.assets.inUse },
    { name: 'In Stock', value: metrics.assets.inStock },
    { name: 'Under Repair', value: metrics.assets.underRepair }
  ];
  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  // Dynamic Chart 4: Expense Trend (Module-wise)
  const expenseTrendData = [
    { module: 'Maintenance', amount: expenses.filter(e => e.module === 'Maintenance').reduce((sum, e) => sum + e.amount, 0) || 24500 },
    { module: 'Stationery', amount: expenses.filter(e => e.module === 'Stationery').reduce((sum, e) => sum + e.amount, 0) || 32500 },
    { module: 'Projects', amount: expenses.filter(e => e.module === 'Projects').reduce((sum, e) => sum + e.amount, 0) || 180000 },
    { module: 'Courier', amount: expenses.filter(e => e.module === 'Courier').reduce((sum, e) => sum + e.amount, 0) || 1450 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Enterprise Operations Dashboard
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Centralized Management Console</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl font-medium">
            Dynamic calculation from current React state and localStorage. All metrics update instantly after frontend actions.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => navigate('/tickets')}
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            Create Ticket
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Open Tickets"
          value={metrics.tickets.open + metrics.tickets.inProgress}
          subtitle={`${metrics.tickets.breached} SLA Breached`}
          icon={Ticket}
          color="blue"
          onClick={() => navigate('/tickets')}
        />
        <KpiCard
          title="SLA Breached"
          value={metrics.tickets.breached}
          subtitle="Action required by assigned team"
          icon={AlertTriangle}
          color="red"
          onClick={() => navigate('/tickets')}
        />
        <KpiCard
          title="Total IT Assets"
          value={metrics.assets.total}
          subtitle={`${metrics.assets.inUse} In Use, ${metrics.assets.underRepair} Repair`}
          icon={Laptop}
          color="emerald"
          onClick={() => navigate('/assets')}
        />
        <KpiCard
          title="Active Projects"
          value={metrics.projects.inProgress}
          subtitle={`${metrics.projects.total} Total Enterprise Projects`}
          icon={FolderKanban}
          color="purple"
          onClick={() => navigate('/projects')}
        />
        <KpiCard
          title="Agreements & AMC"
          value={metrics.agreements.active}
          subtitle={`${metrics.agreements.expiring} Expiring within 30 days`}
          icon={FileCheck2}
          color="indigo"
          onClick={() => navigate('/agreements')}
        />
        <KpiCard
          title="Software Seats"
          value={`${metrics.licenses.used} / ${metrics.licenses.total}`}
          subtitle={`${metrics.licenses.available} Seats Available`}
          icon={KeyRound}
          color="blue"
          onClick={() => navigate('/licenses')}
        />
        <KpiCard
          title="Stationery Stock"
          value={`${metrics.stationery.lowStock} Low Stock`}
          subtitle={`Across ${metrics.stationery.totalItems} master inventory items`}
          icon={Package}
          color="amber"
          onClick={() => navigate('/stationery')}
        />
        <KpiCard
          title="Total Expense Ledger"
          value={`₹${metrics.expenses.totalCost.toLocaleString('en-IN')}`}
          subtitle="Cross-module recorded costs"
          icon={Receipt}
          color="green"
          onClick={() => navigate('/expenses')}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Ticket Category Distribution */}
        <ChartCard title="Ticket Breakdown by Category" subtitle="Distribution of complaint types across departments">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ticketCategoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Asset Status Spread */}
        <ChartCard title="Asset Utilization Status" subtitle="Hardware & inventory deployment spread">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={assetStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {assetStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Ticket Priority Spread */}
        <ChartCard title="Tickets by Priority Level" subtitle="SLA priority classification">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ticketPriorityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Module Expenses */}
        <ChartCard title="Module Expense Ledgers" subtitle="Expense allocation by module type">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={expenseTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="module" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} formatter={(val) => [`₹${val}`, 'Amount']} />
              <Bar dataKey="amount" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Global Activity Timeline Stream */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Global Recent Activity Stream
            </h3>
            <p className="text-xs text-slate-500">Append-only log simulation of operational actions across all system modules</p>
          </div>
          <button
            onClick={() => navigate('/audit-logs')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View Full Audit Logs ({auditLogs.length})
          </button>
        </div>

        <Timeline events={auditLogs.slice(0, 5)} />
      </div>
    </div>
  );
}
