import { storageService } from './storageService';
import { auditService } from './auditService';

export const teamService = {
  getTeams() {
    return storageService.getItem(storageService.KEYS.TEAMS, []);
  },

  getTeamById(id) {
    return this.getTeams().find(t => t.id === id) || null;
  },

  createTeam(teamData) {
    const list = this.getTeams();
    const newItem = {
      ...teamData,
      id: `TEAM-${String(list.length + 1).padStart(3, '0')}`,
      status: teamData.status || 'Active'
    };
    list.push(newItem);
    storageService.setItem(storageService.KEYS.TEAMS, list);
    auditService.logAction({
      module: 'Administration',
      action: 'CREATE',
      recordId: newItem.id,
      description: `Created assignment team ${newItem.name}`
    });
    return newItem;
  },

  updateTeam(id, updates) {
    const list = this.getTeams();
    const index = list.findIndex(t => t.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      storageService.setItem(storageService.KEYS.TEAMS, list);
      auditService.logAction({
        module: 'Administration',
        action: 'UPDATE',
        recordId: id,
        description: `Updated assignment team ${list[index].name}`
      });
      return list[index];
    }
    return null;
  }
};
