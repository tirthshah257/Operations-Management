import { storageService } from './storageService';
import { auditService } from './auditService';

export const userService = {
  getUsers() {
    return storageService.getItem(storageService.KEYS.USERS, []);
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id) || null;
  },

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      ...userData,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      status: userData.status || 'Active'
    };
    users.push(newUser);
    storageService.setItem(storageService.KEYS.USERS, users);
    auditService.logAction({
      module: 'User Management',
      action: 'CREATE',
      recordId: newUser.id,
      description: `Created user account for ${newUser.name} (${newUser.role})`
    });
    return newUser;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storageService.setItem(storageService.KEYS.USERS, users);
      auditService.logAction({
        module: 'User Management',
        action: 'UPDATE',
        recordId: id,
        description: `Updated user account details for ${users[index].name}`
      });
      return users[index];
    }
    return null;
  }
};
