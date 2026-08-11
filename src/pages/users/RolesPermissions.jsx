import React from 'react';
import { roleService } from '../../services/roleService';
import { ShieldAlert, Check, X } from 'lucide-react';

export default function RolesPermissions() {
  const roles = roleService.getRoles();

  const permissionsList = [
    { key: 'view', label: 'View Operational Dashboards' },
    { key: 'create', label: 'Create Tickets & Records' },
    { key: 'edit', label: 'Edit Existing Records' },
    { key: 'delete', label: 'Delete Records' },
    { key: 'approve', label: 'Approve Inward & Expenses' },
    { key: 'assign', label: 'Assign Tickets & Assets' },
    { key: 'export', label: 'Export Excel & PDF Reports' },
    { key: 'configure', label: 'Configure Settings & Complaint Matrix' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-600" />
          Roles & Permissions Access Control Matrix (RBAC Demo)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Frontend Role-Based Access Control policy matrix
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 font-bold uppercase text-[10px] text-slate-500">
              <tr>
                <th className="p-3">Permission Feature</th>
                {roles.map(r => (
                  <th key={r.id} className="p-3 text-center">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsList.map(perm => (
                <tr key={perm.key} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{perm.label}</td>
                  {roles.map(r => {
                    const has = r.permissions.includes('all') || r.permissions.includes(perm.key);
                    return (
                      <td key={r.id} className="p-3 text-center">
                        {has ? (
                          <div className="inline-flex p-1 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex p-1 rounded bg-slate-100 text-slate-400 dark:bg-slate-800">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
