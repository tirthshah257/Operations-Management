import { storageService } from './storageService';

export const auditService = {
  getAuditLogs() {
    return storageService.getItem(storageService.KEYS.AUDIT_LOGS, []);
  },

  logAction({ user = 'System Administrator', role = 'Admin', module, action, recordId, description, previousValue = null, newValue = null }) {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      user,
      role,
      module,
      action,
      recordId,
      description,
      previousValue,
      newValue
    };
    logs.unshift(newLog); // Newest first
    storageService.setItem(storageService.KEYS.AUDIT_LOGS, logs);
    return newLog;
  }
};
