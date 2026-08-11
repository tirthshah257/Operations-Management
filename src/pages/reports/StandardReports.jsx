import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import ChartCard from '../../components/common/ChartCard';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { entityResolver } from '../../utils/entityResolver';
import { BarChart3, Download, Ticket, Laptop, Receipt, Package, FolderKanban } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StandardReports() {
  const { tickets, assets, projects, expenses, stationery, maintenance } = useAppData();
  const [selectedReportType, setSelectedReportType] = useState('TICKETS');

  const reportTypes = [
    { id: 'TICKETS', name: 'Ticket Reports', icon: Ticket },
    { id: 'ASSETS', name: 'Asset Reports', icon: Laptop },
    { id: 'MAINTENANCE', name: 'Maintenance Reports', icon: BarChart3 },
    { id: 'PROJECTS', name: 'Project Reports', icon: FolderKanban },
    { id: 'STATIONERY', name: 'Stationery Reports', icon: Package },
    { id: 'EXPENSES', name: 'Expense Reports', icon: Receipt }
  ];

  const handleExportExcel = () => {
    let exportData = [];
    if (selectedReportType === 'TICKETS') {
      exportData = tickets.map(t => ({ ID: t.ticketNumber, Category: t.category, Subject: t.subject, Priority: t.priority, Status: t.computedStatus || t.status }));
    } else if (selectedReportType === 'ASSETS') {
      exportData = assets.map(a => ({ Tag: a.assetId, Make: a.make, Model: a.model, Status: a.status, Cost: a.purchaseCost }));
    } else {
      exportData = expenses.map(e => ({ Number: e.expenseNumber, Module: e.module, Amount: e.amount, Category: e.category }));
    }
    exportToExcel(exportData, `${selectedReportType.toLowerCase()}_report.xlsx`);
  };

  const handleExportPDF = () => {
    const headers = ['Record ID', 'Module/Category', 'Name/Subject', 'Status/Value'];
    let rows = [];
    if (selectedReportType === 'TICKETS') {
      rows = tickets.map(t => [t.ticketNumber, t.category, t.subject.substring(0, 30), t.computedStatus || t.status]);
    } else {
      rows = assets.map(a => [a.assetId, a.category, `${a.make} ${a.model}`, a.status]);
    }
    exportToPDF(headers, rows, `${selectedReportType} Enterprise Report`, `${selectedReportType.toLowerCase()}_report.pdf`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Standard Reports & Enterprise Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aggregated metrics, visual charts & client-side Excel / PDF export across all modules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex-1 sm:flex-initial px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-initial px-3.5 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Module Report Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {reportTypes.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedReportType(item.id)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedReportType === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Summary View */}
      {selectedReportType === 'TICKETS' && (
        <DataTable
          columns={[
            { header: 'Ticket #', key: 'ticketNumber', render: (r) => <span className="font-bold text-blue-600">{r.ticketNumber}</span> },
            { header: 'Category', key: 'category' },
            { header: 'Subject', key: 'subject' },
            { header: 'Priority', key: 'priority' },
            { header: 'Status', key: 'computedStatus' }
          ]}
          data={tickets}
          itemsPerPage={8}
        />
      )}

      {selectedReportType === 'ASSETS' && (
        <DataTable
          columns={[
            { header: 'Asset Tag', key: 'assetId', render: (r) => <span className="font-bold text-blue-600">{r.assetId}</span> },
            { header: 'Make & Model', key: 'model', render: (r) => `${r.make} ${r.model}` },
            { header: 'User', key: 'currentUserId', render: (r) => entityResolver.getUserName(r.currentUserId) },
            { header: 'Cost', key: 'purchaseCost', render: (r) => `₹${r.purchaseCost}` },
            { header: 'Status', key: 'status' }
          ]}
          data={assets}
          itemsPerPage={8}
        />
      )}

      {selectedReportType === 'EXPENSES' && (
        <DataTable
          columns={[
            { header: 'Expense #', key: 'expenseNumber', render: (r) => <span className="font-bold text-blue-600">{r.expenseNumber}</span> },
            { header: 'Module', key: 'module' },
            { header: 'Description', key: 'description' },
            { header: 'Amount', key: 'amount', render: (r) => `₹${r.amount}` }
          ]}
          data={expenses}
          itemsPerPage={8}
        />
      )}
    </div>
  );
}
