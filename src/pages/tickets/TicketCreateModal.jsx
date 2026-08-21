import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import FileUpload from '../../components/common/FileUpload';
import { ticketService } from '../../services/ticketService';
import { complaintMatrixService } from '../../services/complaintMatrixService';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, AlertCircle, Laptop, Shield } from 'lucide-react';

export default function TicketCreateModal({ isOpen, onClose }) {
  const { refreshAllState, departments, locations, assets } = useAppData();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketType, setTicketType] = useState('IT');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [departmentId, setDepartmentId] = useState('DEPT-001');
  const [locationId, setLocationId] = useState('LOC-005'); // Default Aslali Factory
  const [assetId, setAssetId] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [suggestedRule, setSuggestedRule] = useState(null);

  // Calculate user active ticket limits (Max 1 IT, Max 1 Admin)
  const activeItCount = ticketService.getActiveTicketCount(currentUser?.id, 'IT');
  const activeAdminCount = ticketService.getActiveTicketCount(currentUser?.id, 'Admin');

  const isItDisabled = activeItCount >= 1;
  const isAdminDisabled = activeAdminCount >= 1;

  // Auto set available ticket type if current selection is disabled
  useEffect(() => {
    if (ticketType === 'IT' && isItDisabled && !isAdminDisabled) {
      setTicketType('Admin');
    } else if (ticketType === 'Admin' && isAdminDisabled && !isItDisabled) {
      setTicketType('IT');
    }
  }, [isItDisabled, isAdminDisabled, ticketType]);

  // Auto Categorization Rule Engine
  useEffect(() => {
    if (subject.length > 3 || description.length > 5) {
      const match = complaintMatrixService.matchKeywordSuggestion(subject + ' ' + description);
      if (match) {
        setSuggestedRule(match);
        setCategoryId(match.id);
        setPriority(match.priority);
        if (match.ticketType === 'Admin' && !isAdminDisabled) {
          setTicketType('Admin');
        } else if (match.ticketType === 'IT' && !isItDisabled) {
          setTicketType('IT');
        }
      }
    } else {
      setSuggestedRule(null);
    }
  }, [subject, description, isItDisabled, isAdminDisabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    if (ticketType === 'IT' && isItDisabled) {
      addToast('You already have an active IT ticket.', 'error');
      return;
    }

    if (ticketType === 'Admin' && isAdminDisabled) {
      addToast('You already have an active Admin ticket.', 'error');
      return;
    }

    ticketService.createTicket({
      subject,
      description,
      ticketType,
      categoryId,
      category: suggestedRule ? suggestedRule.category : (ticketType === 'IT' ? 'IT Support' : 'General Admin'),
      subcategory: suggestedRule ? suggestedRule.subcategory : 'General',
      priority,
      departmentId,
      locationId,
      assetId: assetId || null,
      attachments,
      requesterId: currentUser?.id || 'USR-006',
      createdChannel: 'Portal'
    });

    refreshAllState();
    addToast(`${ticketType} Ticket raised successfully!`, 'success');
    onClose();

    // Reset Form
    setSubject('');
    setDescription('');
    setAttachments([]);
    setSuggestedRule(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Raise New Support Complaint / Ticket" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Ticket Type Selection Radio Group */}
        <div className="space-y-1">
          <label className="block font-semibold text-slate-700 dark:text-slate-300">
            Select Ticket Type <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                ticketType === 'IT'
                  ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              } ${isItDisabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50' : ''}`}
            >
              <input
                type="radio"
                name="ticketType"
                value="IT"
                disabled={isItDisabled}
                checked={ticketType === 'IT'}
                onChange={() => setTicketType('IT')}
                className="mt-0.5"
              />
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  IT Ticket
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Hardware, Wi-Fi, Software & IT access issues</p>
                {isItDisabled && (
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3 h-3" /> You already have an active IT ticket.
                  </p>
                )}
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                ticketType === 'Admin'
                  ? 'border-purple-500 bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              } ${isAdminDisabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800/50' : ''}`}
            >
              <input
                type="radio"
                name="ticketType"
                value="Admin"
                disabled={isAdminDisabled}
                checked={ticketType === 'Admin'}
                onChange={() => setTicketType('Admin')}
                className="mt-0.5"
              />
              <div className="space-y-0.5 min-w-0">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Admin Ticket
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Facility, AC, Housekeeping & Admin services</p>
                {isAdminDisabled && (
                  <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 pt-1">
                    <AlertCircle className="w-3 h-3" /> You already have an active Admin ticket.
                  </p>
                )}
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Complaint Subject / Title</label>
          <input
            type="text"
            required
            placeholder="e.g., Aslali Factory packing Wi-Fi disconnected / AC water leakage"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
          />
        </div>

        {/* Auto Rule Categorization Suggestion Banner */}
        {suggestedRule && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="font-bold text-blue-900 dark:text-blue-200">Recommended Matrix Rule Applied</p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  Category: <strong>{suggestedRule.category} ({suggestedRule.subcategory})</strong> • SLA Target: <strong>{suggestedRule.slaHours} Hours</strong>
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-bold">Auto Matched</span>
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description & Issue Details</label>
          <textarea
            rows={3}
            required
            placeholder="Provide exact error code, physical factory bay, or steps to reproduce..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Factory / Location</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
            >
              {locations.map(l => (
                <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="Low">Low (24h SLA)</option>
              <option value="Medium">Medium (8h SLA)</option>
              <option value="High">High (4h SLA)</option>
              <option value="Critical">Critical (2h SLA)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Related Asset (Optional)</label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="">None / General Issue</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.assetId} — {a.assetName || `${a.make} ${a.model}`}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attachments (Screenshots / Photos)</label>
          <FileUpload files={attachments} onFilesChange={setAttachments} />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={(ticketType === 'IT' && isItDisabled) || (ticketType === 'Admin' && isAdminDisabled)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all"
          >
            Submit {ticketType} Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
}
