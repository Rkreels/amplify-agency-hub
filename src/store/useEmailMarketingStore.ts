
import { create } from 'zustand';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  thumbnail?: string;
  category: 'newsletter' | 'promotional' | 'transactional' | 'welcome' | 'follow-up';
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  templateId?: string;
  htmlContent: string;
  textContent: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduledAt?: Date;
  sentAt?: Date;
  recipients: {
    type: 'all' | 'tags' | 'custom';
    tagIds?: string[];
    customEmails?: string[];
    count: number;
  };
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
    spam: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'tag_added' | 'form_submit' | 'date_based' | 'manual';
    config: Record<string, any>;
  };
  emails: {
    id: string;
    subject: string;
    templateId?: string;
    htmlContent: string;
    textContent: string;
    delay: number; // in hours
    delayType: 'hours' | 'days' | 'weeks';
  }[];
  isActive: boolean;
  stats: {
    enrolled: number;
    completed: number;
    optedOut: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailDeliverability {
  domain: string;
  reputation: number;
  spamScore: number;
  dkimSetup: boolean;
  spfSetup: boolean;
  dmarcSetup: boolean;
  deliverabilityRate: number;
  bounceRate: number;
  spamRate: number;
}

interface EmailMarketingStore {
  campaigns: EmailCampaign[];
  sequences: EmailSequence[];
  templates: EmailTemplate[];
  deliverability: EmailDeliverability;
  selectedCampaign: EmailCampaign | null;
  selectedSequence: EmailSequence | null;
  setSelectedCampaign: (campaign: EmailCampaign | null) => void;
  setSelectedSequence: (sequence: EmailSequence | null) => void;
  addCampaign: (campaign: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaign: (id: string, updates: Partial<EmailCampaign>) => void;
  deleteCampaign: (id: string) => void;
  addSequence: (sequence: Omit<EmailSequence, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSequence: (id: string, updates: Partial<EmailSequence>) => void;
  deleteSequence: (id: string) => void;
  addTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;
  sendCampaign: (id: string) => void;
  pauseCampaign: (id: string) => void;
  duplicateCampaign: (id: string) => void;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to {{company_name}}!',
    htmlContent: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
    textContent: 'Welcome! Thank you for joining us.',
    category: 'welcome',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Newsletter Template',
    subject: 'Weekly Newsletter - {{date}}',
    htmlContent: '<h1>This Week</h1><p>Here are the latest updates...</p>',
    textContent: 'This Week - Here are the latest updates...',
    category: 'newsletter',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  }
];

const mockCampaigns: EmailCampaign[] = [
  {
    id: '1',
    name: 'Spring Sale Announcement',
    subject: '🌸 Spring Sale - 30% Off Everything!',
    htmlContent: '<h1>Spring Sale</h1><p>Get 30% off all products!</p>',
    textContent: 'Spring Sale - Get 30% off all products!',
    fromName: 'Sales Team',
    fromEmail: 'sales@company.com',
    replyTo: 'sales@company.com',
    status: 'sent',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    recipients: {
      type: 'tags',
      tagIds: ['1', '3'],
      count: 1247
    },
    stats: {
      sent: 1247,
      delivered: 1235,
      opened: 456,
      clicked: 123,
      unsubscribed: 3,
      bounced: 12,
      spam: 2
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  }
];

const mockSequences: EmailSequence[] = [
  {
    id: '1',
    name: 'Welcome Series',
    description: 'Onboarding sequence for new subscribers',
    trigger: {
      type: 'tag_added',
      config: { tagId: '4' }
    },
    emails: [
      {
        id: '1',
        subject: 'Welcome to our community!',
        htmlContent: '<h1>Welcome!</h1>',
        textContent: 'Welcome!',
        delay: 0,
        delayType: 'hours'
      },
      {
        id: '2',
        subject: 'Getting started guide',
        htmlContent: '<h1>Getting Started</h1>',
        textContent: 'Getting Started',
        delay: 24,
        delayType: 'hours'
      }
    ],
    isActive: true,
    stats: {
      enrolled: 456,
      completed: 342,
      optedOut: 12
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  }
];

const mockDeliverability: EmailDeliverability = {
  domain: 'company.com',
  reputation: 85,
  spamScore: 2.1,
  dkimSetup: true,
  spfSetup: true,
  dmarcSetup: false,
  deliverabilityRate: 94.2,
  bounceRate: 1.8,
  spamRate: 0.3
};

export const useEmailMarketingStore = create<EmailMarketingStore>((set, get) => ({
  campaigns: mockCampaigns,
  sequences: mockSequences,
  templates: mockTemplates,
  deliverability: mockDeliverability,
  selectedCampaign: null,
  selectedSequence: null,

  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setSelectedSequence: (sequence) => set({ selectedSequence: sequence }),

  addCampaign: (campaign) => set((state) => ({
    campaigns: [...state.campaigns, {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateCampaign: (id, updates) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.id === id ? { ...campaign, ...updates, updatedAt: new Date() } : campaign
    )
  })),

  deleteCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.filter(campaign => campaign.id !== id)
  })),

  addSequence: (sequence) => set((state) => ({
    sequences: [...state.sequences, {
      ...sequence,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateSequence: (id, updates) => set((state) => ({
    sequences: state.sequences.map(sequence =>
      sequence.id === id ? { ...sequence, ...updates, updatedAt: new Date() } : sequence
    )
  })),

  deleteSequence: (id) => set((state) => ({
    sequences: state.sequences.filter(sequence => sequence.id !== id)
  })),

  addTemplate: (template) => set((state) => ({
    templates: [...state.templates, {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]
  })),

  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map(template =>
      template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
    )
  })),

  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter(template => template.id !== id)
  })),

  sendCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.id === id 
        ? { ...campaign, status: 'sending', updatedAt: new Date() }
        : campaign
    )
  })),

  pauseCampaign: (id) => set((state) => ({
    campaigns: state.campaigns.map(campaign =>
      campaign.id === id 
        ? { ...campaign, status: 'paused', updatedAt: new Date() }
        : campaign
    )
  })),

  duplicateCampaign: (id) => set((state) => {
    const campaign = state.campaigns.find(c => c.id === id);
    if (!campaign) return state;

    const duplicated = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: 'draft' as const,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
        spam: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return {
      campaigns: [...state.campaigns, duplicated]
    };
  })
}));
