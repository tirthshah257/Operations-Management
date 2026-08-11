import { calculateSlaStatus } from '../utils/slaCalculator';
import { complaintMatrixService } from './complaintMatrixService';

export const slaService = {
  evaluateTicketSla(ticket) {
    if (!ticket) return null;
    const slaHours = ticket.slaHours || 4;
    return calculateSlaStatus(ticket.createdDate, slaHours);
  },

  getSlaPolicyForCategory(categoryId) {
    const rule = complaintMatrixService.getRuleById(categoryId);
    return rule ? { slaHours: rule.slaHours, priority: rule.priority, teamId: rule.teamId } : { slaHours: 8, priority: 'Medium', teamId: 'TEAM-001' };
  }
};
