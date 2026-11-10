import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BusinessSettings } from '../../types';
import {
  Sparkles,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  CalendarCheck,
  ShoppingBag,
  Bell
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  settings: BusinessSettings;
  activeView: string;
  onNavigate: (view: string, serviceSlug?: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activeView,
  onNavigate,
  onOpenAuth,
  unreadNotificationsCount,
}) => {
  const { currentUser, isAuthenticated, isAdmin, signOut, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Services', view: 'services' },
    { label: 'How It Works', view: 'how-it-works' },
    { label: 'About Us', view: 'about' },
    { label: 'Reviews', view: 'testimonials' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs transition-all">
      {/* Top Demo Bar Helper for Reviewers/Evaluators */}
      <div className="bg-[#142B4A] text-xs text-white/90 py-1.5 px-4 sm:px-8 flex items-center justify-between text-center border-b border-white/10">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-[#19B8A5]"></span>
          <span className="font-medium text-slate-200">
            {settings.slogan}
          </span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline text-white/70">
            WhatsApp Hotline: {settings.display_phone}
          </span>
        </div>

        {/* Quick Role Tester Switcher */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-slate-300">Quick Switch:</span>
          <button
            onClick={() => switchDemoUser('customer')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              !isAdmin && isAuthenticated
                ? 'bg-[#19B8A5] text-[#142B4A] font-semibold'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Customer View
          </button>
          <button
            onClick={() => switchDemoUser('admin')}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              isAdmin
                ? 'bg-[#19B8A5] text-[#142B4A] font-semibold'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            Admin View
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center text-left group shrink-0 focus:outline-hidden cursor-pointer"
        >
          <BrandLogo variant="full" height={42} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNav(link.view)}
              className={`transition-colors whitespace-nowrap cursor-pointer hover:text-[#142B4A] ${
                activeView === link.view
                  ? 'text-[#142B4A] font-semibold border-b-2 border-[#19B8A5] pb-0.5'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Auth / Dashboard / Book a Service) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-medium text-slate-800"
              >
                <div className="w-7 h-7 rounded-full bg-[#142B4A] text-white flex items-center justify-center text-xs font-semibold">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900 leading-none truncate max-w-[120px]">
                    {currentUser?.full_name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                    {currentUser?.role === 'admin' ? 'Administrator' : 'Customer'}
                  </p>
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                )}
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {currentUser?.full_name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  </div>

                  {isAdmin ? (
                    <button
                      onClick={() => handleNav('admin')}
                      className="w-full text-left px-4 py-2 text-xs text-[#142B4A] hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#19B8A5]" />
                      Admin Dashboard
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    My Orders & Dashboard
                  </button>

                  <button
                    onClick={() => handleNav('dashboard-notifications')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-slate-400" />
                      Notifications
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleNav('dashboard-profile')}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#142B4A] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-2 text-xs font-semibold text-[#142B4A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Primary CTA: Book Me */}
          <button
            onClick={() => handleNav('book')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Me</span>
          </button>

          {/* Official Choice Laundry Logo in Top Right Corner */}
          <div
            className="pl-3 border-l border-slate-200 flex items-center shrink-0 cursor-pointer group"
            onClick={() => handleNav('home')}
            title="Choice Laundry Official Logo"
          >
            <img
              src="/assets/aistudio/choice-laundry-logo-4-monogram__2__ac1a1524.svg"
              alt="Choice Laundry Official Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Mobile Hamburger Toggle & Top Right Official Logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <img
            src="/assets/aistudio/choice-laundry-logo-4-monogram__2__ac1a1524.svg"
            alt="Choice Laundry Logo"
            className="h-7 w-auto object-contain mr-1 cursor-pointer"
            onClick={() => handleNav('home')}
          />
          <button
            onClick={() => handleNav('book')}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            Book Me
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3 duration-200">
          <div className="py-2 flex items-center justify-between border-b border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Quick switch:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  switchDemoUser('customer');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-slate-100 rounded text-slate-700 font-medium"
              >
                Customer
              </button>
              <button
                onClick={() => {
                  switchDemoUser('admin');
                  setMobileMenuOpen(false);
                }}
                className="px-2 py-1 bg-[#142B4A] text-white rounded font-medium"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNav(link.view)}
                className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeView === link.view
                    ? 'bg-[#EAF7F8] text-[#142B4A] font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{currentUser?.full_name}</p>
                    <p className="text-[10px] text-slate-500">{currentUser?.email}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#19B8A5]/20 text-[#142B4A] uppercase">
                    {currentUser?.role}
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#142B4A] bg-[#EAF7F8] rounded-lg flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#19B8A5]" />
                    Administrator Dashboard
                  </button>
                )}

                <button
                  onClick={() => handleNav('dashboard')}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    My Orders & Dashboard
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-white bg-[#142B4A] rounded-lg text-center"
                >
                  Register
                </button>
              </div>
            )}

            <button
              onClick={() => handleNav('book')}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] rounded-lg shadow-sm text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              Book a Service Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
