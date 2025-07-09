import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Phone,
  Mail,
  Star,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useContactsStore } from '@/store/useContactsStore';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

export function ComprehensiveDashboard() {
  const { metrics, activities, refreshData, addActivity } = useDashboardStore();
  const { contacts } = useContactsStore();
  const { addNotification } = useAppStore();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Add random activity
      const activityTypes = ['contact', 'opportunity', 'campaign', 'appointment', 'call'];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      addActivity({
        type: randomType as any,
        title: `New ${randomType}`,
        description: `A new ${randomType} event occurred`,
        timestamp: new Date(),
        status: 'success'
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [addActivity]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
    toast.success('Dashboard data refreshed');
    addNotification({
      type: 'success',
      title: 'Data Refresh',
      message: 'Dashboard metrics have been updated'
    });
  };

  const quickActions = [
    {
      title: 'Add Contact',
      description: 'Create a new contact',
      icon: Users,
      action: () => {
        toast.success('Opening contact form...');
        // This would typically navigate to contacts page or open modal
      }
    },
    {
      title: 'Schedule Appointment',
      description: 'Book a new appointment',
      icon: Calendar,
      action: () => {
        toast.success('Opening calendar...');
      }
    },
    {
      title: 'Start Campaign',
      description: 'Launch a marketing campaign',
      icon: Mail,
      action: () => {
        toast.success('Opening campaign builder...');
      }
    },
    {
      title: 'View Analytics',
      description: 'Check detailed reports',
      icon: BarChart3,
      action: () => {
        toast.success('Opening analytics...');
      }
    }
  ];

  const recentOpportunities = [
    {
      id: '1',
      title: 'Website Redesign',
      value: 15000,
      stage: 'Proposal',
      probability: 75,
      contact: 'John Smith'
    },
    {
      id: '2',
      title: 'SEO Services',
      value: 5000,
      stage: 'Negotiation',
      probability: 60,
      contact: 'Sarah Johnson'
    },
    {
      id: '3',
      title: 'Social Media Management',
      value: 3000,
      stage: 'Qualified',
      probability: 40,
      contact: 'Mike Davis'
    }
  ];

  const upcomingTasks = [
    {
      id: '1',
      title: 'Follow up with lead',
      time: '10:00 AM',
      priority: 'high',
      type: 'call'
    },
    {
      id: '2',
      title: 'Review campaign performance',
      time: '2:00 PM',
      priority: 'medium',
      type: 'review'
    },
    {
      id: '3',
      title: 'Client presentation',
      time: '4:00 PM',
      priority: 'high',
      type: 'meeting'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
          >
            <Activity className="h-4 w-4 mr-2" />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length.toLocaleString()}</div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{Math.floor(Math.random() * 50)} this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.appointments}</div>
            <div className="flex items-center text-sm text-purple-600">
              <Clock className="h-3 w-3 mr-1" />
              {Math.floor(Math.random() * 10)} today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-orange-600" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <div className="flex items-center text-sm text-orange-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={action.action}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Opportunities</CardTitle>
              <CardDescription>Latest deals in your pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOpportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <div className="font-medium">{opp.title}</div>
                      <div className="text-sm text-muted-foreground">{opp.contact}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${opp.value.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{opp.stage}</Badge>
                        <span className="text-xs text-muted-foreground">{opp.probability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Email Open Rate</span>
                    <span className="font-medium">{metrics.emailOpenRate}%</span>
                  </div>
                  <Progress value={metrics.emailOpenRate} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lead Conversion</span>
                    <span className="font-medium">{metrics.leadConversion}%</span>
                  </div>
                  <Progress value={metrics.leadConversion} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-medium">{metrics.responseTime}h avg</span>
                  </div>
                  <Progress value={(24 - metrics.responseTime) / 24 * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity and Tasks */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Your agenda for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.time}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 10).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' : 
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {activity.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Platform health overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Service</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Automation</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics</span>
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Processing
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
