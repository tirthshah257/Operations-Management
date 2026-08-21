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

const SEED_DEFAULTS = {
  [STORAGE_KEYS.USERS]: DEFAULT_USERS,
  [STORAGE_KEYS.ROLES]: DEFAULT_ROLES,
  [STORAGE_KEYS.DEPARTMENTS]: DEFAULT_DEPARTMENTS,
  [STORAGE_KEYS.LOCATIONS]: DEFAULT_LOCATIONS,
  [STORAGE_KEYS.TEAMS]: DEFAULT_TEAMS,
  [STORAGE_KEYS.VENDORS]: DEFAULT_VENDORS,
  [STORAGE_KEYS.COMPLAINT_MATRIX]: DEFAULT_COMPLAINT_MATRIX,
  [STORAGE_KEYS.ESCALATION_MATRIX]: DEFAULT_ESCALATION_MATRIX,
  [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS,
  [STORAGE_KEYS.TICKETS]: INITIAL_TICKETS,
  [STORAGE_KEYS.ASSETS]: INITIAL_ASSETS,
  [STORAGE_KEYS.PROJECTS]: INITIAL_PROJECTS,
  [STORAGE_KEYS.AGREEMENTS]: INITIAL_AGREEMENTS,
  [STORAGE_KEYS.LICENSES]: INITIAL_LICENSES,
  [STORAGE_KEYS.STATIONERY]: INITIAL_STATIONERY,
  [STORAGE_KEYS.EXPENSES]: INITIAL_EXPENSES,
  [STORAGE_KEYS.INWARD]: INITIAL_INWARD,
  [STORAGE_KEYS.OUTWARD]: INITIAL_OUTWARD,
  [STORAGE_KEYS.COURIER]: INITIAL_COURIER,
  [STORAGE_KEYS.MAINTENANCE]: INITIAL_MAINTENANCE,
  [STORAGE_KEYS.FAQS]: INITIAL_FAQS,
  [STORAGE_KEYS.AUDIT_LOGS]: INITIAL_AUDIT_LOGS,
  [STORAGE_KEYS.NOTIFICATIONS]: INITIAL_NOTIFICATIONS,
  [STORAGE_KEYS.CUSTOM_REMINDERS]: []
};

export const storageService = {
  KEYS: STORAGE_KEYS,

  initializeSeedData(force = false) {
    Object.entries(SEED_DEFAULTS).forEach(([key, defaultValue]) => {
      const existing = localStorage.getItem(key);
      if (force || !existing) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      } else {
        if (key === STORAGE_KEYS.LOCATIONS) {
          try {
            const parsed = JSON.parse(existing);
            if (!parsed.some(l => l.name.includes('Aslali'))) {
              localStorage.setItem(key, JSON.stringify(defaultValue));
            }
          } catch (e) {}
        }
        if (key === STORAGE_KEYS.USERS) {
          try {
            const parsed = JSON.parse(existing);
            if (!parsed.some(u => u.name.includes('Mithun'))) {
              localStorage.setItem(key, JSON.stringify(defaultValue));
            }
          } catch (e) {}
        }
      }
    });
  },

  getItem(key, defaultValue = []) {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
      if (SEED_DEFAULTS[key]) {
        localStorage.setItem(key, JSON.stringify(SEED_DEFAULTS[key]));
        return SEED_DEFAULTS[key];
      }
      return defaultValue;
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
