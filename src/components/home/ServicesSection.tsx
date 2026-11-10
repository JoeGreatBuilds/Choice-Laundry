import React, { useState } from 'react';
import { LaundryService } from '../../types';
import { ArrowRight, Check, Sparkles, CalendarCheck } from 'lucide-react';

interface ServicesSectionProps {
  services: LaundryService[];
  onSelectServiceForBooking: (service: LaundryService) => void;
  onViewServiceDetails: (service: LaundryService) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForBooking,
  onViewServiceDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Services (6)' },
    { id: 'Everyday Care', label: 'Wash & Fold' },
    { id: 'Finishing', label: 'Steam Pressing' },
    { id: 'Full Care', label: 'Wash & Ironing' },
    { id: 'Specialist', label: 'Dry Cleaning' },
    { id: 'Household', label: 'Bedding & Duvets' },
    { id: 'Corporate', label: 'Commercial & Bulk' },
  ];

  const filteredServices = services
    .filter((s) => s.is_active)
    .filter((s) => {
      if (selectedCategory === 'all') return true;
      return s.category === selectedCategory;
    })
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="services" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Garment Care</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight mb-4 text-balance">
            Our Services Catalogue
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Professional laundry, steam pressing, and specialty care tailored to your wardrobe, bedding, and schedule.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-slate-200/70 rounded-xl max-w-2xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-[#142B4A] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden group"
            >
              {/* Service Image */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={service.image_url}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Quiet unboxed category label */}
                <div className="absolute bottom-3 left-4 text-xs font-medium text-white/95 drop-shadow-xs">
                  <span>{service.category}</span>
                  <span className="mx-1.5 text-white/60">·</span>
                  <span>{service.pricing_method}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#142B4A] mb-2 group-hover:text-[#19B8A5] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Options List */}
                  {service.options && service.options.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Available Options:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {service.options.slice(0, 3).map((opt, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#19B8A5] shrink-0" />
                            <span className="truncate">{opt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Card Footer: Pricing & Actions */}
                <div className="pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="font-medium">Pricing:</span>
                    <span className="font-semibold text-slate-800">
                      {service.base_price || 'Price confirmed after assessment'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onViewServiceDetails(service)}
                      className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>

                    <button
                      onClick={() => onSelectServiceForBooking(service)}
                      className="w-full py-2.5 px-3 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Book Me</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
