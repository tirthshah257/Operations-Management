import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { ticketService } from '../../services/ticketService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Sparkles } from 'lucide-react';

export default function EmailTicketSimulator({ isOpen, onClose }) {
  const { refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [senderEmail, setSenderEmail] = useState('employee@enterprise.com');
  const [subject, setSubject] = useState('AC in sales conference room is leaking water');
  const [body, setBody] = useState('Hi Team,\n\nThe split AC in Conference Room 3 on 2nd floor is leaking water on the table.\nPlease send technician immediately.');

  const handleSimulate = (e) => {
    e.preventDefault();
    const created = ticketService.simulateEmailTicket({ senderEmail, subject, body });
    refreshAllState();
    addToast(`Email ticket ${created.ticketNumber} created via simulation!`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Ticket Generator — Demo Simulator" maxWidth="max-w-xl">
      <form onSubmit={handleSimulate} className="space-y-4 text-xs">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-200">Email Parser Simulator</p>
            <p className="text-[11px] text-blue-700 dark:text-blue-300">Simulates an incoming email turning into a routed ticket with Matrix lookup & SLA calculation.</p>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sender Email Address</label>
          <input
            type="email"
            required
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Subject (Complaint Title)</label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Content Body</label>
          <textarea
            rows={4}
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Create Ticket from Email Simulation
          </button>
        </div>
      </form>
    </Modal>
  );
}
