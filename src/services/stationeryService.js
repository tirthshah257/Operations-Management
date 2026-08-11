import { storageService } from './storageService';
import { auditService } from './auditService';
import { expenseService } from './expenseService';

export const stationeryService = {
  getItems() {
    const list = storageService.getItem(storageService.KEYS.STATIONERY, []);
    return list.map(item => {
      const currentStock = (Number(item.openingStock) || 0) + (Number(item.stockIn) || 0) - (Number(item.stockOut) || 0);
      const isLow = currentStock <= (Number(item.reorderLevel) || 10);
      return {
        ...item,
        currentStock,
        totalValue: currentStock * (Number(item.unitCost) || 0),
        status: isLow ? 'Low Stock' : 'Normal'
      };
    });
  },

  createItem(itemData) {
    const list = storageService.getItem(storageService.KEYS.STATIONERY, []);
    const id = `STN-${String(list.length + 1).padStart(3, '0')}`;
    const newItem = {
      ...itemData,
      id,
      itemCode: itemData.itemCode || `STN-ITM-${id}`,
      openingStock: Number(itemData.openingStock) || 0,
      stockIn: 0,
      stockOut: 0,
      reorderLevel: Number(itemData.reorderLevel) || 10,
      minimumStock: Number(itemData.minimumStock) || 5,
      unitCost: Number(itemData.unitCost) || 0
    };
    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.STATIONERY, list);

    auditService.logAction({
      module: 'Stationery',
      action: 'CREATE',
      recordId: id,
      description: `Created stationery master item ${newItem.description}`
    });
    return newItem;
  },

  addStockIn(itemId, quantity, unitCost, vendorId = 'VND-006') {
    const list = storageService.getItem(storageService.KEYS.STATIONERY, []);
    const index = list.findIndex(s => s.id === itemId);
    if (index !== -1) {
      const addedQty = Number(quantity);
      list[index].stockIn = (Number(list[index].stockIn) || 0) + addedQty;
      if (unitCost) list[index].unitCost = Number(unitCost);

      storageService.setItem(storageService.KEYS.STATIONERY, list);

      const totalCost = addedQty * (Number(unitCost) || list[index].unitCost || 0);
      if (totalCost > 0) {
        expenseService.createExpense({
          module: 'Stationery',
          category: 'Stationery Purchase',
          vendorId,
          departmentId: 'DEPT-002',
          locationId: 'LOC-001',
          amount: totalCost,
          description: `Stock In ${addedQty} ${list[index].unit} of ${list[index].description}`,
          date: new Date().toISOString().split('T')[0]
        });
      }

      auditService.logAction({
        module: 'Stationery',
        action: 'STOCK_IN',
        recordId: itemId,
        description: `Added +${addedQty} stock to ${list[index].description}`
      });

      return list[index];
    }
    return null;
  },

  addStockOut(itemId, quantity, issuedToDepartmentId, purpose = '') {
    const list = storageService.getItem(storageService.KEYS.STATIONERY, []);
    const index = list.findIndex(s => s.id === itemId);
    if (index !== -1) {
      const issuedQty = Number(quantity);
      list[index].stockOut = (Number(list[index].stockOut) || 0) + issuedQty;

      storageService.setItem(storageService.KEYS.STATIONERY, list);

      auditService.logAction({
        module: 'Stationery',
        action: 'STOCK_OUT',
        recordId: itemId,
        description: `Issued -${issuedQty} of ${list[index].description} to Dept ${issuedToDepartmentId}. Purpose: ${purpose}`
      });

      return list[index];
    }
    return null;
  }
};
