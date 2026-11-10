import React, { useState, useEffect } from 'react';
import {
  Booking,
  BusinessSettings,
  ContactEnquiry,
  CustomerProfile,
  LaundryService,
  OrderStatus,
  PaymentStatus,
  PricingMethod,
  Testimonial
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  ShoppingBag,
  DollarSign,
  Users,
  Settings,
  MessageCircle,
  Eye,
  Edit,
  Save,
  Check,
  X,
  FileCode,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { openWhatsAppUrl } from '../../services/whatsapp';

interface AdminDashboardProps {
  settings: BusinessSettings;
  onSettingsUpdated: (newSettings: BusinessSettings) => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  onSettingsUpdated,
  onNavigateHome,
}) => {
  const { currentUser, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'customers' | 'services' | 'pickups' | 'testimonials' | 'enquiries' | 'settings' | 'deploy'
  >('overview');

  // Real-time local state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [services, setServices] = useState<LaundryService[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Booking edit state in modal
  const [modalStatus, setModalStatus] = useState<OrderStatus>('Booking Received');
  const [modalInternalNotes, setModalInternalNotes] = useState('');
  const [modalConfirmedDate, setModalConfirmedDate] = useState('');
  const [modalConfirmedTime, setModalConfirmedTime] = useState('');
  const [modalExpectedCompletion, setModalExpectedCompletion] = useState('');
  const [modalFinalPrice, setModalFinalPrice] = useState<number>(0);
  const [modalAmountPaid, setModalAmountPaid] = useState<number>(0);
  const [modalPaymentStatus, setModalPaymentStatus] = useState<PaymentStatus>('Pending');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Settings form state
  const [businessName, setBusinessName] = useState(settings.business_name);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number);
  const [displayPhone, setDisplayPhone] = useState(settings.display_phone);
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address);
  const [operatingHours, setOperatingHours] = useState(settings.operating_hours);
  const [vision, setVision] = useState(settings.vision);
  const [mission, setMission] = useState(settings.mission);
  const [settingsSavedAlert, setSettingsSavedAlert] = useState(false);

  const loadData = () => {
    setBookings(storage.getBookings());
    setCustomers(storage.getProfiles());
    setServices(storage.getServices());
    setTestimonials(storage.getTestimonials());
    setEnquiries(storage.getEnquiries());
  };

  useEffect(() => {
    loadData();
    const handleStorage = () => loadData();
    window.addEventListener('cls_storage_change', handleStorage);
    return () => window.removeEventListener('cls_storage_change', handleStorage);
  }, []);

  // When selected booking changes, populate modal fields
  useEffect(() => {
    if (selectedBooking) {
      setModalStatus(selectedBooking.order_status);
      setModalInternalNotes(selectedBooking.internal_notes || '');
      setModalConfirmedDate(selectedBooking.confirmed_pickup_date || selectedBooking.requested_pickup_date || '');
      setModalConfirmedTime(selectedBooking.confirmed_pickup_time || selectedBooking.requested_pickup_time || '');
      setModalExpectedCompletion(selectedBooking.expected_completion_date || '');
      setModalFinalPrice(selectedBooking.final_price || 0);
      setModalAmountPaid(selectedBooking.amount_paid || 0);
      setModalPaymentStatus(selectedBooking.payment_status);
    }
  }, [selectedBooking]);

  // Financial & order metrics
  const totalBookings = bookings.length;
  const newBookings = bookings.filter((b) => b.order_status === 'Booking Received' || b.order_status === 'Awaiting Confirmation').length;
  const awaitingConf = bookings.filter((b) => b.order_status === 'Awaiting Confirmation').length;
  const pickupScheduled = bookings.filter((b) => b.order_status === 'Pickup Scheduled').length;
  const inProcessing = bookings.filter((b) => b.order_status === 'Laundry Received' || b.order_status === 'Processing').length;
  const readyForCollection = bookings.filter((b) => b.order_status === 'Ready for Collection').length;
  const completedOrders = bookings.filter((b) => b.order_status === 'Completed').length;
  const cancelledOrders = bookings.filter((b) => b.order_status === 'Cancelled').length;

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.amount_paid || 0), 0);
  const outstandingBalance = bookings.reduce((acc, b) => {
    const finalP = b.final_price || 0;
    const paid = b.amount_paid || 0;
    return acc + Math.max(0, finalP - paid);
  }, 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.order_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service_name_snapshot.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return b.order_status === statusFilter;
  });

  // Modal update handler
  const handleSaveBookingModal = () => {
    if (!selectedBooking) return;

    const updated = storage.updateBooking(
      selectedBooking.id,
      {
        order_status: modalStatus,
        internal_notes: modalInternalNotes.trim(),
        confirmed_pickup_date: modalConfirmedDate,
        confirmed_pickup_time: modalConfirmedTime,
        expected_completion_date: modalExpectedCompletion,
        final_price: Number(modalFinalPrice) || 0,
        amount_paid: Number(modalAmountPaid) || 0,
        payment_status: modalPaymentStatus,
      },
      currentUser?.full_name || 'Admin Operations'
    );

    if (updated) {
      setSelectedBooking(updated);
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 2000);
      loadData();
    }
  };

  const handleContactCustomerWhatsApp = (b: Booking) => {
    const cleanPhone = b.customer_whatsapp?.replace(/\D/g, '') || b.customer_phone.replace(/\D/g, '');
    const message = `Hello ${b.customer_name}, this is Choice Laundry Services regarding your booking ${b.order_reference} (${b.service_name_snapshot}).`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    openWhatsAppUrl(url);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storage.saveSettings({
      business_name: businessName.trim(),
      slogan: slogan.trim(),
      whatsapp_number: whatsappNumber.trim().replace(/\D/g, ''),
      display_phone: displayPhone.trim(),
      email: email ? email.trim() : '',
      address: address.trim(),
      operating_hours: operatingHours.trim(),
      vision: vision.trim(),
      mission: mission.trim(),
    });

    onSettingsUpdated(updated);
    setSettingsSavedAlert(true);
    setTimeout(() => setSettingsSavedAlert(false), 2500);
  };

  const handleToggleService = (srv: LaundryService) => {
    const updated = { ...srv, is_active: !srv.is_active };
    storage.saveService(updated);
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="bg-[#142B4A] rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#19B8A5] mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Choice Laundry Operations Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Administrative Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time management for bookings, customer pickups, pricing, and business settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors"
          >
            View Public Site
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 mb-8 text-xs font-semibold scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: Sparkles },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: ShoppingBag },
          { id: 'pickups', label: 'Pickup Coordination', icon: Truck },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'services', label: `Services (${services.length})`, icon: CheckCircle2 },
          { id: 'testimonials', label: `Reviews (${testimonials.length})`, icon: Sparkles },
          { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: MessageCircle },
          { id: 'settings', label: 'Business Settings', icon: Settings },
          { id: 'deploy', label: 'Vercel / Supabase Export', icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#142B4A] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Bookings
              </span>
              <span className="text-2xl font-black text-[#142B4A] tabular-nums">
                {totalBookings}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                New / Awaiting Conf.
              </span>
              <span className="text-2xl font-black text-blue-600 tabular-nums">
                {newBookings}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pickup Scheduled
              </span>
              <span className="text-2xl font-black text-amber-600 tabular-nums">
                {pickupScheduled}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Processing Garments
              </span>
              <span className="text-2xl font-black text-indigo-600 tabular-nums">
                {inProcessing}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#19B8A5]/40 bg-[#EAF7F8]/40 shadow-xs">
              <span className="text-[11px] font-bold text-[#142B4A] uppercase tracking-wider block mb-1">
                Ready for Collection
              </span>
              <span className="text-2xl font-black text-[#19B8A5] tabular-nums">
                {readyForCollection}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Completed Orders
              </span>
              <span className="text-2xl font-black text-emerald-600 tabular-nums">
                {completedOrders}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Revenue Recorded
              </span>
              <span className="text-xl font-black text-slate-900 tabular-nums">
                ₦{totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Outstanding Balance
              </span>
              <span className="text-xl font-black text-rose-600 tabular-nums">
                ₦{outstandingBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick overview of latest bookings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#142B4A]">
                Recent Laundry Bookings
              </h3>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-semibold text-[#19B8A5] hover:underline cursor-pointer"
              >
                View all bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Pickup Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-[#142B4A]">
                        {b.order_reference}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {b.customer_name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {b.service_name_snapshot}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {b.requested_pickup_date}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {b.order_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#142B4A] bg-slate-100 hover:bg-[#19B8A5] hover:text-white rounded transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Search & Filter Header */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reference, customer, service..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-[#19B8A5]"
              >
                <option value="all">All Statuses</option>
                <option value="Booking Received">Booking Received</option>
                <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                <option value="Pickup Scheduled">Pickup Scheduled</option>
                <option value="Laundry Received">Laundry Received</option>
                <option value="Processing">Processing</option>
                <option value="Ready for Collection">Ready for Collection</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Pickup Window</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Price / Paid</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#142B4A]">
                        {b.order_reference}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{b.customer_name}</p>
                        <p className="text-[11px] text-slate-500">{b.customer_phone}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {b.service_name_snapshot}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <p>{b.requested_pickup_date}</p>
                        <p className="text-[11px] text-slate-400">{b.requested_pickup_time}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.order_status === 'Ready for Collection'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.order_status === 'Completed'
                              ? 'bg-slate-100 text-slate-800'
                              : 'bg-blue-50 text-blue-800'
                          }`}
                        >
                          {b.order_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <p className="font-semibold">₦{(b.final_price || 0).toLocaleString()}</p>
                        <p className="text-[11px] text-emerald-600">Paid: ₦{(b.amount_paid || 0).toLocaleString()}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleContactCustomerWhatsApp(b)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-[#19B8A5] hover:text-white text-[#142B4A] transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors cursor-pointer"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PICKUP COORDINATION */}
      {activeTab === 'pickups' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h3 className="text-base font-bold text-[#142B4A] mb-1">
              Dispatch & Pickup Coordination
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Review requested pickup time windows, confirm driver arrivals, and record received laundry bags.
            </p>

            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#142B4A]">
                        {b.order_reference}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-bold text-slate-800">{b.customer_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200">
                        {b.order_status}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      <strong>Address:</strong> {b.pickup_address}{' '}
                      {b.pickup_instructions ? `(${b.pickup_instructions})` : ''}
                    </p>
                    <p className="text-slate-600">
                      <strong>Requested:</strong> {b.requested_pickup_date} at {b.requested_pickup_time}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleContactCustomerWhatsApp(b)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EAF7F8] text-[#142B4A] hover:bg-[#19B8A5] hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </button>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#0ea5e9] text-white hover:bg-[#0284c7] transition-colors cursor-pointer"
                    >
                      Confirm / Update Pickup
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#142B4A] mb-4">
              Registered Customer Accounts ({customers.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Default Pickup Address</th>
                    <th className="py-2.5 px-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{c.full_name}</td>
                      <td className="py-3 px-3 text-slate-600">{c.email}</td>
                      <td className="py-3 px-3 text-slate-600">{c.phone_number}</td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {c.default_pickup_address || '—'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {c.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SERVICES MANAGEMENT */}
      {activeTab === 'services' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#142B4A] mb-2">
              Services Catalogue Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enable, disable, or adjust pricing methods for all 10 service categories.
            </p>

            <div className="space-y-3">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 hover:border-[#19B8A5] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#142B4A]">{srv.name}</h4>
                      <span className="text-[10px] font-semibold text-slate-400">({srv.category})</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Pricing: {srv.pricing_method} · {srv.base_price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-bold ${
                        srv.is_active ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {srv.is_active ? 'Active' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => handleToggleService(srv)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
                    >
                      {srv.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#142B4A] mb-4">
              Customer Testimonials & Moderation ({testimonials.length})
            </h3>
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">{t.customer_name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        ({new Date(t.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })})
                      </span>
                      <span className="text-amber-500 font-bold text-xs">★ {t.rating}</span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{t.content}"</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => storage.toggleTestimonialApproval(t.id, !t.is_approved)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded cursor-pointer ${
                        t.is_approved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.is_approved ? 'Approved' : 'Unpublished'}
                    </button>
                    <button
                      onClick={() => storage.deleteTestimonial(t.id)}
                      className="p-1 text-rose-500 hover:text-rose-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#142B4A] mb-4">
              Contact Enquiries ({enquiries.length})
            </h3>
            {enquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No messages received yet.</p>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-[#142B4A]">{enq.name} ({enq.email})</span>
                      <span className="text-[10px] text-slate-400">{new Date(enq.created_at).toLocaleString()}</span>
                    </div>
                    <p className="font-semibold text-xs text-slate-800 mb-1">{enq.subject}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{enq.message}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => storage.updateEnquiryStatus(enq.id, enq.status === 'responded' ? 'in_progress' : 'responded')}
                        className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer ${
                          enq.status === 'responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {enq.status === 'responded' ? 'Marked Responded' : 'Mark as Responded'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 8: BUSINESS SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-in fade-in duration-150">
          <h3 className="text-xl font-bold text-[#142B4A] mb-1">Central Business Settings</h3>
          <p className="text-xs text-slate-500 mb-6">
            Configure contact details, WhatsApp international numbers, hours, and branding copy.
          </p>

          {settingsSavedAlert && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Business settings updated across the entire website!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Business Name
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand Slogan
                </label>
                <input
                  type="text"
                  required
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number (e.g. 08168137488 or 2348168137488) *
                </label>
                <input
                  type="text"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="2348168137488"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
                <span className="text-[10px] text-slate-400">Used for direct https://wa.me/ customer booking links.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Phone Line
                </label>
                <input
                  type="text"
                  required
                  value={displayPhone}
                  onChange={(e) => setDisplayPhone(e.target.value)}
                  placeholder="0816 813 7488"
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  required
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Physical Facility Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Vision Statement
              </label>
              <textarea
                rows={2}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Mission Statement
              </label>
              <textarea
                rows={2}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Save Business Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 9: DEPLOYMENT & SUPABASE GUIDE */}
      {activeTab === 'deploy' && (
        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
          <div>
            <span className="text-xs font-bold text-[#19B8A5] uppercase tracking-wider block mb-1">
              Vercel & Supabase Architecture
            </span>
            <h3 className="text-xl font-bold text-[#142B4A]">
              Production Deployment Blueprint
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Everything required to transition this functional applet to Vercel hosting and live Supabase PostgreSQL.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
            <h4 className="font-bold text-slate-900">Required Environment Variables:</h4>
            <code className="block p-3 rounded-lg bg-slate-900 text-teal-300 font-mono text-[11px] leading-relaxed">
              NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...<br />
              SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...<br />
              NEXT_PUBLIC_WHATSAPP_NUMBER=2348168137488
            </code>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm">Deployment Steps:</h4>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Create a new Supabase project at <strong>database.new</strong>.</li>
              <li>Open the SQL Editor in Supabase and run the migration script located at <code>supabase/migrations/20261102_choice_laundry.sql</code>.</li>
              <li>Enable Email Authentication and WhatsApp redirection in Supabase Auth settings.</li>
              <li>Deploy this repository to <strong>Vercel</strong> by connecting your Git repository.</li>
              <li>Enter the environment variables above in the Vercel Project Settings.</li>
            </ol>
          </div>
        </div>
      )}

      {/* ORDER MANAGEMENT MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[11px] font-bold text-[#19B8A5] uppercase tracking-wider block mb-1">
                Order Operational Management
              </span>
              <h3 className="text-xl font-extrabold text-[#142B4A]">
                {selectedBooking.order_reference}
              </h3>
              <p className="text-xs text-slate-500">
                Customer: {selectedBooking.customer_name} ({selectedBooking.customer_phone})
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Order details, status, and pricing updated successfully!</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Order Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Update Order Status * (Ready for Collection triggers customer alert)
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as OrderStatus)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#19B8A5]"
                >
                  <option value="Booking Received">Booking Received</option>
                  <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                  <option value="Pickup Scheduled">Pickup Scheduled</option>
                  <option value="Laundry Received">Laundry Received</option>
                  <option value="Processing">Processing</option>
                  <option value="Ready for Collection">Ready for Collection (Generates Alert)</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Pickup arrangements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmed Pickup Date
                  </label>
                  <input
                    type="date"
                    value={modalConfirmedDate}
                    onChange={(e) => setModalConfirmedDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmed Arrival Time
                  </label>
                  <input
                    type="text"
                    value={modalConfirmedTime}
                    onChange={(e) => setModalConfirmedTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                  />
                </div>
              </div>

              {/* Pricing & Payments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Final Price (₦)
                  </label>
                  <input
                    type="number"
                    value={modalFinalPrice}
                    onChange={(e) => setModalFinalPrice(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount Paid (₦)
                  </label>
                  <input
                    type="number"
                    value={modalAmountPaid}
                    onChange={(e) => setModalAmountPaid(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={modalPaymentStatus}
                    onChange={(e) => setModalPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Operational Notes
                </label>
                <textarea
                  rows={2}
                  value={modalInternalNotes}
                  onChange={(e) => setModalInternalNotes(e.target.value)}
                  placeholder="e.g. Driver assigned: Chidi. Delivered 8 shirts on wooden hangers."
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleContactCustomerWhatsApp(selectedBooking)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#EAF7F8] hover:bg-[#19B8A5] text-[#142B4A] hover:text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message Customer on WhatsApp</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveBookingModal}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Order Updates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
