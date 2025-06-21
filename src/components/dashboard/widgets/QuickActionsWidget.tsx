
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Users, 
  Mail, 
  Calendar, 
  Phone, 
  MessageSquare,
  Target,
  Zap,
  FileText,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: string;
  disabled?: boolean;
}

export function QuickActionsWidget() {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      title: 'Add Contact',
      description: 'Create new contact or lead',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        navigate('/contacts');
        toast.success('Navigate to contacts to add new contact');
      }
    },
    {
      title: 'Schedule Appointment',
      description: 'Book new meeting or call',
      icon: <Calendar className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        navigate('/calendars');
        toast.success('Navigate to calendar to schedule appointment');
      }
    },
    {
      title: 'Send Email Campaign',
      description: 'Create and send marketing email',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        navigate('/email-marketing');
        toast.success('Navigate to email marketing');
      }
    },
    {
      title: 'Create Opportunity',
      description: 'Add new sales opportunity',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        navigate('/opportunities');
        toast.success('Navigate to opportunities');
      }
    },
    {
      title: 'Build Automation',
      description: 'Create workflow automation',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => {
        navigate('/automation/builder');
        toast.success('Navigate to automation builder');
      }
    },
    {
      title: 'SMS Campaign',
      description: 'Send bulk SMS messages',
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'bg-teal-500 hover:bg-teal-600',
      action: () => {
        navigate('/marketing/sms-campaigns');
        toast.success('Navigate to SMS campaigns');
      }
    },
    {
      title: 'Create Funnel',
      description: 'Build landing page funnel',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => {
        navigate('/sites');
        toast.success('Navigate to sites and funnels');
      }
    },
    {
      title: 'View Reports',
      description: 'Check performance analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-pink-500 hover:bg-pink-600',
      action: () => {
        navigate('/reporting');
        toast.success('Navigate to reporting');
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-center gap-2 relative ${action.color} text-white border-0 transition-all hover:scale-105`}
              onClick={action.action}
              disabled={action.disabled}
            >
              {action.badge && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs"
                >
                  {action.badge}
                </Badge>
              )}
              <div className="text-center">
                {action.icon}
                <p className="font-medium text-sm mt-1">{action.title}</p>
                <p className="text-xs opacity-90 leading-tight">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
