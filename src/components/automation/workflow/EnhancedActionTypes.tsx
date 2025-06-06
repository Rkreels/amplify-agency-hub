
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  MessageSquare, 
  Phone,
  Tag, 
  User, 
  DollarSign, 
  Calendar, 
  Clock,
  Webhook,
  FileText,
  BarChart3,
  Target,
  Zap,
  Globe,
  Database,
  Bell,
  Settings,
  GitBranch,
  Copy,
  Trash2,
  Plus,
  Minus,
  Edit,
  Send,
  Download,
  Upload,
  Link,
  Star,
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export interface EnhancedActionType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'communication' | 'contact' | 'sales' | 'automation' | 'integration' | 'analytics' | 'scheduling' | 'flow';
  isPremium?: boolean;
  isNew?: boolean;
}

export const enhancedActionTypes: EnhancedActionType[] = [
  // Communication Actions
  {
    id: 'send_email_sequence',
    name: 'Send Email Sequence',
    description: 'Send a series of emails over time',
    icon: Mail,
    category: 'communication',
    isNew: true
  },
  {
    id: 'send_email_ab_test',
    name: 'A/B Test Email',
    description: 'Send two different email versions to test performance',
    icon: Mail,
    category: 'communication',
    isPremium: true,
    isNew: true
  },
  {
    id: 'send_personalized_email',
    name: 'Send Personalized Email',
    description: 'Send email with dynamic content based on contact data',
    icon: Mail,
    category: 'communication',
    isNew: true
  },
  {
    id: 'send_sms_sequence',
    name: 'Send SMS Sequence',
    description: 'Send a series of SMS messages over time',
    icon: MessageSquare,
    category: 'communication',
    isNew: true
  },
  {
    id: 'send_voicemail',
    name: 'Send Voicemail',
    description: 'Send a pre-recorded voicemail message',
    icon: Phone,
    category: 'communication',
    isPremium: true,
    isNew: true
  },
  {
    id: 'make_phone_call',
    name: 'Make Phone Call',
    description: 'Initiate an automated phone call',
    icon: Phone,
    category: 'communication',
    isPremium: true,
    isNew: true
  },

  // Contact Management
  {
    id: 'update_custom_field',
    name: 'Update Custom Field',
    description: 'Update a custom field value for the contact',
    icon: Edit,
    category: 'contact',
    isNew: true
  },
  {
    id: 'calculate_lead_score',
    name: 'Calculate Lead Score',
    description: 'Update lead score based on contact activities',
    icon: BarChart3,
    category: 'contact',
    isPremium: true,
    isNew: true
  },
  {
    id: 'add_contact_note',
    name: 'Add Contact Note',
    description: 'Add a timestamped note to contact record',
    icon: FileText,
    category: 'contact',
    isNew: true
  },
  {
    id: 'duplicate_contact_check',
    name: 'Check for Duplicates',
    description: 'Check if contact is a duplicate and merge if needed',
    icon: Copy,
    category: 'contact',
    isNew: true
  },
  {
    id: 'segment_contact',
    name: 'Add to Segment',
    description: 'Add contact to a specific segment',
    icon: Target,
    category: 'contact',
    isNew: true
  },

  // Sales & Opportunities
  {
    id: 'update_pipeline_stage',
    name: 'Update Pipeline Stage',
    description: 'Move opportunity to a different pipeline stage',
    icon: Target,
    category: 'sales',
    isNew: true
  },
  {
    id: 'create_invoice',
    name: 'Create Invoice',
    description: 'Generate and send an invoice',
    icon: FileText,
    category: 'sales',
    isPremium: true,
    isNew: true
  },
  {
    id: 'process_payment',
    name: 'Process Payment',
    description: 'Charge a payment method on file',
    icon: DollarSign,
    category: 'sales',
    isPremium: true,
    isNew: true
  },
  {
    id: 'send_proposal',
    name: 'Send Proposal',
    description: 'Send a customized proposal document',
    icon: FileText,
    category: 'sales',
    isPremium: true,
    isNew: true
  },
  {
    id: 'schedule_follow_up',
    name: 'Schedule Follow-up',
    description: 'Create a follow-up task or reminder',
    icon: Calendar,
    category: 'sales',
    isNew: true
  },

  // Integration Actions
  {
    id: 'webhook_post',
    name: 'Send Webhook',
    description: 'Send data to an external webhook URL',
    icon: Webhook,
    category: 'integration',
    isPremium: true,
    isNew: true
  },
  {
    id: 'zapier_trigger',
    name: 'Trigger Zapier Zap',
    description: 'Trigger a Zapier automation',
    icon: Zap,
    category: 'integration',
    isPremium: true,
    isNew: true
  },
  {
    id: 'api_request',
    name: 'Make API Request',
    description: 'Send a custom API request to external service',
    icon: Globe,
    category: 'integration',
    isPremium: true,
    isNew: true
  },
  {
    id: 'database_update',
    name: 'Update Database',
    description: 'Update external database record',
    icon: Database,
    category: 'integration',
    isPremium: true,
    isNew: true
  },

  // Analytics Actions
  {
    id: 'track_event',
    name: 'Track Custom Event',
    description: 'Record a custom analytics event',
    icon: BarChart3,
    category: 'analytics',
    isNew: true
  },
  {
    id: 'update_conversion',
    name: 'Mark Conversion',
    description: 'Track a conversion event for reporting',
    icon: Target,
    category: 'analytics',
    isNew: true
  },
  {
    id: 'log_activity',
    name: 'Log Activity',
    description: 'Record a custom activity in the timeline',
    icon: FileText,
    category: 'analytics',
    isNew: true
  },

  // Scheduling Actions
  {
    id: 'book_appointment',
    name: 'Book Appointment',
    description: 'Automatically book an appointment',
    icon: Calendar,
    category: 'scheduling',
    isPremium: true,
    isNew: true
  },
  {
    id: 'reschedule_appointment',
    name: 'Reschedule Appointment',
    description: 'Move an existing appointment to a new time',
    icon: Calendar,
    category: 'scheduling',
    isPremium: true,
    isNew: true
  },
  {
    id: 'send_calendar_invite',
    name: 'Send Calendar Invite',
    description: 'Send a calendar invitation',
    icon: Calendar,
    category: 'scheduling',
    isNew: true
  },

  // Advanced Flow Control
  {
    id: 'advanced_wait',
    name: 'Advanced Wait',
    description: 'Wait with complex timing and conditions',
    icon: Clock,
    category: 'flow',
    isNew: true
  },
  {
    id: 'random_branch',
    name: 'Random Branch',
    description: 'Randomly split contacts into different paths',
    icon: GitBranch,
    category: 'flow',
    isNew: true
  },
  {
    id: 'goal_tracker',
    name: 'Goal Tracker',
    description: 'Track if contact completes a specific goal',
    icon: Target,
    category: 'flow',
    isPremium: true,
    isNew: true
  },
  {
    id: 'loop_control',
    name: 'Loop Control',
    description: 'Create repeating actions with exit conditions',
    icon: GitBranch,
    category: 'flow',
    isPremium: true,
    isNew: true
  }
];

