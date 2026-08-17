import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { teamService } from '../../services/teamService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Users2, Plus } from 'lucide-react';

export default function TeamList() {
  const { teams, departments, locations, users, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'CyberSecurity Response Desk',
    departmentId: 'DEPT-001',
    teamLead: 'USR-004',
    locationId: 'LOC-001',
    description: 'Threat mitigation & firewall audit'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    teamService.createTeam(formData);
    refreshAllState();
    addToast('Assignment team created!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Team Name & ID',
      key: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px]">{row.id}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
        </div>
      )
    },
    {
      header: 'Department',
      key: 'departmentId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getDepartmentName(row.departmentId)}</span>
    },
    {
      header: 'Team Lead',
      key: 'teamLead',
      render: (row) => <span className="font-bold text-slate-900 dark:text-white">{entityResolver.getUserName(row.teamLead)}</span>
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
            <Users2 className="w-6 h-6 text-blue-600" />
            Assignment Teams Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Operational teams referenced in ticket and maintenance routing logic
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Assignment Team
        </button>
      </div>

      <DataTable columns={columns} data={teams} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Master Assignment Team">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Team Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <div>
              <label className="block font-semibold mb-1">Team Lead</label>
              <select
                value={formData.teamLead}
                onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Team</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
