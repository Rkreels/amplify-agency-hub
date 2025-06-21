
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  MessageSquare,
  Target,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'contact_added' | 'opportunity_created' | 'sms' | 'task_completed' | 'workflow_triggered';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'info' | 'error';
  user: string;
  relatedEntity?: {
    type: 'contact' | 'opportunity' | 'campaign';
    name: string;
    id: string;
  };
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'email': return <Mail className="h-4 w-4" />;
    case 'call': return <Phone className="h-4 w-4" />;
    case 'meeting': return <Calendar className="h-4 w-4" />;
    case 'contact_added': return <Users className="h-4 w-4" />;
    case 'opportunity_created': return <Target className="h-4 w-4" />;
    case 'sms': return <MessageSquare className="h-4 w-4" />;
    case 'task_completed': return <CheckCircle className="h-4 w-4" />;
    case 'workflow_triggered': return <AlertCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'success': return 'text-green-600 bg-green-50';
    case 'warning': return 'text-yellow-600 bg-yellow-50';
    case 'error': return 'text-red-600 bg-red-50';
    case 'info': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

export function RecentActivityWidget() {
  // Sample activities - in a real app, this would come from an API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'email',
      title: 'Email Campaign Sent',
      description: 'Welcome series email sent to 245 contacts',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'success',
      user: 'System',
      relatedEntity: { type: 'campaign', name: 'Welcome Series', id: 'camp-1' }
    },
    {
      id: '2',
      type: 'contact_added',
      title: 'New Contact Created',
      description: 'John Smith added as a lead from website form',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      status: 'info',
      user: 'Web Form',
      relatedEntity: { type: 'contact', name: 'John Smith', id: 'contact-1' }
    },
    {
      id: '3',
      type: 'call',
      title: 'Call Completed',
      description: 'Sales call with Sarah Johnson - interested in premium package',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'success',
      user: 'Mike Davis',
      relatedEntity: { type: 'contact', name: 'Sarah Johnson', id: 'contact-2' }
    },
    {
      id: '4',
      type: 'opportunity_created',
      title: 'New Opportunity',
      description: '$5,000 opportunity created for ABC Corp',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'success',
      user: 'Jane Wilson',
      relatedEntity: { type: 'opportunity', name: 'ABC Corp Deal', id: 'opp-1' }
    },
    {
      id: '5',
      type: 'workflow_triggered',
      title: 'Automation Triggered',
      description: 'Follow-up sequence started for new lead',
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      status: 'info',
      user: 'System'
    },
    {
      id: '6',
      type: 'meeting',
      title: 'Meeting Scheduled',
      description: 'Demo call scheduled with prospect for tomorrow',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      status: 'info',
      user: 'Tom Brown',
      relatedEntity: { type: 'contact', name: 'Alex Turner', id: 'contact-3' }
    },
    {
      id: '7',
      type: 'sms',
      title: 'SMS Campaign Sent',
      description: 'Promotional SMS sent to 150 contacts',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      status: 'success',
      user: 'Marketing Team'
    },
    {
      id: '8',
      type: 'task_completed',
      title: 'Task Completed',
      description: 'Monthly report generation completed',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      status: 'success',
      user: 'System'
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b last:border-b-0"
              >
                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      by {activity.user}
                    </span>
                    
                    {activity.relatedEntity && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <Badge variant="outline" className="text-xs py-0">
                          {activity.relatedEntity.type}: {activity.relatedEntity.name}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
