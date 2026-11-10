import React from 'react';
import { BusinessSettings } from '../../types';
import { getWhatsAppGeneralInquiryUrl } from '../../services/whatsapp';

interface WhatsAppButtonProps {
  settings: BusinessSettings;
  customerName?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings, customerName }) => {
  const whatsappUrl = getWhatsAppGeneralInquiryUrl(settings, customerName);

  return (
    <aside
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
      aria-label="Direct WhatsApp Contact"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40"
        title={`Chat with ${settings.business_name} on WhatsApp (${settings.display_phone || settings.whatsapp_number})`}
        aria-label={`Chat with ${settings.business_name} on WhatsApp`}
      >
        {/* Authentic WhatsApp vector logo */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-xs"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67ZM8.6 7.42C8.42 7.42 8.12 7.49 7.87 7.76C7.62 8.03 6.92 8.69 6.92 10.03C6.92 11.37 7.9 12.66 8.03 12.84C8.17 13.02 9.95 15.77 12.67 16.95C13.32 17.23 13.82 17.4 14.22 17.53C14.87 17.74 15.47 17.71 15.94 17.64C16.46 17.56 17.54 16.98 17.77 16.35C18 15.71 18 15.17 17.93 15.06C17.86 14.94 17.67 14.88 17.39 14.74C17.11 14.6 15.73 13.92 15.47 13.83C15.22 13.73 15.03 13.69 14.85 13.96C14.66 14.24 14.13 14.86 13.97 15.05C13.81 15.23 13.65 15.26 13.37 15.12C13.09 14.97 12.2 14.68 11.14 13.74C10.32 13.01 9.77 12.11 9.61 11.83C9.45 11.55 9.59 11.4 9.73 11.26C9.86 11.14 10.01 10.93 10.16 10.77C10.3 10.61 10.35 10.49 10.44 10.31C10.53 10.13 10.49 9.97 10.42 9.83C10.35 9.69 9.8 8.35 9.57 7.81C9.35 7.28 9.12 7.36 8.95 7.35C8.79 7.34 8.6 7.42 8.6 7.42Z" />
        </svg>

        {/* Ambient subtle ping indicator */}
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>
      </a>
    </aside>
  );
};
