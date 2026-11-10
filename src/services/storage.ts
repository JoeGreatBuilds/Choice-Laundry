import {
  Booking,
  BusinessSettings,
  ContactEnquiry,
  CustomerNotification,
  CustomerProfile,
  FAQItem,
  LaundryService,
  OrderStatus,
  OrderStatusHistoryItem,
  Testimonial,
} from '../types';

const STORAGE_KEYS = {
  SERVICES: 'cls_services',
  SETTINGS: 'cls_settings',
  BOOKINGS: 'cls_bookings',
  STATUS_HISTORY: 'cls_status_history',
  NOTIFICATIONS: 'cls_notifications',
  PROFILES: 'cls_profiles',
  TESTIMONIALS: 'cls_testimonials',
  ENQUIRIES: 'cls_enquiries',
  FAQS: 'cls_faqs',
  CURRENT_USER_ID: 'cls_current_user_id',
};

// Initial Seed Data
const DEFAULT_SETTINGS: BusinessSettings = {
  id: 'settings_default',
  business_name: 'CHOICE LAUNDRY SERVICES',
  slogan: 'Your Clothes, Our Care.',
  hero_headline: 'Fresh Clothes. Exceptional Care. More Time for You.',
  hero_supporting_text:
    'Experience convenient laundry care with professional finishing, personalized service, and easy WhatsApp communication. Choose your service, arrange your pickup, and let Choice Laundry Services take care of the rest.',
  whatsapp_number: '2348168137488',
  display_phone: '0816 813 7488',
  email: '',
  address: '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
  operating_hours: 'Monday – Saturday: 7:30 AM – 7:00 PM | Sunday: Closed',
  vision:
    'To become a trusted laundry service brand recognized for excellent garment care, convenience, reliability, and outstanding customer satisfaction.',
  mission:
    "To provide convenient, professional, and dependable laundry services while treating every customer's garments with care and attention.",
  currency_symbol: '₦',
  updated_at: new Date().toISOString(),
};

