import React, { useState } from 'react';
import { FAQItem, BusinessSettings } from '../../types';
import { ChevronDown, Search, MessageCircle, HelpCircle } from 'lucide-react';
import { getWhatsAppGeneralInquiryUrl, openWhatsAppUrl } from '../../services/whatsapp';

interface FaqSectionProps {
  faqs: FAQItem[];
  settings: BusinessSettings;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs, settings }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = faqs
    .filter((f) => f.is_active)
    .filter((f) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    })
    .sort((a, b) => a.display_order - b.display_order);

  const handleWhatsApp = () => {
    const url = getWhatsAppGeneralInquiryUrl(settings);
    openWhatsAppUrl(url);
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-2 block">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight mb-4 text-balance">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-6">
            Clear information about our laundry care, pickup scheduling, order tracking, and policies.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laundry questions..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#19B8A5] bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              No matching questions found for "{searchQuery}". You can ask us directly via WhatsApp!
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 bg-[#F8FAFC] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#142B4A] hover:text-[#19B8A5] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#19B8A5] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#19B8A5]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* WhatsApp Help CTA card */}
        <div className="mt-12 p-6 rounded-2xl bg-[#EAF7F8] border border-[#19B8A5]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-[#142B4A] text-sm">
              Have a specific garment question?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Chat directly with our care team on WhatsApp for quick answers and custom quotes.
            </p>
          </div>
          <button
            onClick={handleWhatsApp}
            className="px-5 py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
