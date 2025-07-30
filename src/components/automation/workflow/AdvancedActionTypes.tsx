import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Users, 
  Tag, 
  Clock, 
  FileText, 
  CreditCard, 
  Bell, 
  Database, 
  Webhook, 
  GitBranch, 
  Zap,
  Send,
  UserCheck,
  UserX,
  ShoppingCart,
  BarChart,
  Share2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Copy,
  Link,
  Trash2
} from 'lucide-react';

export interface ActionType {
  id: string;
  name: string;
  category: 'communication' | 'contact-management' | 'calendar' | 'sales' | 'workflow' | 'integration' | 'analytics';
  icon: React.ComponentType<any>;
  description: string;
  fields: ActionField[];
  color: string;
  isPremium?: boolean;
}

export interface ActionField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'toggle' | 'email-template' | 'sms-template' | 'contact-field' | 'tag-selector' | 'webhook-url';
  required: boolean;
  options?: { value: string; label: string; }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditionalDisplay?: {
    dependsOn: string;
    value: any;
  };
}

export const actionTypes: ActionType[] = [
  // Communication Actions
  {
    id: 'send-email',
    name: 'Send Email',
    category: 'communication',
    icon: Mail,
    description: 'Send an email to the contact',
    color: 'bg-blue-500',
    fields: [
      {
        name: 'template',
        label: 'Email Template',
        type: 'email-template',
        required: true
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'Email subject line'
      },
      {
        name: 'fromEmail',
        label: 'From Email',
        type: 'select',
        required: true,
        options: [
          { value: 'default', label: 'Default Company Email' },
          { value: 'noreply', label: 'noreply@company.com' },
          { value: 'support', label: 'support@company.com' }
        ]
      },
      {
        name: 'trackOpens',
        label: 'Track Opens',
        type: 'toggle',
        required: false
      },
      {
        name: 'trackClicks',
        label: 'Track Clicks',
        type: 'toggle',
        required: false
      }
    ]
  },
  {
    id: 'send-sms',
    name: 'Send SMS',
    category: 'communication',
    icon: MessageSquare,
    description: 'Send an SMS message to the contact',
    color: 'bg-green-500',
    fields: [
      {
        name: 'message',
        label: 'Message',
        type: 'sms-template',
        required: true,
        validation: { max: 160 }
      },
      {
        name: 'fromNumber',
        label: 'From Number',
        type: 'select',
        required: true,
        options: [
          { value: 'default', label: 'Default Business Number' },
          { value: '+1234567890', label: '+1 (234) 567-890' }
        ]
      },
      {
        name: 'mediaUrl',
        label: 'Media URL (optional)',
        type: 'text',
        required: false,
        placeholder: 'https://example.com/image.jpg'
      }
    ]
  },
  {
    id: 'make-call',
    name: 'Make Call',
    category: 'communication',
    icon: Phone,
    description: 'Initiate a phone call to the contact',
    color: 'bg-purple-500',
    isPremium: true,
    fields: [
      {
        name: 'callType',
        label: 'Call Type',
        type: 'select',
        required: true,
        options: [
          { value: 'voicemail-drop', label: 'Voicemail Drop' },
          { value: 'live-call', label: 'Live Call' },
          { value: 'ringless-voicemail', label: 'Ringless Voicemail' }
        ]
      },
      {
        name: 'assignedUser',
        label: 'Assigned User',
        type: 'select',
        required: true,
        options: [
          { value: 'auto', label: 'Auto Assign' },
          { value: 'user-1', label: 'John Doe' },
          { value: 'user-2', label: 'Jane Smith' }
        ]
      }
    ]
  },

  // Contact Management Actions
  {
    id: 'add-tag',
    name: 'Add Tag',
    category: 'contact-management',
    icon: Tag,
    description: 'Add a tag to the contact',
    color: 'bg-yellow-500',
    fields: [
      {
        name: 'tags',
        label: 'Tags to Add',
        type: 'tag-selector',
        required: true
      }
    ]
  },
  {
    id: 'remove-tag',
    name: 'Remove Tag',
    category: 'contact-management',
    icon: UserX,
    description: 'Remove a tag from the contact',
    color: 'bg-orange-500',
    fields: [
      {
        name: 'tags',
        label: 'Tags to Remove',
        type: 'tag-selector',
        required: true
      }
    ]
  },
  {
    id: 'update-contact',
    name: 'Update Contact',
    category: 'contact-management',
    icon: UserCheck,
    description: 'Update contact information',
    color: 'bg-indigo-500',
    fields: [
      {
        name: 'field',
        label: 'Field to Update',
        type: 'contact-field',
        required: true
      },
      {
        name: 'value',
        label: 'New Value',
        type: 'text',
        required: true,
        placeholder: 'Enter new value'
      }
    ]
  },
  {
    id: 'add-to-list',
    name: 'Add to List',
    category: 'contact-management',
    icon: Users,
    description: 'Add contact to a specific list',
    color: 'bg-cyan-500',
    fields: [
      {
        name: 'listId',
        label: 'List',
        type: 'select',
        required: true,
        options: [
          { value: 'prospects', label: 'Prospects' },
          { value: 'customers', label: 'Customers' },
          { value: 'newsletter', label: 'Newsletter Subscribers' }
        ]
      }
    ]
  },

  // Calendar Actions
  {
    id: 'create-task',
    name: 'Create Task',
    category: 'calendar',
    icon: CheckCircle,
    description: 'Create a task for team members',
    color: 'bg-emerald-500',
    fields: [
      {
        name: 'title',
        label: 'Task Title',
        type: 'text',
        required: true,
        placeholder: 'Follow up with lead'
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        placeholder: 'Task details...'
      },
      {
        name: 'assignedTo',
        label: 'Assigned To',
        type: 'select',
        required: true,
        options: [
          { value: 'auto', label: 'Auto Assign' },
          { value: 'user-1', label: 'John Doe' },
          { value: 'user-2', label: 'Jane Smith' }
        ]
      },
      {
        name: 'dueDate',
        label: 'Due In (days)',
        type: 'number',
        required: false,
        validation: { min: 0, max: 365 }
      },
      {
        name: 'priority',
        label: 'Priority',
        type: 'select',
        required: false,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]
      }
    ]
  },
  {
    id: 'book-appointment',
    name: 'Book Appointment',
    category: 'calendar',
    icon: Calendar,
    description: 'Automatically book an appointment',
    color: 'bg-teal-500',
    isPremium: true,
    fields: [
      {
        name: 'calendarId',
        label: 'Calendar',
        type: 'select',
        required: true,
        options: [
          { value: 'consultation', label: 'Consultation Calendar' },
          { value: 'demo', label: 'Demo Calendar' }
        ]
      },
      {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'select',
        required: true,
        options: [
          { value: '15', label: '15 minutes' },
          { value: '30', label: '30 minutes' },
          { value: '60', label: '1 hour' }
        ]
      }
    ]
  },

  // Sales Actions
  {
    id: 'create-opportunity',
    name: 'Create Opportunity',
    category: 'sales',
    icon: CreditCard,
    description: 'Create a sales opportunity',
    color: 'bg-green-600',
    fields: [
      {
        name: 'pipelineId',
        label: 'Pipeline',
        type: 'select',
        required: true,
        options: [
          { value: 'sales-pipeline', label: 'Sales Pipeline' },
          { value: 'service-pipeline', label: 'Service Pipeline' }
        ]
      },
      {
        name: 'stage',
        label: 'Stage',
        type: 'select',
        required: true,
        options: [
          { value: 'lead', label: 'Lead' },
          { value: 'prospect', label: 'Prospect' },
          { value: 'proposal', label: 'Proposal' }
        ]
      },
      {
        name: 'value',
        label: 'Opportunity Value',
        type: 'number',
        required: false,
        validation: { min: 0 }
      },
      {
        name: 'source',
        label: 'Source',
        type: 'text',
        required: false,
        placeholder: 'Lead source'
      }
    ]
  },
  {
    id: 'add-note',
    name: 'Add Note',
    category: 'sales',
    icon: FileText,
    description: 'Add a note to the contact record',
    color: 'bg-gray-500',
    fields: [
      {
        name: 'note',
        label: 'Note',
        type: 'textarea',
        required: true,
        placeholder: 'Add your note here...'
      },
      {
        name: 'isPrivate',
        label: 'Private Note',
        type: 'toggle',
        required: false
      }
    ]
  },

  // Workflow Actions
  {
    id: 'wait',
    name: 'Wait',
    category: 'workflow',
    icon: Clock,
    description: 'Wait for a specified time before continuing',
    color: 'bg-purple-600',
    fields: [
      {
        name: 'waitType',
        label: 'Wait Type',
        type: 'select',
        required: true,
        options: [
          { value: 'duration', label: 'Duration' },
          { value: 'until-date', label: 'Until Date' },
          { value: 'until-time', label: 'Until Time' }
        ]
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'number',
        required: true,
        conditionalDisplay: { dependsOn: 'waitType', value: 'duration' },
        validation: { min: 1 }
      },
      {
        name: 'unit',
        label: 'Unit',
        type: 'select',
        required: true,
        conditionalDisplay: { dependsOn: 'waitType', value: 'duration' },
        options: [
          { value: 'minutes', label: 'Minutes' },
          { value: 'hours', label: 'Hours' },
          { value: 'days', label: 'Days' },
          { value: 'weeks', label: 'Weeks' }
        ]
      }
    ]
  },
  {
    id: 'if-else',
    name: 'If/Else Condition',
    category: 'workflow',
    icon: GitBranch,
    description: 'Create conditional logic in your workflow',
    color: 'bg-indigo-600',
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        required: true,
        options: [
          { value: 'has-tag', label: 'Has Tag' },
          { value: 'field-equals', label: 'Field Equals' },
          { value: 'field-contains', label: 'Field Contains' },
          { value: 'date-comparison', label: 'Date Comparison' }
        ]
      },
      {
        name: 'field',
        label: 'Field',
        type: 'contact-field',
        required: true,
        conditionalDisplay: { dependsOn: 'condition', value: 'field-equals' }
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        required: true,
        placeholder: 'Enter comparison value'
      }
    ]
  },
  {
    id: 'stop-workflow',
    name: 'Stop Workflow',
    category: 'workflow',
    icon: AlertTriangle,
    description: 'Stop the workflow execution',
    color: 'bg-red-500',
    fields: [
      {
        name: 'reason',
        label: 'Reason (optional)',
        type: 'text',
        required: false,
        placeholder: 'Why is the workflow stopping?'
      }
    ]
  },
  {
    id: 'copy-to-workflow',
    name: 'Copy to Workflow',
    category: 'workflow',
    icon: Copy,
    description: 'Copy contact to another workflow',
    color: 'bg-blue-600',
    fields: [
      {
        name: 'targetWorkflow',
        label: 'Target Workflow',
        type: 'select',
        required: true,
        options: [
          { value: 'workflow-1', label: 'Welcome Series' },
          { value: 'workflow-2', label: 'Follow-up Campaign' }
        ]
      },
      {
        name: 'removeFromCurrent',
        label: 'Remove from Current Workflow',
        type: 'toggle',
        required: false
      }
    ]
  },

  // Integration Actions
  {
    id: 'webhook',
    name: 'Webhook',
    category: 'integration',
    icon: Webhook,
    description: 'Send data to an external system',
    color: 'bg-gray-600',
    isPremium: true,
    fields: [
      {
        name: 'url',
        label: 'Webhook URL',
        type: 'webhook-url',
        required: true,
        placeholder: 'https://api.example.com/webhook'
      },
      {
        name: 'method',
        label: 'HTTP Method',
        type: 'select',
        required: true,
        options: [
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'PATCH', label: 'PATCH' }
        ]
      },
      {
        name: 'headers',
        label: 'Headers',
        type: 'textarea',
        required: false,
        placeholder: 'JSON format headers'
      },
      {
        name: 'payload',
        label: 'Payload Template',
        type: 'textarea',
        required: false,
        placeholder: 'JSON payload template'
      }
    ]
  },
  {
    id: 'zapier',
    name: 'Zapier Integration',
    category: 'integration',
    icon: Zap,
    description: 'Trigger a Zapier workflow',
    color: 'bg-orange-600',
    isPremium: true,
    fields: [
      {
        name: 'zapierWebhook',
        label: 'Zapier Webhook URL',
        type: 'text',
        required: true,
        placeholder: 'Zapier webhook URL'
      }
    ]
  },

  // Analytics Actions
  {
    id: 'track-event',
    name: 'Track Event',
    category: 'analytics',
    icon: BarChart,
    description: 'Track a custom event for analytics',
    color: 'bg-pink-500',
    fields: [
      {
        name: 'eventName',
        label: 'Event Name',
        type: 'text',
        required: true,
        placeholder: 'lead_qualified'
      },
      {
        name: 'properties',
        label: 'Event Properties',
        type: 'textarea',
        required: false,
        placeholder: 'JSON format properties'
      }
    ]
  },
  {
    id: 'update-score',
    name: 'Update Lead Score',
    category: 'analytics',
    icon: BarChart,
    description: 'Update the contact lead score',
    color: 'bg-violet-500',
    fields: [
      {
        name: 'scoreChange',
        label: 'Score Change',
        type: 'number',
        required: true,
        validation: { min: -100, max: 100 }
      },
      {
        name: 'reason',
        label: 'Reason',
        type: 'text',
        required: false,
        placeholder: 'Reason for score change'
      }
    ]
  }
];

export const getActionsByCategory = (category: string) => {
  return actionTypes.filter(action => action.category === category);
};

export const getActionById = (id: string) => {
  return actionTypes.find(action => action.id === id);
};

export const actionCategories = [
  { id: 'communication', name: 'Communication', icon: Mail },
  { id: 'contact-management', name: 'Contact Management', icon: Users },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'sales', name: 'Sales', icon: CreditCard },
  { id: 'workflow', name: 'Workflow', icon: GitBranch },
  { id: 'integration', name: 'Integration', icon: Webhook },
  { id: 'analytics', name: 'Analytics', icon: BarChart }
];