const DEFAULT_SERVICES: LaundryService[] = [
  {
    id: 'srv-1',
    name: 'Complete Wash & Fold',
    slug: 'complete-laundry',
    category: 'Everyday Care',
    description: 'Everyday clothing professionally washed, fresh-scented, machine-dried, and neatly folded in protective packaging.',
    options: ['Wash, Dry & Fold', 'Hypoallergenic Wash', 'Stain Pre-treatment', 'Color Separated Care'],
    pricing_method: 'Per load',
    base_price: 'Price confirmed after assessment',
    image_url: '/src/assets/images/choice_female_wash_1794322140471.jpg',
    is_active: true,
    display_order: 1,
    special_requirements: 'Separation of lights, darks, and delicate items recommended.',
    booking_instructions: 'Indicate approximate bag or load count and any detergent preferences.',
    faqs: [
      { q: 'How long does Complete Wash & Fold take?', a: 'Standard turnaround is 24 to 48 hours from receipt of garments.' },
      { q: 'Are detergents skin-friendly?', a: 'We use gentle, hypoallergenic fabric detergents and premium softeners.' }
    ]
  },
  {
    id: 'srv-2',
    name: 'Steam Ironing & Pressing',
    slug: 'ironing',
    category: 'Finishing',
    description: 'Crisp steam pressing on hangers or neatly folded with custom starch options for work shirts, trousers, and native Agbada.',
    options: ['Crisp Hanger Presentation', 'Neatly Folded for Travel', 'Light Starch Finishing', 'Medium / Heavy Native Starch'],
    pricing_method: 'Per item',
    base_price: 'Price confirmed after assessment',
    image_url: '/src/assets/images/choice_male_native_1794322140547.jpg',
    is_active: true,
    display_order: 2,
    special_requirements: 'Garments should be clean prior to pressing. Minor wrinkles or clean dry clothes accepted.',
    booking_instructions: 'Provide garment types (shirts, trousers, agbada, gowns) and total quantity.'
  },
  {
    id: 'srv-3',
    name: 'Wash & Ironing Combo',
    slug: 'washing-and-ironing',
    category: 'Full Care',
    description: 'The complete solution for formal wear and office attire. Freshly washed, steam pressed, and delivered on hangers.',
    options: ['Full Wash + Steam Press', 'Hangers with Shoulder Protectors', 'Collars & Cuffs Treatment', 'Native Attire Care'],
    pricing_method: 'Per item',
    base_price: 'Price confirmed after assessment',
    image_url: '/src/assets/images/choice_female_hang_1794322160241.jpg',
    is_active: true,
    display_order: 3,
    special_requirements: 'Check pockets for pens, coins, and loose items before pickup.',
    booking_instructions: 'List item counts by garment type for accurate tracking.'
  },
  {
    id: 'srv-4',
    name: 'Dry Cleaning & Delicates',
    slug: 'dry-cleaning',
    category: 'Specialist',
    description: 'Specialist fabric care for suits, blazers, evening gowns, silk, lace, and delicate traditional ceremonial garments.',
    options: ['Suits & Blazers', 'Evening Gowns & Dresses', 'Luxury Native Attire', 'Delicate Silks & Woolens'],
    pricing_method: 'Custom quotation',
    base_price: 'Price confirmed after inspection',
    image_url: '/src/assets/images/choice_female_dry_1794322162214.jpg',
    is_active: true,
    display_order: 4,
    special_requirements: 'Fabric composition tags verified upon pickup. Quotation given after professional inspection.',
    booking_instructions: 'Note any specific fabric care requirements or decorative embellishments.'
  },
  {
    id: 'srv-5',
    name: 'Bedding, Duvets & Linens',
    slug: 'bedding-and-linen',
    category: 'Household',
    description: 'Deep hygiene wash and sanitized heat drying for duvets, comforters, bedsheets, blankets, towels, and curtains.',
    options: ['Duvets & Comforters', 'Bedsheets & Pillowcases', 'Curtains & Drapes', 'Plush Bath Towels'],
    pricing_method: 'Per item',
    base_price: 'Price confirmed after assessment',
    image_url: '/src/assets/images/choice_male_duvet_1794322164310.jpg',
    is_active: true,
    display_order: 5,
    special_requirements: 'Indicate heavy down or feather fillings.'
  },
  {
    id: 'srv-6',
    name: 'Bulk & Commercial Laundry',
    slug: 'commercial-and-business-laundry',
    category: 'Corporate',
    description: 'Scheduled volume laundry for hotels, guest houses, short-lets, restaurants, staff uniforms, and corporate clients.',
    options: ['Hotel & Short-Let Linens', 'Company Staff Uniforms', 'Family Weekly Bundle', 'Scheduled Regular Pickup'],
    pricing_method: 'Custom quotation',
    base_price: 'Contact us for quotation',
    image_url: '/src/assets/images/choice_bulk_team_1794322164349.jpg',
    is_active: true,
    display_order: 6
  }
];

