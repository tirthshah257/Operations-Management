import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Drawer from '../../components/common/Drawer';
import { projectService } from '../../services/projectService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import { FolderKanban, Plus, CheckCircle2, Eye, Calendar, DollarSign } from 'lucide-react';

export default function ProjectList() {
  const { projects, vendors, users, departments, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const [formData, setFormData] = useState({
    projectName: 'Enterprise ERP Migration',
    budget: 1200000,
    spent: 45000,
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    ownerId: 'USR-008',
    vendorId: 'VND-001',
    departmentId: 'DEPT-001',
    locationId: 'LOC-001'
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    projectService.createProject(formData);
    refreshAllState();
    addToast('Project created successfully!', 'success');
    setShowModal(false);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProject) return;
    projectService.addTaskToProject(selectedProject.id, { title: newTaskTitle });
    setNewTaskTitle('');
    refreshAllState();
    addToast('Task added to project checklist!', 'info');
  };

  const handleToggleTask = (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'In Progress' : 'Completed';
    projectService.updateTaskStatus(selectedProject.id, taskId, nextStatus);
    refreshAllState();
  };

  const columns = [
    {
      header: 'Code & Name',
      key: 'projectCode',
      render: (row) => (
        <div>
          <span className="font-bold text-blue-600 dark:text-blue-400">{row.projectCode}</span>
          <p className="font-bold text-slate-900 dark:text-white">{row.projectName}</p>
        </div>
      )
    },
    {
      header: 'Owner',
      key: 'ownerId',
      render: (row) => <span className="font-semibold text-slate-700 dark:text-slate-300">{entityResolver.getUserName(row.ownerId)}</span>
    },
    {
      header: 'Progress %',
      key: 'progress',
      render: (row) => (
        <div className="w-32">
          <div className="flex justify-between text-[11px] font-bold mb-1">
            <span>{row.progress}%</span>
            <span className="text-slate-400">{row.completedTaskCount}/{row.totalTaskCount} Tasks</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${row.progress}%` }} />
          </div>
        </div>
      )
    },
    {
      header: 'Budget vs Spent',
      key: 'budget',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">₹{(row.budget || 0).toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400">Spent: ₹{(row.spent || 0).toLocaleString('en-IN')}</p>
        </div>
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
        <button
          onClick={() => setSelectedProject(row)}
          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          Overview
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            Enterprise Project Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Projects tracking, task checklists, milestone deadlines & budget expenditure
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      <DataTable columns={columns} data={projects} itemsPerPage={8} />

      {/* Project Overview Drawer */}
      {selectedProject && (
        <Drawer isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={`Project Overview — ${selectedProject.projectCode}`} width="max-w-2xl">
          <div className="space-y-6 text-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedProject.projectName}</h2>
              <p className="text-xs text-slate-500">Managed by {entityResolver.getUserName(selectedProject.ownerId)}</p>
            </div>

            {/* Task Checklist */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Task Checklist ({selectedProject.progress}% Completed)</span>
              </h4>

              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new project milestone task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg">Add Task</button>
              </form>

              <div className="space-y-2">
                {(selectedProject.tasks || []).map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <span className={`font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {task.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Enterprise Project">
        <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Project Name</label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Budget (₹)</label>
              <input
                type="number"
                required
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Target End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg">Create Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