interface EnhancedActionTypesProps {
  selectedAction: string | null;
  onActionSelect: (actionId: string) => void;
  searchTerm: string;
  selectedCategory: string | null;
}

export const EnhancedActionTypes: React.FC<EnhancedActionTypesProps> = ({
  selectedAction,
  onActionSelect,
  searchTerm,
  selectedCategory
}) => {
  const categories = [
    { id: 'communication', name: 'Communication', color: 'bg-blue-100 text-blue-700' },
    { id: 'contact', name: 'Contact Management', color: 'bg-green-100 text-green-700' },
    { id: 'sales', name: 'Sales & Revenue', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'integration', name: 'Integrations', color: 'bg-purple-100 text-purple-700' },
    { id: 'analytics', name: 'Analytics & Tracking', color: 'bg-pink-100 text-pink-700' },
    { id: 'scheduling', name: 'Scheduling', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'flow', name: 'Flow Control', color: 'bg-gray-100 text-gray-700' }
  ];

  const filteredActions = enhancedActionTypes.filter(action => {
    const matchesSearch = !searchTerm || 
      action.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || action.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoriesToShow = selectedCategory 
    ? categories.filter(cat => cat.id === selectedCategory)
    : categories;

  return (
    <div className="space-y-6">
      {categoriesToShow.map(category => {
        const categoryActions = filteredActions.filter(a => a.category === category.id);
        
        if (categoryActions.length === 0) return null;
        
        return (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge className={category.color}>
                {category.name}
              </Badge>
              <span className="text-sm text-gray-500">
                {categoryActions.length} actions
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {categoryActions.map(action => {
                const IconComponent = action.icon;
                const isSelected = selectedAction === action.id;
                
                return (
                  <Card
                    key={action.id}
                    className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onActionSelect(action.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h3 className="font-medium text-sm text-gray-900">
                            {action.name}
                          </h3>
                          {action.isPremium && (
                            <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                              Premium
                            </Badge>
                          )}
                          {action.isNew && (
                            <Badge variant="outline" className="text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {filteredActions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No actions found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
