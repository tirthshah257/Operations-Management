import React from 'react';
import Modal from './Modal';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function EmailPreviewModal({ isOpen, onClose, emailData }) {
  if (!emailData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Alert Simulation Preview" maxWidth="max-w-xl">
      <div className="flex flex-col space-y-4">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Email Notification Simulation Mode</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">This simulates client-side email generation without external SMTP servers.</p>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-100 dark:bg-slate-800 p-3 space-y-1 font-mono text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
            <p><span className="font-semibold text-slate-500">TO:</span> {emailData.to || 'user@enterprise.com'}</p>
            <p><span className="font-semibold text-slate-500">FROM:</span> {emailData.from || 'noreply@enterprise.com'}</p>
            <p><span className="font-semibold text-slate-500">SUBJECT:</span> <span className="font-bold text-slate-900 dark:text-white">{emailData.subject}</span></p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 space-y-4">
            <p className="font-semibold text-sm">Dear Colleague,</p>
            <p className="leading-relaxed">{emailData.body}</p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
              <p>Reference Record: {emailData.recordId || 'N/A'}</p>
              <p>Trigger Time: {new Date().toLocaleString()}</p>
            </div>
            <p className="text-slate-500 text-xs">Regards,<br /><strong className="text-slate-800 dark:text-slate-200">Enterprise Asset & Ticketing Automated Alert Engine</strong></p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </Modal>
  );
}
