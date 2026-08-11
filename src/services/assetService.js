import { storageService } from './storageService';
import { auditService } from './auditService';

export const assetService = {
  getAssets() {
    return storageService.getItem(storageService.KEYS.ASSETS, []);
  },

  getAssetById(id) {
    return this.getAssets().find(a => a.id === id) || null;
  },

  createAsset(assetData) {
    const assets = storageService.getItem(storageService.KEYS.ASSETS, []);
    const count = assets.length + 1001;
    const assetId = `AST-${count}`;

    const newAsset = {
      ...assetData,
      id: assetId,
      assetId,
      qrCode: `${assetId}-QR`,
      barcode: assetData.barcode || `89012345${Math.floor(10000 + Math.random() * 90000)}`,
      status: assetData.status || 'In Stock',
      verificationStatus: 'Pending Verification',
      lastVerifiedDate: new Date().toISOString().split('T')[0]
    };

    assets.unshift(newAsset);
    storageService.setItem(storageService.KEYS.ASSETS, assets);

    auditService.logAction({
      module: 'Asset Management',
      action: 'CREATE',
      recordId: assetId,
      description: `Registered asset ${assetId} (${newAsset.make} ${newAsset.model})`
    });

    return newAsset;
  },

  transferAsset(id, { currentUserId, departmentId, locationId, reason, notes, user = 'Admin' }) {
    const assets = storageService.getItem(storageService.KEYS.ASSETS, []);
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      const prevUser = assets[index].currentUserId;
      const prevDept = assets[index].departmentId;
      const prevLoc = assets[index].locationId;

      if (currentUserId !== undefined) assets[index].currentUserId = currentUserId;
      if (departmentId !== undefined) assets[index].departmentId = departmentId;
      if (locationId !== undefined) assets[index].locationId = locationId;

      assets[index].status = currentUserId ? 'In Use' : 'In Stock';

      storageService.setItem(storageService.KEYS.ASSETS, assets);

      auditService.logAction({
        module: 'Asset Management',
        action: 'TRANSFER',
        recordId: id,
        description: `Transferred asset ${id} to User: ${currentUserId || 'None'}, Dept: ${departmentId}, Location: ${locationId}. Reason: ${reason || notes}`,
        previousValue: `User: ${prevUser}, Dept: ${prevDept}, Loc: ${prevLoc}`,
        newValue: `User: ${currentUserId}, Dept: ${departmentId}, Loc: ${locationId}`
      });

      return assets[index];
    }
    return null;
  },

  updateVerification(id, { status = 'Verified', notes = '' }) {
    const assets = storageService.getItem(storageService.KEYS.ASSETS, []);
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      assets[index].verificationStatus = status;
      assets[index].lastVerifiedDate = new Date().toISOString().split('T')[0];
      storageService.setItem(storageService.KEYS.ASSETS, assets);

      auditService.logAction({
        module: 'Asset Audit',
        action: 'AUDIT_VERIFY',
        recordId: id,
        description: `Marked asset ${id} as ${status}. ${notes}`
      });
      return assets[index];
    }
    return null;
  },

  bulkImportAssets(assetList) {
    let count = 0;
    const imported = [];
    assetList.forEach(item => {
      const created = this.createAsset(item);
      imported.push(created);
      count++;
    });
    return { count, imported };
  }
};
