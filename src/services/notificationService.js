import { storageService } from './storageService';
import { ticketService } from './ticketService';
import { stationeryService } from './stationeryService';
import { agreementService } from './agreementService';
import { licenseService } from './licenseService';

export const notificationService = {
  getNotifications() {
    this.evaluateAllNotifications();
    return storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
  },

  getCustomReminders() {
    return storageService.getItem(storageService.KEYS.CUSTOM_REMINDERS, []);
  },

  createCustomReminder(reminderData) {
    const reminders = this.getCustomReminders();
    const newReminder = {
      id: `REM-${Date.now()}`,
      ...reminderData,
      createdAt: new Date().toISOString()
    };
    reminders.unshift(newReminder);
    storageService.setItem(storageService.KEYS.CUSTOM_REMINDERS, reminders);
    this.evaluateAllNotifications();
    return newReminder;
  },

  markAsRead(id) {
    const list = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const index = list.findIndex(n => n.id === id);
    if (index !== -1) {
      list[index].read = true;
      storageService.setItem(storageService.KEYS.NOTIFICATIONS, list);
    }
  },

  markAllAsRead() {
    const list = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const updated = list.map(n => ({ ...n, read: true }));
    storageService.setItem(storageService.KEYS.NOTIFICATIONS, updated);
  },

  evaluateAllNotifications() {
    const currentNotifs = storageService.getItem(storageService.KEYS.NOTIFICATIONS, []);
    const existingKeys = new Set(currentNotifs.map(n => n.notificationKey));

    const newNotifs = [];

    // 1. SLA Breached Tickets
    const tickets = ticketService.getTickets();
    tickets.forEach(t => {
      if (t.slaEvaluation && t.slaEvaluation.isOverdue && t.status !== 'Resolved' && t.status !== 'Closed') {
        const key = `SLA_BREACH_${t.id}_100%`;
        if (!existingKeys.has(key)) {
          newNotifs.push({
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            notificationKey: key,
            type: 'SLA Alert',
            title: `SLA Breached: Ticket ${t.ticketNumber}`,
            message: `Ticket "${t.subject}" has breached its ${t.slaHours}-hour SLA threshold.`,
            priority: 'Critical',
            read: false,
            timestamp: new Date().toISOString(),
            linkRoute: '/tickets'
          });
          existingKeys.add(key);
        }
      }
    });

    // 2. Low Stock Stationery
    const stationery = stationeryService.getItems();
    stationery.forEach(s => {
      if (s.status === 'Low Stock') {
        const key = `STATIONERY_LOW_STOCK_${s.id}_THRESHOLD`;
        if (!existingKeys.has(key)) {
          newNotifs.push({
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            notificationKey: key,
            type: 'Low Stock Alert',
            title: `Low Stock: ${s.description}`,
            message: `Current stock is ${s.currentStock} ${s.unit} (Reorder level: ${s.reorderLevel}).`,
            priority: 'Warning',
            read: false,
            timestamp: new Date().toISOString(),
            linkRoute: '/stationery'
          });
          existingKeys.add(key);
        }
      }
    });

    // 3. Agreement Expiry
    const agreements = agreementService.getAgreements();
    agreements.forEach(a => {
      if (a.daysUntilExpiry <= 30 && a.daysUntilExpiry > 0) {
        const key = `AGREEMENT_EXPIRY_${a.id}_30DAYS`;
        if (!existingKeys.has(key)) {
          newNotifs.push({
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            notificationKey: key,
            type: 'Renewal Reminder',
            title: `Agreement Expiring Soon: ${a.agreementNumber}`,
            message: `Agreement "${a.title}" expires in ${a.daysUntilExpiry} days.`,
            priority: 'Medium',
            read: false,
            timestamp: new Date().toISOString(),
            linkRoute: '/agreements'
          });
          existingKeys.add(key);
        }
      }
    });

    // 4. License Expiry
    const licenses = licenseService.getLicenses();
    licenses.forEach(l => {
      if (l.status === 'Expiring Soon') {
        const key = `LICENSE_EXPIRY_${l.id}_30DAYS`;
        if (!existingKeys.has(key)) {
          newNotifs.push({
            id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            notificationKey: key,
            type: 'License Reminder',
            title: `License Renewal: ${l.softwareName}`,
            message: `License subscription for ${l.softwareName} expires soon.`,
            priority: 'Warning',
            read: false,
            timestamp: new Date().toISOString(),
            linkRoute: '/licenses'
          });
          existingKeys.add(key);
        }
      }
    });

    if (newNotifs.length > 0) {
      const updated = [...newNotifs, ...currentNotifs];
      storageService.setItem(storageService.KEYS.NOTIFICATIONS, updated);
    }
  }
};
