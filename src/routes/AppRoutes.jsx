import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import TicketList from '../pages/tickets/TicketList';
import ComplaintMatrix from '../pages/complaint-matrix/ComplaintMatrix';
import KnowledgeBase from '../pages/knowledge-base/KnowledgeBase';
import AssetList from '../pages/assets/AssetList';
import MaintenanceList from '../pages/maintenance/MaintenanceList';
import ProjectList from '../pages/projects/ProjectList';
import AgreementList from '../pages/agreements/AgreementList';
import SlaManagement from '../pages/sla/SlaManagement';
import LicenseList from '../pages/licenses/LicenseList';
import InwardList from '../pages/inward/InwardList';
import OutwardList from '../pages/outward/OutwardList';
import CourierList from '../pages/courier/CourierList';
import StationeryList from '../pages/stationery/StationeryList';
import ExpenseList from '../pages/expenses/ExpenseList';
import NotificationCenter from '../pages/notifications/NotificationCenter';
import StandardReports from '../pages/reports/StandardReports';
import CustomReportBuilder from '../pages/reports/CustomReportBuilder';
import UserList from '../pages/users/UserList';
import RolesPermissions from '../pages/users/RolesPermissions';
import DepartmentList from '../pages/departments/DepartmentList';
import LocationList from '../pages/locations/LocationList';
import TeamList from '../pages/teams/TeamList';
import VendorList from '../pages/vendors/VendorList';
import AuditLogs from '../pages/audit/AuditLogs';
import SettingsPage from '../pages/settings/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tickets" element={<TicketList />} />
        <Route path="complaint-matrix" element={<ComplaintMatrix />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="assets" element={<AssetList />} />
        <Route path="maintenance" element={<MaintenanceList />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="agreements" element={<AgreementList />} />
        <Route path="sla" element={<SlaManagement />} />
        <Route path="licenses" element={<LicenseList />} />
        <Route path="inward" element={<InwardList />} />
        <Route path="outward" element={<OutwardList />} />
        <Route path="courier" element={<CourierList />} />
        <Route path="stationery" element={<StationeryList />} />
        <Route path="expenses" element={<ExpenseList />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="reports" element={<StandardReports />} />
        <Route path="custom-reports" element={<CustomReportBuilder />} />
        <Route path="users" element={<UserList />} />
        <Route path="roles" element={<RolesPermissions />} />
        <Route path="departments" element={<DepartmentList />} />
        <Route path="locations" element={<LocationList />} />
        <Route path="teams" element={<TeamList />} />
        <Route path="vendors" element={<VendorList />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
