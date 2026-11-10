import React from 'react';
import { Shirt, MessageSquare, Sparkles, BellRing, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onBookService: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onBookService }) => {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Service',
      description: 'Explore our services and select the laundry care you need.',
      icon: Shirt,
    },
    {
      number: '02',
      title: 'Book and Chat',
      description: 'Submit your booking details and connect with us on WhatsApp to discuss your service and pickup arrangements.',
      icon: MessageSquare,
    },
    {
      number: '03',
      title: 'We Care for Your Laundry',
      description: 'Our team receives your garments and processes your order with care.',
      icon: Sparkles,
    },
    {
      number: '04',
      title: 'Get Notified',
      description: 'Follow your order status and receive an update when your laundry is ready for collection or delivery.',
      icon: BellRing,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-2 block">
            Simple 4-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight mb-4 text-balance">
            How Choice Laundry Services Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From easy online scheduling to fresh garment return, our process is built around convenience and transparency.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200 hover:border-[#19B8A5] transition-colors group flex flex-col justify-between"
              >
                <div>
                  {/* Step header: Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-[#19B8A5]/70 tabular-nums">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#142B4A] flex items-center justify-center group-hover:bg-[#142B4A] group-hover:text-white transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#142B4A] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-[#19B8A5]">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onBookService}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm shadow-md transition-all duration-200 cursor-pointer hover:scale-102"
          >
            <span>Book Me Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