const DEFAULT_PROFILES: CustomerProfile[] = [
  {
    id: 'usr-customer-1',
    full_name: 'Adaobi Okafor',
    email: 'customer@choicelaundry.com',
    phone_number: '+234 802 345 6789',
    whatsapp_number: '2348023456789',
    default_pickup_address: '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
    default_pickup_instructions: 'Opposite Central Mosque, ring security bell',
    role: 'customer',
    created_at: '2026-10-15T10:00:00Z',
    updated_at: '2026-10-15T10:00:00Z'
  },
  {
    id: 'usr-admin-1',
    full_name: 'Choice Laundry Operations',
    email: 'admin@choicelaundry.com',
    phone_number: '0816 813 7488',
    whatsapp_number: '2348168137488',
    default_pickup_address: 'HQ - 37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
    default_pickup_instructions: 'Operational Dispatch Hub',
    role: 'admin',
    created_at: '2026-10-01T08:00:00Z',
    updated_at: '2026-10-01T08:00:00Z'
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'bk-101',
    order_reference: 'CLS-20261101-0001',
    customer_id: 'usr-customer-1',
    customer_name: 'Adaobi Okafor',
    customer_phone: '0816 813 7488',
    customer_whatsapp: '2348168137488',
    service_id: 'srv-3',
    service_name_snapshot: 'Wash & Ironing Combo',
    service_details: {
      garment_type: 'Business shirts & trousers',
      item_count: 8,
      folding_or_ironing_preference: 'Ironed on hangers',
      special_instructions: 'Light starch on white collared shirts please.'
    },
    pickup_address: '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
    pickup_instructions: 'Leave with estate security if not home',
    requested_pickup_date: '2026-11-01',
    requested_pickup_time: '09:00 - 11:00 AM',
    confirmed_pickup_date: '2026-11-01',
    confirmed_pickup_time: '10:00 AM',
    expected_completion_date: '2026-11-03',
    collection_or_delivery_preference: 'Delivery',
    delivery_address: '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
    quoted_price: 'Price confirmed after assessment',
    final_price: 6400,
    amount_paid: 6400,
    payment_method: 'Bank Transfer',
    payment_status: 'Paid',
    order_status: 'Ready for Collection',
    created_at: '2026-11-01T09:15:00Z',
    updated_at: '2026-11-02T08:30:00Z'
  },
  {
    id: 'bk-102',
    order_reference: 'CLS-20261102-0002',
    customer_id: 'usr-customer-1',
    customer_name: 'Adaobi Okafor',
    customer_phone: '0816 813 7488',
    customer_whatsapp: '2348168137488',
    service_id: 'srv-1',
    service_name_snapshot: 'Complete Wash & Fold',
    service_details: {
      laundry_package: 'Wash, dry, and fold',
      estimated_weight_kg: 6,
      folding_or_ironing_preference: 'Neatly folded',
      special_instructions: 'Hypoallergenic detergent if possible.'
    },
    pickup_address: '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
    requested_pickup_date: '2026-11-02',
    requested_pickup_time: '02:00 - 04:00 PM',
    collection_or_delivery_preference: 'Collection',
    quoted_price: 'Price confirmed after assessment',
    payment_status: 'Pending',
    order_status: 'Pickup Scheduled',
    created_at: '2026-11-02T07:30:00Z',
    updated_at: '2026-11-02T08:00:00Z'
  }
];

