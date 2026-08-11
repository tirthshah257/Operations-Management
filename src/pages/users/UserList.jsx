import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { userService } from '../../services/userService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Users, Plus } from 'lucide-react';

export default function UserList() {
  const { users, departments, locations, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Anish Trivedi',
    email: 'anish.trivedi@enterprise.com',
    role: 'IT Admin',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    userService.createUser(formData);
    refreshAllState();
    addToast('New user account created!', 'success');
    setShowModal(false);
  };

  const columns = [
    {
      header: 'User & Email',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} alt="" className="w-7 h-7 rounded-full object-cover" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => <span className="font-extrabold text-blue-600 dark:text-blue-400">{row.role}</span>
    },
    {
      header: 'Department',
      key: 'departmentId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getDepartmentName(row.departmentId)}</span>
    },
    {
      header: 'Location',
      key: 'locationId',
      render: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{entityResolver.getLocationName(row.locationId)}</span>
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
            <Users className="w-6 h-6 text-blue-600" />
            User Account Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise user directory, department assignments, and access role credentials
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add User Account
        </button>
      </div>

      <DataTable columns={columns} data={users} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add User Account">
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="IT Admin">IT Admin</option>
                <option value="Technician">Technician</option>
                <option value="End User">End User</option>
                <option value="Finance">Finance</option>
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
            <div>
              <label className="block font-semibold mb-1">Location</label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
