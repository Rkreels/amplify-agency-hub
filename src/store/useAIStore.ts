import { create } from 'zustand';

export interface AIConversationResponse {
  id: string;
  conversationId: string;
  originalMessage: string;
  aiResponse: string;
  intent: string;
  confidence: number;
  timestamp: Date;
  wasUsed: boolean;
  feedback?: 'helpful' | 'not_helpful';
}

export interface AIWorkflowAction {
  id: string;
  workflowId: string;
  type: 'send_email' | 'send_sms' | 'create_task' | 'update_contact' | 'schedule_followup';
  conditions: Record<string, any>;
  parameters: Record<string, any>;
  isActive: boolean;
  executionCount: number;
  lastExecuted?: Date;
}

export interface LeadScore {
  id: string;
  contactId: string;
  score: number;
  factors: Array<{
    factor: string;
    contribution: number;
  }>;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: Date;
  predictions: {
    conversionProbability: number;
    timeToConvert: number;
    valueEstimate: number;
  };
}

export interface GeneratedContent {
  id: string;
  type: 'email' | 'sms' | 'social_post' | 'ad_copy' | 'blog_post';
  prompt: string;
  content: string;
  variations: string[];
  tone: 'professional' | 'casual' | 'friendly' | 'urgent' | 'promotional';
  audience: string;
  createdAt: Date;
  isUsed: boolean;
  metrics?: {
    readability: number;
    sentiment: number;
    engagement_prediction: number;
  };
  performance?: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
}

export interface VoiceAssistant {
  id: string;
  name: string;
  voice: string;
  language: string;
  personality: string;
  instructions: string;
  isActive: boolean;
  callsHandled: number;
  averageCallDuration: number;
  satisfactionScore: number;
  skills: string[];
  features: {
    appointment_booking: boolean;
    lead_qualification: boolean;
    information_gathering: boolean;
    call_routing: boolean;
  };
}

export interface AIChatbot {
  id: string;
  name: string;
  type: 'website' | 'facebook' | 'instagram' | 'whatsapp';
  platform: string;
  personality: string;
  knowledgeBase: string[];
  isActive: boolean;
  conversationsHandled: number;
  averageResponseTime: number;
  handoffRate: number;
  languages: string[];
  responses: Record<string, string>;
  analytics: {
    conversations: number;
    resolution_rate: number;
    satisfaction_score: number;
  };
}

export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'prediction';
  category: 'performance' | 'trends' | 'opportunities' | 'alerts';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  actionItems: string[];
  data: Record<string, any>;
  createdAt: Date;
}

export interface AIAppointment {
  id: string;
  contactId: string;
  scheduledBy: 'ai' | 'manual';
  confidence: number;
  suggestedTimes: Date[];
  selectedTime?: Date;
  status: 'suggested' | 'confirmed' | 'rescheduled' | 'cancelled';
  aiReasoning: string;
  reasoning: string;
  autoConfirm: boolean;
}

export interface AISocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  hashtags: string[];
  scheduledFor: Date;
  scheduledAt: Date;
  generatedFrom: string;
  generated: boolean;
  performance_prediction: {
    engagement_score: number;
    reach_estimate: string;
    best_posting_time: Date;
  };
  performance?: {
    reach: number;
    engagement: number;
    clicks: number;
  };
  status: 'draft' | 'scheduled' | 'published';
}

export interface ReputationResponse {
  id: string;
  reviewId: string;
  platform: 'google' | 'yelp' | 'facebook' | 'trustpilot';
  originalReview: string;
  suggestedResponse: string;
  aiResponse: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tone: 'professional' | 'apologetic' | 'grateful' | 'defensive';
  isUsed: boolean;
  posted: boolean;
  createdAt: Date;
}

interface AIStore {
  conversationResponses: AIConversationResponse[];
  aiWorkflowActions: AIWorkflowAction[];
  leadScores: LeadScore[];
  generatedContent: GeneratedContent[];
  voiceAssistants: VoiceAssistant[];
  chatbots: AIChatbot[];
  analyticsInsights: AnalyticsInsight[];
  aiAppointments: AIAppointment[];
  aiSocialPosts: AISocialPost[];
  reputationResponses: ReputationResponse[];
  isGeneratingResponse: boolean;
  isGeneratingContent: boolean;
  scoringModel: string;
  activeVoiceCall: any;
  
