export type UserRole = 'customer' | 'admin';

export type OrderStatus =
  | 'Booking Received'
  | 'Awaiting Confirmation'
  | 'Pickup Scheduled'
  | 'Laundry Received'
  | 'Processing'
  | 'Ready for Collection'
  | 'Out for Delivery'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Paid' | 'Refunded';

export type PricingMethod =
  | 'Per item'
  | 'Per kilogram'
  | 'Per load'
  | 'Fixed package'
  | 'Custom quotation'
  | 'Price confirmed after inspection';

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string;
  default_pickup_address: string;
  default_pickup_instructions: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LaundryService {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  options: string[];
  pricing_method: PricingMethod;
  base_price?: string; // e.g. "Starting from ₦2,500/load" or "$15/bag"
  image_url: string;
  is_active: boolean;
  display_order: number;
  special_requirements?: string;
  booking_instructions?: string;
  faqs?: { q: string; a: string }[];
}

export interface ServiceSpecificDetails {
  garment_type?: string;
  item_count?: number;
  estimated_weight_kg?: number;
  laundry_package?: string;
  folding_or_ironing_preference?: string;
  fabric_notes?: string;
  business_name?: string;
  frequency?: string;
  special_instructions?: string;
}

export interface Booking {
  id: string;
  order_reference: string; // e.g. CLS-20261102-0001
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  service_id: string;
  service_name_snapshot: string;
  service_details: ServiceSpecificDetails;
  pickup_address: string;
  pickup_instructions?: string;
  requested_pickup_date: string;
  requested_pickup_time: string;
  confirmed_pickup_date?: string;
  confirmed_pickup_time?: string;
  expected_completion_date?: string;
  collection_or_delivery_preference: 'Collection' | 'Delivery';
  delivery_address?: string;
  special_instructions?: string;
  quoted_price?: string;
  final_price?: number;
  amount_paid?: number;
  payment_method?: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderStatusHistoryItem {
  id: string;
  booking_id: string;
  previous_status: OrderStatus;
  new_status: OrderStatus;
  changed_by: string;
  note?: string;
  created_at: string;
}

export interface CustomerNotification {
  id: string;
  customer_id: string;
  booking_id?: string;
  order_reference?: string;
  title: string;
  message: string;
  notification_type: 'status_update' | 'pickup_alert' | 'ready_collection' | 'booking_confirmed' | 'general';
  is_read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  role_or_location?: string;
  content: string;
  rating: number; // 1 to 5
  is_approved: boolean;
  created_at: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'responded';
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  slogan: string;
  hero_headline: string;
  hero_supporting_text: string;
  whatsapp_number: string; // international digits only, e.g. "2348168137488"
  display_phone: string; // e.g. "0816 813 7488"
  email?: string;
  address: string;
  operating_hours: string;
  vision: string;
  mission: string;
  currency_symbol: string;
  updated_at: string;
}
