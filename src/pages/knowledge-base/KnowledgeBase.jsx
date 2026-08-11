import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Search, ThumbsUp, ThumbsDown, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KnowledgeBase() {
  const { faqs } = useAppData();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedFaq, setSelectedFaq] = useState(null);

  const categories = ['ALL', 'Hardware & VPN', 'AC & Facilities', 'Access Control & HR', 'Procurement'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = selectedCategory === 'ALL' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          Enterprise Self-Service Knowledge Base
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Self-help troubleshooting guides, standard operating procedures & ticket escalation prompts
        </p>
      </div>

      {/* Search Bar & Categories */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-center">How can we help you solve your issue?</h2>
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-3 sm:top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. VPN, AC leakage, WiFi password)..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none shadow-md font-medium"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'bg-blue-700/60 hover:bg-blue-700 text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Grid Cards (1-col mobile, 2-col tablet, 3-col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaqs.map(faq => (
          <div
            key={faq.id}
            onClick={() => setSelectedFaq(faq)}
            className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">{faq.category}</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 line-clamp-2">{faq.question}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">{faq.answer}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{faq.helpfulCount || 0} users found helpful</span>
              <ChevronRight className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Escalation Banner */}
      <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <p className="font-bold text-blue-950 dark:text-blue-200">Couldn't find an answer to your issue?</p>
            <p className="text-blue-700 dark:text-blue-300">Raise a direct ticket and our technicians will assist you within SLA targets.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shrink-0 text-center"
        >
          Raise Support Ticket
        </button>
      </div>
    </div>
  );
}