const DEFAULT_NOTIFICATIONS: CustomerNotification[] = [
  {
    id: 'notif-1',
    customer_id: 'usr-customer-1',
    booking_id: 'bk-101',
    order_reference: 'CLS-20261101-0001',
    title: 'Laundry Ready for Collection',
    message: 'Good news, Adaobi Okafor! Your laundry order CLS-20261101-0001 is ready for collection.',
    notification_type: 'ready_collection',
    is_read: false,
    created_at: '2026-11-02T08:30:00Z'
  },
  {
    id: 'notif-2',
    customer_id: 'usr-customer-1',
    booking_id: 'bk-102',
    order_reference: 'CLS-20261102-0002',
    title: 'Pickup Scheduled',
    message: 'Your pickup request for order CLS-20261102-0002 has been noted for 02:00 - 04:00 PM today.',
    notification_type: 'pickup_alert',
    is_read: false,
    created_at: '2026-11-02T08:00:00Z'
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    customer_name: 'Babatunde Alabi',
    content: 'Choice Laundry Services has made managing work clothes so hassle-free. The shirts arrived crisply ironed on hangers with zero fuss.',
    rating: 5,
    is_approved: true,
    created_at: '2026-10-20T14:00:00Z'
  },
  {
    id: 't-2',
    customer_name: 'Dr. Chioma Nwachukwu',
    content: 'Very reliable pickup and friendly communication over WhatsApp. I appreciate knowing the exact progress of my bedding laundry.',
    rating: 5,
    is_approved: true,
    created_at: '2026-10-24T11:20:00Z'
  },
  {
    id: 't-3',
    customer_name: 'Mr. & Mrs. Adeleke',
    content: 'The bulk family laundry service is a weekend lifesaver. Everything came back fresh, clean, and neatly packed.',
    rating: 5,
    is_approved: true,
    created_at: '2026-10-28T16:45:00Z'
  }
];

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I book a laundry service?',
    answer: 'Simply select your desired service from our catalogue, fill out the 5-step booking form with your garment preferences and pickup address, and click "Confirm Booking & Chat on WhatsApp" to connect directly with our dispatch team.',
    display_order: 1,
    is_active: true
  },
  {
    id: 'faq-2',
    question: 'What laundry services do you offer?',
    answer: 'We provide Complete Laundry Care, Washing Only, Steam Ironing & Pressing, Washing & Ironing, Dry Cleaning, Bedding & Household Linen, Towels & Bath Linen, Special Garment Care, Bulk/Family bundles, and Commercial laundry.',
    display_order: 2,
    is_active: true
  },
  {
    id: 'faq-3',
    question: 'How do I arrange pickup?',
    answer: 'During the booking process, choose your preferred pickup date and time window. Our team coordinates directly with you via WhatsApp to confirm the driver arrival window.',
    display_order: 3,
    is_active: true
  },
  {
    id: 'faq-4',
    question: 'How will I know when my laundry is ready?',
    answer: 'You will receive an instant in-dashboard notification as soon as our team marks your order as "Ready for Collection", along with a WhatsApp update where preferred.',
    display_order: 4,
    is_active: true
  },
  {
    id: 'faq-5',
    question: 'Can I track my order?',
    answer: 'Yes! Every booking is assigned a unique reference code (e.g. CLS-20261102-0001). You can log in to your Customer Dashboard at any time to see the live 8-stage progress tracker from receipt to completion.',
    display_order: 5,
    is_active: true
  },
  {
    id: 'faq-6',
    question: 'How is the laundry price determined?',
    answer: 'Depending on the service, pricing is based on item count, estimated weight, load size, or custom assessment for delicate fabrics. Our team confirms the exact final quote before washing commences.',
    display_order: 6,
    is_active: true
  },
  {
    id: 'faq-7',
    question: 'Can I contact the business through WhatsApp?',
    answer: 'Yes, WhatsApp is our primary instant support channel. Every booking and order tracking view includes a direct "Chat on WhatsApp" button with your details prefilled.',
    display_order: 7,
    is_active: true
  },
  {
    id: 'faq-8',
    question: 'Can I cancel or change a booking?',
    answer: 'You can request changes or cancellation before the pickup is scheduled by contacting us via WhatsApp or directly through your Customer Dashboard.',
    display_order: 8,
    is_active: true
  },
  {
    id: 'faq-9',
    question: 'How do I collect my laundry?',
    answer: 'You can select either self-collection from our service hub or convenient door delivery when placing your order.',
    display_order: 9,
    is_active: true
  },
  {
    id: 'faq-10',
    question: 'Do you offer delivery?',
    answer: 'Yes, we provide convenient return delivery right to your residential or office address upon request.',
    display_order: 10,
    is_active: true
  },
  {
    id: 'faq-11',
    question: 'How can I contact customer support?',
    answer: 'You can reach us through our instant WhatsApp chat, phone hotline (0816 813 7488), or directly via our website.',
    display_order: 11,
    is_active: true
  }
];

