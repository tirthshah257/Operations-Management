import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { outwardService } from '../../services/outwardService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Send, Plus, CheckCircle2 } from 'lucide-react';

export default function OutwardList() {
  const { outward, departments, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    sentTo: 'Regional Hub (Delhi)',
    departmentId: 'DEPT-002',
    purpose: 'Inter-office Audit Files',
    materialDescription: '2 Sealed Boxes of Q2 Ledger Documents'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    outwardService.createOutward(formData);
    refreshAllState();
    addToast('Outward dispatch created!', 'success');
    setShowModal(false);
  };

  const handleUpdateStatus = (id, status) => {
    outwardService.updateStatus(id, status);
    refreshAllState();
    addToast(`Outward status set to ${status}`, 'info');
  };

  const columns = [
    {
      header: 'Outward #',
      key: 'outwardNumber',
      render: (row) => <span className="font-bold text-blue-600">{row.outwardNumber}</span>
    },
    {
      header: 'Sent To Destination',
      key: 'sentTo',
      render: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.sentTo}</span>
    },
    {
      header: 'Material Description',
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
      header: 'Dispatch Status',
      key: 'dispatchStatus',
      render: (row) => <StatusBadge status={row.dispatchStatus} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        row.dispatchStatus !== 'Completed' && (
          <button
            onClick={() => handleUpdateStatus(row.id, 'Completed')}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold"
          >
            Mark Completed
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
            <Send className="w-6 h-6 text-blue-600" />
            Outward Material Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dispatch authorization workflow for inter-office shipments & equipment returns
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Outward Dispatch
        </button>
      </div>

      <DataTable columns={columns} data={outward} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Outward Dispatch">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Destination / Recipient</label>
            <input
              type="text"
              required
              value={formData.sentTo}
              onChange={(e) => setFormData({ ...formData, sentTo: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Origin Department</label>
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
            <label className="block font-semibold mb-1">Material Description</label>
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
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Outward</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
