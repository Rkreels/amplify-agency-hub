
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Mail, 
  MessageSquare,
  Calendar,
  Target,
  Eye,
  MousePointer,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export function AnalyticsHub() {
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const performanceData = [
    { name: 'Mon', leads: 12, conversions: 8, revenue: 2400 },
    { name: 'Tue', leads: 19, conversions: 12, revenue: 1398 },
    { name: 'Wed', leads: 15, conversions: 9, revenue: 9800 },
    { name: 'Thu', leads: 28, conversions: 18, revenue: 3908 },
    { name: 'Fri', leads: 22, conversions: 14, revenue: 4800 },
    { name: 'Sat', leads: 18, conversions: 11, revenue: 3800 },
    { name: 'Sun', leads: 25, conversions: 16, revenue: 4300 }
  ];

  const channelData = [
    { name: 'Website', value: 45, color: '#8884d8' },
    { name: 'Social Media', value: 25, color: '#82ca9d' },
    { name: 'Email', value: 20, color: '#ffc658' },
    { name: 'Referral', value: 10, color: '#ff7c7c' }
  ];

  const conversionFunnelData = [
    { stage: 'Visitors', count: 10000, percentage: 100 },
    { stage: 'Leads', count: 2500, percentage: 25 },
    { stage: 'Qualified', count: 1000, percentage: 10 },
    { stage: 'Opportunities', count: 500, percentage: 5 },
    { stage: 'Customers', count: 100, percentage: 1 }
  ];

  const emailPerformance = [
    { campaign: 'Welcome Series', sent: 1200, opened: 480, clicked: 96, conversion: 24 },
    { campaign: 'Product Launch', sent: 850, opened: 340, clicked: 68, conversion: 17 },
    { campaign: 'Newsletter', sent: 2100, opened: 630, clicked: 126, conversion: 25 },
    { campaign: 'Re-engagement', sent: 750, opened: 225, clicked: 45, conversion: 9 }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$24,856',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last period'
    },
    {
      title: 'Total Leads',
      value: '1,429',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      description: 'new leads this period'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.4%',
      trend: 'down',
      icon: Target,
      description: 'vs last period'
    },
    {
      title: 'Email Open Rate',
      value: '28.5%',
      change: '+2.1%',
      trend: 'up',
      icon: Mail,
      description: 'average across campaigns'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportData = (type: string) => {
    toast.success(`${type} data exported successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your business performance
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {card.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {card.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {card.description}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-full">
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Page Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47,329</div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +15.2% vs last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Unique Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +8.7% vs last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  Bounce Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34.2%</div>
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +2.1% vs last period
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { page: '/landing-page', views: 8429, conversion: 4.2 },
                  { page: '/pricing', views: 5847, conversion: 8.7 },
                  { page: '/about', views: 3921, conversion: 2.1 },
                  { page: '/contact', views: 2847, conversion: 12.4 },
                  { page: '/blog', views: 1943, conversion: 1.8 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{item.page}</div>
                      <div className="text-sm text-muted-foreground">{item.views} views</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatPercentage(item.conversion)}</div>
                      <div className="text-sm text-muted-foreground">conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-sm text-muted-foreground">
                        {stage.count.toLocaleString()} ({formatPercentage(stage.percentage)})
                      </span>
                    </div>
                    <Progress value={stage.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { goal: 'Newsletter Signup', current: 234, target: 300, rate: 78 },
                  { goal: 'Free Trial', current: 89, target: 120, rate: 74 },
                  { goal: 'Demo Request', current: 45, target: 60, rate: 75 },
                  { goal: 'Purchase', current: 23, target: 40, rate: 58 }
                ].map((goal, index) => (
                  <div key={index} className="p-4 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{goal.goal}</h4>
                      <Badge variant={goal.rate >= 70 ? 'default' : 'secondary'}>
                        {goal.rate}%
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {goal.current} / {goal.target}
                    </div>
                    <Progress value={goal.rate} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Campaign</th>
                      <th className="text-right p-2">Sent</th>
                      <th className="text-right p-2">Opened</th>
                      <th className="text-right p-2">Clicked</th>
                      <th className="text-right p-2">Converted</th>
                      <th className="text-right p-2">Open Rate</th>
                      <th className="text-right p-2">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailPerformance.map((campaign, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{campaign.campaign}</td>
                        <td className="p-2 text-right">{campaign.sent.toLocaleString()}</td>
                        <td className="p-2 text-right">{campaign.opened.toLocaleString()}</td>
                        <td className="p-2 text-right">{campaign.clicked.toLocaleString()}</td>
                        <td className="p-2 text-right">{campaign.conversion.toLocaleString()}</td>
                        <td className="p-2 text-right">
                          {formatPercentage((campaign.opened / campaign.sent) * 100)}
                        </td>
                        <td className="p-2 text-right">
                          {formatPercentage((campaign.clicked / campaign.opened) * 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Monthly Performance Report', description: 'Comprehensive monthly overview', icon: BarChart },
              { name: 'Lead Generation Report', description: 'Detailed lead analysis', icon: Users },
              { name: 'Conversion Report', description: 'Conversion funnel analysis', icon: Target },
              { name: 'Email Marketing Report', description: 'Email campaign performance', icon: Mail },
              { name: 'Revenue Report', description: 'Financial performance overview', icon: DollarSign },
              { name: 'Traffic Report', description: 'Website traffic analysis', icon: Eye }
            ].map((report, index) => {
              const IconComponent = report.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-muted rounded">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => exportData(report.name)}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button size="sm">View Report</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
