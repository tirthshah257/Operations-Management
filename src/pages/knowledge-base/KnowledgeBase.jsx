import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import { faqService } from '../../services/faqService';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import {
  BookOpen,
  Search,
  ThumbsUp,
  ThumbsDown,
  Plus,
  HelpCircle,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KnowledgeBase() {
  const { faqs = [], refreshAllState } = useAppData();
  const { activeRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [votedMap, setVotedMap] = useState({});

  const [formData, setFormData] = useState({
    category: 'Hardware & Laptop',
    question: '',
    answer: ''
  });

  // Extract unique categories from FAQs + standard presets
  const availableCategories = Array.from(
    new Set(['ALL', 'Network & Connectivity', 'Hardware & Laptop', 'Facility & Office', ...(faqs || []).map(f => f.category)])
  );

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleVote = (faqId, type) => {
    if (votedMap[faqId]) {
      addToast('You have already submitted feedback for this article', 'info');
      return;
    }

    const updated = faqService.voteFaq(faqId, type);
    if (updated) {
      setVotedMap({ ...votedMap, [faqId]: type });
      refreshAllState();
      // Update local modal state if open
      if (selectedFaq && selectedFaq.id === faqId) {
        setSelectedFaq(updated);
      }
      addToast(
        type === 'helpful'
          ? 'Thank you for your feedback! Glad this article helped.'
          : 'Thank you for your feedback. You can raise a support ticket below for direct assistance.',
        type === 'helpful' ? 'success' : 'info'
      );
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;
    faqService.createFaq(formData);
    refreshAllState();
    addToast('Knowledge Base article created successfully!', 'success');
    setShowCreateModal(false);
    setFormData({ category: 'Hardware & Laptop', question: '', answer: '' });
  };

  const canCreateFaq = ['Super Admin', 'Admin', 'IT Admin', 'Manager'].includes(activeRole);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Enterprise Knowledge Base & Self-Service Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Troubleshooting guides, resolution steps & instant self-help solutions
          </p>
        </div>

        {canCreateFaq && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge Article
          </button>
        )}
      </div>

      {/* Hero Search Box */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-base sm:text-xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            How can we help you solve your issue today?
          </h2>
          <p className="text-xs text-blue-100">
            Search across {faqs.length} verified technical and operational solution articles
          </p>
        </div>

        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-3 sm:top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solutions (e.g., Wi-Fi, VPN, AC leakage, monitor, printer)..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none shadow-md font-medium"
          />
        </div>

        {/* Dynamic Category Chips */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-blue-700 shadow-md font-extrabold'
                  : 'bg-blue-700/60 hover:bg-blue-700 text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Article Cards Grid */}
      {filteredFaqs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              onClick={() => setSelectedFaq(faq)}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    {faq.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{faq.id}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                  {faq.question}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {faq.answer}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> {faq.helpfulCount || 0} Helpful
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Read Article <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto opacity-60" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No matching Knowledge Base articles found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search terms or selecting another category.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        </div>
      )}

      {/* Ticket Escalation Banner */}
      <div className="p-4 sm:p-5 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 shadow-md">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-blue-950 dark:text-blue-200 text-sm">Couldn't resolve your issue via Knowledge Base?</p>
            <p className="text-blue-700 dark:text-blue-300">Submit a direct ticket to our engineering desk for immediate SLA resolution.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 shrink-0 text-center transition-all"
        >
          Submit Support Ticket
        </button>
      </div>

      {/* Article Detail Modal */}
      {selectedFaq && (
        <Modal
          isOpen={!!selectedFaq}
          onClose={() => setSelectedFaq(null)}
          title={`Article Details — ${selectedFaq.id}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                {selectedFaq.category}
              </span>
              <span className="font-mono text-slate-400">ID: {selectedFaq.id}</span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {selectedFaq.question}
              </h2>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2 leading-relaxed">
              <p className="font-bold text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider">
                Step-by-Step Resolution Guide:
              </p>
              <div className="text-slate-800 dark:text-slate-200 space-y-1.5 whitespace-pre-line font-medium">
                {selectedFaq.answer}
              </div>
            </div>

            {/* Voting & Feedback Section */}
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Was this article helpful?</p>
                <p className="text-[11px] text-slate-500">
                  {selectedFaq.helpfulCount || 0} users found this helpful • {selectedFaq.unhelpfulCount || 0} found unhelpful
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(selectedFaq.id, 'helpful')}
                  disabled={votedMap[selectedFaq.id]}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                    votedMap[selectedFaq.id] === 'helpful'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({selectedFaq.helpfulCount || 0})
                </button>

                <button
                  onClick={() => handleVote(selectedFaq.id, 'unhelpful')}
                  disabled={votedMap[selectedFaq.id]}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                    votedMap[selectedFaq.id] === 'unhelpful'
                      ? 'bg-rose-600 text-white'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> Not Helpful ({selectedFaq.unhelpfulCount || 0})
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFaq(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-lg"
              >
                Close Article
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Article Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Knowledge Base Article"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold mb-1">Article Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
              >
                <option value="Hardware & Laptop">Hardware & Laptop</option>
                <option value="Network & Connectivity">Network & Connectivity</option>
                <option value="Facility & Office">Facility & Office</option>
                <option value="Software & Access">Software & Access</option>
                <option value="Procurement">Procurement</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Question / Problem Title</label>
              <input
                type="text"
                required
                placeholder="e.g., How to configure VPN on macOS Sequoia?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Detailed Resolution Answer / Steps</label>
              <textarea
                rows={5}
                required
                placeholder="Enter step-by-step instructions to solve the issue..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 leading-relaxed font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm"
              >
                Publish Article
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
