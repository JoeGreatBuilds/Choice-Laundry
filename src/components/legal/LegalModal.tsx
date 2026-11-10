import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  settings: BusinessSettings;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, settings, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          {type === 'privacy' ? (
            <ShieldCheck className="w-5 h-5 text-[#19B8A5]" />
          ) : (
            <FileText className="w-5 h-5 text-[#19B8A5]" />
          )}
          <h2 className="text-xl font-bold text-[#142B4A]">
            {type === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
          </h2>
        </div>

        <div className="overflow-y-auto pr-2 space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Official Entity:</strong> {settings.business_name}
          </p>
          <p>
            <strong>Last Updated:</strong> November 2026
          </p>

          {type === 'privacy' ? (
            <>
              <h3 className="font-bold text-slate-900 text-sm">1. Information We Collect</h3>
              <p>
                Choice Laundry Services collects customer information necessary to perform laundry pickup, garment care, and delivery services. This includes customer full names, phone numbers, WhatsApp numbers, pickup and delivery addresses, and garment care instructions.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">2. Use of Information</h3>
              <p>
                We use your details solely to schedule pickups, communicate order updates via WhatsApp or in-app notifications, process garments safely according to care labels, and issue service invoices. We do not sell or rent customer data to third-party advertisers.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">3. WhatsApp Communications</h3>
              <p>
                Customer-initiated WhatsApp conversations allow direct real-time communication between you and our dispatch team. You may opt out of promotional messages at any time.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">4. Data Security</h3>
              <p>
                We maintain appropriate administrative and electronic safeguards to protect customer records against unauthorized disclosure or alteration.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-bold text-slate-900 text-sm">1. Service Agreement</h3>
              <p>
                By scheduling a booking with {settings.business_name}, you agree to the inspection, cleaning, ironing, and return delivery of your garments in accordance with our standard service policies.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">2. Garment Inspection & Quotation</h3>
              <p>
                All initial prices quoted online or in WhatsApp messages are preliminary estimates. Final charges are confirmed upon physical garment intake, fabric verification, and weighing at our facility.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">3. Pockets & Personal Property</h3>
              <p>
                Customers are requested to check all garment pockets prior to handing over clothing. {settings.business_name} is not responsible for money, jewelry, pens, or other valuables left in pockets.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">4. Pickup & Collection Coordination</h3>
              <p>
                Arrival times are coordinated via WhatsApp or telephone call. If a customer is unavailable at the agreed pickup time, our dispatch will reschedule according to operational availability.
              </p>

              <h3 className="font-bold text-slate-900 text-sm">5. Care for Delicate Fabrics</h3>
              <p>
                Special items, dry clean only garments, and delicate traditional wear require disclosure of fabric composition tags. We employ fabric-appropriate cleaning solvents and techniques.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