  // Actions
  generateConversationResponse: (lastMessage: string, conversationId: string) => Promise<void>;
  generateContent: (type: string, prompt: string, options: { tone: string; audience: string }) => Promise<{ id: string }>;
  updateLeadScore: (contactId: string) => Promise<void>;
  createVoiceAssistant: (assistant: Omit<VoiceAssistant, 'id'>) => void;
  updateVoiceAssistant: (id: string, updates: Partial<VoiceAssistant>) => void;
  createChatbot: (chatbot: Omit<AIChatbot, 'id'>) => void;
  updateChatbot: (id: string, updates: Partial<AIChatbot>) => void;
  generateInsights: (dataType: string, timeframe: string) => Promise<void>;
  scheduleAppointmentWithAI: (contactId: string, preferences: any) => Promise<void>;
  generateSocialMediaPost: (platform: string, topic: string, tone: string) => Promise<void>;
  generateReputationResponse: (reviewId: string, reviewText: string, sentiment: string) => Promise<void>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  conversationResponses: [
    {
      id: '1',
      conversationId: '1',
      originalMessage: 'What are your pricing options?',
      aiResponse: 'Thank you for your interest! Our pricing starts at $99/month for our basic package. Would you like me to schedule a call to discuss your specific needs?',
      intent: 'pricing_inquiry',
      confidence: 0.89,
      timestamp: new Date(),
      wasUsed: true,
      feedback: 'helpful'
    }
  ],
  aiWorkflowActions: [
    {
      id: '1',
      workflowId: 'welcome-sequence',
      type: 'send_email',
      conditions: { trigger: 'new_contact' },
      parameters: { templateId: 'welcome-email', delay: 0 },
      isActive: true,
      executionCount: 156,
      lastExecuted: new Date()
    }
  ],
  leadScores: [
    {
      id: '1',
      contactId: '1',
      score: 85,
      factors: [
        { factor: 'engagement', contribution: 25 },
        { factor: 'demographics', contribution: 20 },
        { factor: 'behavior', contribution: 25 },
        { factor: 'firmographic', contribution: 15 }
      ],
      confidence: 0.92,
      trend: 'increasing',
      lastUpdated: new Date(),
      predictions: {
        conversionProbability: 0.78,
        timeToConvert: 14,
        valueEstimate: 5000
      }
    }
  ],
  generatedContent: [
    {
      id: '1',
      type: 'email',
      prompt: 'Welcome email for new subscribers',
      content: 'Welcome to our community! We\'re excited to have you on board.',
      variations: [
        'Welcome aboard! Thanks for joining our community.',
        'Thanks for subscribing! We can\'t wait to share amazing content with you.'
      ],
      tone: 'friendly',
      audience: 'new_subscribers',
      createdAt: new Date(),
      isUsed: true,
      metrics: {
        readability: 87,
        sentiment: 0.85,
        engagement_prediction: 74
      },
      performance: {
        impressions: 1250,
        clicks: 89,
        conversions: 12
      }
    }
  ],
  voiceAssistants: [
    {
      id: '1',
      name: 'Sarah - Sales Assistant',
      voice: 'female-professional',
      language: 'en-US',
      personality: 'Professional and helpful',
      instructions: 'Handle inbound sales calls, qualify leads, and schedule appointments',
      isActive: true,
      callsHandled: 245,
      averageCallDuration: 4.2,
      satisfactionScore: 4.6,
      skills: ['lead_qualification', 'appointment_scheduling', 'product_information'],
      features: {
        appointment_booking: true,
        lead_qualification: true,
        information_gathering: true,
        call_routing: false
      }
    }
  ],
  chatbots: [
    {
      id: '1',
      name: 'Website Assistant',
      type: 'website',
      platform: 'website',
      personality: 'Helpful and knowledgeable',
      knowledgeBase: ['FAQ', 'Product Info', 'Pricing'],
      isActive: true,
      conversationsHandled: 1250,
      averageResponseTime: 0.8,
      handoffRate: 0.15,
      languages: ['en', 'es'],
      responses: {},
      analytics: {
        conversations: 1250,
        resolution_rate: 85,
        satisfaction_score: 4.2
      }
    }
  ],
  analyticsInsights: [
    {
      id: '1',
      type: 'trend',
      category: 'opportunities',
      title: 'Lead Conversion Rate Trending Up',
      description: 'Your lead conversion rate has increased by 15% this month',
      confidence: 0.94,
      impact: 'high',
      actionable: true,
      actionItems: ['Continue current marketing strategy', 'Increase ad spend'],
      data: { conversionRate: 0.15, change: 0.03 },
      createdAt: new Date()
    }
  ],
  aiAppointments: [
    {
      id: '1',
      contactId: '1',
      scheduledBy: 'ai',
      confidence: 0.89,
      suggestedTimes: [new Date(), new Date(Date.now() + 86400000)],
      status: 'suggested',
      aiReasoning: 'Based on contact\'s timezone and availability patterns',
      reasoning: 'Based on contact\'s timezone and availability patterns',
      autoConfirm: true
    }
  ],
  aiSocialPosts: [
    {
      id: '1',
      platform: 'facebook',
      content: 'Exciting news! Our new feature is now live.',
      hashtags: ['news', 'feature', 'update'],
      scheduledFor: new Date(),
      scheduledAt: new Date(),
      generatedFrom: 'New feature announcement',
      generated: true,
      performance_prediction: {
        engagement_score: 78,
        reach_estimate: '2.5K',
        best_posting_time: new Date()
      },
      status: 'scheduled'
    }
  ],
  reputationResponses: [
    {
      id: '1',
      reviewId: '1',
      platform: 'google',
      originalReview: 'Great service and friendly staff!',
      suggestedResponse: 'Thank you for your kind words! We appreciate your feedback.',
      aiResponse: 'Thank you for your kind words! We appreciate your feedback.',
      sentiment: 'positive',
      tone: 'grateful',
      isUsed: true,
      posted: true,
      createdAt: new Date()
    }
  ],
  isGeneratingResponse: false,
  isGeneratingContent: false,
  scoringModel: 'advanced_ml_v2',
  activeVoiceCall: null,

