import React, { useState, useEffect } from 'react';
import { Booking, BusinessSettings, CustomerNotification, OrderStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import {
  getWhatsAppPickupDiscussionUrl,
  getWhatsAppGeneralInquiryUrl,
  openWhatsAppUrl
} from '../../services/whatsapp';
import {
  ShoppingBag,
  Clock,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  User,
  Bell,
  MessageCircle,
  Eye,
  ExternalLink,
  MapPin,
  ArrowRight,
  Filter,
  Check,
  X,
  CreditCard
} from 'lucide-react';

interface CustomerDashboardProps {
  settings: BusinessSettings;
  initialTab?: 'orders' | 'profile' | 'notifications';
  onNavigateToBooking: () => void;
  onOpenOrderModal?: (booking: Booking) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  settings,
  initialTab = 'orders',
  onNavigateToBooking,
}) => {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'notifications'>(initialTab);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Profile form state
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [phone, setPhone] = useState(currentUser?.phone_number || '');
  const [whatsapp, setWhatsapp] = useState(currentUser?.whatsapp_number || '');
  const [address, setAddress] = useState(currentUser?.default_pickup_address || '');
  const [instructions, setInstructions] = useState(currentUser?.default_pickup_instructions || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);

  const loadData = () => {
    if (!currentUser) return;
    const customerBookings = storage.getCustomerBookings(currentUser.id);
    setBookings(customerBookings);
    const customerNotifs = storage.getNotifications(currentUser.id);
    setNotifications(customerNotifs);
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('cls_storage_change', handleStorageChange);
    return () => window.removeEventListener('cls_storage_change', handleStorageChange);
  }, [currentUser]);

  // Order metrics calculation
  const totalOrders = bookings.length;
  const newBookingsCount = bookings.filter((b) => b.order_status === 'Booking Received' || b.order_status === 'Awaiting Confirmation').length;
  const inProgressCount = bookings.filter((b) => b.order_status === 'Laundry Received' || b.order_status === 'Processing' || b.order_status === 'Pickup Scheduled').length;
  const readyForCollectionCount = bookings.filter((b) => b.order_status === 'Ready for Collection').length;
  const completedCount = bookings.filter((b) => b.order_status === 'Completed').length;

  // Filtered orders
  const filteredOrders = bookings.filter((b) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'new') return b.order_status === 'Booking Received' || b.order_status === 'Awaiting Confirmation';
    if (orderFilter === 'in_progress') return b.order_status === 'Pickup Scheduled' || b.order_status === 'Laundry Received' || b.order_status === 'Processing';
    if (orderFilter === 'ready') return b.order_status === 'Ready for Collection';
    if (orderFilter === 'completed') return b.order_status === 'Completed';
    if (orderFilter === 'cancelled') return b.order_status === 'Cancelled';
    return true;
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      phone_number: phone.trim(),
      whatsapp_number: whatsapp.trim().replace(/\D/g, ''),
      default_pickup_address: address.trim(),
      default_pickup_instructions: instructions.trim(),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleDiscussOrderWhatsApp = (booking: Booking) => {
    const url = getWhatsAppPickupDiscussionUrl(booking, settings);
    openWhatsAppUrl(url);
  };

  const handleSupportWhatsApp = () => {
    const url = getWhatsAppGeneralInquiryUrl(settings, currentUser?.full_name);
    openWhatsAppUrl(url);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    if (currentUser) {
      storage.markAllNotificationsAsRead(currentUser.id);
      loadData();
    }
  };

  // Status step progression for order tracker
  const orderStages: OrderStatus[] = [
    'Booking Received',
    'Awaiting Confirmation',
    'Pickup Scheduled',
    'Laundry Received',
    'Processing',
    'Ready for Collection',
    'Completed'
  ];

  const getStageIndex = (status: OrderStatus): number => {
    if (status === 'Cancelled') return -1;
    if (status === 'Out for Delivery') return 5;
    return orderStages.indexOf(status);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Greeting & Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#19B8A5] mb-1">
            <span>Customer Portal</span>
            <span>·</span>
            <span>Choice Laundry Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A]">
            Welcome back, {currentUser?.full_name || 'Valued Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your garments, coordinate pickups, and manage account details.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onNavigateToBooking}
            className="px-4 py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book a Service</span>
          </button>

          <button
            onClick={handleSupportWhatsApp}
            className="px-4 py-2.5 rounded-lg bg-[#19B8A5] hover:bg-[#16a594] text-[#142B4A] text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Support</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Total Orders
          </span>
          <span className="text-2xl font-black text-[#142B4A] tabular-nums">
            {totalOrders}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            New Bookings
          </span>
          <span className="text-2xl font-black text-blue-600 tabular-nums">
            {newBookingsCount}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            In Progress
          </span>
          <span className="text-2xl font-black text-amber-600 tabular-nums">
            {inProgressCount}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#19B8A5]/40 bg-[#EAF7F8]/40 shadow-xs">
          <span className="text-[11px] font-bold text-[#142B4A] uppercase tracking-wider block mb-1">
            Ready for Pickup
          </span>
          <span className="text-2xl font-black text-[#19B8A5] tabular-nums">
            {readyForCollectionCount}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Completed
          </span>
          <span className="text-2xl font-black text-emerald-600 tabular-nums">
            {completedCount}
          </span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-3 cursor-pointer transition-colors relative flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-[#142B4A] border-b-2 border-[#19B8A5]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 px-3 cursor-pointer transition-colors relative flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'text-[#142B4A] border-b-2 border-[#19B8A5]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 cursor-pointer transition-colors relative flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'text-[#142B4A] border-b-2 border-[#19B8A5]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile & Address</span>
        </button>
      </div>

      {/* TAB 1: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Filter:</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'new', label: 'New' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'ready', label: 'Ready for Collection' },
                { id: 'completed', label: 'Completed' },
                { id: 'cancelled', label: 'Cancelled' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                    orderFilter === f.id
                      ? 'bg-[#142B4A] text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards / Table List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">No orders found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You do not have any orders matching the "{orderFilter}" filter.
                </p>
              </div>
              <button
                onClick={onNavigateToBooking}
                className="px-5 py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Book Your First Laundry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-[#19B8A5] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#142B4A]">
                        {order.order_reference}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-xs text-slate-900">
                        {order.service_name_snapshot}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500">
                        Booked: {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                        Pickup: {order.requested_pickup_date} ({order.requested_pickup_time})
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {order.collection_or_delivery_preference}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status badge */}
                    <div className="text-right mr-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          order.order_status === 'Ready for Collection'
                            ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                            : order.order_status === 'Completed'
                            ? 'bg-slate-100 text-slate-800'
                            : order.order_status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {order.order_status}
                      </span>
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        Payment: {order.payment_status}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedBooking(order)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details & Tracking</span>
                    </button>

                    <button
                      onClick={() => handleDiscussOrderWhatsApp(order)}
                      className="px-3.5 py-2 text-xs font-bold text-[#142B4A] bg-[#EAF7F8] hover:bg-[#19B8A5] hover:text-white rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Discuss order on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#19B8A5] hover:text-white" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h2 className="text-base font-bold text-[#142B4A]">
              In-Dashboard Notifications ({notifications.length})
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#19B8A5] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
              No notifications yet. You will receive real-time updates when your order moves to processing or is ready for collection!
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  storage.markNotificationAsRead(notif.id);
                  loadData();
                }}
                className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 cursor-pointer ${
                  notif.is_read
                    ? 'bg-white border-slate-200'
                    : 'bg-[#EAF7F8]/50 border-[#19B8A5]/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.notification_type === 'ready_collection'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-[#142B4A] text-white'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#142B4A]">{notif.title}</h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {notif.order_reference && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const b = storage.getBookingByReference(notif.order_reference!);
                      if (b) setSelectedBooking(b);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 shrink-0 cursor-pointer"
                  >
                    View Order
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#142B4A]">Customer Profile & Saved Address</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These details automatically prefill future laundry bookings.
            </p>
          </div>

          {profileSaved && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Your profile details have been saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Account Identifier)
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Pickup Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Residential or office address"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Gate / Building Access Instructions
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Gate security code, flat intercom, or call instructions"
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-hidden focus:border-[#19B8A5]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INDIVIDUAL ORDER DETAILS & PROGRESS MODAL */}
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
                Order Tracking & Details
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-extrabold text-[#142B4A]">
                  {selectedBooking.order_reference}
                </h3>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                    selectedBooking.order_status === 'Ready for Collection'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedBooking.order_status}
                </span>
              </div>
            </div>

            {/* Visual Order Progress Indicator (8-stage workflow) */}
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Live Garment Progress
              </h4>

              <div className="relative">
                <div className="flex items-center justify-between text-center relative z-10">
                  {orderStages.map((stage, idx) => {
                    const currentIdx = getStageIndex(selectedBooking.order_status);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div key={stage} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-colors ${
                            isCurrent
                              ? 'bg-[#19B8A5] text-[#142B4A] ring-4 ring-[#19B8A5]/20'
                              : isPassed
                              ? 'bg-[#142B4A] text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] hidden sm:block ${
                            isCurrent ? 'font-bold text-[#142B4A]' : 'text-slate-500'
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Specification Summary */}
            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <p>
                  <strong className="text-slate-900">Service:</strong> {selectedBooking.service_name_snapshot}
                </p>
                <p>
                  <strong className="text-slate-900">Requested Pickup:</strong> {selectedBooking.requested_pickup_date} ({selectedBooking.requested_pickup_time})
                </p>
                <p>
                  <strong className="text-slate-900">Pickup Address:</strong> {selectedBooking.pickup_address}
                </p>
                <p>
                  <strong className="text-slate-900">Payment Status:</strong> {selectedBooking.payment_status}
                </p>
                {selectedBooking.confirmed_pickup_date && (
                  <p>
                    <strong className="text-slate-900">Confirmed Pickup:</strong> {selectedBooking.confirmed_pickup_date} at {selectedBooking.confirmed_pickup_time}
                  </p>
                )}
                {selectedBooking.final_price && (
                  <p>
                    <strong className="text-slate-900">Final Price:</strong> ₦{selectedBooking.final_price.toLocaleString()}
                  </p>
                )}
              </div>

              {selectedBooking.service_details && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Garment Notes:</strong>{' '}
                    {selectedBooking.service_details.garment_type || 'Assorted clothing'}{' '}
                    {selectedBooking.service_details.item_count ? `(${selectedBooking.service_details.item_count} items)` : ''}
                    {selectedBooking.service_details.folding_or_ironing_preference ? ` · ${selectedBooking.service_details.folding_or_ironing_preference}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleDiscussOrderWhatsApp(selectedBooking)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#19B8A5] hover:bg-[#16a594] text-[#142B4A] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Discuss Order on WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
