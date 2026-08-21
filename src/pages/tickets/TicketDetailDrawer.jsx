import React, { useState } from 'react';
import Drawer from '../../components/common/Drawer';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import FileUpload from '../../components/common/FileUpload';
import { ticketService } from '../../services/ticketService';
import { entityResolver } from '../../utils/entityResolver';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/dateUtils';
import {
  User,
  Clock,
  CheckCircle2,
  Lock,
  Play,
  UserCheck,
  Building2,
  MapPin,
  Laptop,
  Shield,
  Send
} from 'lucide-react';

export default function TicketDetailDrawer({ isOpen, onClose, ticket }) {
  const { refreshAllState } = useAppData();
  const { currentUser, activeRole } = useAuth();
  const { addToast } = useToast();

  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');

  if (!ticket) return null;

  const itAssignees = [
    { id: 'USR-004', name: 'Mithun Parmar', role: 'IT Admin' },
    { id: 'USR-010', name: 'Rohan Shah', role: 'IT Admin' },
    { id: 'USR-011', name: 'Arvind Patel', role: 'IT Admin' }
  ];

  const adminAssignees = [
    { id: 'USR-002', name: 'Kiran Patel', role: 'Admin' }
  ];

  const availableAssignees = ticket.ticketType === 'Admin' ? adminAssignees : itAssignees;

  // Step 1: Open -> Assign
  const handleAssign = (e) => {
    e.preventDefault();
    const assignee = availableAssignees.find(a => a.id === selectedAssignee) || availableAssignees[0];
    ticketService.assignTicket(ticket.id, {
      userId: assignee.id,
      assignedToName: assignee.name,
      assignedBy: currentUser?.name || 'System'
    });
    refreshAllState();
    addToast(`Ticket assigned to ${assignee.name} (Status: Assigned)`, 'success');
  };

  // Step 2: Assigned -> In Progress
  const handleStartProgress = () => {
    ticketService.startProgress(ticket.id, { user: currentUser?.name || 'Technician' });
    refreshAllState();
    addToast('Ticket status moved to In Progress', 'info');
  };

  // Step 3: In Progress -> Solved
  const handleSolve = (e) => {
    e.preventDefault();
    if (!resolutionRemarks.trim()) {
      addToast('Please enter resolution remarks before solving', 'error');
      return;
    }
    ticketService.solveTicket(ticket.id, {
      resolutionRemarks,
      solvedBy: currentUser?.name || 'Technician'
    });
    setResolutionRemarks('');
    refreshAllState();
    addToast('Ticket marked as Solved!', 'success');
  };

  // Step 4: Solved -> Closed
  const handleClose = () => {
    ticketService.closeTicket(ticket.id, { closedBy: currentUser?.name || 'User' });
    refreshAllState();
    addToast('Ticket confirmed and Closed', 'info');
  };

  const sla = ticket.slaEvaluation;
  const status = ticket.computedStatus || ticket.status;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Ticket Details — ${ticket.ticketNumber}`} width="max-w-3xl">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                  ticket.ticketType === 'IT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  {ticket.ticketType === 'IT' ? <Laptop className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {ticket.ticketType || 'IT'} Ticket
                </span>
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={status} />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{ticket.subject}</h2>
            </div>
          </div>

          {/* SLA Countdown Bar */}
          {sla && (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  SLA Target ({sla.slaDurationHours} Hours)
                </span>
                <span className={`font-bold ${sla.isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {sla.slaStatus} ({sla.formattedRemaining} {sla.isOverdue ? 'Overdue' : 'Remaining'})
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${sla.isOverdue ? 'bg-rose-500' : sla.progressPercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(sla.progressPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Requester</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-500" />
              {entityResolver.getUserName(ticket.requesterId)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Factory / Location</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              {entityResolver.getLocationName(ticket.locationId)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Assigned To</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-500" />
              {ticket.assignedToName || (ticket.assignedUserId ? entityResolver.getUserName(ticket.assignedUserId) : 'Unassigned')}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Created Date</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
              {formatDateTime(ticket.createdDate)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complaint Details & Description</h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">{ticket.description}</p>
        </div>

        {/* Sequential Workflow Execution Panel */}
        <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-blue-950 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Workflow Next Action (Current Status: {status})
          </h4>

          {/* STATUS: OPEN -> ASSIGN */}
          {status === 'Open' && (
            <form onSubmit={handleAssign} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign {ticket.ticketType || 'IT'} Ticket To:
                </label>
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="">Select Assignee...</option>
                  {availableAssignees.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-4 h-4" /> Assign Ticket
              </button>
            </form>
          )}

          {/* STATUS: ASSIGNED -> IN PROGRESS */}
          {status === 'Assigned' && (
            <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-xs">Ticket assigned to {ticket.assignedToName}</p>
                <p className="text-[11px] text-slate-500">Click below to start active work on this complaint.</p>
              </div>
              <button
                onClick={handleStartProgress}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Play className="w-4 h-4 fill-white" /> Start / In Progress
              </button>
            </div>
          )}

          {/* STATUS: IN PROGRESS -> SOLVED */}
          {status === 'In Progress' && (
            <form onSubmit={handleSolve} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enter Resolution Remarks <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter exact fix provided, replaced parts, software reinstall steps..."
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" /> Solve Ticket
                </button>
              </div>
            </form>
          )}

          {/* STATUS: SOLVED -> CLOSED */}
          {status === 'Solved' && (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">Resolution Remarks:</p>
                  <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{ticket.resolution}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 shrink-0 transition-all"
                >
                  <Lock className="w-4 h-4 text-emerald-400" /> Close Ticket
                </button>
              </div>
            </div>
          )}

          {/* STATUS: CLOSED (READ-ONLY) */}
          {status === 'Closed' && (
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              Ticket is Closed and Read-Only.
            </div>
          )}
        </div>

        {/* Resolution Record Display if Solved or Closed */}
        {ticket.resolution && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Verified Resolution ({ticket.resolvedBy || 'Technician'})
            </p>
            <p className="text-xs text-slate-900 dark:text-slate-100 font-medium leading-relaxed">{ticket.resolution}</p>
          </div>
        )}

        {/* History / Timeline Section */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Ticket Audit History & Timeline
          </h4>
          <Timeline events={ticket.timeline || []} />
        </div>
      </div>
    </Drawer>
  );
}
