import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { Shield, Users, Check, UserCheck } from 'lucide-react';

export default function RoleSwitcher() {
  const { currentUser, activeRole, switchActiveUser, switchUserRole } = useAuth();
  const { refreshAllState } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('USERS'); // 'USERS' or 'ROLES'

  const users = userService.getUsers();

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

  const handleSelectUser = (user) => {
    switchActiveUser(user.id);
    refreshAllState();
    addToast(`Switched user session to ${user.name} (${user.role})`, 'success');
  };

  const handleSelectRole = (r) => {
    switchUserRole(r);
    refreshAllState();
    addToast(`Switched active role to ${r}`, 'info');
  };

  return (
    <div className="p-2 space-y-2">
      {/* Sub Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] font-bold">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-all ${
            activeTab === 'USERS'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-3 h-3" />
          User Accounts
        </button>
        <button
          onClick={() => setActiveTab('ROLES')}
          className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-all ${
            activeTab === 'ROLES'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Shield className="w-3 h-3" />
          Role Preset
        </button>
      </div>

      {/* Users View */}
      {activeTab === 'USERS' && (
        <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
          <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-slate-400">
            Select Active User Account
          </div>
          {users.map((u) => {
            const isCurrent = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => handleSelectUser(u)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={u.name}
                    className="w-6 h-6 rounded-full object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-slate-900 dark:text-white truncate text-[11px]">{u.name}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{u.role}</p>
                  </div>
                </div>
                {isCurrent && <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Roles View */}
      {activeTab === 'ROLES' && (
        <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
          <div className="px-2 py-1 text-[10px] font-extrabold uppercase text-slate-400">
            Select Role Authorization
          </div>
          {roles.map((r) => {
            const isSelected = activeRole === r;
            return (
              <button
                key={r}
                onClick={() => handleSelectRole(r)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{r}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
