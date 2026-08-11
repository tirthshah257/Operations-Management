import { storageService } from './storageService';
import { auditService } from './auditService';

export const inwardService = {
  getInwardLogs() {
    return storageService.getItem(storageService.KEYS.INWARD, []);
  },

  createInward(data) {
    const list = this.getInwardLogs();
    const id = `INW-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...data,
      id,
      inwardNumber: id,
      date: data.date || new Date().toISOString().split('T')[0],
      approvalStatus: 'Pending'
    };
    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.INWARD, list);

    auditService.logAction({
      module: 'Inward Management',
      action: 'CREATE',
      recordId: id,
      description: `Created inward entry ${id} from ${newItem.receivedFrom}`
    });
    return newItem;
  },

  updateApproval(id, status) {
    const list = this.getInwardLogs();
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      list[index].approvalStatus = status;
      storageService.setItem(storageService.KEYS.INWARD, list);
      auditService.logAction({
        module: 'Inward Management',
        action: 'UPDATE_STATUS',
        recordId: id,
        description: `Updated inward status to ${status}`
      });
      return list[index];
    }
    return null;
  }
};
