import {
  DEFAULT_DEPARTMENTS,
  DEFAULT_LOCATIONS,
  DEFAULT_TEAMS,
  DEFAULT_VENDORS,
  DEFAULT_USERS,
  DEFAULT_ROLES,
  DEFAULT_COMPLAINT_MATRIX,
  DEFAULT_ESCALATION_MATRIX,
  DEFAULT_SETTINGS
} from '../data/masterDefaults';

import {
  INITIAL_TICKETS,
  INITIAL_ASSETS,
  INITIAL_PROJECTS,
  INITIAL_AGREEMENTS,
  INITIAL_LICENSES,
  INITIAL_STATIONERY,
  INITIAL_EXPENSES,
  INITIAL_INWARD,
  INITIAL_OUTWARD,
  INITIAL_COURIER,
  INITIAL_MAINTENANCE,
  INITIAL_FAQS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'ems_users',
  ROLES: 'ems_roles',
  DEPARTMENTS: 'ems_departments',
  LOCATIONS: 'ems_locations',
  TEAMS: 'ems_teams',
  VENDORS: 'ems_vendors',
  COMPLAINT_MATRIX: 'ems_complaint_matrix',
  ESCALATION_MATRIX: 'ems_escalation_matrix',
  SETTINGS: 'ems_settings',
  TICKETS: 'ems_tickets',
  ASSETS: 'ems_assets',
  PROJECTS: 'ems_projects',
  AGREEMENTS: 'ems_agreements',
  LICENSES: 'ems_licenses',
  STATIONERY: 'ems_stationery',
  EXPENSES: 'ems_expenses',
  INWARD: 'ems_inward',
  OUTWARD: 'ems_outward',
  COURIER: 'ems_courier',
  MAINTENANCE: 'ems_maintenance',
  FAQS: 'ems_faqs',
  AUDIT_LOGS: 'ems_audit_logs',
  NOTIFICATIONS: 'ems_notifications',
  CUSTOM_REMINDERS: 'ems_custom_reminders'
};

export const storageService = {
  KEYS: STORAGE_KEYS,

  initializeSeedData(force = false) {
    if (force || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(DEFAULT_ROLES));
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(DEFAULT_DEPARTMENTS));
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
      localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(DEFAULT_TEAMS));
      localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(DEFAULT_VENDORS));
      localStorage.setItem(STORAGE_KEYS.COMPLAINT_MATRIX, JSON.stringify(DEFAULT_COMPLAINT_MATRIX));
      localStorage.setItem(STORAGE_KEYS.ESCALATION_MATRIX, JSON.stringify(DEFAULT_ESCALATION_MATRIX));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(INITIAL_TICKETS));
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(INITIAL_ASSETS));
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem(STORAGE_KEYS.AGREEMENTS, JSON.stringify(INITIAL_AGREEMENTS));
      localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(INITIAL_LICENSES));
      localStorage.setItem(STORAGE_KEYS.STATIONERY, JSON.stringify(INITIAL_STATIONERY));
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      localStorage.setItem(STORAGE_KEYS.INWARD, JSON.stringify(INITIAL_INWARD));
      localStorage.setItem(STORAGE_KEYS.OUTWARD, JSON.stringify(INITIAL_OUTWARD));
      localStorage.setItem(STORAGE_KEYS.COURIER, JSON.stringify(INITIAL_COURIER));
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(INITIAL_MAINTENANCE));
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.CUSTOM_REMINDERS, JSON.stringify([]));
    }
  },

  getItem(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
      console.error(`Error reading ${key} from localStorage`, err);
      return defaultValue;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving ${key} to localStorage`, err);
    }
  },

  exportAllData() {
    const backup = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      backup[key] = this.getItem(key);
    });
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, val]) => {
        if (Object.values(STORAGE_KEYS).includes(key)) {
          this.setItem(key, val);
        }
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  clearAllData() {
    localStorage.clear();
    this.initializeSeedData(true);
  }
};
