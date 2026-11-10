import React from 'react';
import {
  CalendarCheck2,
  MessageCircle,
  HeartHandshake,
  Route,
  Truck,
  Bell,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const benefits = [
    {
      title: 'Convenient Booking',
      desc: 'Seamless 5-step online booking that remembers your preferences, addresses, and garment care instructions.',
      icon: CalendarCheck2,
    },
    {
      title: 'Direct WhatsApp Communication',
      desc: 'Instant click-to-chat messaging with your booking reference and pickup details prefilled.',
      icon: MessageCircle,
    },
    {
      title: 'Personalized Service',
      desc: 'Tailored folding, hanging, and starching preferences customized to each client wardrobe.',
      icon: HeartHandshake,
    },
    {
      title: 'Clear Order Tracking',
      desc: 'Live 8-stage progress tracker from collection to completion with transparent status updates.',
      icon: Route,
    },
    {
      title: 'Pickup Coordination',
      desc: 'Scheduled pickup time windows coordinated directly with our friendly dispatch team.',
      icon: Truck,
    },
    {
      title: 'Order Status Notifications',
      desc: 'Automated in-app alerts whenever your laundry changes status or becomes ready for collection.',
      icon: Bell,
    },
    {
      title: 'Careful Handling of Garments',
      desc: 'Fabric-safe temperature cycles, fabric softener treatments, and gentle steam pressing.',
      icon: Sparkles,
    },
    {
      title: 'Convenient Customer Account',
      desc: 'Save your profile, view order history, reorder past services, and track past invoices effortlessly.',
      icon: UserCheck,
    },
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-2 block">
            The Choice Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight mb-4 text-balance">
            Why Choose Choice Laundry Services
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We combine expert garment care with modern digital convenience to give you more time for living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-[#19B8A5] transition-all hover:shadow-xs flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EAF7F8] text-[#142B4A] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#19B8A5]" />
                </div>
                <h3 className="text-base font-bold text-[#142B4A] mb-2">
                  {b.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
