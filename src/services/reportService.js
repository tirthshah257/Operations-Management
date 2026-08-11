import { ticketService } from './ticketService';
import { assetService } from './assetService';
import { projectService } from './projectService';
import { agreementService } from './agreementService';
import { licenseService } from './licenseService';
import { stationeryService } from './stationeryService';
import { expenseService } from './expenseService';
import { notificationService } from './notificationService';
import { maintenanceService } from './maintenanceService';

export const reportService = {
  getDashboardMetrics() {
    const tickets = ticketService.getTickets();
    const assets = assetService.getAssets();
    const projects = projectService.getProjects();
    const agreements = agreementService.getAgreements();
    const licenses = licenseService.getLicenses();
    const stationery = stationeryService.getItems();
    const expenses = expenseService.getExpenses();
    const notifications = notificationService.getNotifications();
    const maintenance = maintenanceService.getMaintenanceRequests();

    // Ticket KPIs
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
    const closedTickets = tickets.filter(t => t.status === 'Closed').length;
    const breachedTickets = tickets.filter(t => t.slaEvaluation && t.slaEvaluation.isOverdue && t.status !== 'Resolved' && t.status !== 'Closed').length;

    // Asset KPIs
    const totalAssets = assets.length;
    const inUseAssets = assets.filter(a => a.status === 'In Use').length;
    const inStockAssets = assets.filter(a => a.status === 'In Stock').length;
    const underRepairAssets = assets.filter(a => a.status === 'Under Repair').length;

    // Project KPIs
    const totalProjects = projects.length;
    const inProgressProjects = projects.filter(p => p.status === 'In Progress').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    // Agreement KPIs
    const activeAgreements = agreements.filter(a => a.computedStatus === 'Active').length;
    const expiringAgreements = agreements.filter(a => a.computedStatus === 'Expiring Soon').length;

    // License KPIs
    const totalLicenses = licenses.reduce((sum, l) => sum + (Number(l.totalQuantity) || 0), 0);
    const usedLicenses = licenses.reduce((sum, l) => sum + (Number(l.usedQuantity) || 0), 0);

    // Stationery KPIs
    const lowStockStationery = stationery.filter(s => s.status === 'Low Stock').length;

    // Financial KPIs
    const totalExpenseAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    // Unread Notifications
    const unreadNotifs = notifications.filter(n => !n.read).length;

    return {
      tickets: { total: tickets.length, open: openTickets, inProgress: inProgressTickets, resolved: resolvedTickets, closed: closedTickets, breached: breachedTickets },
      assets: { total: totalAssets, inUse: inUseAssets, inStock: inStockAssets, underRepair: underRepairAssets },
      projects: { total: totalProjects, inProgress: inProgressProjects, completed: completedProjects },
      agreements: { active: activeAgreements, expiring: expiringAgreements },
      licenses: { total: totalLicenses, used: usedLicenses, available: totalLicenses - usedLicenses },
      stationery: { totalItems: stationery.length, lowStock: lowStockStationery },
      expenses: { totalCost: totalExpenseAmount },
      notifications: { unread: unreadNotifs },
      maintenance: { totalRequests: maintenance.length }
    };
  }
};
