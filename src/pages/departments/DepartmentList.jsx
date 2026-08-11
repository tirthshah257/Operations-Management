import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { departmentService } from '../../services/departmentService';
import { useToast } from '../../context/ToastContext';
import { Building2, Plus } from 'lucide-react';

export default function DepartmentList() {
  const { departments, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Security & Safety',
    code: 'SEC',
    head: 'Karan Patel',
    description: 'Physical security & CCTV surveillance'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    departmentService.createDepartment(formData);
    refreshAllState();
    addToast('Department created!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Department Code & Name',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px]">{row.code}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
        </div>
      )
    },
    {
      header: 'Department Head',
      key: 'head',
      render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.head}</span>
    },
    {
      header: 'Description',
      key: 'description',
      render: (row) => <span className="text-slate-600 dark:text-slate-400 text-xs">{row.description}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Master Department Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Department master records consumed across tickets, assets, stationery & expenses
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      <DataTable columns={columns} data={departments} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Master Department">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Department Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Code</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Department Head</label>
              <input
                type="text"
                required
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
