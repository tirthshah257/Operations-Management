import React, { useState } from 'react';
import Drawer from '../../components/common/Drawer';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Timeline from '../../components/common/Timeline';
import FileUpload from '../../components/common/FileUpload';
import { ticketService } from '../../services/ticketService';
import { entityResolver } from '../../utils/entityResolver';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/dateUtils';
import {
  User,
  Clock,
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  Paperclip,
  Star,
  Send,
  Building2,
  MapPin,
  Shield
} from 'lucide-react';

export default function TicketDetailDrawer({ isOpen, onClose, ticket }) {
  const { refreshAllState, teams, users } = useAppData();
  const { addToast } = useToast();

  const [commentText, setCommentText] = useState('');
  const [resolutionText, setResolutionText] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  if (!ticket) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    ticketService.addComment(ticket.id, { user: 'Active User', commentText });
    setCommentText('');
    refreshAllState();
    addToast('Comment added to ticket timeline', 'info');
  };

  const handleResolve = (e) => {
    e.preventDefault();
    if (!resolutionText.trim()) return;
    ticketService.resolveTicket(ticket.id, { resolvedBy: 'Rahul Mehta', resolutionText });
    setShowResolutionForm(false);
    refreshAllState();
    addToast('Ticket marked as Resolved!', 'success');
  };

  const handleFeedback = (action) => {
    ticketService.submitFeedback(ticket.id, {
      rating: feedbackRating,
      comment: feedbackComment,
      action
    });
    refreshAllState();
    addToast(action === 'reopen' ? 'Ticket Reopened' : 'Ticket Closed with Feedback', 'info');
  };

  const handleAssign = () => {
    ticketService.assignTicket(ticket.id, { teamId: selectedTeamId || ticket.assignedTeamId, userId: selectedUserId || ticket.assignedUserId });
    refreshAllState();
    addToast('Ticket assignment updated', 'success');
  };

  const sla = ticket.slaEvaluation;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Ticket Details — ${ticket.ticketNumber}`} width="max-w-3xl">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{ticket.subject}</h2>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.computedStatus || ticket.status} />
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
                  style={{ width: `${sla.progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Created: {formatDateTime(ticket.createdDate)}</span>
                <span>Due: {formatDateTime(ticket.dueDate)}</span>
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
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Department</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              {entityResolver.getDepartmentName(ticket.departmentId)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Location</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              {entityResolver.getLocationName(ticket.locationId)}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Assigned Team</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              {entityResolver.getTeamName(ticket.assignedTeamId)}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Complaint Description</h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{ticket.description}</p>
        </div>

        {/* Reassign Team / Technician Section */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ticket Assignment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Assign Team</label>
              <select
                value={selectedTeamId || ticket.assignedTeamId || ''}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Assign Technician</label>
              <select
                value={selectedUserId || ticket.assignedUserId || ''}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleAssign}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Update Assignment
          </button>
        </div>

        {/* Resolution Section if Resolved */}
        {ticket.resolution && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              Resolution Provided by {ticket.resolvedBy} on {formatDateTime(ticket.resolvedDate)}
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">{ticket.resolution}</p>

            {/* Feedback Form for Requester */}
            {ticket.status === 'Resolved' && (
              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800 space-y-3">
                <p className="text-xs font-bold text-emerald-950 dark:text-white">Did this solve your complaint?</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setFeedbackRating(star)}>
                      <Star className={`w-5 h-5 ${star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Optional feedback comment..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full p-2 text-xs rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFeedback('accept')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Accept Resolution & Close Ticket
                  </button>
                  <button
                    onClick={() => handleFeedback('reopen')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reopen Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons to Resolve Ticket */}
        {!ticket.resolution && ticket.status !== 'Closed' && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowResolutionForm(prev => !prev)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Provide Resolution
            </button>
          </div>
        )}

        {/* Resolution Form Box */}
        {showResolutionForm && (
          <form onSubmit={handleResolve} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Record Official Ticket Resolution</h4>
            <textarea
              required
              rows={3}
              placeholder="Describe resolution steps taken..."
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResolutionForm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs"
              >
                Submit Resolution
              </button>
            </div>
          </form>
        )}

        {/* Comments & Timeline Stream */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            Activity Timeline & Comments
          </h4>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Add internal note or comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              Comment
            </button>
          </form>

          <Timeline events={ticket.timeline} />
        </div>
      </div>
    </Drawer>
  );
}
