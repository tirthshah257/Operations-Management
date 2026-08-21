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
      assetName: assetData.assetName || `${assetData.make || 'IT'} ${assetData.model || 'Asset'}`,
      qrCode: `${assetId}-QR`,
      barcode: assetData.barcode || `89012345${Math.floor(10000 + Math.random() * 90000)}`,
      status: assetData.status || 'Available',
      verificationStatus: 'Verified',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      allocationHistory: assetData.allocationHistory || []
    };

    assets.unshift(newAsset);
    storageService.setItem(storageService.KEYS.ASSETS, assets);

    auditService.logAction({
      module: 'Asset Management',
      action: 'CREATE',
      recordId: assetId,
      description: `Registered asset ${assetId} (${newAsset.assetName})`
    });

    return newAsset;
  },

  allocateAsset(id, { userId, userName, locationId, locationName, allocationDate, notes = '' }) {
    const assets = storageService.getItem(storageService.KEYS.ASSETS, []);
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      const asset = assets[index];
      const allocDate = allocationDate || new Date().toISOString().split('T')[0];

      asset.status = 'Allocated';
      asset.currentUserId = userId;
      asset.currentUserName = userName;
      asset.locationId = locationId;
      asset.locationName = locationName;
      asset.allocationDate = allocDate;

      if (!asset.allocationHistory) asset.allocationHistory = [];

      asset.allocationHistory.unshift({
        id: `ALH-${Date.now()}`,
        type: 'Allocation',
        fromUserId: null,
        fromUserName: null,
        toUserId: userId,
        toUserName: userName,
        fromLocationId: null,
        fromLocationName: null,
        toLocationId: locationId,
        toLocationName: locationName,
        date: allocDate,
        notes: notes || `Allocated asset to ${userName} at ${locationName}`
      });

      storageService.setItem(storageService.KEYS.ASSETS, assets);

      auditService.logAction({
        module: 'Asset Management',
        action: 'ALLOCATE',
        recordId: id,
        description: `Allocated asset ${id} to ${userName} at ${locationName}`
      });

      return asset;
    }
    return null;
  },

  reallocateAsset(id, { newUserId, newUserName, newLocationId, newLocationName, reallocationDate, reason = '' }) {
    const assets = storageService.getItem(storageService.KEYS.ASSETS, []);
    const index = assets.findIndex(a => a.id === id);
    if (index !== -1) {
      const asset = assets[index];
      const prevUserId = asset.currentUserId;
      const prevUserName = asset.currentUserName;
      const prevLocId = asset.locationId;
      const prevLocName = asset.locationName;
      const reallocDate = reallocationDate || new Date().toISOString().split('T')[0];

      asset.status = 'Allocated';
      asset.currentUserId = newUserId;
      asset.currentUserName = newUserName;
      asset.locationId = newLocationId;
      asset.locationName = newLocationName;
      asset.allocationDate = reallocDate;

      if (!asset.allocationHistory) asset.allocationHistory = [];

      asset.allocationHistory.unshift({
        id: `ALH-${Date.now()}`,
        type: 'Reallocation',
        fromUserId: prevUserId,
        fromUserName: prevUserName,
        toUserId: newUserId,
        toUserName: newUserName,
        fromLocationId: prevLocId,
        fromLocationName: prevLocName,
        toLocationId: newLocationId,
        toLocationName: newLocationName,
        date: reallocDate,
        notes: reason || `Reallocated from ${prevUserName || 'Previous User'} to ${newUserName}`
      });

      storageService.setItem(storageService.KEYS.ASSETS, assets);

      auditService.logAction({
        module: 'Asset Management',
        action: 'REALLOCATE',
        recordId: id,
        description: `Reallocated asset ${id} from ${prevUserName} to ${newUserName}. Reason: ${reason}`
      });

      return asset;
    }
    return null;
  },

  getAllocationHistory(id) {
    const asset = this.getAssetById(id);
    return asset ? (asset.allocationHistory || []) : [];
  },

  transferAsset(id, { currentUserId, departmentId, locationId, reason, notes }) {
    return this.reallocateAsset(id, {
      newUserId: currentUserId,
      newUserName: currentUserId,
      newLocationId: locationId,
      newLocationName: locationId,
      reallocationDate: new Date().toISOString().split('T')[0],
      reason: reason || notes
    });
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
