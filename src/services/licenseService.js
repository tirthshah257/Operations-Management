import { storageService } from './storageService';
import { auditService } from './auditService';

export const licenseService = {
  getLicenses() {
    const list = storageService.getItem(storageService.KEYS.LICENSES, []);
    return list.map(l => {
      const availableQuantity = Number(l.totalQuantity) - Number(l.usedQuantity);
      let complianceStatus = 'Compliant';
      if (availableQuantity < 0) complianceStatus = 'Compliance Issue (Overallocated)';
      else if (availableQuantity === 0) complianceStatus = 'At Capacity';

      return {
        ...l,
        availableQuantity,
        complianceStatus
      };
    });
  },

  createLicense(data) {
    const list = storageService.getItem(storageService.KEYS.LICENSES, []);
    const id = `LIC-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...data,
      id,
      availableQuantity: Number(data.totalQuantity) - Number(data.usedQuantity || 0),
      status: 'Active'
    };
    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.LICENSES, list);

    auditService.logAction({
      module: 'Licenses',
      action: 'CREATE',
      recordId: id,
      description: `Registered license ${id} (${newItem.softwareName})`
    });
    return newItem;
  }
};
