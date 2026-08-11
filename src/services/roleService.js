import { storageService } from './storageService';

export const roleService = {
  getRoles() {
    return storageService.getItem(storageService.KEYS.ROLES, []);
  },

  getRoleById(id) {
    return this.getRoles().find(r => r.id === id) || null;
  }
};
