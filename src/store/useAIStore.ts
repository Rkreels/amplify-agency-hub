
import { create } from 'zustand';

export interface AIConversationResponse {
  id: string;
  conversationId: string;
  prompt: string;
  response: string;
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
  factors: {
    engagement: number;
    demographics: number;
    behavior: number;
    firmographic: number;
  };
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
}

export interface AIChatbot {
  id: string;
  name: string;
  platform: 'website' | 'facebook' | 'instagram' | 'whatsapp';
  personality: string;
  knowledgeBase: string[];
  isActive: boolean;
  conversationsHandled: number;
  averageResponseTime: number;
  handoffRate: number;
  languages: string[];
}

export interface AnalyticsInsight {
  id: string;
  category: 'performance' | 'trends' | 'opportunities' | 'alerts';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
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
}

export interface AISocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  hashtags: string[];
  scheduledFor: Date;
  generatedFrom: string;
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
  tone: 'professional' | 'apologetic' | 'grateful' | 'defensive';
  isUsed: boolean;
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
  
  // Actions
  generateConversationResponse: (conversationId: string, lastMessage: string) => Promise<void>;
  generateContent: (type: string, prompt: string, tone: string) => Promise<void>;
  updateLeadScore: (contactId: string) => void;
  createVoiceAssistant: (assistant: Omit<VoiceAssistant, 'id'>) => void;
  updateVoiceAssistant: (id: string, updates: Partial<VoiceAssistant>) => void;
  createChatbot: (chatbot: Omit<AIChatbot, 'id'>) => void;
  updateChatbot: (id: string, updates: Partial<AIChatbot>) => void;
  generateInsight: (category: string) => void;
  scheduleAIAppointment: (contactId: string, availableTimes: Date[]) => void;
  generateSocialPost: (platform: string, topic: string) => void;
  generateReputationResponse: (reviewId: string, reviewText: string, rating: number) => void;
}

