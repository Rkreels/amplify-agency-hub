
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Tag, 
  Clock, 
  Webhook, 
  FileText,
  UserPlus,
  MousePointer,
  MessageSquare,
  Globe
} from 'lucide-react';

export interface TriggerType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'contact' | 'form' | 'appointment' | 'payment' | 'time' | 'integration' | 'website';
  isPremium?: boolean;
}

export const triggerTypes: TriggerType[] = [
  // Contact Triggers
  {
    id: 'contact_added',
    name: 'Contact Added',
    description: 'When a new contact is added to the system',
    icon: UserPlus,
    category: 'contact'
  },
  {
    id: 'tag_added',
    name: 'Tag Added',
    description: 'When a specific tag is added to a contact',
    icon: Tag,
    category: 'contact'
  },
  {
    id: 'tag_removed',
    name: 'Tag Removed',
    description: 'When a specific tag is removed from a contact',
    icon: Tag,
    category: 'contact'
  },
  {
    id: 'contact_updated',
    name: 'Contact Updated',
    description: 'When contact information is modified',
    icon: UserPlus,
    category: 'contact'
  },

  // Form Triggers
  {
    id: 'form_submitted',
    name: 'Form Submitted',
    description: 'When a form is submitted on your website',
    icon: FileText,
    category: 'form'
  },
  {
    id: 'survey_completed',
    name: 'Survey Completed',
    description: 'When a survey is completed by a contact',
    icon: FileText,
    category: 'form'
  },

  // Appointment Triggers
  {
    id: 'appointment_booked',
    name: 'Appointment Booked',
    description: 'When an appointment is scheduled',
    icon: Calendar,
    category: 'appointment'
  },
  {
    id: 'appointment_cancelled',
    name: 'Appointment Cancelled',
    description: 'When an appointment is cancelled',
    icon: Calendar,
    category: 'appointment'
  },
  {
    id: 'appointment_completed',
    name: 'Appointment Completed',
    description: 'When an appointment is marked as completed',
    icon: Calendar,
    category: 'appointment'
  },

  // Payment Triggers
  {
    id: 'payment_received',
    name: 'Payment Received',
    description: 'When a payment is successfully processed',
    icon: DollarSign,
    category: 'payment',
    isPremium: true
  },
  {
    id: 'payment_failed',
    name: 'Payment Failed',
    description: 'When a payment attempt fails',
    icon: DollarSign,
    category: 'payment',
    isPremium: true
  },
  {
    id: 'subscription_created',
    name: 'Subscription Created',
    description: 'When a new subscription is created',
    icon: DollarSign,
    category: 'payment',
    isPremium: true
  },

  // Time-based Triggers
  {
    id: 'date_reached',
    name: 'Date Reached',
    description: 'When a specific date is reached',
    icon: Clock,
    category: 'time'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'When it\'s a contact\'s birthday',
    icon: Clock,
    category: 'time'
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    description: 'When it\'s a contact\'s anniversary',
    icon: Clock,
    category: 'time'
  },

  // Integration Triggers
  {
    id: 'webhook_received',
    name: 'Webhook Received',
    description: 'When a webhook is received from external service',
    icon: Webhook,
    category: 'integration',
    isPremium: true
  },
  {
    id: 'api_call',
    name: 'API Call',
    description: 'When an API endpoint is called',
    icon: Globe,
    category: 'integration',
    isPremium: true
  },

  // Website Triggers
  {
    id: 'page_visited',
    name: 'Page Visited',
    description: 'When a contact visits a specific page',
    icon: MousePointer,
    category: 'website'
  },
  {
    id: 'email_opened',
    name: 'Email Opened',
    description: 'When a contact opens an email',
    icon: Mail,
    category: 'website'
  },
  {
    id: 'email_clicked',
    name: 'Email Link Clicked',
    description: 'When a contact clicks a link in an email',
    icon: MousePointer,
    category: 'website'
  },
  {
    id: 'sms_received',
    name: 'SMS Received',
    description: 'When an SMS is received from a contact',
    icon: MessageSquare,
    category: 'website'
  }
];

interface TriggerTypesProps {
  selectedTrigger: string | null;
  onTriggerSelect: (triggerId: string) => void;
}

export const TriggerTypes: React.FC<TriggerTypesProps> = ({
  selectedTrigger,
  onTriggerSelect
}) => {
  const categories = [
    { id: 'contact', name: 'Contact Events', color: 'bg-blue-100 text-blue-700' },
    { id: 'form', name: 'Forms & Surveys', color: 'bg-green-100 text-green-700' },
    { id: 'appointment', name: 'Appointments', color: 'bg-purple-100 text-purple-700' },
    { id: 'payment', name: 'Payments', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'time', name: 'Time-based', color: 'bg-red-100 text-red-700' },
    { id: 'integration', name: 'Integrations', color: 'bg-indigo-100 text-indigo-700' },
    { id: 'website', name: 'Website Activity', color: 'bg-pink-100 text-pink-700' }
  ];

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryTriggers = triggerTypes.filter(t => t.category === category.id);
        
        return (
          <div key={category.id} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge className={category.color}>
                {category.name}
              </Badge>
              <span className="text-sm text-gray-500">
                {categoryTriggers.length} triggers
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {categoryTriggers.map(trigger => {
                const IconComponent = trigger.icon;
                const isSelected = selectedTrigger === trigger.id;
                
                return (
                  <Card
                    key={trigger.id}
                    className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onTriggerSelect(trigger.id)}
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
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-sm text-gray-900">
                            {trigger.name}
                          </h3>
                          {trigger.isPremium && (
                            <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {trigger.description}
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
    </div>
  );
};
