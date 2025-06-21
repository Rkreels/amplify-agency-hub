
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target, 
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Star
} from 'lucide-react';

interface MetricData {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

interface MetricsWidgetProps {
  title: string;
  metrics: MetricData[];
  className?: string;
}

export function MetricsWidget({ title, metrics, className = "" }: MetricsWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 rounded-lg border bg-gradient-to-r from-white to-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${metric.color}`}>
                  {metric.icon}
                </div>
                <Badge 
                  variant={metric.changeType === 'increase' ? 'default' : 'destructive'}
                  className="flex items-center gap-1"
                >
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(metric.change)}%
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm text-gray-600">{metric.title}</p>
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-configured metric widgets
export function SalesMetricsWidget() {
  const salesMetrics: MetricData[] = [
    {
      title: 'Total Revenue',
      value: '$127,350',
      change: 12.5,
      changeType: 'increase',
      icon: <DollarSign className="h-4 w-4 text-white" />,
      color: 'bg-green-500',
      subtitle: 'This month'
    },
    {
      title: 'Active Opportunities',
      value: 24,
      change: 8.3,
      changeType: 'increase',
      icon: <Target className="h-4 w-4 text-white" />,
      color: 'bg-blue-500',
      subtitle: 'In pipeline'
    },
    {
      title: 'Conversion Rate',
      value: '23.4%',
      change: 3.2,
      changeType: 'increase',
      icon: <TrendingUp className="h-4 w-4 text-white" />,
      color: 'bg-purple-500',
      subtitle: 'Lead to customer'
    }
  ];

  return <MetricsWidget title="Sales Performance" metrics={salesMetrics} />;
}

export function ContactMetricsWidget() {
  const contactMetrics: MetricData[] = [
    {
      title: 'Total Contacts',
      value: '2,847',
      change: 15.2,
      changeType: 'increase',
      icon: <Users className="h-4 w-4 text-white" />,
      color: 'bg-indigo-500',
      subtitle: 'All contacts'
    },
    {
      title: 'New Leads',
      value: 156,
      change: 23.1,
      changeType: 'increase',
      icon: <Star className="h-4 w-4 text-white" />,
      color: 'bg-yellow-500',
      subtitle: 'This week'
    },
    {
      title: 'Response Rate',
      value: '68.4%',
      change: 5.7,
      changeType: 'increase',
      icon: <MessageSquare className="h-4 w-4 text-white" />,
      color: 'bg-teal-500',
      subtitle: 'Email campaigns'
    }
  ];

  return <MetricsWidget title="Contact Metrics" metrics={contactMetrics} />;
}

export function ActivityMetricsWidget() {
  const activityMetrics: MetricData[] = [
    {
      title: 'Appointments',
      value: 18,
      change: 6.3,
      changeType: 'increase',
      icon: <Calendar className="h-4 w-4 text-white" />,
      color: 'bg-orange-500',
      subtitle: 'This week'
    },
    {
      title: 'Emails Sent',
      value: '1,243',
      change: 11.2,
      changeType: 'increase',
      icon: <Mail className="h-4 w-4 text-white" />,
      color: 'bg-red-500',
      subtitle: 'This month'
    },
    {
      title: 'Calls Made',
      value: 89,
      change: 2.1,
      changeType: 'decrease',
      icon: <Phone className="h-4 w-4 text-white" />,
      color: 'bg-pink-500',
      subtitle: 'This week'
    }
  ];

  return <MetricsWidget title="Activity Summary" metrics={activityMetrics} />;
}
