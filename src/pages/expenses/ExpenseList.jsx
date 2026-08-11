import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import ChartCard from '../../components/common/ChartCard';
import { expenseService } from '../../services/expenseService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Receipt, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ExpenseList() {
  const { expenses, vendors, departments, locations, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    module: 'Other',
    category: 'General Office Expense',
    amount: 12500,
    description: 'Quarterly office pest control & sanitization service',
    vendorId: 'VND-002',
    departmentId: 'DEPT-002',
    locationId: 'LOC-001',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    expenseService.createExpense(formData);
    refreshAllState();
    addToast('Expense recorded in financial ledger!', 'success');
    setShowModal(false);
  };

  const chartData = [
    { name: 'Maintenance', total: expenses.filter(e => e.module === 'Maintenance').reduce((s, e) => s + e.amount, 0) },
    { name: 'Stationery', total: expenses.filter(e => e.module === 'Stationery').reduce((s, e) => s + e.amount, 0) },
    { name: 'Projects', total: expenses.filter(e => e.module === 'Projects').reduce((s, e) => s + e.amount, 0) },
    { name: 'Courier', total: expenses.filter(e => e.module === 'Courier').reduce((s, e) => s + e.amount, 0) },
    { name: 'Other', total: expenses.filter(e => e.module === 'Other').reduce((s, e) => s + e.amount, 0) }
  ];

  const columns = [
    {
      header: 'Expense #',
      key: 'expenseNumber',
      render: (row) => <span className="font-bold text-blue-600">{row.expenseNumber}</span>
    },
    {
      header: 'Module & Category',
      key: 'module',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.category}</p>
          <p className="text-[10px] text-slate-500">Module: {row.module}</p>
        </div>
      )
    },
    {
      header: 'Vendor & Dept',
      key: 'vendorId',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{entityResolver.getVendorName(row.vendorId)}</p>
          <p className="text-[10px] text-slate-400">{entityResolver.getDepartmentName(row.departmentId)}</p>
        </div>
      )
    },
    {
      header: 'Amount',
      key: 'amount',
      render: (row) => <span className="font-extrabold text-emerald-600 text-sm">₹{(row.amount || 0).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Date',
      key: 'date',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.date}</span>
    },
    {
      header: 'Approval Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            Centralized Expense Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Financial expense ledger integrated across maintenance, stationery, projects & courier modules
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Expense Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DataTable columns={columns} data={expenses} itemsPerPage={7} />
        </div>
        <div>
          <ChartCard title="Category Expense Totals" subtitle="Cross-module expenditure breakdown">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(val) => [`₹${val}`, 'Total']} />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Expense Ledger Entry">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Expense Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Module Source</label>
              <select
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Stationery">Stationery</option>
                <option value="Projects">Projects</option>
                <option value="Courier">Courier</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-emerald-600 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Vendor</label>
              <select
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Expense</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
