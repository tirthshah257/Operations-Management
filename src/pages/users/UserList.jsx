import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import { userService } from '../../services/userService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Users, Plus, Edit2, UserCheck, Shield } from 'lucide-react';

export default function UserList() {
  const { users, departments, locations, refreshAllState } = useAppData();
  const { switchActiveUser, currentUser } = useAuth();
  const { addToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Anish Trivedi',
    email: 'anish.trivedi@enterprise.com',
    role: 'IT Admin',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001',
    status: 'Active'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    userService.createUser(formData);
    refreshAllState();
    addToast('New user account created successfully!', 'success');
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'IT Admin',
      departmentId: 'DEPT-001',
      locationId: 'LOC-001',
      status: 'Active'
    });
  };

  const handleEditOpen = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId || 'DEPT-001',
      locationId: user.locationId || 'LOC-001',
      status: user.status || 'Active'
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    userService.updateUser(editingUser.id, formData);
    refreshAllState();
    addToast(`User account updated for ${formData.name}`, 'success');
    setEditingUser(null);
  };

  const handleSwitchUser = (user) => {
    switchActiveUser(user.id);
    refreshAllState();
    addToast(`Switched active session to ${user.name} (${user.role})`, 'info');
  };

  const columns = [
    {
      header: 'User & Email',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt=""
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
              {currentUser?.id === row.id && (
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-extrabold">
                  Active Session
                </span>
              )}
            </div>
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
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleEditOpen(row)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Edit User Details"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            Edit
          </button>
          {currentUser?.id !== row.id && (
            <button
              onClick={() => handleSwitchUser(row)}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
              title="Switch Active Session to this user"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Switch Session
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            User Account Management & Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage user details, change roles, assign departments & switch active sessions
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              email: '',
              role: 'IT Admin',
              departmentId: departments[0]?.id || 'DEPT-001',
              locationId: locations[0]?.id || 'LOC-001',
              status: 'Active'
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add User Account
        </button>
      </div>

      <DataTable columns={columns} data={users} itemsPerPage={8} />

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add User Account">
        <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-blue-600"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="IT Admin">IT Admin</option>
                <option value="Technician">Technician</option>
                <option value="End User">End User</option>
                <option value="Finance">Finance</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Inventory Manager">Inventory Manager</option>
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
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save User Account</button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {editingUser && (
        <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Edit User Account — ${editingUser.name}`}>
          <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold mb-1">Role Permission</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-blue-600"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="IT Admin">IT Admin</option>
                  <option value="Technician">Technician</option>
                  <option value="End User">End User</option>
                  <option value="Finance">Finance</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Inventory Manager">Inventory Manager</option>
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

            <div>
              <label className="block font-semibold mb-1">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
