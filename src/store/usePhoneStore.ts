
import { create } from 'zustand';

export interface Call {
  id: string;
  contactId: string;
  contactName: string;
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  status: 'ringing' | 'connected' | 'ended' | 'missed' | 'voicemail';
  duration: number;
  startTime: Date;
  endTime?: Date;
  recordingUrl?: string;
  notes: string;
  disposition: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'local' | 'toll-free' | 'international';
  isActive: boolean;
  assignedTo?: string;
  forwardingEnabled: boolean;
  forwardingNumber?: string;
  voicemailEnabled: boolean;
}

interface PhoneStore {
  calls: Call[];
  phoneNumbers: PhoneNumber[];
  activeCall: Call | null;
  isDialerOpen: boolean;
  dialedNumber: string;
  isMuted: boolean;
  isOnHold: boolean;
  callVolume: number;
  addCall: (call: Omit<Call, 'id'>) => void;
  updateCall: (id: string, updates: Partial<Call>) => void;
  endCall: (id: string) => void;
  setActiveCall: (call: Call | null) => void;
  setDialerOpen: (open: boolean) => void;
  setDialedNumber: (number: string) => void;
  dialNumber: (number: string) => void;
  answerCall: (id: string) => void;
  toggleMute: () => void;
  toggleHold: () => void;
  setVolume: (volume: number) => void;
  addPhoneNumber: (number: Omit<PhoneNumber, 'id'>) => void;
  updatePhoneNumber: (id: string, updates: Partial<PhoneNumber>) => void;
  deletePhoneNumber: (id: string) => void;
}

export const usePhoneStore = create<PhoneStore>((set, get) => ({
  calls: [
    {
      id: '1',
      contactId: '1',
      contactName: 'John Smith',
      phoneNumber: '+1-555-0123',
      direction: 'inbound',
      status: 'ended',
      duration: 245,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 245 * 1000),
      notes: 'Discussed website redesign project',
      disposition: 'interested'
    },
    {
      id: '2',
      contactId: '2',
      contactName: 'Jane Doe',
      phoneNumber: '+1-555-0124',
      direction: 'outbound',
      status: 'missed',
      duration: 0,
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      notes: '',
      disposition: 'no_answer'
    }
  ],
  phoneNumbers: [
    {
      id: '1',
      number: '+1-555-0100',
      type: 'local',
      isActive: true,
      assignedTo: 'Main Line',
      forwardingEnabled: false,
      voicemailEnabled: true
    },
    {
      id: '2',
      number: '+1-800-555-0200',
      type: 'toll-free',
      isActive: true,
      assignedTo: 'Sales Team',
      forwardingEnabled: true,
      forwardingNumber: '+1-555-0101',
      voicemailEnabled: true
    }
  ],
  activeCall: null,
  isDialerOpen: false,
  dialedNumber: '',
  isMuted: false,
  isOnHold: false,
  callVolume: 80,
  addCall: (call) => set((state) => ({
    calls: [{ ...call, id: Date.now().toString() }, ...state.calls]
  })),
  updateCall: (id, updates) => set((state) => ({
    calls: state.calls.map(call => 
      call.id === id ? { ...call, ...updates } : call
    )
  })),
  endCall: (id) => set((state) => ({
    calls: state.calls.map(call => 
      call.id === id ? { 
        ...call, 
        status: 'ended' as const, 
        endTime: new Date(),
        duration: call.endTime ? 0 : Math.floor((new Date().getTime() - call.startTime.getTime()) / 1000)
      } : call
    ),
    activeCall: state.activeCall?.id === id ? null : state.activeCall
  })),
  setActiveCall: (call) => set({ activeCall: call }),
  setDialerOpen: (open) => set({ isDialerOpen: open }),
  setDialedNumber: (number) => set({ dialedNumber: number }),
  dialNumber: (number) => {
    const newCall: Call = {
      id: Date.now().toString(),
      contactId: '',
      contactName: 'Unknown',
      phoneNumber: number,
      direction: 'outbound',
      status: 'ringing',
      duration: 0,
      startTime: new Date(),
      notes: '',
      disposition: ''
    };
    set((state) => ({
      calls: [newCall, ...state.calls],
      activeCall: newCall,
      dialedNumber: '',
      isDialerOpen: false
    }));
  },
  answerCall: (id) => set((state) => ({
    calls: state.calls.map(call => 
      call.id === id ? { ...call, status: 'connected' as const } : call
    ),
    activeCall: state.calls.find(call => call.id === id) || null
  })),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleHold: () => set((state) => ({ isOnHold: !state.isOnHold })),
  setVolume: (volume) => set({ callVolume: volume }),
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
  }))
}));
