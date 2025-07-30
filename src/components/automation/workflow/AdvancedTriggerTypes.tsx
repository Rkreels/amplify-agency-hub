import React from 'react';
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Users, 
  Clock, 
  Phone, 
  FileText, 
  CreditCard, 
  Globe,
  UserPlus,
  UserMinus,
  Tag,
  ShoppingCart,
  MapPin
} from 'lucide-react';

export interface TriggerType {
  id: string;
  name: string;
  category: 'contact' | 'communication' | 'behavioral' | 'calendar' | 'ecommerce' | 'location' | 'system';
  icon: React.ComponentType<any>;
  description: string;
  fields: TriggerField[];
  color: string;
}

export interface TriggerField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'number' | 'date' | 'time' | 'toggle';
  required: boolean;
  options?: { value: string; label: string; }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export const triggerTypes: TriggerType[] = [
  // Contact Triggers
  {
    id: 'contact-created',
    name: 'Contact Created',
    category: 'contact',
    icon: UserPlus,
    description: 'Triggered when a new contact is created',
    color: 'bg-green-500',
    fields: [
      {
        name: 'source',
        label: 'Contact Source',
        type: 'select',
        required: false,
        options: [
          { value: 'any', label: 'Any Source' },
          { value: 'form', label: 'Form Submission' },
          { value: 'manual', label: 'Manual Entry' },
          { value: 'import', label: 'Import' },
          { value: 'api', label: 'API' }
        ]
      }
    ]
  },
  {
    id: 'contact-updated',
    name: 'Contact Updated',
    category: 'contact',
    icon: Users,
    description: 'Triggered when contact information is updated',
    color: 'bg-blue-500',
    fields: [
      {
        name: 'field',
        label: 'Updated Field',
        type: 'select',
        required: false,
        options: [
          { value: 'any', label: 'Any Field' },
          { value: 'email', label: 'Email' },
          { value: 'phone', label: 'Phone' },
          { value: 'name', label: 'Name' },
          { value: 'status', label: 'Status' }
        ]
      }
    ]
  },
  {
    id: 'tag-applied',
    name: 'Tag Applied',
    category: 'contact',
    icon: Tag,
    description: 'Triggered when a tag is applied to a contact',
    color: 'bg-purple-500',
    fields: [
      {
        name: 'tagName',
        label: 'Tag Name',
        type: 'text',
        required: true,
        placeholder: 'Enter tag name'
      }
    ]
  },
  {
    id: 'tag-removed',
    name: 'Tag Removed',
    category: 'contact',
    icon: UserMinus,
    description: 'Triggered when a tag is removed from a contact',
    color: 'bg-orange-500',
    fields: [
      {
        name: 'tagName',
        label: 'Tag Name',
        type: 'text',
        required: true,
        placeholder: 'Enter tag name'
      }
    ]
  },

  // Communication Triggers
  {
    id: 'email-opened',
    name: 'Email Opened',
    category: 'communication',
    icon: Mail,
    description: 'Triggered when a contact opens an email',
    color: 'bg-blue-600',
    fields: [
      {
        name: 'campaign',
        label: 'Email Campaign',
        type: 'select',
        required: false,
        options: [
          { value: 'any', label: 'Any Campaign' },
          { value: 'welcome', label: 'Welcome Series' },
          { value: 'promotional', label: 'Promotional' },
          { value: 'newsletter', label: 'Newsletter' }
        ]
      }
    ]
  },
  {
    id: 'email-clicked',
    name: 'Email Link Clicked',
    category: 'communication',
    icon: Globe,
    description: 'Triggered when a contact clicks a link in an email',
    color: 'bg-indigo-500',
    fields: [
      {
        name: 'linkUrl',
        label: 'Link URL (optional)',
        type: 'text',
        required: false,
        placeholder: 'https://example.com'
      }
    ]
  },
  {
    id: 'sms-received',
    name: 'SMS Received',
    category: 'communication',
    icon: MessageSquare,
    description: 'Triggered when a contact sends an SMS',
    color: 'bg-green-600',
    fields: [
      {
        name: 'keyword',
        label: 'Contains Keyword',
        type: 'text',
        required: false,
        placeholder: 'Optional keyword to match'
      }
    ]
  },
  {
    id: 'missed-call',
    name: 'Missed Call',
    category: 'communication',
    icon: Phone,
    description: 'Triggered when a contact has a missed call',
    color: 'bg-red-500',
    fields: [
      {
        name: 'duration',
        label: 'Minimum Ring Duration (seconds)',
        type: 'number',
        required: false,
        validation: { min: 0, max: 300 }
      }
    ]
  },

  // Behavioral Triggers
  {
    id: 'form-submitted',
    name: 'Form Submitted',
    category: 'behavioral',
    icon: FileText,
    description: 'Triggered when a contact submits a form',
    color: 'bg-yellow-500',
    fields: [
      {
        name: 'formId',
        label: 'Form',
        type: 'select',
        required: true,
        options: [
          { value: 'contact-form', label: 'Contact Form' },
          { value: 'quote-form', label: 'Quote Request Form' },
          { value: 'survey-form', label: 'Survey Form' }
        ]
      }
    ]
  },
  {
    id: 'website-visit',
    name: 'Website Visit',
    category: 'behavioral',
    icon: Globe,
    description: 'Triggered when a contact visits a specific page',
    color: 'bg-cyan-500',
    fields: [
      {
        name: 'pageUrl',
        label: 'Page URL',
        type: 'text',
        required: true,
        placeholder: '/pricing'
      },
      {
        name: 'visitCount',
        label: 'Visit Count',
        type: 'number',
        required: false,
        validation: { min: 1, max: 100 }
      }
    ]
  },

  // Calendar Triggers
  {
    id: 'appointment-booked',
    name: 'Appointment Booked',
    category: 'calendar',
    icon: Calendar,
    description: 'Triggered when a contact books an appointment',
    color: 'bg-emerald-500',
    fields: [
      {
        name: 'calendarType',
        label: 'Calendar Type',
        type: 'select',
        required: false,
        options: [
          { value: 'any', label: 'Any Calendar' },
          { value: 'consultation', label: 'Consultation' },
          { value: 'demo', label: 'Demo' },
          { value: 'meeting', label: 'Meeting' }
        ]
      }
    ]
  },
  {
    id: 'appointment-completed',
    name: 'Appointment Completed',
    category: 'calendar',
    icon: Calendar,
    description: 'Triggered when an appointment is marked as completed',
    color: 'bg-green-700',
    fields: []
  },
  {
    id: 'appointment-no-show',
    name: 'Appointment No Show',
    category: 'calendar',
    icon: Calendar,
    description: 'Triggered when a contact misses their appointment',
    color: 'bg-red-600',
    fields: [
      {
        name: 'waitTime',
        label: 'Wait Time (minutes)',
        type: 'number',
        required: false,
        validation: { min: 1, max: 60 }
      }
    ]
  },

  // E-commerce Triggers
  {
    id: 'purchase-made',
    name: 'Purchase Made',
    category: 'ecommerce',
    icon: CreditCard,
    description: 'Triggered when a contact makes a purchase',
    color: 'bg-green-600',
    fields: [
      {
        name: 'minimumAmount',
        label: 'Minimum Amount',
        type: 'number',
        required: false,
        validation: { min: 0 }
      },
      {
        name: 'productId',
        label: 'Specific Product',
        type: 'select',
        required: false,
        options: [
          { value: 'any', label: 'Any Product' },
          { value: 'premium', label: 'Premium Package' },
          { value: 'basic', label: 'Basic Package' }
        ]
      }
    ]
  },
  {
    id: 'cart-abandoned',
    name: 'Cart Abandoned',
    category: 'ecommerce',
    icon: ShoppingCart,
    description: 'Triggered when a contact abandons their shopping cart',
    color: 'bg-orange-600',
    fields: [
      {
        name: 'timeDelay',
        label: 'Time Since Abandonment (hours)',
        type: 'number',
        required: true,
        validation: { min: 1, max: 168 }
      }
    ]
  },

  // Location Triggers
  {
    id: 'geofence-entered',
    name: 'Geofence Entered',
    category: 'location',
    icon: MapPin,
    description: 'Triggered when a contact enters a defined location',
    color: 'bg-pink-500',
    fields: [
      {
        name: 'locationName',
        label: 'Location Name',
        type: 'text',
        required: true,
        placeholder: 'Store Location'
      },
      {
        name: 'radius',
        label: 'Radius (meters)',
        type: 'number',
        required: true,
        validation: { min: 10, max: 10000 }
      }
    ]
  },

  // System Triggers
  {
    id: 'date-time',
    name: 'Date/Time',
    category: 'system',
    icon: Clock,
    description: 'Triggered at a specific date or time',
    color: 'bg-gray-600',
    fields: [
      {
        name: 'triggerType',
        label: 'Trigger Type',
        type: 'select',
        required: true,
        options: [
          { value: 'specific-date', label: 'Specific Date' },
          { value: 'recurring', label: 'Recurring' },
          { value: 'relative', label: 'Relative to Contact' }
        ]
      },
      {
        name: 'date',
        label: 'Date',
        type: 'date',
        required: false
      },
      {
        name: 'time',
        label: 'Time',
        type: 'time',
        required: false
      }
    ]
  }
];

export const getTriggersByCategory = (category: string) => {
  return triggerTypes.filter(trigger => trigger.category === category);
};

export const getTriggerById = (id: string) => {
  return triggerTypes.find(trigger => trigger.id === id);
};

export const triggerCategories = [
  { id: 'contact', name: 'Contact', icon: Users },
  { id: 'communication', name: 'Communication', icon: Mail },
  { id: 'behavioral', name: 'Behavioral', icon: Globe },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'ecommerce', name: 'E-commerce', icon: CreditCard },
  { id: 'location', name: 'Location', icon: MapPin },
  { id: 'system', name: 'System', icon: Clock }
];