  generateConversationResponse: async (lastMessage: string, conversationId: string) => {
    set({ isGeneratingResponse: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newResponse: AIConversationResponse = {
      id: Date.now().toString(),
      conversationId,
      originalMessage: lastMessage,
      aiResponse: 'This is an AI-generated response based on your message.',
      intent: 'general_inquiry',
      confidence: Math.random() * 0.3 + 0.7,
      timestamp: new Date(),
      wasUsed: false
    };

    set(state => ({
      conversationResponses: [...state.conversationResponses, newResponse],
      isGeneratingResponse: false
    }));
  },

  generateContent: async (type: string, prompt: string, options: { tone: string; audience: string }) => {
    set({ isGeneratingContent: true });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      type: type as any,
      prompt,
      content: `AI-generated ${type} content based on: ${prompt}`,
      variations: [
        `Alternative version 1 for: ${prompt}`,
        `Alternative version 2 for: ${prompt}`
      ],
      tone: options.tone as any,
      audience: options.audience,
      createdAt: new Date(),
      isUsed: false,
      metrics: {
        readability: Math.floor(Math.random() * 20) + 80,
        sentiment: Math.random() * 0.3 + 0.7,
        engagement_prediction: Math.floor(Math.random() * 30) + 60
      }
    };

    set(state => ({
      generatedContent: [...state.generatedContent, newContent],
      isGeneratingContent: false
    }));

    return { id: newContent.id };
  },

  updateLeadScore: async (contactId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newScore: LeadScore = {
      id: Date.now().toString(),
      contactId,
      score: Math.floor(Math.random() * 40) + 60,
      factors: [
        { factor: 'engagement', contribution: Math.floor(Math.random() * 30) + 10 },
        { factor: 'demographics', contribution: Math.floor(Math.random() * 25) + 5 },
        { factor: 'behavior', contribution: Math.floor(Math.random() * 30) + 10 },
        { factor: 'firmographic', contribution: Math.floor(Math.random() * 20) + 5 }
      ],
      confidence: Math.random() * 0.3 + 0.7,
      trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any,
      lastUpdated: new Date(),
      predictions: {
        conversionProbability: Math.random() * 0.4 + 0.5,
        timeToConvert: Math.floor(Math.random() * 30) + 7,
        valueEstimate: Math.floor(Math.random() * 8000) + 2000
      }
    };

    set(state => ({
      leadScores: [...state.leadScores, newScore]
    }));
  },

  createVoiceAssistant: (assistant) => {
    const newAssistant: VoiceAssistant = {
      ...assistant,
      id: Date.now().toString(),
      callsHandled: 0,
      averageCallDuration: 0,
      satisfactionScore: 0,
      skills: []
    };

    set(state => ({
      voiceAssistants: [...state.voiceAssistants, newAssistant]
    }));
  },

  updateVoiceAssistant: (id, updates) => {
    set(state => ({
      voiceAssistants: state.voiceAssistants.map(assistant =>
        assistant.id === id ? { ...assistant, ...updates } : assistant
      )
    }));
  },

  createChatbot: (chatbot) => {
    const newChatbot: AIChatbot = {
      ...chatbot,
      id: Date.now().toString(),
      platform: chatbot.type,
      conversationsHandled: 0,
      averageResponseTime: 0,
      handoffRate: 0,
      languages: ['en']
    };

    set(state => ({
      chatbots: [...state.chatbots, newChatbot]
    }));
  },

  updateChatbot: (id, updates) => {
    set(state => ({
      chatbots: state.chatbots.map(chatbot =>
        chatbot.id === id ? { ...chatbot, ...updates } : chatbot
      )
    }));
  },

  generateInsights: async (dataType: string, timeframe: string) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const insights = [
      'Lead engagement patterns show peak activity on Tuesdays',
      'Email open rates increased 23% with personalized subject lines',
      'Social media posts perform better between 2-4 PM'
    ];

    const newInsight: AnalyticsInsight = {
      id: Date.now().toString(),
      type: ['trend', 'anomaly', 'recommendation', 'prediction'][Math.floor(Math.random() * 4)] as any,
      category: 'performance',
      title: insights[Math.floor(Math.random() * insights.length)],
      description: 'AI-generated insight based on your data analysis',
      confidence: Math.random() * 0.3 + 0.7,
      impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any,
      actionable: Math.random() > 0.5,
      actionItems: ['Review current strategy', 'Implement changes', 'Monitor results'],
      data: {},
      createdAt: new Date()
    };

    set(state => ({
      analyticsInsights: [...state.analyticsInsights, newInsight]
    }));
  },

