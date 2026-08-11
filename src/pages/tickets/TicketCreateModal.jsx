import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import FileUpload from '../../components/common/FileUpload';
import { ticketService } from '../../services/ticketService';
import { complaintMatrixService } from '../../services/complaintMatrixService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function TicketCreateModal({ isOpen, onClose }) {
  const { refreshAllState, departments, locations, assets } = useAppData();
  const { addToast } = useToast();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [ticketType, setTicketType] = useState('IT');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [departmentId, setDepartmentId] = useState('DEPT-001');
  const [locationId, setLocationId] = useState('LOC-001');
  const [assetId, setAssetId] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [suggestedRule, setSuggestedRule] = useState(null);

  // Auto Categorization Rule Engine
  useEffect(() => {
    if (subject.length > 3 || description.length > 5) {
      const match = complaintMatrixService.matchKeywordSuggestion(subject + ' ' + description);
      if (match) {
        setSuggestedRule(match);
        setCategoryId(match.id);
        setPriority(match.priority);
        setTicketType(match.ticketType || 'IT');
      }
    } else {
      setSuggestedRule(null);
    }
  }, [subject, description]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    ticketService.createTicket({
      subject,
      description,
      ticketType,
      categoryId,
      category: suggestedRule ? suggestedRule.category : 'General',
      subcategory: suggestedRule ? suggestedRule.subcategory : 'General',
      priority,
      departmentId,
      locationId,
      assetId: assetId || null,
      attachments,
      requesterId: 'USR-002',
      createdChannel: 'Portal'
    });

    refreshAllState();
    addToast('Ticket raised successfully!', 'success');
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
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Complaint Subject / Title</label>
          <input
            type="text"
            required
            placeholder="e.g. AC in server room not cooling / Wi-Fi disconnected"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
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
            placeholder="Provide exact error code, physical location, or steps to reproduce..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Ticket Type</label>
            <select
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="IT">IT Ticket</option>
              <option value="Admin">Admin Ticket</option>
              <option value="Maintenance">Maintenance Ticket</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="Low">Low (24h SLA)</option>
              <option value="Medium">Medium (8h SLA)</option>
              <option value="High">High (4h SLA)</option>
              <option value="Critical">Critical (2h SLA)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Related Asset (Optional)</label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="">None / Facility Issue</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.assetId} — {a.make} {a.model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-500 mb-1">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-500 mb-1">Office Location</label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
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
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
          >
            Submit Complaint Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
}
