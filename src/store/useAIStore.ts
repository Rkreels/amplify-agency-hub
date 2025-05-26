
import { create } from 'zustand';

export interface AIConversationResponse {
  id: string;
  conversationId: string;
  originalMessage: string;
  aiResponse: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
  timestamp: Date;
  wasHelpful?: boolean;
}

export interface AIWorkflowAction {
  id: string;
  type: 'ai_decision' | 'ai_response' | 'ai_content_generation' | 'ai_scoring';
  config: {
    prompt?: string;
    model?: string;
    parameters?: Record<string, any>;
  };
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

export interface AILeadScore {
  id: string;
  contactId: string;
  score: number;
  factors: Array<{
    factor: string;
    weight: number;
    value: any;
    contribution: number;
  }>;
  lastUpdated: Date;
  confidence: number;
}

export interface AIGeneratedContent {
  id: string;
  type: 'email' | 'sms' | 'social_post' | 'ad_copy';
  prompt: string;
  content: string;
  variations: string[];
  tone: string;
  audience: string;
  metrics?: {
    readability: number;
    sentiment: number;
    engagement_prediction: number;
  };
  createdAt: Date;
}

export interface AIVoiceAssistant {
  id: string;
  name: string;
  voice: string;
  language: string;
  personality: string;
  features: {
    appointment_booking: boolean;
    lead_qualification: boolean;
    information_gathering: boolean;
    call_routing: boolean;
  };
  isActive: boolean;
}

export interface AIChatbot {
  id: string;
  name: string;
  type: 'website' | 'facebook' | 'instagram' | 'whatsapp';
  personality: string;
  knowledgeBase: string[];
  responses: Record<string, string>;
  isActive: boolean;
  analytics: {
    conversations: number;
    resolution_rate: number;
    satisfaction_score: number;
  };
}

export interface AIAnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  createdAt: Date;
}

export interface AIAppointmentScheduling {
  id: string;
  contactId: string;
  suggestedTimes: Date[];
  preferences: {
    timezone: string;
    preferred_duration: number;
    preferred_times: string[];
    avoid_times: string[];
  };
  autoConfirm: boolean;
  reasoning: string;
}

export interface AISocialMediaPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  hashtags: string[];
  scheduledAt: Date;
  performance_prediction: {
    engagement_score: number;
    reach_estimate: number;
    best_posting_time: Date;
  };
  generated: boolean;
}

export interface AIReputationResponse {
  id: string;
  reviewId: string;
  platform: string;
  originalReview: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  aiResponse: string;
  tone: 'professional' | 'friendly' | 'apologetic' | 'grateful';
  posted: boolean;
  reviewerHistory?: Record<string, any>;
}

interface AIStore {
  // Conversation Responses
  conversationResponses: AIConversationResponse[];
  isGeneratingResponse: boolean;
  
  // Workflow Automation
  aiWorkflowActions: AIWorkflowAction[];
  
  // Lead Scoring
  leadScores: AILeadScore[];
  scoringModel: string;
  
  // Content Generation
  generatedContent: AIGeneratedContent[];
  isGeneratingContent: boolean;
  
  // Voice Assistants
  voiceAssistants: AIVoiceAssistant[];
  activeVoiceCall: string | null;
  
  // Chatbots
  chatbots: AIChatbot[];
  
  // Analytics
  analyticsInsights: AIAnalyticsInsight[];
  
  // Appointment Scheduling
  aiAppointments: AIAppointmentScheduling[];
  
  // Social Media
  aiSocialPosts: AISocialMediaPost[];
  
  // Reputation Management
  reputationResponses: AIReputationResponse[];
  
  // Actions
  generateConversationResponse: (message: string, conversationId: string) => Promise<AIConversationResponse>;
  addAIWorkflowAction: (action: Omit<AIWorkflowAction, 'id'>) => void;
  updateLeadScore: (contactId: string) => Promise<AILeadScore>;
  generateContent: (type: string, prompt: string, options?: Record<string, any>) => Promise<AIGeneratedContent>;
  createVoiceAssistant: (assistant: Omit<AIVoiceAssistant, 'id'>) => void;
  createChatbot: (chatbot: Omit<AIChatbot, 'id'>) => void;
  generateInsights: (dataType: string, timeframe: string) => Promise<AIAnalyticsInsight[]>;
  scheduleAppointmentWithAI: (contactId: string, preferences: any) => Promise<AIAppointmentScheduling>;
  generateSocialMediaPost: (platform: string, topic: string, tone: string) => Promise<AISocialMediaPost>;
  generateReputationResponse: (reviewId: string, reviewText: string, sentiment: string) => Promise<AIReputationResponse>;
}

