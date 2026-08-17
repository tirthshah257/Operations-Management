import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { complaintMatrixService } from '../../services/complaintMatrixService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { Grid, Plus, Edit, Shield } from 'lucide-react';

export default function ComplaintMatrix() {
  const { complaintMatrix, refreshAllState, teams, departments } = useAppData();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Facility / HVAC',
    subcategory: 'AC Unit',
    ticketType: 'Maintenance',
    example: 'AC cooling issue',
    priority: 'High',
    slaHours: 4,
    teamId: 'TEAM-003',
    departmentId: 'DEPT-006'
  });

  const filteredRules = complaintMatrix.filter(r =>
    r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.example && r.example.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setEditingRule(null);
    setFormData({
      category: 'IT & Network',
      subcategory: 'Software',
      ticketType: 'IT',
      example: 'Software license crash',
      priority: 'Medium',
      slaHours: 8,
      teamId: teams[0]?.id || 'TEAM-001',
      departmentId: departments[0]?.id || 'DEPT-001'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (rule) => {
    setEditingRule(rule);
    setFormData({ ...rule });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRule) {
      complaintMatrixService.updateRule(editingRule.id, formData);
      addToast('Matrix rule updated!', 'success');
    } else {
      complaintMatrixService.createRule(formData);
      addToast('New matrix rule added!', 'success');
    }
    refreshAllState();
    setShowModal(false);
  };

  const columns = [
    {
      header: 'Category & Subcategory',
      key: 'category',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.category}</p>
          <p className="text-[10px] text-slate-500">{row.subcategory}</p>
        </div>
      )
    },
    {
      header: 'Ticket Type',
      key: 'ticketType',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{row.ticketType}</span>
    },
    {
      header: 'Issue Examples',
      key: 'example',
      render: (row) => <span className="truncate max-w-xs block text-slate-600 dark:text-slate-400">{row.example}</span>
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <PriorityBadge priority={row.priority} />
    },
    {
      header: 'SLA Target',
      key: 'slaHours',
      render: (row) => <span className="font-bold text-blue-600 dark:text-blue-400">{row.slaHours} Hours</span>
    },
    {
      header: 'Responsible Team',
      key: 'teamId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getTeamName(row.teamId)}</span>
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => handleOpenEdit(row)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Grid className="w-6 h-6 text-blue-600" />
            Configurable Complaint Matrix
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Defines SLA hours, priorities, and responsible teams for ticket categorization
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Matrix Rule
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search matrix categories, subcategories..." />
      </div>

      <DataTable columns={columns} data={filteredRules} itemsPerPage={8} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingRule ? 'Edit Complaint Matrix Rule' : 'Add New Complaint Matrix Rule'}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Subcategory</label>
              <input
                type="text"
                required
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Example Issue Match Keywords</label>
            <input
              type="text"
              required
              placeholder="e.g. AC not cooling, gas leak"
              value={formData.example}
              onChange={(e) => setFormData({ ...formData, example: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1">Ticket Type</label>
              <select
                value={formData.ticketType}
                onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="IT">IT</option>
                <option value="Admin">Admin</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">SLA Hours</label>
              <input
                type="number"
                required
                min={1}
                value={formData.slaHours}
                onChange={(e) => setFormData({ ...formData, slaHours: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Responsible Team</label>
              <select
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
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

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">
              Save Matrix Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
