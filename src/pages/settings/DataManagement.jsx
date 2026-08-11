import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { Download, Upload, RotateCcw, Trash2, Database } from 'lucide-react';

export default function DataManagement() {
  const { refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '' });

  const handleExportBackup = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise_ems_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    addToast('JSON Demo Backup exported successfully!', 'success');
  };

  const handleRestoreImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = storageService.importAllData(event.target.result);
      if (res.success) {
        refreshAllState();
        addToast('JSON Demo Data restored successfully!', 'success');
      } else {
        addToast(`Restore failed: ${res.error}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    storageService.initializeSeedData(true);
    refreshAllState();
    addToast('Demo seed data reset to default enterprise state!', 'success');
  };

  const handleClearStorage = () => {
    storageService.clearAllData();
    refreshAllState();
    addToast('localStorage cleared and re-initialized!', 'info');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          JSON Backup & Local Data Management (Frontend Preview)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Export JSON Demo Backup</h4>
            <p className="text-[11px] text-slate-500">Download entire localStorage state as a formatted JSON snapshot.</p>
            <button
              onClick={handleExportBackup}
              className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Backup JSON File
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Restore JSON Demo Backup</h4>
            <p className="text-[11px] text-slate-500">Upload a previously exported JSON backup file to restore state.</p>
            <input type="file" accept=".json" onChange={handleRestoreImport} className="hidden" id="json-restore-input" />
            <label
              htmlFor="json-restore-input"
              className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-center"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              Restore JSON File
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-3">
          <button
            onClick={() => setConfirmModal({ isOpen: true, action: handleResetData, title: 'Reset Demo Seed Data?', message: 'This will reset all tickets, assets, and expenses to default seed state.' })}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Enterprise Seed Data
          </button>

          <button
            onClick={() => setConfirmModal({ isOpen: true, action: handleClearStorage, title: 'Clear LocalStorage?', message: 'This will completely wipe localStorage and initialize fresh seed data.' })}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Clear Local Storage
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, title: '', message: '' })}
        onConfirm={() => confirmModal.action && confirmModal.action()}
        title={confirmModal.title}
        message={confirmModal.message}
      />
    </div>
  );
}
