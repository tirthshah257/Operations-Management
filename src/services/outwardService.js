import { storageService } from './storageService';
import { auditService } from './auditService';

export const outwardService = {
  getOutwardLogs() {
    return storageService.getItem(storageService.KEYS.OUTWARD, []);
  },

  createOutward(data) {
    const list = this.getOutwardLogs();
    const id = `OUT-2026-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...data,
      id,
      outwardNumber: id,
      date: data.date || new Date().toISOString().split('T')[0],
      dispatchStatus: 'Created'
    };
    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.OUTWARD, list);

    auditService.logAction({
      module: 'Outward Management',
      action: 'CREATE',
      recordId: id,
      description: `Created outward dispatch ${id} to ${newItem.sentTo}`
    });
    return newItem;
  },

  updateStatus(id, status) {
    const list = this.getOutwardLogs();
    const index = list.findIndex(o => o.id === id);
    if (index !== -1) {
      list[index].dispatchStatus = status;
      storageService.setItem(storageService.KEYS.OUTWARD, list);
      return list[index];
    }
    return null;
  }
};
