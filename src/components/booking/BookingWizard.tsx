import React, { useState, useEffect } from 'react';
import { Booking, BusinessSettings, LaundryService } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { getWhatsAppBookingUrl, sanitizeWhatsAppNumber } from '../../services/whatsapp';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Send,
  Lock,
  MessageSquare,
  Home
} from 'lucide-react';

interface BookingWizardProps {
  initialService?: LaundryService | null;
  allServices: LaundryService[];
  settings: BusinessSettings;
  onBookingCompleted: (booking: Booking) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onNavigateHome: () => void;
}

const LOAD_OPTIONS = [
  { id: 'few', label: '1 - 5 Items', desc: 'Single garments, suits or shirts', count: 5 },
  { id: 'standard', label: '6 - 15 Items', desc: 'Standard weekly laundry bag', count: 12 },
  { id: 'medium', label: '16 - 30 Items', desc: 'Large load / family mix', count: 22 },
  { id: 'bulk', label: 'Bulk / Heavy', desc: 'Duvets, curtains or bulk loads', count: 35 },
];

const TIME_WINDOWS = [
  { id: 'morning', label: 'Morning (08:00 AM – 11:00 AM)' },
  { id: 'midday', label: 'Midday (11:00 AM – 02:00 PM)' },
  { id: 'afternoon', label: 'Afternoon (02:00 PM – 05:00 PM)' },
  { id: 'evening', label: 'Evening (05:00 PM – 07:00 PM)' },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialService,
  allServices,
  settings,
  onBookingCompleted,
  onOpenAuth,
  onNavigateHome,
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  // Active available services
  const activeServices = allServices.filter((s) => s.is_active);

  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || activeServices[0]?.id || ''
  );

  // Customer Contact Fields
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone_number || '');
  const [pickupAddress, setPickupAddress] = useState(
    currentUser?.default_pickup_address || ''
  );

  // Load / Quantity Selection
  const [selectedLoadId, setSelectedLoadId] = useState<string>('standard');
  const [customItems, setCustomItems] = useState<string>('');

  // Schedule Fields
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().slice(0, 10);

  const [pickupDate, setPickupDate] = useState(defaultDateStr);
  const [timeWindow, setTimeWindow] = useState('Morning (08:00 AM – 11:00 AM)');
  const [deliveryMode, setDeliveryMode] = useState<'Delivery' | 'Collection'>('Delivery');

  // Optional Note
  const [specialNote, setSpecialNote] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Sync profile details if auth status changes
  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.full_name);
      if (!phone) setPhone(currentUser.phone_number || currentUser.whatsapp_number);
      if (!pickupAddress) setPickupAddress(currentUser.default_pickup_address);
    }
  }, [currentUser]);

  // Sync if initialService prop changes
  useEffect(() => {
    if (initialService) {
      setSelectedServiceId(initialService.id);
    }
  }, [initialService]);

  const currentService =
    activeServices.find((s) => s.id === selectedServiceId) || activeServices[0];

  const selectedLoad =
    LOAD_OPTIONS.find((l) => l.id === selectedLoadId) || LOAD_OPTIONS[1];

  // Validate form
  const validate = (): boolean => {
    setFormError(null);
    if (!fullName.trim()) {
      setFormError('Please enter your name.');
      return false;
    }
    if (!phone.trim()) {
      setFormError('Please provide your phone or WhatsApp number.');
      return false;
    }
    if (!pickupAddress.trim()) {
      setFormError('Please provide your pickup address.');
      return false;
    }
    if (!pickupDate) {
      setFormError('Please choose a preferred pickup date.');
      return false;
    }
    return true;
  };

  // Create booking object & save
  const executeBooking = (viaWhatsApp: boolean) => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const customerId = currentUser?.id || `guest-${Date.now()}`;
      const loadDesc = customItems.trim()
        ? `${selectedLoad.label} (${customItems.trim()})`
        : selectedLoad.label;

      const newBooking = storage.createBooking({
        customer_id: customerId,
        customer_name: fullName.trim(),
        customer_phone: phone.trim(),
        customer_whatsapp: phone.trim(),
        service_id: currentService.id,
        service_name_snapshot: currentService.name,
        service_details: {
          garment_type: loadDesc,
          item_count: selectedLoad.count,
          special_instructions: specialNote.trim(),
        },
        pickup_address: pickupAddress.trim(),
        pickup_instructions: specialNote.trim(),
        requested_pickup_date: pickupDate,
        requested_pickup_time: timeWindow,
        collection_or_delivery_preference: deliveryMode,
        delivery_address: deliveryMode === 'Delivery' ? pickupAddress.trim() : undefined,
        special_instructions: specialNote.trim(),
        quoted_price: currentService.base_price || 'Price confirmed after assessment',
        payment_status: 'Pending',
        order_status: 'Booking Received',
      });

      setCompletedBooking(newBooking);
      setIsSubmitting(false);

      if (viaWhatsApp) {
        // Direct WhatsApp connect to admin
        const whatsappUrl = getWhatsAppBookingUrl(newBooking, settings);
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setIsSubmitting(false);
      setFormError('Unable to save your booking. Please try again.');
    }
  };

  const handleCopyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleResetForm = () => {
    setCompletedBooking(null);
    setSpecialNote('');
    setCustomItems('');
  };

  // If booking is completed, show the success confirmation screen
  if (completedBooking) {
    const whatsappUrl = getWhatsAppBookingUrl(completedBooking, settings);

    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 text-center animate-in zoom-in-95 duration-200">
          {/* Success Checkmark */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Booking Request Recorded</span>
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] tracking-tight">
            Thank You, {completedBooking.customer_name}!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
            Your laundry booking has been stored in our system and formatted for our WhatsApp admin dispatch team.
          </p>

          {/* Unique Reference Card */}
          <div className="my-6 max-w-md mx-auto p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Order Reference Code
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#142B4A] tracking-wider">
                {completedBooking.order_reference}
              </span>
            </div>
            <button
              onClick={() => handleCopyReference(completedBooking.order_reference)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-600 hover:text-[#0ea5e9] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Copy Order Reference"
            >
              {copiedRef ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Summary Grid */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left text-xs text-slate-700 space-y-2 mb-8">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900">{completedBooking.service_name_snapshot}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Pickup Date & Time:</span>
              <span className="font-semibold text-slate-800">
                {completedBooking.requested_pickup_date} ({completedBooking.requested_pickup_time.split('(')[0].trim()})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Address:</span>
              <span className="font-medium text-slate-800 truncate max-w-[220px]" title={completedBooking.pickup_address}>
                {completedBooking.pickup_address}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-amber-600">{completedBooking.order_status}</span>
            </div>
          </div>

          {/* Primary Call to Action on WhatsApp */}
          <div className="space-y-3 max-w-md mx-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
            >
              {/* WhatsApp vector logo */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.6 7.42C8.42 7.42 8.12 7.49 7.87 7.76C7.62 8.03 6.92 8.69 6.92 10.03C6.92 11.37 7.9 12.66 8.03 12.84C8.17 13.02 9.95 15.77 12.67 16.95C13.32 17.23 13.82 17.4 14.22 17.53C14.87 17.74 15.47 17.71 15.94 17.64C16.46 17.56 17.54 16.98 17.77 16.35C18 15.71 18 15.17 17.93 15.06C17.86 14.94 17.67 14.88 17.39 14.74C17.11 14.6 15.73 13.92 15.47 13.83C15.22 13.73 15.03 13.69 14.85 13.96C14.66 14.24 14.13 14.86 13.97 15.05C13.81 15.23 13.65 15.26 13.37 15.12C13.09 14.97 12.2 14.68 11.14 13.74C10.32 13.01 9.77 12.11 9.61 11.83C9.45 11.55 9.59 11.4 9.73 11.26C9.86 11.14 10.01 10.93 10.16 10.77C10.3 10.61 10.35 10.49 10.44 10.31C10.53 10.13 10.49 9.97 10.42 9.83C10.35 9.69 9.8 8.35 9.57 7.81C9.35 7.28 9.12 7.36 8.95 7.35C8.79 7.34 8.6 7.42 8.6 7.42Z" />
              </svg>
              <span>Send Request to Admin on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onBookingCompleted(completedBooking)}
                className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Track in Dashboard
              </button>
              <button
                onClick={handleResetForm}
                className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Book Another</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-6">
            Admin WhatsApp Hotline: {settings.display_phone || '0816 813 7488'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Minimalist Top Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7F8] text-[#19B8A5] text-xs font-bold uppercase tracking-wider mb-2.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Direct WhatsApp Booking</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#142B4A] tracking-tight">
          Quick Laundry Booking
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Fill out this straightforward form — your request connects directly to our WhatsApp dispatch team for prompt pickup confirmation.
        </p>

        {/* Guest prompt */}
        {!isAuthenticated && (
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-800">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Booking as a guest. Have an account?</span>
            <button
              onClick={() => onOpenAuth('signin')}
              className="font-bold underline hover:text-amber-900 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left is Minimalist Form, Right is Real-time WhatsApp Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
          {formError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <span>⚠️ {formError}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeBooking(true);
            }}
            className="space-y-6"
          >
            {/* SECTION 1: Contact Information */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                <User className="w-4 h-4 text-[#0ea5e9]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Your Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Adaobi Okafor"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0816 813 7488"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Service & Quantity */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                <Sparkles className="w-4 h-4 text-[#0ea5e9]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Choose Service & Approximate Load
                </h2>
              </div>

              {/* Service Selection Dropdown */}
              <div className="mb-3.5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Laundry Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
                >
                  {activeServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Approximate Load Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Approximate Quantity / Load Size
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {LOAD_OPTIONS.map((opt) => {
                    const isSelected = selectedLoadId === opt.id;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setSelectedLoadId(opt.id)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#EAF7F8] border-[#0ea5e9] text-[#142B4A] ring-2 ring-[#0ea5e9]/30 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-xs">{opt.label}</span>
                        <span className="block text-[10px] text-slate-400 font-normal truncate">
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: Pickup Schedule & Address */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                <Calendar className="w-4 h-4 text-[#0ea5e9]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Pickup Schedule & Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Pickup Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Window
                  </label>
                  <select
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
                  >
                    {TIME_WINDOWS.map((tw) => (
                      <option key={tw.id} value={tw.label}>
                        {tw.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3.5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pickup Address & Landmark <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="e.g. 37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
                  />
                </div>
              </div>

              {/* Delivery mode */}
              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold text-slate-700">
                  Return Mode:
                </label>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('Delivery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      deliveryMode === 'Delivery'
                        ? 'bg-white text-[#142B4A] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Door Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('Collection')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      deliveryMode === 'Collection'
                        ? 'bg-white text-[#142B4A] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Hub Collection
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 4: Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
                placeholder="e.g. Starch white shirts, delicate lace native wear, gate access code"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
              />
            </div>

            {/* SECTION 5: Sky Blue Primary CTA & Action Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              {/* PRIMARY CTA: Sky Blue WhatsApp Connect */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                {/* WhatsApp Logo */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.6 7.42C8.42 7.42 8.12 7.49 7.87 7.76C7.62 8.03 6.92 8.69 6.92 10.03C6.92 11.37 7.9 12.66 8.03 12.84C8.17 13.02 9.95 15.77 12.67 16.95C13.32 17.23 13.82 17.4 14.22 17.53C14.87 17.74 15.47 17.71 15.94 17.64C16.46 17.56 17.54 16.98 17.77 16.35C18 15.71 18 15.17 17.93 15.06C17.86 14.94 17.67 14.88 17.39 14.74C17.11 14.6 15.73 13.92 15.47 13.83C15.22 13.73 15.03 13.69 14.85 13.96C14.66 14.24 14.13 14.86 13.97 15.05C13.81 15.23 13.65 15.26 13.37 15.12C13.09 14.97 12.2 14.68 11.14 13.74C10.32 13.01 9.77 12.11 9.61 11.83C9.45 11.55 9.59 11.4 9.73 11.26C9.86 11.14 10.01 10.93 10.16 10.77C10.3 10.61 10.35 10.49 10.44 10.31C10.53 10.13 10.49 9.97 10.42 9.83C10.35 9.69 9.8 8.35 9.57 7.81C9.35 7.28 9.12 7.36 8.95 7.35C8.79 7.34 8.6 7.42 8.6 7.42Z" />
                </svg>
                <span>
                  {isSubmitting ? 'Connecting...' : 'Send Booking Request via WhatsApp'}
                </span>
                <Send className="w-4 h-4 ml-1" />
              </button>

              {/* SECONDARY ACTION: Portal only */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => executeBooking(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Save to Portal Only (Without WhatsApp)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Admin WhatsApp Preview Card (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Nigerian Worker Feature Banner */}
          <div className="bg-[#142B4A] rounded-3xl p-5 text-white shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/choice_reception_desk_1794322139269.jpg"
                alt="Choice Laundry customer reception desk specialist in branded apron"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#19B8A5]/40 shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-[#19B8A5] uppercase tracking-wider block">
                  Dedicated Garment Care
                </span>
                <h3 className="text-sm font-bold text-white">
                  Choice Laundry Operations
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                  Professional washing, steam pressing, and direct WhatsApp dispatch.
                </p>
              </div>
            </div>
          </div>

          {/* Live Message Preview (What the Admin Sees on WhatsApp) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800">
                  Admin WhatsApp Message Preview
                </span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Live Preview
              </span>
            </div>

            {/* WhatsApp Chat Bubble Mockup */}
            <div className="p-3.5 rounded-2xl bg-[#DCF8C6] border border-emerald-200 text-xs font-mono text-slate-800 space-y-2 leading-relaxed shadow-xs">
              <p className="font-bold text-[#142B4A]">
                🧺 *NEW LAUNDRY BOOKING — CHOICE LAUNDRY SERVICES*
              </p>
              <p>
                *Customer Name:* {fullName.trim() || '[Your Name]'}<br />
                *Phone:* {phone.trim() || '[Your Phone]'}
              </p>
              <p>
                *Service:* {currentService.name}<br />
                *Items / Load:* {selectedLoad.label}
              </p>
              <p>
                *Pickup Date:* {pickupDate}<br />
                *Pickup Window:* {timeWindow.split('(')[0].trim()}<br />
                *Pickup Address:* {pickupAddress.trim() || '[Pickup Location]'}<br />
                *Return Mode:* {deliveryMode}
              </p>
              {specialNote.trim() && (
                <p>*Special Notes:* {specialNote.trim()}</p>
              )}
              <p className="text-[10px] text-slate-500 pt-1 border-t border-emerald-200/60 font-sans italic">
                The admin receives this message directly upon tapping the button.
              </p>
            </div>

            {/* Transparent Pricing Explanation */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between font-semibold text-slate-900">
                <span>Estimated Service Rate:</span>
                <span>{currentService.base_price || 'Confirmed upon inspection'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Final pricing is verified by Choice Laundry Services after item inspection. No advance payment is charged online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
