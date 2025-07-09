
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  Target, 
  Calendar, 
  TrendingUp, 
  Phone, 
  Mail, 
  MessageSquare,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';

const revenueData = [
  { month: 'Jan', revenue: 45000, leads: 120 },
  { month: 'Feb', revenue: 52000, leads: 150 },
  { month: 'Mar', revenue: 48000, leads: 130 },
  { month: 'Apr', revenue: 61000, leads: 180 },
  { month: 'May', revenue: 55000, leads: 160 },
  { month: 'Jun', revenue: 67000, leads: 200 },
];

const conversionData = [
  { name: 'Leads', value: 400, color: '#3b82f6' },
  { name: 'Qualified', value: 300, color: '#10b981' },
  { name: 'Proposals', value: 150, color: '#f59e0b' },
  { name: 'Closed', value: 75, color: '#8b5cf6' },
];

export function ComprehensiveDashboard() {
  const { 
    metrics, 
    activities, 
    isLoading, 
    updateMetrics, 
    addActivity, 
    refreshData 
  } = useDashboardStore();
  
  const { announceFeature } = useVoiceTraining();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  useEffect(() => {
    announceFeature(
      'Dashboard Overview',
      'Welcome to your comprehensive dashboard. Here you can monitor key metrics, track revenue, manage opportunities, and view recent activities. Use the refresh button to update data or quick actions to perform common tasks.'
    );
  }, [announceFeature]);

  const handleRefresh = async () => {
    await refreshData();
    toast.success('Dashboard data refreshed');
  };

  const handleQuickAction = (action: string) => {
    addActivity({
      type: 'contact',
      title: `Quick Action: ${action}`,
      description: `Performed ${action} from dashboard`,
      timestamp: new Date(),
      status: 'success'
    });
    toast.success(`${action} completed`);
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color,
    onClick 
  }: {
    title: string;
    value: string | number;
    change: string;
    icon: any;
    color: string;
    onClick?: () => void;
  }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${onClick ? 'hover:bg-muted/50' : ''}`} onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <TrendingUp className="h-3 w-3 mr-1" />
          {change}
        </div>
      </CardContent>
    </Card>
  );

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
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => handleQuickAction('New Contact')}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((period) => (
          <Button
            key={period}
            variant={selectedTimeframe === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe(period)}
          >
            {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          change="+12.5% from last month"
          icon={DollarSign}
          color="text-green-600"
          onClick={() => handleQuickAction('View Revenue Details')}
        />
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          change="+156 new this week"
          icon={Users}
          color="text-blue-600"
          onClick={() => handleQuickAction('View Contacts')}
        />
        <MetricCard
          title="Active Campaigns"
          value={metrics.activeCampaigns}
          change="3 launching this week"
          icon={Target}
          color="text-purple-600"
          onClick={() => handleQuickAction('View Campaigns')}
        />
        <MetricCard
          title="Appointments"
          value={metrics.appointments}
          change="Next: Today 2:00 PM"
          icon={Calendar}
          color="text-orange-600"
          onClick={() => handleQuickAction('View Calendar')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and lead generation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name === 'revenue' ? 'Revenue' : 'Leads'
                  ]}
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
                <Bar dataKey="leads" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead to customer conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {conversionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Progress value={85} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('Create Campaign')}
            >
              <Target className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('Add Contact')}
            >
              <Users className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('Schedule Call')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => handleQuickAction('Send Email')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>
              <Badge variant="outline">5 pending</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'Follow up with John Smith', time: '2:00 PM', priority: 'high' },
                { task: 'Send proposal to ABC Corp', time: '3:30 PM', priority: 'medium' },
                { task: 'Review campaign performance', time: '4:00 PM', priority: 'low' },
                { task: 'Team standup meeting', time: '5:00 PM', priority: 'medium' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{item.task}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                  >
                    {item.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: 'Email Service', status: 'operational', uptime: '99.9%' },
                { service: 'SMS Gateway', status: 'operational', uptime: '99.8%' },
                { service: 'Phone System', status: 'operational', uptime: '99.7%' },
                { service: 'API Services', status: 'maintenance', uptime: '98.9%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.status === 'operational' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">{item.service}</span>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={item.status === 'operational' ? 'default' : 'secondary'}
                    >
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{item.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
