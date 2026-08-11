import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { inwardService } from '../../services/inwardService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Inbox, Plus, CheckCircle2 } from 'lucide-react';

export default function InwardList() {
  const { inward, departments, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    receivedFrom: 'Dell India Logistics Pvt Ltd',
    departmentId: 'DEPT-001',
    purpose: 'Bulk Monitor Delivery',
    materialDescription: '10 Box UltraSharp 27" Monitors'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    inwardService.createInward(formData);
    refreshAllState();
    addToast('Inward receipt logged!', 'success');
    setShowModal(false);
  };

  const handleApprove = (id) => {
    inwardService.updateApproval(id, 'Approved');
    refreshAllState();
    addToast('Inward log approved!', 'success');
  };

  const columns = [
    {
      header: 'Inward #',
      key: 'inwardNumber',
      render: (row) => <span className="font-bold text-blue-600">{row.inwardNumber}</span>
    },
    {
      header: 'Received From',
      key: 'receivedFrom',
      render: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.receivedFrom}</span>
    },
    {
      header: 'Material Details',
      key: 'materialDescription',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">{row.materialDescription}</p>
          <p className="text-[10px] text-slate-400">Purpose: {row.purpose}</p>
        </div>
      )
    },
    {
      header: 'Department',
      key: 'departmentId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getDepartmentName(row.departmentId)}</span>
    },
    {
      header: 'Approval Status',
      key: 'approvalStatus',
      render: (row) => <StatusBadge status={row.approvalStatus} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        row.approvalStatus !== 'Approved' && (
          <button
            onClick={() => handleApprove(row.id)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" />
            Approve Inward
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
            <Inbox className="w-6 h-6 text-blue-600" />
            Inward Material Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Receiving log for hardware shipments, documents, parcels & approval workflow
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Inward Delivery
        </button>
      </div>

      <DataTable columns={columns} data={inward} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Incoming Delivery Material">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Received From (Vendor / Courier)</label>
            <input
              type="text"
              required
              value={formData.receivedFrom}
              onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Target Department</label>
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

          <div>
            <label className="block font-semibold mb-1">Material / Document Description</label>
            <textarea
              rows={3}
              required
              value={formData.materialDescription}
              onChange={(e) => setFormData({ ...formData, materialDescription: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Inward Entry</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