  scheduleAppointmentWithAI: async (contactId: string, preferences: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestedTimes = [
      new Date(Date.now() + 86400000),
      new Date(Date.now() + 172800000),
      new Date(Date.now() + 259200000)
    ];

    const newAppointment: AIAppointment = {
      id: Date.now().toString(),
      contactId,
      scheduledBy: 'ai',
      confidence: Math.random() * 0.3 + 0.7,
      suggestedTimes,
      status: 'suggested',
      aiReasoning: 'Based on contact preferences and availability patterns',
      reasoning: 'Based on contact preferences and availability patterns',
      autoConfirm: Math.random() > 0.5
    };

    set(state => ({
      aiAppointments: [...state.aiAppointments, newAppointment]
    }));
  },

  generateSocialMediaPost: async (platform: string, topic: string, tone: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPost: AISocialPost = {
      id: Date.now().toString(),
      platform: platform as any,
      content: `AI-generated ${platform} post about ${topic} with ${tone} tone`,
      hashtags: ['ai', 'generated', 'content'],
      scheduledFor: new Date(Date.now() + 3600000),
      scheduledAt: new Date(Date.now() + 3600000),
      generatedFrom: topic,
      generated: true,
      performance_prediction: {
        engagement_score: Math.floor(Math.random() * 30) + 60,
        reach_estimate: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)}K`,
        best_posting_time: new Date(Date.now() + 7200000)
      },
      status: 'draft'
    };

    set(state => ({
      aiSocialPosts: [...state.aiSocialPosts, newPost]
    }));
  },

  generateReputationResponse: async (reviewId: string, reviewText: string, sentiment: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newResponse: ReputationResponse = {
      id: Date.now().toString(),
      reviewId,
      platform: 'google',
      originalReview: reviewText,
      suggestedResponse: 'AI-generated professional response to the review',
      aiResponse: 'AI-generated professional response to the review',
      sentiment: sentiment as any,
      tone: sentiment === 'positive' ? 'grateful' : 'professional',
      isUsed: false,
      posted: false,
      createdAt: new Date()
    };

    set(state => ({
      reputationResponses: [...state.reputationResponses, newResponse]
    }));
  }
}));
