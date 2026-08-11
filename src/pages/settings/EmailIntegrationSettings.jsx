import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, CheckCircle2, Play, Info } from 'lucide-react';

export default function EmailIntegrationSettings() {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    username: 'notifications@enterprise.com',
    fromEmail: 'noreply@enterprise.com',
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    popHost: 'pop.office365.com',
    popPort: 995,
    enableNotifications: true,
    enableTicketEmailSimulation: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast('Email Integration settings saved in localStorage!', 'success');
  };

  const handleTestEmail = () => {
    addToast('Test Email Simulation: Mock connection successful (200 OK)', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl text-xs">
      <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-200">Email Integration (Frontend Simulation Demo)</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">Configures mock SMTP/IMAP settings used by Email Ticket Simulator & Alert Preview.</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-blue-600 text-white rounded font-mono text-[10px] font-bold">API-Ready Demo</span>
      </div>

      <form onSubmit={handleSave} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">SMTP Outbound Configuration</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-1">SMTP Host</label>
            <input
              type="text"
              value={formData.smtpHost}
              onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">SMTP Port</label>
            <input
              type="number"
              value={formData.smtpPort}
              onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mb-1">From Email Address</label>
            <input
              type="email"
              value={formData.fromEmail}
              onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Username / Account</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestEmail}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5 hover:bg-slate-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            Test Email Connection Simulation
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
          >
            Save Email Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
