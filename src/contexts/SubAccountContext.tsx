
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
  contacts?: any[];
  conversations?: any[];
  opportunities?: any[];
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
  getCurrentSubAccountData: () => any;
}

const SubAccountContext = createContext<SubAccountContextType | undefined>(undefined);

// Enhanced mock data with different data sets for each sub-account
const mockSubAccounts: SubAccount[] = [
  {
    id: 'agency-main',
    name: 'Main Agency',
    type: 'agency',
    permissions: ['all'],
    settings: { timezone: 'UTC-8', currency: 'USD', businessHours: '9-5' },
    stats: { contacts: 2847, revenue: 127350, campaigns: 24, appointments: 18 },
    contacts: [
      { id: '1', firstName: 'John', lastName: 'Smith', email: 'john@agency.com', status: 'customer' },
      { id: '2', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@agency.com', status: 'lead' }
    ],
    conversations: [
      { id: '1', contactName: 'John Smith', channel: 'email', lastMessage: 'Agency conversation' },
      { id: '2', contactName: 'Sarah Johnson', channel: 'sms', lastMessage: 'Follow up needed' }
    ]
  },
  {
    id: 'client-realestate',
    name: 'Premium Real Estate',
    type: 'client',
    permissions: ['contacts', 'campaigns', 'calendar', 'pipeline'],
    settings: { timezone: 'UTC-5', currency: 'USD', businessHours: '8-6' },
    stats: { contacts: 1523, revenue: 85000, campaigns: 12, appointments: 32 },
    contacts: [
      { id: '3', firstName: 'Mike', lastName: 'Wilson', email: 'mike@realestate.com', status: 'prospect' },
      { id: '4', firstName: 'Lisa', lastName: 'Brown', email: 'lisa@realestate.com', status: 'customer' }
    ],
    conversations: [
      { id: '3', contactName: 'Mike Wilson', channel: 'whatsapp', lastMessage: 'Property inquiry' },
      { id: '4', contactName: 'Lisa Brown', channel: 'sms', lastMessage: 'Closing documents ready' }
    ]
  },
  {
    id: 'client-fitness',
    name: 'FitLife Gym',
    type: 'client',
    permissions: ['contacts', 'calendar', 'marketing'],
    settings: { timezone: 'UTC-6', currency: 'USD', businessHours: '6-10' },
    stats: { contacts: 892, revenue: 45000, campaigns: 8, appointments: 67 },
    contacts: [
      { id: '5', firstName: 'David', lastName: 'Lee', email: 'david@fitlife.com', status: 'lead' },
      { id: '6', firstName: 'Emma', lastName: 'Taylor', email: 'emma@fitlife.com', status: 'customer' }
    ],
    conversations: [
      { id: '5', contactName: 'David Lee', channel: 'facebook', lastMessage: 'Membership inquiry' },
      { id: '6', contactName: 'Emma Taylor', channel: 'instagram', lastMessage: 'Class schedule question' }
    ]
  },
  {
    id: 'client-restaurant',
    name: 'Gourmet Bistro',
    type: 'client',
    permissions: ['contacts', 'calendar', 'reviews'],
    settings: { timezone: 'UTC-7', currency: 'USD', businessHours: '11-11' },
    stats: { contacts: 634, revenue: 32000, campaigns: 5, appointments: 23 },
    contacts: [
      { id: '7', firstName: 'Carlos', lastName: 'Martinez', email: 'carlos@bistro.com', status: 'customer' },
      { id: '8', firstName: 'Anna', lastName: 'Davis', email: 'anna@bistro.com', status: 'lead' }
    ],
    conversations: [
      { id: '7', contactName: 'Carlos Martinez', channel: 'email', lastMessage: 'Reservation confirmed' },
      { id: '8', contactName: 'Anna Davis', channel: 'sms', lastMessage: 'Menu question' }
    ]
  },
  {
    id: 'client-ecommerce',
    name: 'TechStore Pro',
    type: 'client',
    permissions: ['contacts', 'campaigns', 'automation', 'analytics'],
    settings: { timezone: 'UTC-8', currency: 'USD', businessHours: '24/7' },
    stats: { contacts: 3421, revenue: 156000, campaigns: 18, appointments: 12 },
    contacts: [
      { id: '9', firstName: 'Robert', lastName: 'Chen', email: 'robert@techstore.com', status: 'prospect' },
      { id: '10', firstName: 'Jessica', lastName: 'Miller', email: 'jessica@techstore.com', status: 'customer' }
    ],
    conversations: [
      { id: '9', contactName: 'Robert Chen', channel: 'webchat', lastMessage: 'Product support needed' },
      { id: '10', contactName: 'Jessica Miller', channel: 'email', lastMessage: 'Order shipped' }
    ]
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
    
    // Force a re-render of components that depend on sub-account data
    window.dispatchEvent(new CustomEvent('subAccountChanged', { detail: { accountId } }));
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

  const getCurrentSubAccountData = () => {
    return {
      contacts: currentSubAccount?.contacts || [],
      conversations: currentSubAccount?.conversations || [],
      opportunities: currentSubAccount?.opportunities || [],
      stats: currentSubAccount?.stats || { contacts: 0, revenue: 0, campaigns: 0, appointments: 0 }
    };
  };

  return (
    <SubAccountContext.Provider value={{
      currentUser,
      currentSubAccount,
      subAccounts,
      switchSubAccount,
      hasPermission,
      updateSubAccount,
      getCurrentSubAccountData
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
