import React, { useState } from 'react';
import Modal from '../common/Modal';
import { assetService } from '../../services/assetService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { UserCheck, MapPin, Calendar, FileText } from 'lucide-react';

export default function AllocateAssetModal({ isOpen, onClose, asset }) {
  const { users, locations, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || 'USR-004');
  const [selectedLocationId, setSelectedLocationId] = useState(asset?.locationId || 'LOC-005');
  const [allocationDate, setAllocationDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  if (!asset) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const userObj = users.find(u => u.id === selectedUserId) || users[0];
    const locObj = locations.find(l => l.id === selectedLocationId) || locations[0];

    assetService.allocateAsset(asset.id, {
      userId: userObj.id,
      userName: userObj.name,
      locationId: locObj.id,
      locationName: locObj.name,
      allocationDate,
      notes
    });

    refreshAllState();
    addToast(`Asset ${asset.assetId} allocated to ${userObj.name} at ${locObj.name}`, 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Allocate Asset — ${asset.assetId}`} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <p className="font-bold text-slate-900 dark:text-white text-sm">{asset.assetName || `${asset.make} ${asset.model}`}</p>
          <p className="text-[11px] text-slate-500 font-mono">Serial #: {asset.serialNumber} • Type: {asset.category || asset.assetType}</p>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Assign To User / Employee <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          >
            {users.map(u => (
              <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {u.name} ({u.role} - {u.departmentId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Factory / Location <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
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
            Allocation Date
          </label>
          <input
            type="date"
            required
            value={allocationDate}
            onChange={(e) => setAllocationDate(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-500" />
            Allocation Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g., Laptop provided for Aslali Factory production desk"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
          >
            Confirm Allocation
          </button>
        </div>
      </form>
    </Modal>
  );
}
