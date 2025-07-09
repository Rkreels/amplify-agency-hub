
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, MessageSquare, Calendar, DollarSign } from 'lucide-react';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'sms' | 'appointment' | 'opportunity';
  description: string;
  contact: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    description: 'Called Sarah Johnson about follow-up',
    contact: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '2',
    type: 'email',
    description: 'Sent welcome email sequence',
    contact: 'Michael Brown',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'completed'
  },
  {
    id: '3',
    type: 'appointment',
    description: 'Scheduled consultation',
    contact: 'Emma Davis',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '4',
    type: 'opportunity',
    description: 'New opportunity created - $5,000',
    contact: 'James Wilson',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'completed'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'call': return <Phone className="h-4 w-4" />;
    case 'email': return <Mail className="h-4 w-4" />;
    case 'sms': return <MessageSquare className="h-4 w-4" />;
    case 'appointment': return <Calendar className="h-4 w-4" />;
    case 'opportunity': return <DollarSign className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'failed': return 'bg-red-100 text-red-800';
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10">
                {getActivityIcon(activity.type)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{activity.contact}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {activity.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
