import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BusinessSettings, LaundryService, Booking } from './types';
import { storage } from './services/storage';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { HeroSlider } from './components/home/HeroSlider';
import { ServicesSection } from './components/home/ServicesSection';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { WhyChooseUsSection } from './components/home/WhyChooseUsSection';
import { AboutSection } from './components/home/AboutSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { FaqSection } from './components/home/FaqSection';
import { ContactSection } from './components/home/ContactSection';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { BookingWizard } from './components/booking/BookingWizard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { LegalModal } from './components/legal/LegalModal';

const AppContent: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const [settings, setSettings] = useState<BusinessSettings>(storage.getSettings());
  const [services, setServices] = useState<LaundryService[]>(storage.getServices());
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<LaundryService | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<LaundryService | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Unread notifications
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshData = () => {
    setSettings(storage.getSettings());
    setServices(storage.getServices());
    if (currentUser) {
      const notifs = storage.getNotifications(currentUser.id);
      setUnreadCount(notifs.filter((n) => !n.is_read).length);
    } else {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    refreshData();
    const handleStorageChange = () => refreshData();
    window.addEventListener('cls_storage_change', handleStorageChange);
    return () => window.removeEventListener('cls_storage_change', handleStorageChange);
  }, [currentUser]);

  const handleNavigate = (view: string, serviceSlug?: string) => {
    if (serviceSlug) {
      const srv = storage.getServiceBySlug(serviceSlug);
      if (srv) {
        setSelectedServiceForDetail(srv);
        return;
      }
    }

    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectServiceForBooking = (service: LaundryService) => {
    setSelectedServiceForBooking(service);
    setSelectedServiceForDetail(null);
    setActiveView('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingCompleted = (_booking: Booking) => {
    refreshData();
    // Navigate to customer dashboard after booking
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8FAFC] text-[#1F2937] overflow-x-hidden">
      {/* Header */}
      <Header
        settings={settings}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW: Admin Dashboard */}
        {activeView === 'admin' ? (
          <AdminDashboard
            settings={settings}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
            onNavigateHome={() => handleNavigate('home')}
          />
        ) : activeView === 'dashboard' ? (
          /* VIEW: Customer Dashboard (Orders Tab) */
          <CustomerDashboard
            settings={settings}
            initialTab="orders"
            onNavigateToBooking={() => handleNavigate('book')}
          />
        ) : activeView === 'dashboard-profile' ? (
          /* VIEW: Customer Dashboard (Profile Tab) */
          <CustomerDashboard
            settings={settings}
            initialTab="profile"
            onNavigateToBooking={() => handleNavigate('book')}
          />
        ) : activeView === 'dashboard-notifications' ? (
          /* VIEW: Customer Dashboard (Notifications Tab) */
          <CustomerDashboard
            settings={settings}
            initialTab="notifications"
            onNavigateToBooking={() => handleNavigate('book')}
          />
        ) : activeView === 'book' ? (
          /* VIEW: 5-Step Booking Wizard */
          <BookingWizard
            initialService={selectedServiceForBooking}
            allServices={services}
            settings={settings}
            onBookingCompleted={handleBookingCompleted}
            onOpenAuth={handleOpenAuth}
            onNavigateHome={() => handleNavigate('home')}
          />
        ) : activeView === 'services' ? (
          /* VIEW: Dedicated Services Catalogue */
          <div>
            <div className="bg-[#142B4A] py-16 text-white text-center px-4">
              <span className="text-xs font-bold text-[#19B8A5] uppercase tracking-widest block mb-2">
                6 Essential Garment Care Categories
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Our Services Catalogue
              </h1>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
                From daily wash & fold bundles to premium dry cleaning and custom hotel linens.
              </p>
            </div>
            <ServicesSection
              services={services}
              onSelectServiceForBooking={handleSelectServiceForBooking}
              onViewServiceDetails={(srv) => setSelectedServiceForDetail(srv)}
            />
            <WhyChooseUsSection />
            <HowItWorksSection onBookService={() => handleNavigate('book')} />
          </div>
        ) : activeView === 'how-it-works' ? (
          /* VIEW: How It Works */
          <div>
            <div className="bg-[#142B4A] py-16 text-white text-center px-4">
              <span className="text-xs font-bold text-[#19B8A5] uppercase tracking-widest block mb-2">
                Convenient & Transparent Care
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                How Choice Laundry Works
              </h1>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
                Book online, chat with us on WhatsApp, and follow your order progress live.
              </p>
            </div>
            <HowItWorksSection onBookService={() => handleNavigate('book')} />
            <WhyChooseUsSection />
            <FaqSection faqs={storage.getFAQs()} settings={settings} />
          </div>
        ) : activeView === 'about' ? (
          /* VIEW: About Us */
          <div>
            <div className="bg-[#142B4A] py-16 text-white text-center px-4">
              <span className="text-xs font-bold text-[#19B8A5] uppercase tracking-widest block mb-2">
                Our Story & Standards
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                About Choice Laundry Services
              </h1>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
                {settings.slogan} — Dedicated to high quality garment care and seamless communication.
              </p>
            </div>
            <AboutSection
              settings={settings}
              onDiscoverServices={() => handleNavigate('services')}
            />
            <WhyChooseUsSection />
          </div>
        ) : activeView === 'testimonials' ? (
          /* VIEW: Reviews */
          <div>
            <div className="bg-[#142B4A] py-16 text-white text-center px-4">
              <span className="text-xs font-bold text-[#19B8A5] uppercase tracking-widest block mb-2">
                Verified Feedback
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                What Our Customers Say
              </h1>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
                Real customer feedback from our weekly and on-demand garment care clients.
              </p>
            </div>
            <TestimonialsSection
              testimonials={storage.getTestimonials()}
              onReviewSubmitted={() => refreshData()}
            />
          </div>
        ) : activeView === 'contact' ? (
          /* VIEW: Contact & Hours */
          <div>
            <div className="bg-[#142B4A] py-16 text-white text-center px-4">
              <span className="text-xs font-bold text-[#19B8A5] uppercase tracking-widest block mb-2">
                We're Here to Help
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Contact Choice Laundry Services
              </h1>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-2">
                Pickup coordination, custom quotations, and customer support.
              </p>
            </div>
            <ContactSection settings={settings} />
            <FaqSection faqs={storage.getFAQs()} settings={settings} />
          </div>
        ) : (
          /* DEFAULT VIEW: Complete Landing Page */
          <>
            {/* Automatic 4-slide Hero */}
            <HeroSlider settings={settings} onNavigate={handleNavigate} />

            {/* Why Choose Us - 8 Benefits */}
            <WhyChooseUsSection />

            {/* Services Showcase */}
            <ServicesSection
              services={services}
              onSelectServiceForBooking={handleSelectServiceForBooking}
              onViewServiceDetails={(srv) => setSelectedServiceForDetail(srv)}
            />

            {/* How It Works - 4 Steps */}
            <HowItWorksSection onBookService={() => handleNavigate('book')} />

            {/* About Choice Laundry Preview */}
            <AboutSection
              settings={settings}
              onDiscoverServices={() => handleNavigate('services')}
            />

            {/* Testimonials */}
            <TestimonialsSection
              testimonials={storage.getTestimonials()}
              onReviewSubmitted={() => refreshData()}
            />

            {/* FAQs */}
            <FaqSection faqs={storage.getFAQs()} settings={settings} />

            {/* Contact Section */}
            <ContactSection settings={settings} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton
        settings={settings}
        customerName={currentUser?.full_name}
      />

      {/* Service Detail Modal */}
      {selectedServiceForDetail && (
        <ServiceDetailModal
          service={selectedServiceForDetail}
          allServices={services}
          settings={settings}
          onClose={() => setSelectedServiceForDetail(null)}
          onBookService={handleSelectServiceForBooking}
          onSelectAnotherService={(srv) => setSelectedServiceForDetail(srv)}
        />
      )}

      {/* Authentication Modal */}
      {authModalOpen && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            refreshData();
            // If user logged in as admin, optionally switch to admin view
            if (storage.getProfile(localStorage.getItem('cls_active_user_id') || '')?.role === 'admin') {
              setActiveView('admin');
            }
          }}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      {legalModalType && (
        <LegalModal
          type={legalModalType}
          settings={settings}
          onClose={() => setLegalModalType(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
