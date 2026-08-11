import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Drawer({ isOpen, onClose, title, children, width = 'max-w-2xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className={`fixed inset-y-0 right-0 max-w-full flex pl-10`}>
        <div className={`w-screen ${width} bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