// Mock implementations for demo purposes
export const useAIStore = create<AIStore>((set, get) => ({
  conversationResponses: [],
  isGeneratingResponse: false,
  aiWorkflowActions: [],
  leadScores: [],
  scoringModel: 'advanced_ml_v2',
  generatedContent: [],
  isGeneratingContent: false,
  voiceAssistants: [
    {
      id: '1',
      name: 'Sarah - Sales Assistant',
      voice: 'female_professional',
      language: 'en-US',
      personality: 'professional_friendly',
      features: {
        appointment_booking: true,
        lead_qualification: true,
        information_gathering: true,
        call_routing: false
      },
      isActive: true
    }
  ],
  chatbots: [
    {
      id: '1',
      name: 'Website Assistant',
      type: 'website',
      personality: 'helpful_professional',
      knowledgeBase: ['products', 'pricing', 'support'],
      responses: {},
      isActive: true,
      analytics: {
        conversations: 456,
        resolution_rate: 85,
        satisfaction_score: 4.2
      }
    }
  ],
  analyticsInsights: [],
  aiAppointments: [],
  aiSocialPosts: [],
  reputationResponses: [],
  activeVoiceCall: null,

  generateConversationResponse: async (message: string, conversationId: string) => {
    set({ isGeneratingResponse: true });
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response: AIConversationResponse = {
      id: Date.now().toString(),
      conversationId,
      originalMessage: message,
      aiResponse: "Thank you for your message! I understand you're interested in our services. Let me connect you with the right person to help you.",
      confidence: 0.89,
      intent: 'information_request',
      entities: { product: 'services', sentiment: 'positive' },
      timestamp: new Date()
    };
    
    set(state => ({
      conversationResponses: [...state.conversationResponses, response],
      isGeneratingResponse: false
    }));
    
    return response;
  },

  addAIWorkflowAction: (action) => set(state => ({
    aiWorkflowActions: [...state.aiWorkflowActions, { ...action, id: Date.now().toString() }]
  })),

  updateLeadScore: async (contactId: string) => {
    const score: AILeadScore = {
      id: Date.now().toString(),
      contactId,
      score: Math.floor(Math.random() * 100),
      factors: [
        { factor: 'engagement', weight: 0.3, value: 'high', contribution: 25 },
        { factor: 'demographics', weight: 0.2, value: 'target_match', contribution: 18 },
        { factor: 'behavior', weight: 0.3, value: 'interested', contribution: 22 },
        { factor: 'firmographics', weight: 0.2, value: 'good_fit', contribution: 15 }
      ],
      lastUpdated: new Date(),
      confidence: 0.85
    };
    
    set(state => ({
      leadScores: [...state.leadScores.filter(s => s.contactId !== contactId), score]
    }));
    
    return score;
  },

  generateContent: async (type: string, prompt: string, options = {}) => {
    set({ isGeneratingContent: true });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const content: AIGeneratedContent = {
      id: Date.now().toString(),
      type: type as any,
      prompt,
      content: "Thank you for your interest in our services! We'd love to help you achieve your goals.",
      variations: [
        "We appreciate your interest! Let's discuss how we can help you succeed.",
        "Thanks for reaching out! We're excited to potentially work with you."
      ],
      tone: options.tone || 'professional',
      audience: options.audience || 'general',
      metrics: {
        readability: 85,
        sentiment: 0.8,
        engagement_prediction: 72
      },
      createdAt: new Date()
    };
    
    set(state => ({
      generatedContent: [...state.generatedContent, content],
      isGeneratingContent: false
    }));
    
    return content;
  },

  createVoiceAssistant: (assistant) => set(state => ({
    voiceAssistants: [...state.voiceAssistants, { ...assistant, id: Date.now().toString() }]
  })),

  createChatbot: (chatbot) => set(state => ({
    chatbots: [...state.chatbots, { ...chatbot, id: Date.now().toString() }]
  })),

  generateInsights: async (dataType: string, timeframe: string) => {
    const insights: AIAnalyticsInsight[] = [
      {
        id: Date.now().toString(),
        type: 'trend',
        title: 'Lead Quality Improvement',
        description: 'Lead quality has improved by 23% over the last 30 days',
        data: { improvement: 23, period: '30_days' },
        confidence: 0.92,
        impact: 'high',
        actionable: true,
        createdAt: new Date()
      }
    ];
    
    set(state => ({
      analyticsInsights: [...state.analyticsInsights, ...insights]
    }));
    
    return insights;
  },

  scheduleAppointmentWithAI: async (contactId: string, preferences: any) => {
    const appointment: AIAppointmentScheduling = {
      id: Date.now().toString(),
      contactId,
      suggestedTimes: [
        new Date(Date.now() + 24 * 60 * 60 * 1000),
        new Date(Date.now() + 48 * 60 * 60 * 1000),
        new Date(Date.now() + 72 * 60 * 60 * 1000)
      ],
      preferences,
      autoConfirm: false,
      reasoning: 'Based on your availability and the contact\'s timezone, these times work best.'
    };
    
    set(state => ({
      aiAppointments: [...state.aiAppointments, appointment]
    }));
    
    return appointment;
  },

  generateSocialMediaPost: async (platform: string, topic: string, tone: string) => {
    const post: AISocialMediaPost = {
      id: Date.now().toString(),
      platform: platform as any,
      content: `🚀 Exciting news! We're here to help you succeed. ${topic} #business #success`,
      hashtags: ['business', 'success', 'growth'],
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      performance_prediction: {
        engagement_score: 78,
        reach_estimate: 1250,
        best_posting_time: new Date(Date.now() + 2 * 60 * 60 * 1000)
      },
      generated: true
    };
    
    set(state => ({
      aiSocialPosts: [...state.aiSocialPosts, post]
    }));
    
    return post;
  },

  generateReputationResponse: async (reviewId: string, reviewText: string, sentiment: string) => {
    const response: AIReputationResponse = {
      id: Date.now().toString(),
      reviewId,
      platform: 'google',
      originalReview: reviewText,
      sentiment: sentiment as any,
      aiResponse: sentiment === 'positive' 
        ? "Thank you so much for your wonderful review! We're thrilled to hear about your positive experience."
        : "Thank you for your feedback. We take all reviews seriously and would love to discuss how we can improve your experience.",
      tone: sentiment === 'positive' ? 'grateful' : 'apologetic',
      posted: false
    };
    
    set(state => ({
      reputationResponses: [...state.reputationResponses, response]
    }));
    
    return response;
  }
}));