export const useAIStore = create<AIStore>((set, get) => ({
  conversationResponses: [
    {
      id: '1',
      conversationId: '1',
      prompt: 'Customer asking about pricing',
      response: 'Thank you for your interest! Our pricing starts at $99/month for our basic package. Would you like me to schedule a call to discuss your specific needs?',
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
      factors: {
        engagement: 90,
        demographics: 75,
        behavior: 85,
        firmographic: 90
      },
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
      skills: ['lead_qualification', 'appointment_scheduling', 'product_information']
    }
  ],
  chatbots: [
    {
      id: '1',
      name: 'Website Assistant',
      platform: 'website',
      personality: 'Helpful and knowledgeable',
      knowledgeBase: ['FAQ', 'Product Info', 'Pricing'],
      isActive: true,
      conversationsHandled: 1250,
      averageResponseTime: 0.8,
      handoffRate: 0.15,
      languages: ['en', 'es']
    }
  ],
  analyticsInsights: [
    {
      id: '1',
      category: 'opportunities',
      title: 'High-value leads not followed up',
      description: 'You have 12 leads with scores above 80 that haven\'t been contacted in 7+ days',
      confidence: 0.92,
      impact: 'high',
      actionItems: [
        'Schedule follow-up calls with top 5 leads',
        'Create automated nurture sequence',
        'Assign leads to sales team'
      ],
      data: { affectedLeads: 12, potentialValue: 45000 },
      createdAt: new Date()
    }
  ],
  aiAppointments: [
    {
      id: '1',
      contactId: '1',
      scheduledBy: 'ai',
      confidence: 0.85,
      suggestedTimes: [
        new Date('2024-12-25T14:00:00'),
        new Date('2024-12-25T15:00:00'),
        new Date('2024-12-26T10:00:00')
      ],
      selectedTime: new Date('2024-12-25T14:00:00'),
      status: 'confirmed',
      aiReasoning: 'Based on contact\'s timezone and previous meeting preferences'
    }
  ],
  aiSocialPosts: [
    {
      id: '1',
      platform: 'linkedin',
      content: 'Excited to share our latest insights on digital transformation!',
      hashtags: ['#DigitalTransformation', '#BusinessGrowth', '#Innovation'],
      scheduledFor: new Date('2024-12-25T09:00:00'),
      generatedFrom: 'Recent blog post about digital transformation',
      status: 'scheduled'
    }
  ],
  reputationResponses: [
    {
      id: '1',
      reviewId: 'google-review-123',
      platform: 'google',
      originalReview: 'Great service and fast response time!',
      suggestedResponse: 'Thank you for your kind words! We\'re thrilled that you had a positive experience with our service.',
      tone: 'grateful',
      isUsed: false,
      createdAt: new Date()
    }
  ],
  isGeneratingResponse: false,
  isGeneratingContent: false,

  generateConversationResponse: async (conversationId, lastMessage) => {
    set({ isGeneratingResponse: true });
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const responses = [
      "Thank you for reaching out! I'd be happy to help you with that.",
      "That's a great question. Let me provide you with the information you need.",
      "I understand your concern. Here's what I recommend...",
      "Thanks for your interest! Would you like to schedule a call to discuss this further?"
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    set((state) => ({
      conversationResponses: [...state.conversationResponses, {
        id: Date.now().toString(),
        conversationId,
        prompt: lastMessage,
        response,
        confidence: 0.75 + Math.random() * 0.25,
        timestamp: new Date(),
        wasUsed: false
      }],
      isGeneratingResponse: false
    }));
  },

  generateContent: async (type, prompt, tone) => {
    set({ isGeneratingContent: true });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const contentTemplates = {
      email: [
        "Thank you for your interest in our services. We'd love to help you achieve your goals.",
        "We're excited to introduce you to our latest features that can transform your business.",
        "Your success is our priority. Let's schedule some time to discuss your needs."
      ],
      sms: [
        "Hi! Thanks for signing up. Reply STOP to opt out.",
        "Your appointment is confirmed for tomorrow at 2 PM.",
        "Special offer: 20% off this week only!"
      ],
      social_post: [
        "Excited to share our latest insights with you!",
        "Here's what we learned about growing your business...",
        "Monday motivation: Success starts with taking action!"
      ]
    };
    
    const templates = contentTemplates[type as keyof typeof contentTemplates] || contentTemplates.email;
    const content = templates[Math.floor(Math.random() * templates.length)];
    
    set((state) => ({
      generatedContent: [...state.generatedContent, {
        id: Date.now().toString(),
        type: type as any,
        prompt,
        content,
        variations: templates.filter(t => t !== content).slice(0, 2),
        tone: tone as any,
        audience: 'general',
        createdAt: new Date(),
        isUsed: false
      }],
      isGeneratingContent: false
    }));
  },

  updateLeadScore: (contactId) => {
    set((state) => {
      const existingScore = state.leadScores.find(s => s.contactId === contactId);
      if (existingScore) {
        return {
          leadScores: state.leadScores.map(score =>
            score.contactId === contactId
              ? {
                  ...score,
                  score: Math.min(100, score.score + Math.floor(Math.random() * 10)),
                  lastUpdated: new Date()
                }
              : score
          )
        };
      } else {
        return {
          leadScores: [...state.leadScores, {
            id: Date.now().toString(),
            contactId,
            score: 50 + Math.floor(Math.random() * 50),
            factors: {
              engagement: Math.floor(Math.random() * 100),
              demographics: Math.floor(Math.random() * 100),
              behavior: Math.floor(Math.random() * 100),
              firmographic: Math.floor(Math.random() * 100)
            },
            trend: Math.random() > 0.5 ? 'increasing' : 'stable',
            lastUpdated: new Date(),
            predictions: {
              conversionProbability: Math.random(),
              timeToConvert: Math.floor(Math.random() * 30) + 7,
              valueEstimate: Math.floor(Math.random() * 10000) + 1000
            }
          }]
        };
      }
    });
  },

  createVoiceAssistant: (assistant) => set((state) => ({
    voiceAssistants: [...state.voiceAssistants, { ...assistant, id: Date.now().toString() }]
  })),

  updateVoiceAssistant: (id, updates) => set((state) => ({
    voiceAssistants: state.voiceAssistants.map(assistant =>
      assistant.id === id ? { ...assistant, ...updates } : assistant
    )
  })),

  createChatbot: (chatbot) => set((state) => ({
    chatbots: [...state.chatbots, { ...chatbot, id: Date.now().toString() }]
  })),

  updateChatbot: (id, updates) => set((state) => ({
    chatbots: state.chatbots.map(chatbot =>
      chatbot.id === id ? { ...chatbot, ...updates } : chatbot
    )
  })),

  generateInsight: (category) => {
    const insights = [
      {
        category: 'performance',
        title: 'Email open rates trending up',
        description: 'Your email campaigns are performing 15% better this month',
        impact: 'medium' as const
      },
      {
        category: 'opportunities',
        title: 'Missed follow-up opportunities',
        description: 'Several high-value leads haven\'t been contacted recently',
        impact: 'high' as const
      },
      {
        category: 'trends',
        title: 'Peak engagement hours identified',
        description: 'Your audience is most active between 2-4 PM on weekdays',
        impact: 'medium' as const
      }
    ];
    
    const insight = insights[Math.floor(Math.random() * insights.length)];
    
    set((state) => ({
      analyticsInsights: [...state.analyticsInsights, {
        id: Date.now().toString(),
        category: insight.category as any,
        title: insight.title,
        description: insight.description,
        confidence: 0.7 + Math.random() * 0.3,
        impact: insight.impact,
        actionItems: [
          'Review current strategy',
          'Implement recommended changes',
          'Monitor results'
        ],
        data: {},
        createdAt: new Date()
      }]
    }));
  },

  scheduleAIAppointment: (contactId, availableTimes) => set((state) => ({
    aiAppointments: [...state.aiAppointments, {
      id: Date.now().toString(),
      contactId,
      scheduledBy: 'ai' as const,
      confidence: 0.8 + Math.random() * 0.2,
      suggestedTimes: availableTimes,
      status: 'suggested' as const,
      aiReasoning: 'Based on contact preferences and availability patterns'
    }]
  })),

  generateSocialPost: (platform, topic) => {
    const posts = [
      'Excited to share our latest insights!',
      'Here\'s what we learned this week...',
      'Monday motivation for business growth!',
      'Tips for improving your customer experience'
    ];
    
    set((state) => ({
      aiSocialPosts: [...state.aiSocialPosts, {
        id: Date.now().toString(),
        platform: platform as any,
        content: posts[Math.floor(Math.random() * posts.length)],
        hashtags: ['#Business', '#Growth', '#Success'],
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
        generatedFrom: topic,
        status: 'draft' as const
      }]
    }));
  },

  generateReputationResponse: (reviewId, reviewText, rating) => {
    const positiveResponses = [
      'Thank you for your wonderful review! We\'re thrilled you had a great experience.',
      'We appreciate your kind words and are glad we could exceed your expectations.',
      'Thank you for taking the time to share your positive feedback!'
    ];
    
    const negativeResponses = [
      'Thank you for your feedback. We take all concerns seriously and would like to make this right.',
      'We apologize for not meeting your expectations. Please contact us so we can resolve this.',
      'We value your feedback and are committed to improving our service.'
    ];
    
    const responses = rating >= 4 ? positiveResponses : negativeResponses;
    const tone = rating >= 4 ? 'grateful' : 'apologetic';
    
    set((state) => ({
      reputationResponses: [...state.reputationResponses, {
        id: Date.now().toString(),
        reviewId,
        platform: 'google' as const,
        originalReview: reviewText,
        suggestedResponse: responses[Math.floor(Math.random() * responses.length)],
        tone: tone as any,
        isUsed: false,
        createdAt: new Date()
      }]
    }));
  }
}));
