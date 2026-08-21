import React, { useState } from 'react';
import Modal from '../common/Modal';
import { assetService } from '../../services/assetService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { ArrowRightLeft, UserCheck, MapPin, Calendar, FileText } from 'lucide-react';

export default function ReallocateAssetModal({ isOpen, onClose, asset }) {
  const { users, locations, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [newUserId, setNewUserId] = useState(users[1]?.id || 'USR-010');
  const [newLocationId, setNewLocationId] = useState(asset?.locationId || 'LOC-006');
  const [reallocationDate, setReallocationDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  if (!asset) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = users.find(u => u.id === newUserId) || users[0];
    const newLoc = locations.find(l => l.id === newLocationId) || locations[0];

    assetService.reallocateAsset(asset.id, {
      newUserId: newUser.id,
      newUserName: newUser.name,
      newLocationId: newLoc.id,
      newLocationName: newLoc.name,
      reallocationDate,
      reason
    });

    refreshAllState();
    addToast(`Asset ${asset.assetId} reallocated to ${newUser.name} at ${newLoc.name}`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reallocate Asset — ${asset.assetId}`} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white text-sm">{asset.assetName || `${asset.make} ${asset.model}`}</p>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-purple-900 dark:text-purple-300">
            <span>Currently Assigned To: <strong>{asset.currentUserName || 'Mithun Parmar'}</strong></span>
            <span>•</span>
            <span>Location: <strong>{asset.locationName || 'Aslali Factory'}</strong></span>
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-purple-600" />
            Reallocate To New User <span className="text-rose-500">*</span>
          </label>
          <select
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          >
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            New Factory / Location <span className="text-rose-500">*</span>
          </label>
          <select
            value={newLocationId}
            onChange={(e) => setNewLocationId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          >
            {locations.map(l => (
              <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Reallocation Date
          </label>
          <input
            type="date"
            required
            value={reallocationDate}
            onChange={(e) => setReallocationDate(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-500" />
            Reallocation Reason
          </label>
          <textarea
            rows={2}
            required
            placeholder="e.g., Transfer to Radhu Factory IT operations desk"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Confirm Reallocation
          </button>
        </div>
      </form>
    </Modal>
  );
}
