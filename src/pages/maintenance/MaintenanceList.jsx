import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { maintenanceService } from '../../services/maintenanceService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Wrench, Plus, CheckCircle2 } from 'lucide-react';

export default function MaintenanceList() {
  const { maintenance, vendors, users, assets, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Precision AC Water Leakage Fix',
    category: 'AC / HVAC',
    description: 'Compressor copper pipe repair',
    assetId: 'AST-1004',
    vendorId: 'VND-002',
    technicianId: 'USR-005',
    estimatedCost: 25000,
    actualCost: 24500
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    maintenanceService.createMaintenanceRequest(formData);
    refreshAllState();
    addToast('Maintenance request logged!', 'success');
    setShowModal(false);
  };

  const handleComplete = (id, actualCost) => {
    maintenanceService.updateMaintenance(id, { status: 'Completed', actualCost: Number(actualCost) || 24500 });
    refreshAllState();
    addToast('Maintenance request marked Completed! Auto-logged in Expenses ledger.', 'success');
  };

  const columns = [
    {
      header: 'Request #',
      key: 'requestNumber',
      render: (row) => <span className="font-bold text-blue-600">{row.requestNumber}</span>
    },
    {
      header: 'Title & Category',
      key: 'title',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.title}</p>
          <p className="text-[10px] text-slate-500">{row.category}</p>
        </div>
      )
    },
    {
      header: 'Assigned Vendor',
      key: 'vendorId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getVendorName(row.vendorId)}</span>
    },
    {
      header: 'Technician',
      key: 'technicianId',
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{entityResolver.getUserName(row.technicianId)}</span>
    },
    {
      header: 'Cost (Estimated / Actual)',
      key: 'actualCost',
      render: (row) => (
        <span className="font-bold text-emerald-600">
          ₹{(row.actualCost || row.estimatedCost || 0).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        row.status !== 'Completed' && (
          <button
            onClick={() => handleComplete(row.id, row.actualCost || row.estimatedCost)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            Complete & Log Expense
          </button>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            Admin & Building Maintenance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Work orders for HVAC, Electrical, UPS, Plumbing & Facility servicing
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Maintenance Request
        </button>
      </div>

      <DataTable columns={columns} data={maintenance} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Maintenance Request">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="AC / HVAC">AC / HVAC</option>
                <option value="UPS / Electrical">UPS / Electrical</option>
                <option value="Furniture">Furniture</option>
                <option value="Plumbing / Water">Plumbing / Water</option>
                <option value="Housekeeping">Housekeeping</option>
              </select>
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Technician</label>
              <select
                value={formData.technicianId}
                onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Estimated Cost (₹)</label>
              <input
                type="number"
                required
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">Save Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
