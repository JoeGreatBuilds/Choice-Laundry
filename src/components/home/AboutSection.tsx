import React from 'react';
import { BusinessSettings } from '../../types';
import {
  CheckCircle,
  Eye,
  Target,
  ArrowRight,
  Shield,
  Heart,
  Smile,
  Award,
  Zap,
  Clock
} from 'lucide-react';

interface AboutSectionProps {
  settings: BusinessSettings;
  onDiscoverServices: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onDiscoverServices }) => {
  const objectives = [
    'Deliver consistently high-quality laundry services.',
    'Make booking and communication simple and convenient.',
    'Provide personalized customer service.',
    'Coordinate pickups and collections efficiently.',
    'Build long-term customer relationships.',
    'Maintain clear communication about service progress.',
    'Continuously improve the customer experience.',
  ];

  const coreValues = [
    { name: 'Quality', icon: Award, desc: 'Highest standard in garment cleanliness and presentation.' },
    { name: 'Integrity', icon: Shield, desc: 'Honest pricing, careful handling, and authentic service.' },
    { name: 'Reliability', icon: Clock, desc: 'Dependable scheduling and prompt pickup and return.' },
    { name: 'Customer Satisfaction', icon: Smile, desc: 'Your delight with every freshly cleaned fold.' },
    { name: 'Professionalism', icon: Target, desc: 'Trained garment specialists and dedicated customer care.' },
    { name: 'Convenience', icon: Zap, desc: 'Simple digital booking and direct WhatsApp communication.' },
    { name: 'Care', icon: Heart, desc: 'Treating your fabrics with gentle, fabric-safe attention.' },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-2 block">
              About Choice Laundry Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight mb-6 text-balance">
              Professional Laundry Care, Made Convenient.
            </h2>
            <p className="text-slate-600 leading-relaxed text-base mb-6">
              At Choice Laundry Services, we believe laundry care should be simple, convenient, and dependable. We help customers care for their clothes through professional washing, ironing, and other laundry services, with personalized communication and convenient pickup coordination.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm mb-8">
              Whether you need crisp business shirts pressed for your workweek, fresh bedding sanitized for your family, or comprehensive weekly laundry bundles, our dedicated team takes care of every detail so you can enjoy fresh clothes and more free time.
            </p>

            <button
              onClick={onDiscoverServices}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs"
            >
              <span>Discover Our Services</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[380px] sm:h-[420px]">
            <img
              src="/src/assets/images/choice_manager_qa_1794322137657.jpg"
              alt="Choice Laundry Quality Manager wearing official branded uniform inspecting shirt"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#142B4A]/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <p className="font-bold text-lg">{settings.business_name}</p>
                <p className="text-xs text-[#19B8A5] font-medium">{settings.slogan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-slate-200 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#19B8A5] flex items-center justify-center mb-6 shadow-xs">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#142B4A] mb-3">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {settings.vision}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-slate-200 relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#19B8A5] flex items-center justify-center mb-6 shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#142B4A] mb-3">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {settings.mission}
            </p>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="mb-16 bg-[#F8FAFC] p-8 sm:p-10 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-[#142B4A] mb-6 text-center">
            Our Business Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80">
                <CheckCircle className="w-5 h-5 text-[#19B8A5] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 font-medium">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-1 block">
              What Guides Us
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A]">
              Our Core Values
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#19B8A5] transition-colors shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EAF7F8] text-[#142B4A] flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-[#19B8A5]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#142B4A] mb-1">
                    {val.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
