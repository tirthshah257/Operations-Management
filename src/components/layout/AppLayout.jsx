import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import clsx from 'clsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function AppLayout() {
  const { toasts, removeToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={clsx(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          // Desktop margins:
          collapsed ? 'md:pl-16' : 'md:pl-64',
          // Mobile padding (0 margin since sidebar is overlay drawer on mobile):
          'pl-0'
        )}
      >
        <Header onMobileToggle={() => setMobileOpen(prev => !prev)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Notifications Overlay Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs sm:max-w-sm w-full px-3 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl shadow-xl border flex items-center justify-between gap-3 text-xs animate-slideUp ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span className="font-semibold">{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
