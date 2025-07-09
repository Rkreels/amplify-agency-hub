
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

interface VoiceTrainingContextType {
  isTrainingMode: boolean;
  currentContext: string | null;
  startContextualTraining: (context: string) => void;
  stopTraining: () => void;
  announceFeature: (title: string, description: string) => void;
  announceNavigation: (section: string) => void;
}

const VoiceTrainingContext = createContext<VoiceTrainingContextType | undefined>(undefined);

export function VoiceTrainingProvider({ children }: { children: React.ReactNode }) {
  const { speak, stop, isSpeaking } = useTTS();
  const { addNotification } = useAppStore();
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [currentContext, setCurrentContext] = useState<string | null>(null);

  const contextualTrainingContent = {
    dashboard: {
      title: 'Dashboard Overview',
      content: 'Welcome to your dashboard! Here you can view key metrics like total revenue, contacts, and appointments. Use the navigation sidebar to access different modules. The dashboard updates in real-time to show your business performance.'
    },
    contacts: {
      title: 'Contact Management',
      content: 'In the contacts section, you can add, edit, and organize your contacts. Use the search bar to find specific contacts, apply filters by status, and manage contact details. Click "Add Contact" to create new contacts with all necessary information.'
    },
    calendar: {
      title: 'Calendar & Appointments',
      content: 'The calendar helps you schedule and manage appointments. You can create appointment types, set availability, and book meetings. Use the calendar view to see upcoming appointments and manage your schedule efficiently.'
    },
    conversations: {
      title: 'Conversation Management',
      content: 'Manage all customer communications in one place. View messages from different channels, assign conversations to team members, and track response times. Use automated responses to handle common inquiries faster.'
    },
    automation: {
      title: 'Marketing Automation',
      content: 'Create powerful automated workflows using the visual builder. Set up triggers, conditions, and actions to automate your marketing processes. Monitor campaign performance and optimize for better results.'
    },
    opportunities: {
      title: 'Sales Pipeline',
      content: 'Track your sales opportunities through different stages. Manage deals, forecast revenue, and monitor conversion rates. Use the pipeline view to visualize your sales process and identify bottlenecks.'
    },
    marketing: {
      title: 'Marketing Hub',
      content: 'Launch and manage marketing campaigns across multiple channels. Create email campaigns, SMS marketing, and social media content. Track campaign performance and optimize for better engagement.'
    },
    payments: {
      title: 'Payment Management',
      content: 'Handle invoicing and payment processing. Create professional invoices, track payment status, and manage recurring billing. Monitor your revenue and financial metrics in real-time.'
    },
    settings: {
      title: 'System Settings',
      content: 'Configure your account settings, team management, and system preferences. Set up integrations, customize notifications, and manage security settings. Update your profile and business information here.'
    }
  };

  const startContextualTraining = useCallback((context: string) => {
    const trainingContent = contextualTrainingContent[context as keyof typeof contextualTrainingContent];
    if (!trainingContent) {
      toast.error(`No training content available for ${context}`);
      return;
    }

    setIsTrainingMode(true);
    setCurrentContext(context);
    
    const fullContent = `${trainingContent.title}. ${trainingContent.content}`;
    speak(fullContent);
    
    toast.success(`Voice training started for ${trainingContent.title}`);
    addNotification({
      type: 'info',
      title: 'Voice Training Active',
      message: `Learning about ${trainingContent.title}`
    });
  }, [speak, addNotification]);

  const stopTraining = useCallback(() => {
    stop();
    setIsTrainingMode(false);
    setCurrentContext(null);
    toast.success('Voice training stopped');
  }, [stop]);

  const announceFeature = useCallback((title: string, description: string) => {
    if (!isTrainingMode) return;
    
    const content = `${title}. ${description}`;
    speak(content);
  }, [speak, isTrainingMode]);

  const announceNavigation = useCallback((section: string) => {
    if (!isTrainingMode) return;
    
    speak(`Navigating to ${section} section`);
  }, [speak, isTrainingMode]);

  const value = {
    isTrainingMode,
    currentContext,
    startContextualTraining,
    stopTraining,
    announceFeature,
    announceNavigation
  };

  return (
    <VoiceTrainingContext.Provider value={value}>
      {children}
    </VoiceTrainingContext.Provider>
  );
}

export function useVoiceTraining() {
  const context = useContext(VoiceTrainingContext);
  if (context === undefined) {
    // Return a mock implementation instead of throwing an error
    return {
      isTrainingMode: false,
      currentContext: null,
      startContextualTraining: () => {},
      stopTraining: () => {},
      announceFeature: () => {},
      announceNavigation: () => {}
    };
  }
  return context;
}
