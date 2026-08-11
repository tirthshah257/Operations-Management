import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import SearchBar from '../../components/common/SearchBar';
import TicketCreateModal from '../tickets/TicketCreateModal';
import { BookOpen, ThumbsUp, ThumbsDown, HelpCircle, ArrowRight } from 'lucide-react';

export default function KnowledgeBase() {
  const { storageService } = useAppData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showRaiseTicketModal, setShowRaiseTicketModal] = useState(false);
  const [faqs, setFaqs] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('ems_faqs')) || [
        {
          id: 'FAQ-001',
          category: 'Network & Connectivity',
          question: 'How do I resolve Wi-Fi disconnections on corporate laptops?',
          answer: '1. Click Wi-Fi settings and choose Forget Enterprise-Secure SSID.\n2. Re-select Enterprise-Secure network.\n3. Enter your domain username and updated password.\n4. If issue persists, flush DNS using command prompt: ipconfig /flushdns.',
          helpfulCount: 42,
          unhelpfulCount: 2
        },
        {
          id: 'FAQ-002',
          category: 'Hardware & Laptop',
          question: 'What is the standard process to request an external monitor or docking station?',
          answer: 'Navigate to IT Assets → Request Allocation, select Desktop Accessory, and submit line-manager approval. Standard approvals take 24-48 hours.',
          helpfulCount: 28,
          unhelpfulCount: 1
        },
        {
          id: 'FAQ-003',
          category: 'Facility & Office',
          question: 'How do I schedule maintenance for office AC or seating issues?',
          answer: 'Submit an Admin & Maintenance ticket selecting Category Facility / HVAC or Seating. The complaint matrix auto-assigns the Facility Team with a 4-12 hour SLA.',
          helpfulCount: 35,
          unhelpfulCount: 0
        }
      ]
    );
  });

  const categories = ['ALL', 'Network & Connectivity', 'Hardware & Laptop', 'Facility & Office'];

  const filteredFaqs = faqs.filter(f => {
    const matchSearch = f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleVote = (id, isHelpful) => {
    const updated = faqs.map(f => {
      if (f.id === id) {
        return {
          ...f,
          helpfulCount: isHelpful ? f.helpfulCount + 1 : f.helpfulCount,
          unhelpfulCount: !isHelpful ? f.unhelpfulCount + 1 : f.unhelpfulCount
        };
      }
      return f;
    });
    setFaqs(updated);
    localStorage.setItem('ems_faqs', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 mb-1">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Knowledge Base & Self-Service FAQ</h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Find instant troubleshooting guides and standard operating procedures before raising a ticket
        </p>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search FAQs, Wi-Fi, AC, Monitors..." />

        <div className="flex gap-2">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === c ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map(faq => (
          <div key={faq.id} className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                {faq.question}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
                {faq.category}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {faq.answer}
            </p>

            <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">Did this solve your issue?</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote(faq.id, true)}
                  className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-2 py-1 rounded transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-semibold">{faq.helpfulCount} Yes</span>
                </button>
                <button
                  onClick={() => {
                    handleVote(faq.id, false);
                    setShowRaiseTicketModal(true);
                  }}
                  className="flex items-center gap-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 px-2 py-1 rounded transition-colors"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span className="font-semibold">{faq.unhelpfulCount} No (Raise Ticket)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Prompt Box */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold">Still can't find what you're looking for?</h4>
          <p className="text-xs text-blue-200 mt-0.5">Raise a direct complaint ticket to auto-route to the responsible department team.</p>
        </div>
        <button
          onClick={() => setShowRaiseTicketModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
        >
          Raise Support Ticket
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <TicketCreateModal isOpen={showRaiseTicketModal} onClose={() => setShowRaiseTicketModal(false)} />
    </div>
  );
}
