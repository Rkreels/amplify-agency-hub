
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface SubAccount {
  id: string;
  name: string;
  type: 'agency' | 'client';
  logo?: string;
  permissions: string[];
  settings: {
    timezone: string;
    currency: string;
    businessHours: string;
  };
  stats: {
    contacts: number;
    revenue: number;
    campaigns: number;
    appointments: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  currentSubAccount: string;
  accessibleAccounts: string[];
}

interface SubAccountContextType {
  currentUser: User | null;
  currentSubAccount: SubAccount | null;
  subAccounts: SubAccount[];
  switchSubAccount: (accountId: string) => void;
  hasPermission: (permission: string) => boolean;
  updateSubAccount: (accountId: string, updates: Partial<SubAccount>) => void;
}

const SubAccountContext = createContext<SubAccountContextType | undefined>(undefined);

// Mock data for 5 sub-accounts
const mockSubAccounts: SubAccount[] = [
  {
    id: 'agency-main',
    name: 'Main Agency',
    type: 'agency',
    permissions: ['all'],
    settings: { timezone: 'UTC-8', currency: 'USD', businessHours: '9-5' },
    stats: { contacts: 2847, revenue: 127350, campaigns: 24, appointments: 18 }
  },
  {
    id: 'client-realestate',
    name: 'Premium Real Estate',
    type: 'client',
    permissions: ['contacts', 'campaigns', 'calendar', 'pipeline'],
    settings: { timezone: 'UTC-5', currency: 'USD', businessHours: '8-6' },
    stats: { contacts: 1523, revenue: 85000, campaigns: 12, appointments: 32 }
  },
  {
    id: 'client-fitness',
    name: 'FitLife Gym',
    type: 'client',
    permissions: ['contacts', 'calendar', 'marketing'],
    settings: { timezone: 'UTC-6', currency: 'USD', businessHours: '6-10' },
    stats: { contacts: 892, revenue: 45000, campaigns: 8, appointments: 67 }
  },
  {
    id: 'client-restaurant',
    name: 'Gourmet Bistro',
    type: 'client',
    permissions: ['contacts', 'calendar', 'reviews'],
    settings: { timezone: 'UTC-7', currency: 'USD', businessHours: '11-11' },
    stats: { contacts: 634, revenue: 32000, campaigns: 5, appointments: 23 }
  },
  {
    id: 'client-ecommerce',
    name: 'TechStore Pro',
    type: 'client',
    permissions: ['contacts', 'campaigns', 'automation', 'analytics'],
    settings: { timezone: 'UTC-8', currency: 'USD', businessHours: '24/7' },
    stats: { contacts: 3421, revenue: 156000, campaigns: 18, appointments: 12 }
  }
];

const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  currentSubAccount: 'agency-main',
  accessibleAccounts: ['agency-main', 'client-realestate', 'client-fitness', 'client-restaurant', 'client-ecommerce']
};

export function SubAccountProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>(mockSubAccounts);
  
  const currentSubAccount = subAccounts.find(account => 
    account.id === currentUser?.currentSubAccount
  ) || null;

  const switchSubAccount = (accountId: string) => {
    if (!currentUser?.accessibleAccounts.includes(accountId)) {
      toast.error('You do not have access to this account');
      return;
    }

    setCurrentUser(prev => prev ? { ...prev, currentSubAccount: accountId } : null);
    const account = subAccounts.find(acc => acc.id === accountId);
    toast.success(`Switched to ${account?.name}`);
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentSubAccount || !currentUser) return false;
    
    // Admin and agency accounts have all permissions
    if (currentUser.role === 'admin' || currentSubAccount.type === 'agency') {
      return true;
    }

    return currentSubAccount.permissions.includes(permission) || 
           currentSubAccount.permissions.includes('all');
  };

  const updateSubAccount = (accountId: string, updates: Partial<SubAccount>) => {
    setSubAccounts(prev => prev.map(account => 
      account.id === accountId ? { ...account, ...updates } : account
    ));
  };

  return (
    <SubAccountContext.Provider value={{
      currentUser,
      currentSubAccount,
      subAccounts,
      switchSubAccount,
      hasPermission,
      updateSubAccount
    }}>
      {children}
    </SubAccountContext.Provider>
  );
}

export const useSubAccount = () => {
  const context = useContext(SubAccountContext);
  if (context === undefined) {
    throw new Error('useSubAccount must be used within a SubAccountProvider');
  }
  return context;
};
