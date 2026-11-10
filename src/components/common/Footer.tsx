import React from 'react';
import { BusinessSettings } from '../../types';
import {
  Sparkles,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { getWhatsAppGeneralInquiryUrl, openWhatsAppUrl } from '../../services/whatsapp';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (view: string, serviceSlug?: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenLegal,
}) => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const url = getWhatsAppGeneralInquiryUrl(settings);
    openWhatsAppUrl(url);
  };

  return (
    <footer className="bg-[#142B4A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20">
                <img
                  src="/assets/aistudio/choice-laundry-logo-4-monogram__2__ac1a1524.svg"
                  alt="Choice Laundry"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">
                  {settings.business_name}
                </span>
                <span className="text-xs font-medium text-[#38B6FF] block">
                  {settings.slogan}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {settings.hero_supporting_text}
            </p>

            <div className="pt-2">
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#19B8A5] hover:bg-[#16a594] text-[#142B4A] font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <span>Chat with us on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Our Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services Catalogue
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Care
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'complete-laundry')}
                  className="hover:text-[#19B8A5] transition-colors cursor-pointer text-left"
                >
                  Complete Laundry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'washing-and-ironing')}
                  className="hover:text-[#19B8A5] transition-colors cursor-pointer text-left"
                >
                  Washing & Ironing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'ironing')}
                  className="hover:text-[#19B8A5] transition-colors cursor-pointer text-left"
                >
                  Steam Hand Pressing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'dry-cleaning')}
                  className="hover:text-[#19B8A5] transition-colors cursor-pointer text-left"
                >
                  Specialist Dry Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'bedding-and-linen')}
                  className="hover:text-[#19B8A5] transition-colors cursor-pointer text-left"
                >
                  Bedding & Household Linen
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'bulk-and-family-laundry')}
                  className="hover:text-[#19B8A5] transition-colors cursor-pointer text-left"
                >
                  Bulk Family Bundles
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Get In Touch
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-[#19B8A5] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-[#19B8A5] shrink-0" />
              <span>{settings.display_phone || '0816 813 7488'}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-[#19B8A5] shrink-0 mt-0.5" />
              <span>{settings.operating_hours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {settings.business_name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              Terms & Conditions
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="text-slate-500 hover:text-[#19B8A5] transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
