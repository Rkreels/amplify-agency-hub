
import { create } from 'zustand';

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'local' | 'toll-free' | 'international';
  country: string;
  city?: string;
  state?: string;
  isActive: boolean;
  features: {
    sms: boolean;
    voice: boolean;
    mms: boolean;
    fax: boolean;
  };
  assignedTo?: string;
  monthlyRate: number;
}

export interface CallRecord {
  id: string;
  phoneNumberId: string;
  contactId?: string;
  contactName?: string;
  contactNumber: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'busy' | 'failed' | 'voicemail';
  duration: number; // in seconds
  recordingUrl?: string;
  transcript?: string;
  notes?: string;
  tags: string[];
  cost: number;
  startedAt: Date;
  endedAt?: Date;
  assignedTo?: string;
  dispositionCode?: string;
}

export interface VoicemailDrop {
  id: string;
  name: string;
  audioUrl: string;
  transcript: string;
  duration: number;
  createdAt: Date;
  usageCount: number;
}

export interface CallTracking {
  id: string;
  name: string;
  trackingNumber: string;
  forwardingNumber: string;
  source: string;
  campaign?: string;
  isActive: boolean;
  analytics: {
    totalCalls: number;
    uniqueCallers: number;
    averageDuration: number;
    conversionRate: number;
    totalCost: number;
  };
  createdAt: Date;
}

export interface CallQueue {
  id: string;
  name: string;
  phoneNumbers: string[];
  agents: string[];
  maxWaitTime: number;
  maxQueueSize: number;
  musicOnHold?: string;
  voicemailEnabled: boolean;
  priorities: {
    vip: string[];
    returning: boolean;
    geographic: string[];
  };
  businessHours: {
    timezone: string;
    schedule: Record<string, { start: string; end: string; enabled: boolean }>;
  };
  isActive: boolean;
}

interface PhoneSystemStore {
  phoneNumbers: PhoneNumber[];
  callRecords: CallRecord[];
  voicemailDrops: VoicemailDrop[];
  callTracking: CallTracking[];
  callQueues: CallQueue[];
  activeCall: CallRecord | null;
  selectedRecord: CallRecord | null;
  setActiveCall: (call: CallRecord | null) => void;
  setSelectedRecord: (record: CallRecord | null) => void;
  addPhoneNumber: (number: Omit<PhoneNumber, 'id'>) => void;
  updatePhoneNumber: (id: string, updates: Partial<PhoneNumber>) => void;
  deletePhoneNumber: (id: string) => void;
  makeCall: (contactNumber: string, phoneNumberId: string) => void;
  endCall: (callId: string, duration: number) => void;
  addCallNote: (callId: string, note: string) => void;
  addVoicemailDrop: (drop: Omit<VoicemailDrop, 'id' | 'createdAt' | 'usageCount'>) => void;
  useVoicemailDrop: (dropId: string, callId: string) => void;
  addCallTracking: (tracking: Omit<CallTracking, 'id' | 'createdAt'>) => void;
  updateCallTracking: (id: string, updates: Partial<CallTracking>) => void;
  addCallQueue: (queue: Omit<CallQueue, 'id'>) => void;
  updateCallQueue: (id: string, updates: Partial<CallQueue>) => void;
  getCallAnalytics: (period: string) => any;
}

const mockPhoneNumbers: PhoneNumber[] = [
  {
    id: '1',
    number: '+1-555-123-4567',
    type: 'local',
    country: 'US',
    city: 'San Francisco',
    state: 'CA',
    isActive: true,
    features: {
      sms: true,
      voice: true,
      mms: true,
      fax: false
    },
    assignedTo: 'Sales Team',
    monthlyRate: 15.00
  },
  {
    id: '2',
    number: '+1-800-555-9876',
    type: 'toll-free',
    country: 'US',
    isActive: true,
    features: {
      sms: false,
      voice: true,
      mms: false,
      fax: true
    },
    assignedTo: 'Support Team',
    monthlyRate: 25.00
  }
];

const mockCallRecords: CallRecord[] = [
  {
    id: '1',
    phoneNumberId: '1',
    contactId: '1',
    contactName: 'Sarah Johnson',
    contactNumber: '+1-555-987-6543',
    direction: 'inbound',
    status: 'completed',
    duration: 450,
    recordingUrl: '/recordings/call-1.mp3',
    transcript: 'Customer called about product pricing...',
    notes: 'Interested in enterprise package',
    tags: ['sales', 'pricing'],
    cost: 0.05,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 450 * 1000),
    assignedTo: 'John Doe',
    dispositionCode: 'qualified'
  },
  {
    id: '2',
    phoneNumberId: '2',
    contactNumber: '+1-555-456-7890',
    direction: 'outbound',
    status: 'voicemail',
    duration: 0,
    notes: 'Left voicemail about follow-up',
    tags: ['follow-up'],
    cost: 0.03,
    startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    assignedTo: 'Jane Smith'
  }
];

const mockVoicemailDrops: VoicemailDrop[] = [
  {
    id: '1',
    name: 'Follow-up Message',
    audioUrl: '/voicemail/follow-up.mp3',
    transcript: 'Hi, this is John from Company. I wanted to follow up on our conversation...',
    duration: 30,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    usageCount: 45
  },
  {
    id: '2',
    name: 'Appointment Reminder',
    audioUrl: '/voicemail/reminder.mp3',
    transcript: 'This is a friendly reminder about your upcoming appointment...',
    duration: 25,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    usageCount: 78
  }
];

