import { storageService } from './storageService';
import { auditService } from './auditService';

export const faqService = {
  getFaqs() {
    return storageService.getItem(storageService.KEYS.FAQS, []);
  },

  getFaqById(id) {
    return this.getFaqs().find(f => f.id === id) || null;
  },

  createFaq(faqData) {
    const faqs = this.getFaqs();
    const newFaq = {
      id: `FAQ-${String(faqs.length + 1).padStart(3, '0')}`,
      category: faqData.category || 'General IT',
      question: faqData.question,
      answer: faqData.answer,
      helpfulCount: 0,
      unhelpfulCount: 0,
      createdAt: new Date().toISOString()
    };
    faqs.push(newFaq);
    storageService.setItem(storageService.KEYS.FAQS, faqs);
    auditService.logAction({
      module: 'Knowledge Base',
      action: 'CREATE',
      recordId: newFaq.id,
      description: `Created FAQ article: "${newFaq.question}"`
    });
    return newFaq;
  },

  voteFaq(id, type = 'helpful') {
    const faqs = this.getFaqs();
    const index = faqs.findIndex(f => f.id === id);
    if (index !== -1) {
      if (type === 'helpful') {
        faqs[index].helpfulCount = (faqs[index].helpfulCount || 0) + 1;
      } else {
        faqs[index].unhelpfulCount = (faqs[index].unhelpfulCount || 0) + 1;
      }
      storageService.setItem(storageService.KEYS.FAQS, faqs);
      return faqs[index];
    }
    return null;
  },

  deleteFaq(id) {
    const faqs = this.getFaqs().filter(f => f.id !== id);
    storageService.setItem(storageService.KEYS.FAQS, faqs);
    auditService.logAction({
      module: 'Knowledge Base',
      action: 'DELETE',
      recordId: id,
      description: `Deleted FAQ article ${id}`
    });
    return true;
  }
};
