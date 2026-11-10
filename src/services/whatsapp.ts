import { Booking, BusinessSettings } from '../types';

/**
 * Sanitizes phone number to international digits only (e.g., "2348168137488")
 * Strips +, spaces, dashes, brackets
 */
export function sanitizeWhatsAppNumber(num: string): string {
  if (!num) return '2348168137488';
  let cleaned = num.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.slice(1);
  }
  return cleaned || '2348168137488';
}

/**
 * Builds personalized WhatsApp booking message matching Section 11 specification
 */
export function buildWhatsAppBookingMessage(
  booking: Booking,
  settings: BusinessSettings
): string {
  const serviceName = booking.service_name_snapshot;
  const d = booking.service_details || {};

  const lines: string[] = [];
  lines.push(`🧺 *NEW LAUNDRY BOOKING — ${settings.business_name}*`);
  lines.push('');
  lines.push(`*Order Reference:* ${booking.order_reference}`);
  lines.push(`*Customer Name:* ${booking.customer_name}`);
  if (booking.customer_phone) lines.push(`*Phone / WhatsApp:* ${booking.customer_phone}`);
  lines.push('');
  lines.push(`*Service:* ${serviceName}`);
  if (d.garment_type) lines.push(`*Items / Load:* ${d.garment_type}`);
  if (d.item_count !== undefined && d.item_count > 0) lines.push(`*Item Count:* ~${d.item_count} items`);
  if (d.estimated_weight_kg !== undefined && d.estimated_weight_kg > 0) lines.push(`*Estimated Weight:* ~${d.estimated_weight_kg} kg`);
  if (d.laundry_package) lines.push(`*Option:* ${d.laundry_package}`);
  if (d.folding_or_ironing_preference) lines.push(`*Finishing:* ${d.folding_or_ironing_preference}`);
  lines.push('');
  lines.push(`*Pickup Date:* ${booking.requested_pickup_date}`);
  lines.push(`*Pickup Window:* ${booking.requested_pickup_time}`);
  lines.push(`*Pickup Address:* ${booking.pickup_address}`);
  if (booking.pickup_instructions) lines.push(`*Access / Gate:* ${booking.pickup_instructions}`);
  if (booking.collection_or_delivery_preference) lines.push(`*Return Mode:* ${booking.collection_or_delivery_preference}`);
  if (booking.collection_or_delivery_preference === 'Delivery' && booking.delivery_address && booking.delivery_address !== booking.pickup_address) {
    lines.push(`*Delivery Address:* ${booking.delivery_address}`);
  }
  if (booking.special_instructions || d.special_instructions) {
    lines.push(`*Special Notes:* ${booking.special_instructions || d.special_instructions}`);
  }
  lines.push('');
  lines.push(`Please confirm this booking and dispatch pickup window.`);
  lines.push(`Thank you!`);

  return lines.join('\n');
}

/**
 * Generates WhatsApp click-to-chat URL for an existing booking
 */
export function getWhatsAppBookingUrl(booking: Booking, settings: BusinessSettings): string {
  const number = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const text = buildWhatsAppBookingMessage(booking, settings);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${number}?text=${encodedText}`;
}

/**
 * Generates WhatsApp click-to-chat URL to discuss pickup for an existing order (Section 13)
 */
export function getWhatsAppPickupDiscussionUrl(booking: Booking, settings: BusinessSettings): string {
  const number = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const text = [
    `Hello ${settings.business_name}.`,
    '',
    'I am contacting you about my laundry booking.',
    '',
    `Customer: ${booking.customer_name}`,
    `Order Reference: ${booking.order_reference}`,
    `Service: ${booking.service_name_snapshot}`,
    '',
    'I would like to discuss my pickup arrangements.',
    '',
    'Thank you.'
  ].join('\n');

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates general WhatsApp inquiry URL
 */
export function getWhatsAppGeneralInquiryUrl(settings: BusinessSettings, customerName?: string): string {
  const number = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const greeting = customerName
    ? `Hello ${settings.business_name}, my name is ${customerName}. I'd like to enquire about your laundry services.`
    : `Hello ${settings.business_name}, I would like to enquire about your laundry services and pickup options.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(greeting)}`;
}

/**
 * Helper to open WhatsApp URL in a safe new window tab
 */
export function openWhatsAppUrl(url: string): boolean {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return !!win;
  } catch (err) {
    console.error('Could not open WhatsApp window automatically', err);
    return false;
  }
}
