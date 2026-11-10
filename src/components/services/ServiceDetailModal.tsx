import React from 'react';
import { BusinessSettings, LaundryService } from '../../types';
import { X, CalendarCheck, MessageCircle, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { getWhatsAppGeneralInquiryUrl, openWhatsAppUrl } from '../../services/whatsapp';

interface ServiceDetailModalProps {
  service: LaundryService | null;
  allServices: LaundryService[];
  settings: BusinessSettings;
  onClose: () => void;
  onBookService: (service: LaundryService) => void;
  onSelectAnotherService: (service: LaundryService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  allServices,
  settings,
  onClose,
  onBookService,
  onSelectAnotherService,
}) => {
  if (!service) return null;

  const handleWhatsApp = () => {
    const text = `Hello ${settings.business_name}, I am interested in booking the "${service.name}" service. Could you share more details on turnaround time and pricing?`;
    const num = settings.whatsapp_number.replace(/\D/g, '');
    const url = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
    openWhatsAppUrl(url);
  };

  const relatedServices = allServices
    .filter((s) => s.id !== service.id && s.is_active)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative h-60 sm:h-72 w-full bg-slate-900 shrink-0">
          <img
            src={service.image_url}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142B4A] via-[#142B4A]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#19B8A5] mb-1">
              <span>{service.category}</span>
              <span>·</span>
              <span>Pricing model: {service.pricing_method}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {service.name}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {service.description}
            </p>
          </div>

          {/* Available Options */}
          {service.options && service.options.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Service Options & Finishes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {service.options.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-800 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#19B8A5] shrink-0" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Info */}
          <div className="p-4 rounded-xl bg-[#EAF7F8] border border-[#19B8A5]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#142B4A] uppercase tracking-wider block">
                Standard Pricing Structure
              </span>
              <p className="text-sm font-bold text-[#142B4A]">
                {service.base_price || 'Price confirmed after assessment'}
              </p>
            </div>
            <div className="text-xs text-slate-600 max-w-xs">
              Charged based on {service.pricing_method.toLowerCase()}. Final invoice is confirmed upon physical inspection.
            </div>
          </div>

          {/* Special Requirements & Instructions */}
          {(service.special_requirements || service.booking_instructions) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.special_requirements && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Care Requirements</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.special_requirements}
                  </p>
                </div>
              )}

              {service.booking_instructions && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
                    <HelpCircle className="w-4 h-4 text-[#19B8A5]" />
                    <span>Booking Advice</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.booking_instructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* FAQs if present */}
          {service.faqs && service.faqs.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900 mb-1">Q: {faq.q}</p>
                    <p className="text-slate-600 leading-relaxed">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Services */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Explore Related Services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {relatedServices.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectAnotherService(rel)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#19B8A5] hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-[#19B8A5] line-clamp-1">
                    {rel.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {rel.category}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleWhatsApp}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[#19B8A5]" />
            <span>Chat on WhatsApp</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Back to Services
            </button>
            <button
              onClick={() => onBookService(service)}
              className="flex-1 sm:flex-initial px-6 py-2.5 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Me</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
