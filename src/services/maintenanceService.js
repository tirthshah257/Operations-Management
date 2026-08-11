import { storageService } from './storageService';
import { auditService } from './auditService';
import { expenseService } from './expenseService';

export const maintenanceService = {
  getMaintenanceRequests() {
    return storageService.getItem(storageService.KEYS.MAINTENANCE, []);
  },

  createMaintenanceRequest(reqData) {
    const list = this.getMaintenanceRequests();
    const id = `MNT-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...reqData,
      id,
      requestNumber: id,
      requestDate: reqData.requestDate || new Date().toISOString().split('T')[0],
      status: reqData.status || 'Open'
    };

    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.MAINTENANCE, list);

    auditService.logAction({
      module: 'Maintenance',
      action: 'CREATE',
      recordId: id,
      description: `Logged maintenance request ${id} [${newItem.title}]`
    });

    return newItem;
  },

  updateMaintenance(id, updates) {
    const list = this.getMaintenanceRequests();
    const index = list.findIndex(m => m.id === id);
    if (index !== -1) {
      const prevStatus = list[index].status;
      list[index] = { ...list[index], ...updates };
      storageService.setItem(storageService.KEYS.MAINTENANCE, list);

      // Auto-create expense when maintenance cost added or completed
      if (updates.status === 'Completed' && updates.actualCost > 0 && prevStatus !== 'Completed') {
        expenseService.createExpense({
          module: 'Maintenance',
          category: 'Repairs & Maintenance',
          vendorId: list[index].vendorId || 'VND-002',
          departmentId: list[index].departmentId || 'DEPT-006',
          locationId: list[index].locationId || 'LOC-001',
          assetId: list[index].assetId || null,
          amount: Number(updates.actualCost),
          description: `Maintenance repair expense for ${list[index].title} (${id})`,
          date: new Date().toISOString().split('T')[0]
        });
      }

      auditService.logAction({
        module: 'Maintenance',
        action: 'UPDATE',
        recordId: id,
        description: `Updated maintenance request ${id}`
      });

      return list[index];
    }
    return null;
  }
};
