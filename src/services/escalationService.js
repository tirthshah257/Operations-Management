import { storageService } from './storageService';

export const escalationService = {
  getEscalationRules() {
    return storageService.getItem(storageService.KEYS.ESCALATION_MATRIX, []);
  },

  updateEscalationRules(rules) {
    storageService.setItem(storageService.KEYS.ESCALATION_MATRIX, rules);
  },

  evaluateEscalation(ticket, slaCalculation) {
    if (!ticket || !slaCalculation) return ticket ? ticket.escalationLevel || 'Level 1' : 'Level 1';
    
    if (slaCalculation.slaStatus === 'Breached') {
      if (slaCalculation.elapsedMinutes > (slaCalculation.slaDurationHours * 60 + 720)) {
        return 'Level 4';
      }
      return 'Level 3';
    } else if (slaCalculation.slaStatus === 'Approaching') {
      return 'Level 2';
    }

    return 'Level 1';
  }
};
