import { storageService } from './storageService';
import { auditService } from './auditService';

export const departmentService = {
  getDepartments() {
    return storageService.getItem(storageService.KEYS.DEPARTMENTS, []);
  },

  getDepartmentById(id) {
    return this.getDepartments().find(d => d.id === id) || null;
  },

  createDepartment(deptData) {
    const list = this.getDepartments();
    const newItem = {
      ...deptData,
      id: `DEPT-${String(list.length + 1).padStart(3, '0')}`,
      status: deptData.status || 'Active'
    };
    list.push(newItem);
    storageService.setItem(storageService.KEYS.DEPARTMENTS, list);
    auditService.logAction({
      module: 'Administration',
      action: 'CREATE',
      recordId: newItem.id,
      description: `Created department ${newItem.name} (${newItem.code})`
    });
    return newItem;
  },

  updateDepartment(id, updates) {
    const list = this.getDepartments();
    const index = list.findIndex(d => d.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      storageService.setItem(storageService.KEYS.DEPARTMENTS, list);
      auditService.logAction({
        module: 'Administration',
        action: 'UPDATE',
        recordId: id,
        description: `Updated department ${list[index].name}`
      });
      return list[index];
    }
    return null;
  }
};
