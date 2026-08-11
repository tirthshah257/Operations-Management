import { storageService } from './storageService';
import { auditService } from './auditService';

export const expenseService = {
  getExpenses() {
    return storageService.getItem(storageService.KEYS.EXPENSES, []);
  },

  createExpense(expenseData) {
    const list = this.getExpenses();
    const count = list.length + 1001;
    const expenseId = `EXP-${count}`;

    const newExpense = {
      ...expenseData,
      id: expenseId,
      expenseNumber: expenseId,
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      status: expenseData.status || 'Approved'
    };

    list.unshift(newExpense);
    storageService.setItem(storageService.KEYS.EXPENSES, list);

    auditService.logAction({
      module: 'Expenses',
      action: 'CREATE',
      recordId: expenseId,
      description: `Logged expense ${expenseId} of ₹${newExpense.amount} under ${newExpense.module}`
    });

    return newExpense;
  }
};
