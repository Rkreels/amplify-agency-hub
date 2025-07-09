
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Global app state
  isLoading: boolean;
  currentUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
  } | null;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setLoading: (loading: boolean) => void;
  setUser: (user: AppState['currentUser']) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      currentUser: {
        id: '1',
        name: 'John Smith',
        email: 'john@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'admin'
      },
      notifications: [
        {
          id: '1',
          type: 'info',
          title: 'Welcome to GHL Clone',
          message: 'Your dashboard is ready to use',
          timestamp: new Date(),
          read: false
        }
      ],
      sidebarCollapsed: false,
      theme: 'light',
      
      setLoading: (loading) => set({ isLoading: loading }),
      setUser: (user) => set({ currentUser: user }),
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false
          },
          ...state.notifications
        ].slice(0, 50) // Keep only last 50 notifications
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme
      })
    }
  )
);
