import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BusinessSettings } from '../../types';
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight, Calendar } from 'lucide-react';
import { getWhatsAppGeneralInquiryUrl, openWhatsAppUrl } from '../../services/whatsapp';

interface HeroSliderProps {
  settings: BusinessSettings;
  onNavigate: (view: string, serviceSlug?: string) => void;
}

interface SlideItem {
  id: number;
  headline: string;
  supportingText: string;
  primaryButton: string;
  primaryAction: () => void;
  secondaryButton: string;
  secondaryAction: () => void;
  secondaryIcon?: 'whatsapp' | 'pickup' | 'contact';
  image: string;
  alt: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ settings, onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handleWhatsAppChat = useCallback(() => {
    const url = getWhatsAppGeneralInquiryUrl(settings);
    openWhatsAppUrl(url);
  }, [settings]);

  const slides: SlideItem[] = [
    {
      id: 1,
      headline: 'Your Clothes, Our Care.',
      supportingText: 'Experience fresh, clean, and beautifully finished clothes with the professional care you deserve.',
      primaryButton: 'Book Me',
      primaryAction: () => onNavigate('book'),
      secondaryButton: 'Chat on WhatsApp',
      secondaryAction: handleWhatsAppChat,
      secondaryIcon: 'whatsapp',
      image: '/src/assets/images/choice_female_folding_1794322101538.jpg',
      alt: 'Choice Laundry specialist wearing branded vest folding clean garments',
    },
    {
      id: 2,
      headline: 'Freshness You Can Feel. Quality You Can Trust.',
      supportingText: 'From washing and ironing to complete laundry care, we make looking after your clothes easier.',
      primaryButton: 'Book Me',
      primaryAction: () => onNavigate('book'),
      secondaryButton: 'Chat on WhatsApp',
      secondaryAction: handleWhatsAppChat,
      secondaryIcon: 'whatsapp',
      image: '/src/assets/images/choice_male_ironing_1794322103676.jpg',
      alt: 'Choice Laundry worker in customized Choice Laundry apron steam pressing crisp shirt',
    },
    {
      id: 3,
      headline: 'Less Laundry. More Living.',
      supportingText: 'Spend more time doing what matters while Choice Laundry Services takes care of your laundry.',
      primaryButton: 'Book Me Now',
      primaryAction: () => onNavigate('book'),
      secondaryButton: 'WhatsApp Us',
      secondaryAction: handleWhatsAppChat,
      secondaryIcon: 'whatsapp',
      image: '/src/assets/images/choice_laundry_team_1794322118534.jpg',
      alt: 'Choice Laundry staff team wearing official branded aprons in modern laundry facility',
    },
    {
      id: 4,
      headline: 'Every Garment Deserves the Right Care.',
      supportingText: 'Choose convenient laundry solutions designed around your clothing, your schedule, and your needs.',
      primaryButton: 'Book Me',
      primaryAction: () => onNavigate('book'),
      secondaryButton: 'Chat on WhatsApp',
      secondaryAction: handleWhatsAppChat,
      secondaryIcon: 'whatsapp',
      image: '/src/assets/images/choice_clean_hero_slide4_1794323144854.jpg',
      alt: 'Choice Laundry specialist in sky blue polo holding suits in clean boutique entrance',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Automatic sliding timer with reduced-motion check
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[650px] bg-[#142B4A] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Choice Laundry Services Highlights"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Image with Fallback */}
            <div className="absolute inset-0 bg-slate-900">
              <img
                src={slide.image}
                alt={slide.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-7000 ease-out"
              />
              {/* High-legibility scrim: measured contrast overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#142B4A]/95 via-[#142B4A]/80 to-transparent sm:w-3/4 md:w-2/3" />
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl text-left py-10 sm:py-12">
                {/* Brand Tagline */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#19B8A5]/20 text-[#19B8A5] text-[11px] sm:text-xs font-semibold mb-3 sm:mb-4 backdrop-blur-xs">
                  <span>Choice Laundry Services</span>
                  <span>·</span>
                  <span>Professional Garment Care</span>
                </div>

                {/* Headline with text-wrap: balance */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4 text-balance">
                  {slide.headline}
                </h1>

                {/* Supporting Text */}
                <p className="text-sm sm:text-lg text-slate-200 mb-6 sm:mb-8 leading-relaxed max-w-xl line-clamp-3 sm:line-clamp-none">
                  {slide.supportingText}
                </p>

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3.5 w-full sm:w-auto">
                  <button
                    onClick={slide.primaryAction}
                    className="w-full sm:w-auto justify-center px-6 py-3 sm:py-3.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer hover:shadow-lg hover:scale-102"
                  >
                    <span>{slide.primaryButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={slide.secondaryAction}
                    className="w-full sm:w-auto justify-center px-5 py-3 sm:py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all duration-200 flex items-center gap-2 cursor-pointer hover:border-white/40"
                  >
                    {slide.secondaryIcon === 'whatsapp' && (
                      <MessageCircle className="w-4 h-4 text-[#19B8A5]" />
                    )}
                    {slide.secondaryIcon === 'pickup' && (
                      <Calendar className="w-4 h-4 text-[#19B8A5]" />
                    )}
                    <span>{slide.secondaryButton}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows - Compact on mobile, standard on desktop */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs border border-white/10 transition-all cursor-pointer focus:outline-hidden items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs border border-white/10 transition-all cursor-pointer focus:outline-hidden items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-hidden ${
              idx === currentSlide
                ? 'w-8 h-2 bg-[#0ea5e9]'
                : 'w-2 h-2 bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
