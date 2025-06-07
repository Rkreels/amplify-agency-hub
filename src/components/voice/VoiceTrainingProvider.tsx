
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, X } from 'lucide-react';

interface VoiceTrainingContextType {
  isTrainingMode: boolean;
  startContextualTraining: (context: string, element?: string) => void;
  endTraining: () => void;
  announceFeature: (feature: string, description: string) => void;
}

const VoiceTrainingContext = createContext<VoiceTrainingContextType | null>(null);

export function useVoiceTraining() {
  const context = useContext(VoiceTrainingContext);
  if (!context) {
    throw new Error('useVoiceTraining must be used within VoiceTrainingProvider');
  }
  return context;
}

export function VoiceTrainingProvider({ children }: { children: React.ReactNode }) {
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [currentContext, setCurrentContext] = useState<string>('');
  const synthRef = React.useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use female voice if available
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('karen')
    ) || voices[0];
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    synthRef.current.speak(utterance);
  };

  const startContextualTraining = (context: string, element?: string) => {
    setIsTrainingMode(true);
    setCurrentContext(context);
    
    const contextMessages: Record<string, string> = {
      'contacts': 'Welcome to the Contacts section. Here you can manage all your leads, prospects, and customers. You can create new contacts, edit existing ones, and organize them with custom fields.',
      'dashboard': 'This is your Dashboard overview. Here you can see key metrics, recent activities, and important widgets to monitor your business performance.',
      'automation': 'Welcome to Automation. This powerful feature lets you create workflows that automatically handle lead nurturing, follow-ups, and customer communications.',
      'marketing': 'This is the Marketing section where you can create and manage SMS campaigns, email sequences, and other marketing activities.',
      'calendars': 'Welcome to Calendar management. Here you can set up appointment types, manage availability, and handle booking integrations.',
      'messaging': 'This is the Messaging hub for SMS campaigns, A2P compliance, and automated communications.',
      'sites': 'Welcome to Sites and Funnels. Here you can build landing pages, sales funnels, and manage conditional visibility features.',
      'crm': 'This is your CRM pipeline where you can track opportunities, manage deals, and monitor your sales process.',
      'conversations': 'Welcome to Conversations. This unified inbox handles all customer communications across different channels.'
    };

    const message = contextMessages[context] || `Welcome to the ${context} section. Let me guide you through this feature.`;
    speak(message);
  };

  const announceFeature = (feature: string, description: string) => {
    if (isTrainingMode) {
      speak(`${feature}. ${description}`);
    }
  };

  const endTraining = () => {
    setIsTrainingMode(false);
    setCurrentContext('');
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return (
    <VoiceTrainingContext.Provider 
      value={{ 
        isTrainingMode, 
        startContextualTraining, 
        endTraining, 
        announceFeature 
      }}
    >
      {children}
      
      {/* Voice Training Overlay */}
      {isTrainingMode && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-2">
          <Headphones className="h-4 w-4" />
          <span className="text-sm font-medium">Voice Training Active</span>
          <Button size="sm" variant="ghost" onClick={endTraining} className="text-white hover:bg-blue-700">
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </VoiceTrainingContext.Provider>
  );
}
