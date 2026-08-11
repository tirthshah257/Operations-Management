import React, { useState } from 'react';
import ComplaintMatrix from '../complaint-matrix/ComplaintMatrix';
import DepartmentList from '../departments/DepartmentList';
import LocationList from '../locations/LocationList';
import TeamList from '../teams/TeamList';
import VendorList from '../vendors/VendorList';
import RolesPermissions from '../users/RolesPermissions';
import EmailIntegrationSettings from './EmailIntegrationSettings';
import DataManagement from './DataManagement';
import { Settings, Grid, Building2, MapPin, Users2, Store, ShieldAlert, Mail, Database, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('GENERAL');

  const tabs = [
    { id: 'GENERAL', label: 'General Configuration', icon: Sliders },
    { id: 'MATRIX', label: 'Complaint Matrix Editor', icon: Grid },
    { id: 'DEPARTMENTS', label: 'Departments Registry', icon: Building2 },
    { id: 'LOCATIONS', label: 'Locations Registry', icon: MapPin },
    { id: 'TEAMS', label: 'Teams Registry', icon: Users2 },
    { id: 'VENDORS', label: 'Vendors Directory', icon: Store },
    { id: 'ROLES', label: 'Roles & Permissions Matrix', icon: ShieldAlert },
    { id: 'EMAIL', label: 'Email Integration Demo', icon: Mail },
    { id: 'DATA', label: 'Data Management (JSON Backup/Restore)', icon: Database }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Central Configuration & Settings Portal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Master data registers, Complaint Matrix rules, SLA policy parameters & data management
        </p>
      </div>

      {/* Tabs Menu Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'GENERAL' && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-2xl space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Enterprise General System Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">Company / Organization Name</label>
              <input type="text" defaultValue="Enterprise SaaS Solutions Ltd" className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold" />
            </div>
            <div>
              <label className="block font-semibold mb-1">System Portal Title</label>
              <input type="text" defaultValue="Asset Management & Ticketing Portal" className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Currency Format</label>
                <input type="text" defaultValue="INR (₹)" className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Default Timezone</label>
                <input type="text" defaultValue="Asia/Kolkata (IST)" className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MATRIX' && <ComplaintMatrix />}
      {activeTab === 'DEPARTMENTS' && <DepartmentList />}
      {activeTab === 'LOCATIONS' && <LocationList />}
      {activeTab === 'TEAMS' && <TeamList />}
      {activeTab === 'VENDORS' && <VendorList />}
      {activeTab === 'ROLES' && <RolesPermissions />}
      {activeTab === 'EMAIL' && <EmailIntegrationSettings />}
      {activeTab === 'DATA' && <DataManagement />}
    </div>
  );
}
