import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile, UserRole } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
  currentUser: CustomerProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<CustomerProfile>) => CustomerProfile | null;
  switchDemoUser: (role: UserRole) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    // Default to the demo customer initially for pleasant out-of-the-box exploration
    const savedUserId = localStorage.getItem('cls_active_user_id');
    const profiles = storage.getProfiles();

    if (savedUserId) {
      const found = profiles.find(p => p.id === savedUserId);
      if (found) {
        setCurrentUser(found);
        return;
      }
    }

    // Default to customer-1
    const defaultCustomer = profiles.find(p => p.id === 'usr-customer-1') || profiles[0] || null;
    if (defaultCustomer) {
      setCurrentUser(defaultCustomer);
      localStorage.setItem('cls_active_user_id', defaultCustomer.id);
    }
  }, []);

  const signIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const profile = storage.getProfileByEmail(cleanEmail);

    if (!profile) {
      // In production with Supabase Auth, invalid credentials message:
      return { success: false, error: 'No account found with this email. Please check your spelling or create an account.' };
    }

    setCurrentUser(profile);
    localStorage.setItem('cls_active_user_id', profile.id);
    return { success: true };
  };

  const signUp = async (data: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    address?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = storage.getProfileByEmail(cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please sign in instead.' };
    }

    const newProfile: CustomerProfile = {
      id: `usr-${Date.now()}`,
      full_name: data.fullName.trim(),
      email: cleanEmail,
      phone_number: data.phone.trim(),
      whatsapp_number: (data.whatsapp || data.phone).trim().replace(/\D/g, ''),
      default_pickup_address: data.address?.trim() || '',
      default_pickup_instructions: '',
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    storage.saveProfile(newProfile);
    setCurrentUser(newProfile);
    localStorage.setItem('cls_active_user_id', newProfile.id);

    // Initial welcome notification
    storage.createNotification({
      customer_id: newProfile.id,
      title: 'Welcome to Choice Laundry Services!',
      message: `Welcome, ${newProfile.full_name}! Your customer profile is active. Book your first pickup with ease anytime.`,
      notification_type: 'general',
      is_read: false,
    });

    return { success: true };
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('cls_active_user_id');
  };

  const updateProfile = (updates: Partial<CustomerProfile>): CustomerProfile | null => {
    if (!currentUser) return null;
    const updated = storage.saveProfile({
      ...currentUser,
      ...updates,
      // prevent customer from escalating role to admin
      role: currentUser.role,
    });
    setCurrentUser(updated);
    return updated;
  };

  const switchDemoUser = (role: UserRole) => {
    const profiles = storage.getProfiles();
    const target = profiles.find(p => p.role === role);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('cls_active_user_id', target.id);
    }
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const profile = storage.getProfileByEmail(cleanEmail);
    if (!profile) {
      return { success: false, message: 'If an account exists with that email, a password recovery link has been dispatched.' };
    }
    return { success: true, message: `A secure password reset link has been dispatched to ${email}. Check your inbox shortly.` };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        signIn,
        signUp,
        signOut,
        updateProfile,
        switchDemoUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
