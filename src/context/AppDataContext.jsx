import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { ticketService } from '../services/ticketService';
import { assetService } from '../services/assetService';
import { projectService } from '../services/projectService';
import { agreementService } from '../services/agreementService';
import { licenseService } from '../services/licenseService';
import { stationeryService } from '../services/stationeryService';
import { expenseService } from '../services/expenseService';
import { notificationService } from '../services/notificationService';
import { maintenanceService } from '../services/maintenanceService';
import { userService } from '../services/userService';
import { departmentService } from '../services/departmentService';
import { locationService } from '../services/locationService';
import { teamService } from '../services/teamService';
import { vendorService } from '../services/vendorService';
import { auditService } from '../services/auditService';
import { complaintMatrixService } from '../services/complaintMatrixService';
import { reportService } from '../services/reportService';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [stationery, setStationery] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [complaintMatrix, setComplaintMatrix] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const refreshAllState = useCallback(() => {
    storageService.initializeSeedData();
    setTickets(ticketService.getTickets());
    setAssets(assetService.getAssets());
    setProjects(projectService.getProjects());
    setAgreements(agreementService.getAgreements());
    setLicenses(licenseService.getLicenses());
    setStationery(stationeryService.getItems());
    setExpenses(expenseService.getExpenses());
    setNotifications(notificationService.getNotifications());
    setMaintenance(maintenanceService.getMaintenanceRequests());
    setUsers(userService.getUsers());
    setDepartments(departmentService.getDepartments());
    setLocations(locationService.getLocations());
    setTeams(teamService.getTeams());
    setVendors(vendorService.getVendors());
    setAuditLogs(auditService.getAuditLogs());
    setComplaintMatrix(complaintMatrixService.getRules());
    setMetrics(reportService.getDashboardMetrics());
  }, []);

  useEffect(() => {
    refreshAllState();
  }, [refreshAllState]);

  return (
    <AppDataContext.Provider
      value={{
        tickets,
        assets,
        projects,
        agreements,
        licenses,
        stationery,
        expenses,
        notifications,
        maintenance,
        users,
        departments,
        locations,
        teams,
        vendors,
        auditLogs,
        complaintMatrix,
        metrics,
        refreshAllState
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
