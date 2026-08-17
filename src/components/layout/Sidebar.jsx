import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Ticket,
  Grid,
  Laptop,
  Wrench,
  FolderKanban,
  FileCheck2,
  Clock,
  KeyRound,
  Inbox,
  Send,
  Truck,
  Package,
  Receipt,
  BookOpen,
  BarChart3,
  SlidersHorizontal,
  Users,
  ShieldAlert,
  Building2,
  MapPin,
  Users2,
  Store,
  History,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, onMobileClose }) {
  const { activeRole } = useAuth();

  const navigationGroups = [
    {
      group: 'DASHBOARD',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'OPERATIONS',
      items: [
        { name: 'Tickets', path: '/tickets', icon: Ticket },
        { name: 'Complaint Matrix', path: '/complaint-matrix', icon: Grid },
        { name: 'IT Assets', path: '/assets', icon: Laptop },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench },
        { name: 'Projects', path: '/projects', icon: FolderKanban },
        { name: 'Agreements / AMC', path: '/agreements', icon: FileCheck2 },
        { name: 'SLA Management', path: '/sla', icon: Clock },
        { name: 'Licenses', path: '/licenses', icon: KeyRound },
        { name: 'Inward', path: '/inward', icon: Inbox },
        { name: 'Outward', path: '/outward', icon: Send },
        { name: 'Courier', path: '/courier', icon: Truck },
        { name: 'Stationery', path: '/stationery', icon: Package },
        { name: 'Expenses', path: '/expenses', icon: Receipt }
      ]
    },
    {
      group: 'KNOWLEDGE',
      items: [
        { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen }
      ]
    },
    {
      group: 'INSIGHTS',
      items: [
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Custom Report Builder', path: '/custom-reports', icon: SlidersHorizontal }
      ]
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Roles & Permissions', path: '/roles', icon: ShieldAlert },
        { name: 'Departments', path: '/departments', icon: Building2 },
        { name: 'Locations', path: '/locations', icon: MapPin },
        { name: 'Teams', path: '/teams', icon: Users2 },
        { name: 'Vendors', path: '/vendors', icon: Store },
        { name: 'Audit Logs', path: '/audit-logs', icon: History },
        { name: 'Notifications & Reminders', path: '/notifications', icon: Bell },
        { name: 'Configuration / Settings', path: '/settings', icon: Settings },
        { name: 'My Profile & Account', path: '/profile', icon: Users }
      ]
    }
  ];

  // RBAC Navigation Filter
  const filterByRole = (items) => {
    if (activeRole === 'Super Admin' || activeRole === 'Admin') return items;

    return items.filter(item => {
      if (item.name === 'My Profile & Account') return true;

      if (activeRole === 'End User') {
        return ['Dashboard', 'Tickets', 'IT Assets', 'Knowledge Base'].includes(item.name);
      }
      if (activeRole === 'Technician') {
        return ['Dashboard', 'Tickets', 'IT Assets', 'Maintenance', 'Knowledge Base'].includes(item.name);
      }
      if (activeRole === 'Manager') {
        return !['Users', 'Roles & Permissions', 'Configuration / Settings'].includes(item.name);
      }
      if (activeRole === 'Inventory Manager') {
        return ['Dashboard', 'IT Assets', 'Stationery', 'Inward', 'Outward', 'Courier', 'Knowledge Base'].includes(item.name);
      }
      if (activeRole === 'Finance') {
        return ['Dashboard', 'Expenses', 'Agreements / AMC', 'Licenses', 'Reports', 'Custom Report Builder'].includes(item.name);
      }
      return true;
    });
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col',
          // Desktop positioning:
          'md:translate-x-0',
          collapsed ? 'md:w-16' : 'md:w-64',
          // Mobile positioning:
          'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {(!collapsed || mobileOpen) && (
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xs font-black text-white tracking-wider uppercase leading-none">Enterprise</h1>
                <p className="text-[10px] text-blue-400 font-semibold tracking-tight mt-0.5">Asset & Ticketing</p>
              </div>
            </div>
          )}

          {/* Close button for mobile */}
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Collapse button for desktop */}
          <button
            onClick={() => setCollapsed(prev => !prev)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navigationGroups.map((group) => {
            const visibleItems = filterByRole(group.items);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                {(!collapsed || mobileOpen) && (
                  <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                    {group.group}
                  </div>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          if (mobileOpen) onMobileClose();
                        }}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
                            isActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          )
                        }
                        title={collapsed && !mobileOpen ? item.name : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {(!collapsed || mobileOpen) && <span className="truncate">{item.name}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        {(!collapsed || mobileOpen) && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-500 font-mono text-center shrink-0">
            Frontend Demo Architecture
          </div>
        )}
      </aside>
    </>
  );
}