class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    const storedSettingsRaw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!storedSettingsRaw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } else {
      try {
        const storedS = JSON.parse(storedSettingsRaw);
        if (
          storedS.address?.includes('Plot 12') ||
          storedS.whatsapp_number?.includes('234801') ||
          storedS.email
        ) {
          const updatedS = {
            ...storedS,
            address: '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State',
            whatsapp_number: '2348168137488',
            display_phone: '0816 813 7488',
            email: '',
          };
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedS));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      }
    }
    const storedServicesRaw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    if (!storedServicesRaw) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    } else {
      try {
        const stored = JSON.parse(storedServicesRaw);
        // If previous unbranded images or old services exist, upgrade to Choice Laundry customized images
        if (
          !Array.isArray(stored) ||
          stored.length !== 6 ||
          stored.some((s: LaundryService) => s.image_url.includes('nigerian_') || s.image_url.includes('hero_'))
        ) {
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(DEFAULT_PROFILES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify([]));
    }
  }

  private emitChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cls_storage_change'));
    }
  }

  // --- Settings ---
  getSettings(): BusinessSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(settings: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.emitChange();
    return updated;
  }

  // --- Services ---
  getServices(): LaundryService[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return data ? JSON.parse(data) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  }

  getServiceBySlug(slug: string): LaundryService | undefined {
    return this.getServices().find(s => s.slug === slug);
  }

  saveService(service: LaundryService): LaundryService {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      services[index] = service;
    } else {
      services.push(service);
    }
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    this.emitChange();
    return service;
  }

  // --- Profiles ---
  getProfiles(): CustomerProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  }

  getProfile(id: string): CustomerProfile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  getProfileByEmail(email: string): CustomerProfile | undefined {
    return this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  saveProfile(profile: CustomerProfile): CustomerProfile {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push({ ...profile, updated_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    this.emitChange();
    return profile;
  }

  // --- Bookings ---
  getBookings(): Booking[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  getBookingByReference(ref: string): Booking | undefined {
    return this.getBookings().find(b => b.order_reference.toLowerCase() === ref.toLowerCase());
  }

  getCustomerBookings(customerId: string): Booking[] {
    return this.getBookings().filter(b => b.customer_id === customerId);
  }

  generateOrderReference(): string {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CLS-${dateStr}-${randomSuffix}`;
  }

  createBooking(data: Omit<Booking, 'id' | 'order_reference' | 'created_at' | 'updated_at'>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...data,
      id: `bk-${Date.now()}`,
      order_reference: this.generateOrderReference(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    bookings.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Create confirmation notification for customer
    this.createNotification({
      customer_id: newBooking.customer_id,
      booking_id: newBooking.id,
      order_reference: newBooking.order_reference,
      title: 'Booking Received',
      message: `Thank you for booking ${newBooking.service_name_snapshot}! Your order reference is ${newBooking.order_reference}. We will confirm your pickup shortly.`,
      notification_type: 'booking_confirmed',
      is_read: false,
    });

    this.emitChange();
    return newBooking;
  }

  updateBooking(id: string, updates: Partial<Booking>, changedBy: string = 'Staff'): Booking | undefined {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return undefined;

    const currentBooking = bookings[index];
    const prevStatus = currentBooking.order_status;
    const newStatus = updates.order_status || prevStatus;

    const updatedBooking: Booking = {
      ...currentBooking,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    bookings[index] = updatedBooking;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // If order status changed, create status history record and notify customer
    if (updates.order_status && updates.order_status !== prevStatus) {
      this.recordStatusHistory({
        id: `hist-${Date.now()}`,
        booking_id: id,
        previous_status: prevStatus,
        new_status: updates.order_status,
        changed_by: changedBy,
        note: updates.internal_notes,
        created_at: new Date().toISOString(),
      });

      // Special notification for "Ready for Collection"
      if (updates.order_status === 'Ready for Collection') {
        this.createNotification({
          customer_id: updatedBooking.customer_id,
          booking_id: updatedBooking.id,
          order_reference: updatedBooking.order_reference,
          title: 'Laundry Ready for Collection',
          message: `Good news, ${updatedBooking.customer_name}! Your laundry order ${updatedBooking.order_reference} is ready for collection.`,
          notification_type: 'ready_collection',
          is_read: false,
        });
      } else {
        this.createNotification({
          customer_id: updatedBooking.customer_id,
          booking_id: updatedBooking.id,
          order_reference: updatedBooking.order_reference,
          title: `Order Status: ${updates.order_status}`,
          message: `Your order ${updatedBooking.order_reference} has updated to "${updates.order_status}".`,
          notification_type: 'status_update',
          is_read: false,
        });
      }
    }

    this.emitChange();
    return updatedBooking;
  }

  // --- Status History ---
  getStatusHistory(bookingId: string): OrderStatusHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATUS_HISTORY);
      const all: OrderStatusHistoryItem[] = data ? JSON.parse(data) : [];
      return all.filter(h => h.booking_id === bookingId);
    } catch {
      return [];
    }
  }

  private recordStatusHistory(item: OrderStatusHistoryItem) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATUS_HISTORY);
      const all: OrderStatusHistoryItem[] = data ? JSON.parse(data) : [];
      all.push(item);
      localStorage.setItem(STORAGE_KEYS.STATUS_HISTORY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to record status history', e);
    }
  }

  // --- Notifications ---
  getNotifications(customerId: string): CustomerNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: CustomerNotification[] = data ? JSON.parse(data) : [];
      return all.filter(n => n.customer_id === customerId);
    } catch {
      return [];
    }
  }

  createNotification(notif: Omit<CustomerNotification, 'id' | 'created_at'>): CustomerNotification {
    const all = this.getAllNotifications();
    const newNotif: CustomerNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.emitChange();
    return newNotif;
  }

  private getAllNotifications(): CustomerNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  markNotificationAsRead(id: string) {
    const all = this.getAllNotifications();
    const notif = all.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      this.emitChange();
    }
  }

  markAllNotificationsAsRead(customerId: string) {
    const all = this.getAllNotifications();
    all.forEach(n => {
      if (n.customer_id === customerId) {
        n.is_read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    this.emitChange();
  }

  // --- Testimonials ---
  getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      return data ? JSON.parse(data) : DEFAULT_TESTIMONIALS;
    } catch {
      return DEFAULT_TESTIMONIALS;
    }
  }

  addTestimonial(t: Omit<Testimonial, 'id' | 'created_at'>): Testimonial {
    const all = this.getTestimonials();
    const newT: Testimonial = {
      ...t,
      id: `t-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    all.unshift(newT);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(all));
    this.emitChange();
    return newT;
  }

  toggleTestimonialApproval(id: string, isApproved: boolean) {
    const all = this.getTestimonials();
    const target = all.find(t => t.id === id);
    if (target) {
      target.is_approved = isApproved;
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(all));
      this.emitChange();
    }
  }

  deleteTestimonial(id: string) {
    const all = this.getTestimonials().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(all));
    this.emitChange();
  }

  // --- FAQs ---
  getFAQs(): FAQItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAQS);
      return data ? JSON.parse(data) : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  }

  saveFAQ(faq: FAQItem) {
    const all = this.getFAQs();
    const idx = all.findIndex(f => f.id === faq.id);
    if (idx >= 0) {
      all[idx] = faq;
    } else {
      all.push(faq);
    }
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(all));
    this.emitChange();
  }

  deleteFAQ(id: string) {
    const all = this.getFAQs().filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(all));
    this.emitChange();
  }

  // --- Contact Enquiries ---
  getEnquiries(): ContactEnquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  submitEnquiry(enquiry: Omit<ContactEnquiry, 'id' | 'created_at' | 'status'>): ContactEnquiry {
    const all = this.getEnquiries();
    const newEnquiry: ContactEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    all.unshift(newEnquiry);
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(all));
    this.emitChange();
    return newEnquiry;
  }

  updateEnquiryStatus(id: string, status: ContactEnquiry['status']) {
    const all = this.getEnquiries();
    const enq = all.find(e => e.id === id);
    if (enq) {
      enq.status = status;
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(all));
      this.emitChange();
    }
  }
}

export const storage = new StorageService();
