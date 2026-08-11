import { storageService } from './storageService';
import { auditService } from './auditService';

export const locationService = {
  getLocations() {
    return storageService.getItem(storageService.KEYS.LOCATIONS, []);
  },

  getLocationById(id) {
    return this.getLocations().find(l => l.id === id) || null;
  },

  createLocation(locData) {
    const list = this.getLocations();
    const newItem = {
      ...locData,
      id: `LOC-${String(list.length + 1).padStart(3, '0')}`,
      status: locData.status || 'Active'
    };
    list.push(newItem);
    storageService.setItem(storageService.KEYS.LOCATIONS, list);
    auditService.logAction({
      module: 'Administration',
      action: 'CREATE',
      recordId: newItem.id,
      description: `Created location ${newItem.name}`
    });
    return newItem;
  },

  updateLocation(id, updates) {
    const list = this.getLocations();
    const index = list.findIndex(l => l.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      storageService.setItem(storageService.KEYS.LOCATIONS, list);
      auditService.logAction({
        module: 'Administration',
        action: 'UPDATE',
        recordId: id,
        description: `Updated location ${list[index].name}`
      });
      return list[index];
    }
    return null;
  }
};
