import { storageService } from './storageService';
import { auditService } from './auditService';

export const agreementService = {
  getAgreements() {
    const list = storageService.getItem(storageService.KEYS.AGREEMENTS, []);
    const now = new Date();
    return list.map(a => {
      const exp = new Date(a.expiryDate);
      const diffDays = Math.ceil((exp - now) / (1000 * 3600 * 24));
      let computedStatus = a.status;
      if (diffDays <= 0) computedStatus = 'Expired';
      else if (diffDays <= 30) computedStatus = 'Expiring Soon';
      else computedStatus = 'Active';
      return { ...a, computedStatus, daysUntilExpiry: diffDays };
    });
  },

  createAgreement(data) {
    const list = storageService.getItem(storageService.KEYS.AGREEMENTS, []);
    const id = `AGR-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...data,
      id,
      agreementNumber: data.agreementNumber || id,
      status: 'Active',
      documents: data.documents || []
    };
    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.AGREEMENTS, list);

    auditService.logAction({
      module: 'Agreements',
      action: 'CREATE',
      recordId: id,
      description: `Created agreement ${id} (${newItem.title})`
    });
    return newItem;
  }
};
