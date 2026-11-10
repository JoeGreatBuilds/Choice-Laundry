import React, { useState } from 'react';
import { BusinessSettings } from '../../types';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { storage } from '../../services/storage';
import { getWhatsAppGeneralInquiryUrl, openWhatsAppUrl } from '../../services/whatsapp';

interface ContactSectionProps {
  settings: BusinessSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in your name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      storage.submitEnquiry({
        name: name.trim(),
        email: `${phone.trim()}@contact`,
        phone_number: phone.trim(),
        subject: subject.trim() || 'General Laundry Enquiry',
        message: message.trim(),
      });

      setIsSubmitting(false);
      setSubmitted(true);
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setIsSubmitting(false);
      setError('An unexpected error occurred while sending your enquiry. Please chat on WhatsApp.');
    }
  };

  const handleWhatsAppChat = () => {
    const url = getWhatsAppGeneralInquiryUrl(settings);
    openWhatsAppUrl(url);
  };

  return (
    <section id="contact" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold text-[#19B8A5] tracking-widest uppercase mb-2 block">
            Direct & Responsive Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B4A] tracking-tight mb-4 text-balance">
            Contact Choice Laundry Services
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Reach out by message, phone call, or instant WhatsApp chat. We are here to assist with all your garment care requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Contact Details & Info Card */}
          <div className="lg:col-span-2 bg-[#142B4A] text-white rounded-2xl p-8 sm:p-10 shadow-lg space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Service Hub & Hours</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We coordinate daily scheduled collections and door deliveries across the region.
              </p>
            </div>

            <div className="space-y-5 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#19B8A5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white mb-0.5">Physical Facility:</span>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#19B8A5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white mb-0.5">Customer Care Line:</span>
                  <span>{settings.display_phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#19B8A5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white mb-0.5">WhatsApp Orders:</span>
                  <span>{settings.display_phone || '0816 813 7488'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#19B8A5] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white mb-0.5">Operating Hours:</span>
                  <span>{settings.operating_hours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-300 mb-3">Prefer immediate messaging?</p>
              <button
                onClick={handleWhatsAppChat}
                className="w-full py-3 px-4 rounded-xl bg-[#19B8A5] hover:bg-[#16a594] text-[#142B4A] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Contact Enquiry Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs">
            <h3 className="text-xl font-bold text-[#142B4A] mb-2">
              Send an Online Enquiry
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details below and our client care team will respond promptly.
            </p>

            {submitted ? (
              <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Enquiry Received!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you for contacting Choice Laundry Services. Your message has been stored in our customer management queue and we will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-emerald-800 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Samuel Adekunle"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0816 813 7488"
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Weekly Laundry Bundle Question"
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need or how we can assist you..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Submit Enquiry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
