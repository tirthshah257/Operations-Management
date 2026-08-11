import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { agreementService } from '../../services/agreementService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { FileCheck2, Plus, AlertCircle } from 'lucide-react';

export default function AgreementList() {
  const { agreements, vendors, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Enterprise Server AMC Renewal 2026-2027',
    agreementType: 'AMC',
    vendorId: 'VND-001',
    contractValue: 450000,
    startDate: '2026-09-01',
    expiryDate: '2027-08-31',
    contactPerson: 'Rajesh Shah (+91 98765 43210)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    agreementService.createAgreement(formData);
    refreshAllState();
    addToast('Agreement contract logged!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Agreement # & Title',
      key: 'agreementNumber',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400">{row.agreementNumber}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.title}</p>
        </div>
      )
    },
    {
      header: 'Vendor',
      key: 'vendorId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getVendorName(row.vendorId)}</span>
    },
    {
      header: 'Type',
      key: 'agreementType',
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.agreementType}</span>
    },
    {
      header: 'Contract Value',
      key: 'contractValue',
      render: (row) => <span className="font-bold text-emerald-600">₹{(row.contractValue || 0).toLocaleString('en-IN')}</span>
    },
    {
      header: 'Expiry Date',
      key: 'expiryDate',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-semibold">{row.expiryDate}</span>
          <p className="text-[10px] text-amber-600 font-bold">{row.daysUntilExpiry > 0 ? `${row.daysUntilExpiry} days left` : 'EXPIRED'}</p>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'computedStatus',
      render: (row) => <StatusBadge status={row.computedStatus || row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-blue-600" />
            Agreements & AMC Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vendor contracts, annual maintenance contracts (AMC), warranties & 90/60/30 day expiry notifications
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Agreement / AMC
        </button>
      </div>

      <DataTable columns={columns} data={agreements} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register Vendor Contract / AMC">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Contract Title</label>
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
              <label className="block font-semibold mb-1">Type</label>
              <select
                value={formData.agreementType}
                onChange={(e) => setFormData({ ...formData, agreementType: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="AMC">AMC</option>
                <option value="Service Agreement">Service Agreement</option>
                <option value="Vendor Contract">Vendor Contract</option>
                <option value="SLA">SLA</option>
                <option value="Warranty">Warranty</option>
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
              <label className="block font-semibold mb-1">Contract Value (₹)</label>
              <input
                type="number"
                required
                value={formData.contractValue}
                onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Expiry Date</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Agreement</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
