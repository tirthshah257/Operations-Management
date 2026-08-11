import { storageService } from './storageService';
import { auditService } from './auditService';
import { expenseService } from './expenseService';

export const courierService = {
  getCouriers() {
    return storageService.getItem(storageService.KEYS.COURIER, []);
  },

  createCourierBooking(data) {
    const list = this.getCouriers();
    const id = `COU-${String(list.length + 1).padStart(3, '0')}`;
    const awb = data.awbNumber || `AWB-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newItem = {
      ...data,
      id,
      awbNumber: awb,
      currentStatus: 'Booked',
      timeline: [
        { status: 'Booked', timestamp: new Date().toLocaleString(), location: 'Origin Hub' }
      ]
    };
    list.unshift(newItem);
    storageService.setItem(storageService.KEYS.COURIER, list);

    if (data.courierCost > 0) {
      expenseService.createExpense({
        module: 'Courier',
        category: 'Logistics & Courier',
        vendorId: 'VND-005',
        departmentId: 'DEPT-002',
        locationId: 'LOC-001',
        amount: Number(data.courierCost),
        description: `Courier booking charge for AWB ${awb} (${data.receiverName})`,
        date: new Date().toISOString().split('T')[0]
      });
    }

    auditService.logAction({
      module: 'Courier Management',
      action: 'CREATE',
      recordId: id,
      description: `Booked courier AWB ${awb} via ${data.courierCompany}`
    });

    return newItem;
  },

  updateStatus(id, newStatus, location = 'Destination Hub') {
    const list = this.getCouriers();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index].currentStatus = newStatus;
      list[index].timeline.push({
        status: newStatus,
        timestamp: new Date().toLocaleString(),
        location
      });
      storageService.setItem(storageService.KEYS.COURIER, list);
      return list[index];
    }
    return null;
  }
};
