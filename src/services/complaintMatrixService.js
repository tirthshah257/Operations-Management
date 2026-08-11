import { storageService } from './storageService';
import { auditService } from './auditService';

export const complaintMatrixService = {
  getRules() {
    return storageService.getItem(storageService.KEYS.COMPLAINT_MATRIX, []);
  },

  getRuleById(id) {
    return this.getRules().find(r => r.id === id) || null;
  },

  createRule(ruleData) {
    const list = this.getRules();
    const newItem = {
      ...ruleData,
      id: `CM-${String(list.length + 1).padStart(3, '0')}`,
      status: ruleData.status || 'Active'
    };
    list.push(newItem);
    storageService.setItem(storageService.KEYS.COMPLAINT_MATRIX, list);
    auditService.logAction({
      module: 'Complaint Matrix',
      action: 'CREATE',
      recordId: newItem.id,
      description: `Created complaint matrix rule for ${newItem.category} - ${newItem.subcategory}`
    });
    return newItem;
  },

  updateRule(id, updates) {
    const list = this.getRules();
    const index = list.findIndex(r => r.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      storageService.setItem(storageService.KEYS.COMPLAINT_MATRIX, list);
      auditService.logAction({
        module: 'Complaint Matrix',
        action: 'UPDATE',
        recordId: id,
        description: `Updated complaint matrix rule ${id}`
      });
      return list[index];
    }
    return null;
  },

  matchKeywordSuggestion(inputText) {
    if (!inputText || inputText.trim().length < 3) return null;
    const text = inputText.toLowerCase();
    const rules = this.getRules().filter(r => r.status === 'Active');

    // Rule-based keyword matching
    for (const rule of rules) {
      const categoryMatch = rule.category.toLowerCase();
      const subcategoryMatch = rule.subcategory.toLowerCase();
      const exampleMatch = (rule.example || '').toLowerCase();

      if (text.includes(subcategoryMatch.toLowerCase()) || 
          text.includes(categoryMatch.toLowerCase()) || 
          exampleMatch.split(',').some(ex => text.includes(ex.trim()))) {
        return rule;
      }
    }

    // Default fallback rule if no exact keyword matched
    return rules.find(r => r.category.includes('IT')) || rules[0] || null;
  }
};
