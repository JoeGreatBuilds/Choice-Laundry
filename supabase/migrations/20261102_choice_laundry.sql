-- ==============================================================================
-- CHOICE LAUNDRY SERVICES — SUPABASE POSTGRESQL PRODUCTION MIGRATION
-- Generated for Choice Laundry Services
-- Includes: Tables, Constraints, Indexes, Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 1. Create custom ENUM types
CREATE TYPE user_role AS ENUM ('customer', 'admin');

CREATE TYPE order_status AS ENUM (
  'Booking Received',
  'Awaiting Confirmation',
  'Pickup Scheduled',
  'Laundry Received',
  'Processing',
  'Ready for Collection',
  'Out for Delivery',
  'Completed',
  'Cancelled'
);

CREATE TYPE payment_status AS ENUM ('Pending', 'Partially Paid', 'Paid', 'Refunded');

CREATE TYPE pricing_method AS ENUM (
  'Per item',
  'Per kilogram',
  'Per load',
  'Fixed package',
  'Custom quotation',
  'Price confirmed after inspection'
);

-- 2. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT,
  default_pickup_address TEXT,
  default_pickup_instructions TEXT,
  role user_role DEFAULT 'customer' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. SERVICES CATALOGUE TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb NOT NULL,
  pricing_method pricing_method DEFAULT 'Per load' NOT NULL,
  base_price TEXT,
  image_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  special_requirements TEXT,
  booking_instructions TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_whatsapp TEXT,
  service_id UUID REFERENCES public.services(id) ON DELETE RESTRICT NOT NULL,
  service_name_snapshot TEXT NOT NULL,
  service_details JSONB DEFAULT '{}'::jsonb NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_instructions TEXT,
  requested_pickup_date DATE NOT NULL,
  requested_pickup_time TEXT NOT NULL,
  confirmed_pickup_date DATE,
  confirmed_pickup_time TEXT,
  expected_completion_date DATE,
  collection_or_delivery_preference TEXT DEFAULT 'Delivery' NOT NULL,
  delivery_address TEXT,
  special_instructions TEXT,
  quoted_price TEXT,
  final_price NUMERIC(12,2) DEFAULT 0,
  amount_paid NUMERIC(12,2) DEFAULT 0,
  payment_method TEXT,
  payment_status payment_status DEFAULT 'Pending' NOT NULL,
  order_status order_status DEFAULT 'Booking Received' NOT NULL,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. ORDER STATUS HISTORY TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  previous_status order_status NOT NULL,
  new_status order_status NOT NULL,
  changed_by TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. CUSTOMER NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  order_reference TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'status_update' NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  role_or_location TEXT,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. BUSINESS SETTINGS TABLE (Single row)
CREATE TABLE IF NOT EXISTS public.business_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary_settings',
  business_name TEXT DEFAULT 'CHOICE LAUNDRY SERVICES' NOT NULL,
  slogan TEXT DEFAULT 'Your Clothes, Our Care.' NOT NULL,
  hero_headline TEXT DEFAULT 'Fresh Clothes. Exceptional Care. More Time for You.',
  hero_supporting_text TEXT,
  whatsapp_number TEXT DEFAULT '2348168137488' NOT NULL,
  display_phone TEXT DEFAULT '0816 813 7488' NOT NULL,
  email TEXT DEFAULT '' NOT NULL,
  address TEXT DEFAULT '37 Baruwa Street, Ogo-Oluwa area, Osogbo, Osun State' NOT NULL,
  operating_hours TEXT DEFAULT 'Monday – Saturday: 7:30 AM – 7:00 PM',
  vision TEXT,
  mission TEXT,
  currency_symbol TEXT DEFAULT '₦',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. CONTACT ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. FAQ ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- INDEXES FOR HIGH QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_order_reference ON public.bookings(order_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_order_status ON public.bookings(order_status);
CREATE INDEX IF NOT EXISTS idx_notifications_customer ON public.notifications(customer_id, is_read);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Current User an Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Customer can read & update self; Admin can read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Services: Everyone can read active services; Admin can write
CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admin can manage services" ON public.services
  FOR ALL USING (public.is_admin());

-- Bookings: Customers can read and create their own bookings; Admin can read/update all
CREATE POLICY "Customers can read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Customers can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Admin can update bookings" ON public.bookings
  FOR UPDATE USING (public.is_admin());

-- Notifications: Customers can read their own notifications
CREATE POLICY "Customers read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());

CREATE POLICY "Customers update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = customer_id);

-- Testimonials: Public can view approved; Admin can manage all
CREATE POLICY "Public read approved testimonials" ON public.testimonials
  FOR SELECT USING (is_approved = TRUE OR public.is_admin());

CREATE POLICY "Admin manage testimonials" ON public.testimonials
  FOR ALL USING (public.is_admin());

-- Business Settings: Public read; Admin update
CREATE POLICY "Public read settings" ON public.business_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin update settings" ON public.business_settings
  FOR UPDATE USING (public.is_admin());
