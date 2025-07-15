
import React from 'react';
import { Sidebar } from './Sidebar';
import { MainNav } from './MainNav';
import { UserAccountNav } from './UserAccountNav';
import { SubAccountSwitcher } from './SubAccountSwitcher';
import { useSubAccountSync } from '@/hooks/useSubAccountSync';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // Sync store data with sub-account changes
  useSubAccountSync();
  const location = useLocation();
  
  // Check if we're in the page builder
  const isPageBuilder = location.pathname.includes('/page-builder') || 
                       location.search.includes('builder=true');

  if (isPageBuilder) {
    // Full screen mode for page builder
    return (
      <div className="h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center gap-4">
            <div className="w-64">
              <SubAccountSwitcher />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MainNav />
            <UserAccountNav />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
