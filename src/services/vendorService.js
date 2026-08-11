import { storageService } from './storageService';
import { auditService } from './auditService';

export const vendorService = {
  getVendors() {
    return storageService.getItem(storageService.KEYS.VENDORS, []);
  },

  getVendorById(id) {
    return this.getVendors().find(v => v.id === id) || null;
  },

  createVendor(vendorData) {
    const list = this.getVendors();
    const newItem = {
      ...vendorData,
      id: `VND-${String(list.length + 1).padStart(3, '0')}`,
      status: vendorData.status || 'Active'
    };
    list.push(newItem);
    storageService.setItem(storageService.KEYS.VENDORS, list);
    auditService.logAction({
      module: 'Vendor Management',
      action: 'CREATE',
      recordId: newItem.id,
      description: `Created vendor ${newItem.name} (${newItem.code})`
    });
    return newItem;
  },

  updateVendor(id, updates) {
    const list = this.getVendors();
    const index = list.findIndex(v => v.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      storageService.setItem(storageService.KEYS.VENDORS, list);
      auditService.logAction({
        module: 'Vendor Management',
        action: 'UPDATE',
        recordId: id,
        description: `Updated vendor details for ${list[index].name}`
      });
      return list[index];
    }
    return null;
  },

  getVendorRelatedSummary(vendorId) {
    const agreements = storageService.getItem(storageService.KEYS.AGREEMENTS, []).filter(a => a.vendorId === vendorId);
    const licenses = storageService.getItem(storageService.KEYS.LICENSES, []).filter(l => l.vendorId === vendorId);
    const maintenance = storageService.getItem(storageService.KEYS.MAINTENANCE, []).filter(m => m.vendorId === vendorId);
    const stationery = storageService.getItem(storageService.KEYS.STATIONERY, []).filter(s => s.vendorId === vendorId);
    const expenses = storageService.getItem(storageService.KEYS.EXPENSES, []).filter(e => e.vendorId === vendorId);

    return {
      agreements,
      licenses,
      maintenance,
      stationery,
      expenses,
      totalExpenseValue: expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    };
  }
};
