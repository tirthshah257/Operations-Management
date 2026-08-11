import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';
import RoleSwitcher from './RoleSwitcher';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  ChevronDown,
  User,
  LogOut,
  MapPin,
  ExternalLink,
  X
} from 'lucide-react';

export default function Header() {
  const { currentUser, activeRole, locationFilter, setLocationFilter, logoutDemo } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, tickets, assets, projects, vendors, locations } = useAppData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadNotifsCount = notifications ? notifications.filter(n => !n.read).length : 0;

  // Global Search Filter
  const filteredSearchResults = () => {
    if (!searchQuery || searchQuery.trim().length < 2) return null;
    const q = searchQuery.toLowerCase();

    return {
      tickets: tickets.filter(t => t.ticketNumber.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 3),
      assets: assets.filter(a => a.assetId.toLowerCase().includes(q) || a.make.toLowerCase().includes(q) || a.model.toLowerCase().includes(q)).slice(0, 3),
      projects: projects.filter(p => p.projectCode.toLowerCase().includes(q) || p.projectName.toLowerCase().includes(q)).slice(0, 3),
      vendors: vendors.filter(v => v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q)).slice(0, 3)
    };
  };

  const searchResults = filteredSearchResults();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* Search Input Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs w-48 md:w-72 transition-colors"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="truncate">Global search (Tickets, Assets)...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Global Location Filter */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Active Role Switcher Badge */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{activeRole}</span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </button>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(prev => !prev)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-3 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <button
                  onClick={() => navigate('/notifications')}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  View All ({notifications.length})
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifDropdown(false);
                      navigate(n.linkRoute || '/notifications');
                    }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      !n.read
                        ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{n.title}</span>
                      <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400 uppercase">{n.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt="Avatar"
              className="w-7 h-7 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{currentUser?.email}</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 space-y-1">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                  Role: {activeRole}
                </span>
              </div>

              <RoleSwitcher />

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    logoutDemo();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Overlay Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tickets, Assets, Projects, Vendors..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
              />
              <button onClick={() => setShowSearchModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {searchResults ? (
                <>
                  {searchResults.tickets.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Tickets</p>
                      {searchResults.tickets.map(t => (
                        <div
                          key={t.id}
                          onClick={() => { setShowSearchModal(false); navigate('/tickets'); }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-blue-600">{t.ticketNumber} — {t.subject}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.assets.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Assets</p>
                      {searchResults.assets.map(a => (
                        <div
                          key={a.id}
                          onClick={() => { setShowSearchModal(false); navigate('/assets'); }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{a.assetId} — {a.make} {a.model}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.projects.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Projects</p>
                      {searchResults.projects.map(p => (
                        <div
                          key={p.id}
                          onClick={() => { setShowSearchModal(false); navigate('/projects'); }}
                          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{p.projectCode} — {p.projectName}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">Type keywords to search across all operational modules...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
