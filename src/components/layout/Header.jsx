import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';
import RoleSwitcher from './RoleSwitcher';
import { useToast } from '../../context/ToastContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Shield,
  ChevronDown,
  LogOut,
  MapPin,
  ExternalLink,
  X,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Header({ onMobileToggle }) {
  const { currentUser, activeRole, switchActiveUser, locationFilter, setLocationFilter, logoutDemo } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { notifications, tickets, assets, projects, vendors, locations, refreshAllState } = useAppData();
  const { addToast } = useToast();
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

  const handleSwitchToSuperAdmin = () => {
    switchActiveUser('USR-001');
    refreshAllState();
    setShowProfileMenu(false);
    addToast('Switched session to Super Admin (System Administrator)', 'success');
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full max-w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-2.5 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Hamburger & Search & Location Filter */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          onClick={onMobileToggle}
          className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Compact Search Button for Phone / Expanded Bar for Tablet & Desktop */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs sm:w-60 md:w-72 transition-colors shrink-0"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="truncate hidden sm:inline">Search (Tickets, Assets)...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Global Location Filter (Desktop only - Dark Mode Fixed) */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Active Role Indicator Badge (Informational - Navigates to Roles or Profile) */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] sm:text-xs font-extrabold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          title="Active Permission Role (Click to view Profile)"
        >
          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate max-w-[75px] sm:max-w-none">{activeRole}</span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          title="Toggle Dark / Light Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown Bell */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowNotifDropdown(prev => !prev);
              setShowProfileMenu(false);
            }}
            className="relative p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications Alert Bell"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 p-3 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <button
                  onClick={() => {
                    setShowNotifDropdown(false);
                    navigate('/notifications');
                  }}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
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

        {/* User Profile Avatar Menu (Single Clear Entrypoint) */}
        <div className="relative shrink-0">
          <button
            onClick={() => {
              setShowProfileMenu(prev => !prev);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="User Profile Menu"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt="Avatar"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-500/40 shrink-0"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{currentUser?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2.5 space-y-2">
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                  Role: {activeRole}
                </span>
              </div>

              {/* Navigation to Full Profile Page */}
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-extrabold text-xs transition-colors"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  View & Edit My Profile Page
                </span>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-70" />
              </button>

              {/* Quick Super Admin Switch Button */}
              {activeRole !== 'Super Admin' && (
                <button
                  onClick={handleSwitchToSuperAdmin}
                  className="w-full flex items-center gap-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Quick Switch to Super Admin
                </button>
              )}

              <RoleSwitcher />

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => {
                    logoutDemo();
                    setShowProfileMenu(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-6 sm:pt-20 p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tickets, Assets, Projects..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
              />
              <button onClick={() => setShowSearchModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
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
