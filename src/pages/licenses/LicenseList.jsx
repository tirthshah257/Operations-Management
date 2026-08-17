import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { licenseService } from '../../services/licenseService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { KeyRound, Plus, ShieldCheck } from 'lucide-react';

export default function LicenseList() {
  const { licenses, vendors, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    softwareName: 'Figma Enterprise Workspace',
    vendorId: 'VND-007',
    licenseType: 'Per Seat License',
    totalQuantity: 50,
    usedQuantity: 42,
    unitCost: 1800,
    purchaseDate: '2026-01-10',
    expiryDate: '2027-01-09'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    licenseService.createLicense(formData);
    refreshAllState();
    addToast('Software license registered!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Software & Vendor',
      key: 'softwareName',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.softwareName}</p>
          <p className="text-[10px] text-slate-500">{entityResolver.getVendorName(row.vendorId)}</p>
        </div>
      )
    },
    {
      header: 'License Type',
      key: 'licenseType',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{row.licenseType}</span>
    },
    {
      header: 'Seat Utilization',
      key: 'totalQuantity',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">{row.usedQuantity} / {row.totalQuantity} Seats</span>
          <p className={`text-[10px] font-bold ${row.availableQuantity < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {row.availableQuantity} Seats Available
          </p>
        </div>
      )
    },
    {
      header: 'Compliance Status',
      key: 'complianceStatus',
      render: (row) => <StatusBadge status={row.complianceStatus} />
    },
    {
      header: 'Expiry Date',
      key: 'expiryDate',
      render: (row) => <span className="font-mono text-xs text-slate-500">{row.expiryDate}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-blue-600" />
            Software License Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Software seat allocations, utilization compliance, and expiration tracking
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Software License
        </button>
      </div>

      <DataTable columns={columns} data={licenses} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Software License">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Software Product Name</label>
            <input
              type="text"
              required
              value={formData.softwareName}
              onChange={(e) => setFormData({ ...formData, softwareName: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">License Vendor</label>
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
              <label className="block font-semibold mb-1">License Model</label>
              <input
                type="text"
                required
                value={formData.licenseType}
                onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Total Quantity Seats</label>
              <input
                type="number"
                required
                value={formData.totalQuantity}
                onChange={(e) => setFormData({ ...formData, totalQuantity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Currently Allocated Seats</label>
              <input
                type="number"
                required
                value={formData.usedQuantity}
                onChange={(e) => setFormData({ ...formData, usedQuantity: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save License</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
