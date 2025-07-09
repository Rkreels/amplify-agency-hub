
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface VoiceTrainingContextType {
  isTrainingMode: boolean;
  currentFeature: string | null;
  voiceEnabled: boolean;
  speechRate: number;
  speechVolume: number;
  isCurrentlySpeaking: boolean;
  startTraining: () => void;
  stopTraining: () => void;
  announceFeature: (featureName: string, description: string) => void;
  startContextualTraining: (context: string) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setSpeechVolume: (volume: number) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const VoiceTrainingContext = createContext<VoiceTrainingContextType | undefined>(undefined);

export function VoiceTrainingProvider({ children }: { children: React.ReactNode }) {
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechVolume, setSpeechVolume] = useState(0.8);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !text.trim()) return;

    // Stop any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a female voice or use the first available voice
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('susan')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    
    utterance.rate = speechRate;
    utterance.volume = speechVolume;
    utterance.pitch = 1.1; // Slightly higher pitch for female voice
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsCurrentlySpeaking(true);
    utterance.onend = () => setIsCurrentlySpeaking(false);
    utterance.onerror = () => {
      setIsCurrentlySpeaking(false);
      console.error('Speech synthesis error');
    };

    speechSynthesis.speak(utterance);
  }, [voiceEnabled, speechRate, speechVolume, voices]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsCurrentlySpeaking(false);
  }, []);

  const startTraining = useCallback(() => {
    setIsTrainingMode(true);
    speak('Voice training mode activated. I will guide you through using this application.');
  }, [speak]);

  const stopTraining = useCallback(() => {
    setIsTrainingMode(false);
    stopSpeaking();
    setCurrentFeature(null);
  }, [stopSpeaking]);

  const announceFeature = useCallback((featureName: string, description: string) => {
    if (!isTrainingMode && !voiceEnabled) return;
    
    setCurrentFeature(featureName);
    speak(description);
  }, [isTrainingMode, voiceEnabled, speak]);

  const startContextualTraining = useCallback((context: string) => {
    const contextualGuidance = {
      dashboard: 'Welcome to your dashboard. Here you can view key metrics, recent activities, and quick actions. The revenue card shows your total earnings, contacts card displays your customer base, campaigns card tracks active marketing efforts, and appointments card shows upcoming meetings.',
      contacts: 'This is the contacts page where you manage all your customer relationships. You can add new contacts using the Add Contact button, search existing contacts, filter by status or source, and view detailed contact information including lead scores and interaction history.',
      conversations: 'The conversations center allows you to manage all your communications in one place. You can view messages from SMS, email, and social media channels, respond to customer inquiries, and track conversation history.',
      calendar: 'The calendar helps you schedule and manage appointments. You can create new events, set reminders, invite attendees, and view your schedule in different formats including month, week, and day views.',
      opportunities: 'The opportunities page shows your sales pipeline. You can track deals through different stages, update opportunity values, add notes, and move prospects through your sales process using drag and drop.',
      marketing: 'Marketing tools allow you to create and manage campaigns. You can build email campaigns, schedule social media posts, track campaign performance, and segment your audience for targeted messaging.',
      automation: 'Automation workflows help you save time by automating repetitive tasks. You can create triggers, set conditions, and define actions to automatically nurture leads and follow up with prospects.',
      payments: 'The payments section helps you create invoices, track transactions, and manage your financial operations. You can generate professional invoices, send them to clients, and monitor payment status.',
      phone: 'The phone system allows you to make and receive calls directly from the platform. Call history is automatically logged, and you can add notes and schedule follow-ups after each call.',
      'ai-features': 'AI features help enhance your productivity with intelligent automation. You can generate content, get smart recommendations, and use AI-powered chatbots to handle customer inquiries.'
    };

    const guidance = contextualGuidance[context as keyof typeof contextualGuidance] || 
      'This section contains various tools and features to help you manage your business effectively.';
    
    speak(guidance);
  }, [speak]);

  const contextValue: VoiceTrainingContextType = {
    isTrainingMode,
    currentFeature,
    voiceEnabled,
    speechRate,
    speechVolume,
    isCurrentlySpeaking,
    startTraining,
    stopTraining,
    announceFeature,
    startContextualTraining,
    setVoiceEnabled,
    setSpeechRate,
    setSpeechVolume,
    speak,
    stopSpeaking
  };

  return (
    <VoiceTrainingContext.Provider value={contextValue}>
      {children}
    </VoiceTrainingContext.Provider>
  );
}

export function useVoiceTraining() {
  const context = useContext(VoiceTrainingContext);
  if (context === undefined) {
    throw new Error('useVoiceTraining must be used within a VoiceTrainingProvider');
  }
  return context;
}
