import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Shield, Check } from 'lucide-react';

export default function RoleSwitcher() {
  const { activeRole, switchUserRole } = useAuth();
  const { refreshAllState } = useAppData();

  const roles = [
    'Super Admin',
    'Admin',
    'Manager',
    'IT Admin',
    'Technician',
    'End User',
    'Project Manager',
    'Inventory Manager',
    'Finance'
  ];

  const handleSelectRole = (r) => {
    switchUserRole(r);
    refreshAllState();
  };

  return (
    <div className="p-2 space-y-1">
      <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
        <Shield className="w-3 h-3 text-blue-500" />
        Switch Demo Role
      </div>
      {roles.map((r) => (
        <button
          key={r}
          onClick={() => handleSelectRole(r)}
          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeRole === r
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {r}
          {activeRole === r && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        </button>
      ))}
    </div>
  );
}
