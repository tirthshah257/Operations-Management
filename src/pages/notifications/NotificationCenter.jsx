import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmailPreviewModal from '../../components/common/EmailPreviewModal';
import { notificationService } from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';
import { Bell, Plus, Check, Mail, Calendar, Eye } from 'lucide-react';

export default function NotificationCenter() {
  const { notifications, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedEmailPreview, setSelectedEmailPreview] = useState(null);

  const [reminderFormData, setReminderFormData] = useState({
    title: 'Q3 Hardware License Renewal Audit',
    description: 'Verify active Microsoft 365 E5 seats before renewal invoice',
    date: '2026-08-25',
    time: '10:00 AM',
    type: 'Custom Reminder',
    recipient: 'IT Admin',
    inAppToggle: true,
    emailToggle: true
  });

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    refreshAllState();
    addToast('Notification marked read', 'info');
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    refreshAllState();
    addToast('All notifications marked read', 'success');
  };

  const handleCreateReminder = (e) => {
    e.preventDefault();
    notificationService.createCustomReminder(reminderFormData);
    refreshAllState();
    addToast('Custom reminder scheduled in localStorage!', 'success');
    setShowReminderModal(false);
  };

  const columns = [
    {
      header: 'Alert Type & Title',
      key: 'title',
      render: (row) => (
        <div>
          <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">{row.type}</span>
          <p className={`font-bold ${!row.read ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{row.title}</p>
        </div>
      )
    },
    {
      header: 'Message Body',
      key: 'message',
      render: (row) => <span className="truncate max-w-sm block text-slate-600 dark:text-slate-300">{row.message}</span>
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (row) => <StatusBadge status={row.priority} />
    },
    {
      header: 'Actions',
      key: 'actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {!row.read && (
            <button
              onClick={() => handleMarkRead(row.id)}
              className="p-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-xs font-semibold"
              title="Mark Read"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setSelectedEmailPreview({
              to: 'it.manager@enterprise.com',
              from: 'noreply@enterprise.com',
              subject: `[ALERT] ${row.title}`,
              body: row.message,
              recordId: row.id
            })}
            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded text-[11px] font-bold flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            Email Preview
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            Centralized Notifications & Custom Reminders
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Idempotent alert evaluator for SLA breaches, expiring agreements, low stock & custom alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Mark All Read
          </button>

          <button
            onClick={() => setShowReminderModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Custom Reminder Configuration
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={notifications} itemsPerPage={8} />

      {/* Custom Reminder Modal */}
      <Modal isOpen={showReminderModal} onClose={() => setShowReminderModal(false)} title="Configure Custom Reminder Alert">
        <form onSubmit={handleCreateReminder} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Reminder Title</label>
            <input
              type="text"
              required
              value={reminderFormData.title}
              onChange={(e) => setReminderFormData({ ...reminderFormData, title: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description & Details</label>
            <textarea
              rows={2}
              required
              value={reminderFormData.description}
              onChange={(e) => setReminderFormData({ ...reminderFormData, description: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Reminder Date</label>
              <input
                type="date"
                required
                value={reminderFormData.date}
                onChange={(e) => setReminderFormData({ ...reminderFormData, date: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Time</label>
              <input
                type="text"
                required
                value={reminderFormData.time}
                onChange={(e) => setReminderFormData({ ...reminderFormData, time: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowReminderModal(false)} className="px-4 py-2 text-slate-600 font-semibold">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Save Reminder</button>
          </div>
        </form>
      </Modal>

      {/* Email Preview Modal */}
      <EmailPreviewModal isOpen={!!selectedEmailPreview} onClose={() => setSelectedEmailPreview(null)} emailData={selectedEmailPreview} />
    </div>
  );
}
