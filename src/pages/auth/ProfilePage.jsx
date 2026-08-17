import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { userService } from '../../services/userService';
import { entityResolver } from '../../utils/entityResolver';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Shield,
  Building2,
  MapPin,
  Mail,
  CheckCircle2,
  Save,
  Laptop,
  Ticket,
  UserCheck,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, activeRole, switchActiveUser, switchUserRole, setCurrentUser } = useAuth();
  const { assets, tickets, departments, locations, refreshAllState } = useAppData();
  const { addToast } = useToast();

  const usersList = userService.getUsers();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    departmentId: currentUser?.departmentId || 'DEPT-001',
    locationId: currentUser?.locationId || 'LOC-001'
  });

  // Calculate user-assigned assets & tickets
  const userAssets = assets.filter(a => a.currentUserId === currentUser?.id);
  const userTickets = tickets.filter(t => t.requesterId === currentUser?.id || t.assignedUserId === currentUser?.id);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated = userService.updateUser(currentUser.id, formData);
    if (updated) {
      setCurrentUser(updated);
      localStorage.setItem('ems_current_user', JSON.stringify(updated));
      refreshAllState();
      addToast('Profile details updated successfully!', 'success');
    }
  };

  const handleSwitchToSuperAdmin = () => {
    // Find USR-001 or any Super Admin user
    const superAdmin = usersList.find(u => u.role === 'Super Admin' || u.id === 'USR-001') || usersList[0];
    if (superAdmin) {
      switchActiveUser(superAdmin.id);
      refreshAllState();
      addToast(`Switched session to Super Admin (${superAdmin.name})`, 'success');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt=""
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-blue-500/40 shadow-lg shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-black">{currentUser?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 font-extrabold text-xs">
                {activeRole}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> {currentUser?.email}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">User ID: <span className="font-bold text-white">{currentUser?.id}</span></p>
          </div>
        </div>

        {/* Quick Super Admin Switch Button */}
        <button
          onClick={handleSwitchToSuperAdmin}
          className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 shrink-0 transition-all"
        >
          <ShieldCheck className="w-4 h-4 fill-slate-950" />
          Switch Session to Super Admin
        </button>
      </div>

      {/* Account Switching & Role Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Account Selection Box */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Switch Active User Account
          </h3>
          <p className="text-xs text-slate-500">
            Select any enterprise user to switch your active session and view their profile.
          </p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {usersList.map((u) => {
              const isSelected = currentUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    switchActiveUser(u.id);
                    setFormData({
                      name: u.name,
                      email: u.email,
                      departmentId: u.departmentId || 'DEPT-001',
                      locationId: u.locationId || 'LOC-001'
                    });
                    refreshAllState();
                    addToast(`Switched user session to ${u.name}`, 'success');
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="text-left truncate">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{u.role}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Edit Profile Details Form */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User className="w-4 h-4 text-blue-600" />
            Edit Profile Details
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold"
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* User Assigned Assets & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* User IT Assets */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
            <Laptop className="w-4 h-4 text-emerald-600" />
            Assigned IT Assets ({userAssets.length})
          </h3>
          <div className="space-y-2">
            {userAssets.length > 0 ? (
              userAssets.map(a => (
                <div key={a.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-blue-600">{a.assetId}</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{a.make} {a.model}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    {a.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">No IT assets assigned to this user.</p>
            )}
          </div>
        </div>

        {/* User Tickets Summary */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
            <Ticket className="w-4 h-4 text-blue-600" />
            Tickets Associated ({userTickets.length})
          </h3>
          <div className="space-y-2">
            {userTickets.length > 0 ? (
              userTickets.slice(0, 4).map(t => (
                <div key={t.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-bold text-blue-600">{t.ticketNumber}</span>
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{t.subject}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px] shrink-0">
                    {t.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 py-4 text-center">No active tickets for this user.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