const mockCallTracking: CallTracking[] = [
  {
    id: '1',
    name: 'Google Ads Campaign',
    trackingNumber: '+1-555-TRACK-01',
    forwardingNumber: '+1-555-123-4567',
    source: 'Google Ads',
    campaign: 'Spring Sale 2024',
    isActive: true,
    analytics: {
      totalCalls: 156,
      uniqueCallers: 134,
      averageDuration: 180,
      conversionRate: 24.5,
      totalCost: 78.50
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
];

const mockCallQueues: CallQueue[] = [
  {
    id: '1',
    name: 'Sales Queue',
    phoneNumbers: ['+1-555-123-4567'],
    agents: ['John Doe', 'Jane Smith'],
    maxWaitTime: 300,
    maxQueueSize: 10,
    musicOnHold: '/audio/hold-music.mp3',
    voicemailEnabled: true,
    priorities: {
      vip: ['vip-customers'],
      returning: true,
      geographic: ['CA', 'NY', 'TX']
    },
    businessHours: {
      timezone: 'America/Los_Angeles',
      schedule: {
        monday: { start: '09:00', end: '17:00', enabled: true },
        tuesday: { start: '09:00', end: '17:00', enabled: true },
        wednesday: { start: '09:00', end: '17:00', enabled: true },
        thursday: { start: '09:00', end: '17:00', enabled: true },
        friday: { start: '09:00', end: '17:00', enabled: true },
        saturday: { start: '10:00', end: '14:00', enabled: false },
        sunday: { start: '10:00', end: '14:00', enabled: false }
      }
    },
    isActive: true
  }
];

export const usePhoneSystemStore = create<PhoneSystemStore>((set, get) => ({
  phoneNumbers: mockPhoneNumbers,
  callRecords: mockCallRecords,
  voicemailDrops: mockVoicemailDrops,
  callTracking: mockCallTracking,
  callQueues: mockCallQueues,
  activeCall: null,
  selectedRecord: null,

  setActiveCall: (call) => set({ activeCall: call }),
  setSelectedRecord: (record) => set({ selectedRecord: record }),

  addPhoneNumber: (number) => set((state) => ({
    phoneNumbers: [...state.phoneNumbers, { ...number, id: Date.now().toString() }]
  })),

  updatePhoneNumber: (id, updates) => set((state) => ({
    phoneNumbers: state.phoneNumbers.map(number =>
      number.id === id ? { ...number, ...updates } : number
    )
  })),

  deletePhoneNumber: (id) => set((state) => ({
    phoneNumbers: state.phoneNumbers.filter(number => number.id !== id)
  })),

  makeCall: (contactNumber, phoneNumberId) => {
    const newCall: CallRecord = {
      id: Date.now().toString(),
      phoneNumberId,
      contactNumber,
      direction: 'outbound',
      status: 'completed',
      duration: 0,
      tags: [],
      cost: 0,
      startedAt: new Date()
    };
    
    set((state) => ({
      callRecords: [...state.callRecords, newCall],
      activeCall: newCall
    }));
  },

  endCall: (callId, duration) => set((state) => ({
    callRecords: state.callRecords.map(call =>
      call.id === callId 
        ? { ...call, duration, endedAt: new Date(), cost: duration * 0.01 }
        : call
    ),
    activeCall: null
  })),

  addCallNote: (callId, note) => set((state) => ({
    callRecords: state.callRecords.map(call =>
      call.id === callId ? { ...call, notes: note } : call
    )
  })),

  addVoicemailDrop: (drop) => set((state) => ({
    voicemailDrops: [...state.voicemailDrops, {
      ...drop,
      id: Date.now().toString(),
      createdAt: new Date(),
      usageCount: 0
    }]
  })),

  useVoicemailDrop: (dropId, callId) => set((state) => ({
    voicemailDrops: state.voicemailDrops.map(drop =>
      drop.id === dropId ? { ...drop, usageCount: drop.usageCount + 1 } : drop
    ),
    callRecords: state.callRecords.map(call =>
      call.id === callId ? { ...call, status: 'voicemail', tags: [...call.tags, 'voicemail-drop'] } : call
    )
  })),

  addCallTracking: (tracking) => set((state) => ({
    callTracking: [...state.callTracking, {
      ...tracking,
      id: Date.now().toString(),
      createdAt: new Date()
    }]
  })),

  updateCallTracking: (id, updates) => set((state) => ({
    callTracking: state.callTracking.map(tracking =>
      tracking.id === id ? { ...tracking, ...updates } : tracking
    )
  })),

  addCallQueue: (queue) => set((state) => ({
    callQueues: [...state.callQueues, { ...queue, id: Date.now().toString() }]
  })),

  updateCallQueue: (id, updates) => set((state) => ({
    callQueues: state.callQueues.map(queue =>
      queue.id === id ? { ...queue, ...updates } : queue
    )
  })),

  getCallAnalytics: (period) => {
    const { callRecords } = get();
    // Implementation for call analytics based on period
    return {
      totalCalls: callRecords.length,
      totalDuration: callRecords.reduce((sum, call) => sum + call.duration, 0),
      averageDuration: callRecords.length > 0 ? callRecords.reduce((sum, call) => sum + call.duration, 0) / callRecords.length : 0,
      conversionRate: 15.5,
      totalCost: callRecords.reduce((sum, call) => sum + call.cost, 0)
    };
  }
}));
