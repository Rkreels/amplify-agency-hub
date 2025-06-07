
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Headphones, X } from 'lucide-react';

interface VoiceTrainingContextType {
  isTrainingMode: boolean;
  startContextualTraining: (context: string, element?: string) => void;
  endTraining: () => void;
  announceFeature: (feature: string, description: string) => void;
  currentTrainingContext: string;
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
  const [currentTrainingContext, setCurrentTrainingContext] = useState<string>('');
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
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('zira')
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
    setCurrentTrainingContext(context);
    
    const contextMessages: Record<string, string> = {
      'contacts': 'Welcome to the Contacts section. This is your customer database where you can manage all your leads, prospects, and customers. You can create new contacts by clicking the "Add Contact" button, edit existing ones by clicking on their name, and organize them using tags and custom fields. Use the search and filter options to find specific contacts quickly.',
      
      'dashboard': 'This is your Dashboard overview, your command center for monitoring business performance. Here you can see key metrics like total leads, conversion rates, and revenue. The widgets show recent activities, sales pipeline progress, and upcoming tasks. You can customize this dashboard by adding or removing widgets to focus on the metrics that matter most to your business.',
      
      'automation': 'Welcome to Automation, the most powerful feature in GoHighLevel. Here you can create workflows that automatically handle lead nurturing, follow-ups, and customer communications. Start by choosing a trigger like form submission or tag addition, then add actions like sending emails or SMS. Connect them to create sophisticated automation sequences.',
      
      'marketing': 'This is the Marketing section where you create and manage all your marketing campaigns. You can build email campaigns using our drag-and-drop editor, send SMS campaigns to your contact lists, and track the performance of all your marketing efforts. Use segments to target specific groups of contacts with personalized messages.',
      
      'calendars': 'Welcome to Calendar management. Here you can set up appointment types for different services, configure your availability for each day of the week, and manage booking integrations. Clients can book appointments through your booking page, and you\'ll receive automatic notifications and reminders.',
      
      'messaging': 'This is the Messaging hub where you manage all customer communications. The unified inbox shows emails, SMS messages, and social media messages in one place. You can set up automated responses, assign conversations to team members, and track the complete communication history with each contact.',
      
      'sites': 'Welcome to Sites and Funnels, your website building toolkit. Here you can create landing pages, sales funnels, and complete websites using our drag-and-drop editor. Choose from professional templates or build from scratch. Add forms to capture leads and integrate them with your automation workflows.',
      
      'crm': 'This is your CRM pipeline where you track opportunities and manage your sales process. Create opportunities for qualified leads, set deal values and expected close dates, and move them through pipeline stages as they progress. Use the visual pipeline view to see your sales progress at a glance.',
      
      'conversations': 'Welcome to Conversations, your unified communication center. This inbox handles all customer communications across different channels - email, SMS, Facebook Messenger, and more. Each conversation shows the complete history with a contact, and you can respond directly from here.',
      
      'phone-system': 'Welcome to the Phone System. Here you can manage call tracking numbers, set up call forwarding, and monitor call analytics. You can record calls for training purposes and integrate phone interactions with your CRM data to get a complete view of customer communications.',
      
      'reputation': 'This is Reputation Management where you monitor and improve your online reputation. Track reviews from Google, Facebook, and other platforms automatically. Set up review request campaigns to generate more positive reviews and respond quickly to feedback.',
      
      'reporting': 'Welcome to Reporting and Analytics. Here you can track the performance of all your marketing campaigns, sales activities, and business metrics. Create custom reports to analyze what\'s working best and make data-driven decisions to grow your business.',
      
      'settings': 'This is the Settings area where you configure your GoHighLevel account. You can manage team members, set up integrations, configure notification preferences, and customize the platform to match your business needs.'
    };

    const message = contextMessages[context] || `Welcome to the ${context} section. Let me guide you through this feature and explain how to use it effectively for your business.`;
    speak(message);
  };

  const announceFeature = (feature: string, description: string) => {
    if (isTrainingMode) {
      speak(`${feature}. ${description}`);
    }
  };

  const endTraining = () => {
    setIsTrainingMode(false);
    setCurrentTrainingContext('');
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
        announceFeature,
        currentTrainingContext
      }}
    >
      {children}
      
      {/* Voice Training Overlay */}
      {isTrainingMode && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Headphones className="h-4 w-4" />
          <span className="text-sm font-medium">
            Voice Training Active - {currentTrainingContext}
          </span>
          <Button size="sm" variant="ghost" onClick={endTraining} className="text-white hover:bg-blue-700">
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </VoiceTrainingContext.Provider>
  );
}
