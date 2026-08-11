import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', type = 'danger' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div className={`p-3 rounded-full mb-4 ${type === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 font-medium">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 w-full border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm ${
              type === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
