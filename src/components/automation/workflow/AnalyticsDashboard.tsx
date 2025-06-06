
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  Mail,
  MessageSquare,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  Filter
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  dropOff?: number;
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'draft';
  startDate: Date;
  endDate?: Date;
  variants: {
    name: string;
    traffic: number;
    conversions: number;
    conversionRate: number;
    isWinner?: boolean;
  }[];
  goal: string;
  significance: number;
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const metrics: MetricCard[] = [
    {
      title: 'Total Workflows',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: BarChart3
    },
    {
      title: 'Active Contacts',
      value: '3,247',
      change: '+8.2%',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Emails Sent',
      value: '45,721',
      change: '+15.3%',
      trend: 'up',
      icon: Mail
    },
    {
      title: 'SMS Sent',
      value: '12,034',
      change: '-2.1%',
      trend: 'down',
      icon: MessageSquare
    },
    {
      title: 'Revenue Generated',
      value: '$127,459',
      change: '+23.7%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Conversion Rate',
      value: '18.4%',
      change: '+3.2%',
      trend: 'up',
      icon: Target
    }
  ];

  const conversionFunnel: ConversionFunnel[] = [
    { stage: 'Workflow Started', count: 5247, percentage: 100 },
    { stage: 'Email Opened', count: 3421, percentage: 65.2, dropOff: 34.8 },
    { stage: 'Link Clicked', count: 1876, percentage: 35.7, dropOff: 29.5 },
    { stage: 'Form Submitted', count: 892, percentage: 17.0, dropOff: 18.7 },
    { stage: 'Purchase Made', count: 234, percentage: 4.5, dropOff: 12.5 }
  ];

  const abTests: ABTest[] = [
    {
      id: 'test-1',
      name: 'Email Subject Line A/B Test',
      status: 'running',
      startDate: new Date('2024-01-15'),
      variants: [
        { name: 'Control', traffic: 50, conversions: 234, conversionRate: 15.6 },
        { name: 'Variant A', traffic: 50, conversions: 298, conversionRate: 19.9, isWinner: true }
      ],
      goal: 'Email Open Rate',
      significance: 95.2
    },
    {
      id: 'test-2',
      name: 'Landing Page CTA Button',
      status: 'completed',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-14'),
      variants: [
        { name: 'Blue Button', traffic: 50, conversions: 156, conversionRate: 12.4 },
        { name: 'Green Button', traffic: 50, conversions: 203, conversionRate: 16.1, isWinner: true }
      ],
      goal: 'Button Click Rate',
      significance: 98.7
    }
  ];

  const workflowPerformance = [
    { name: 'Welcome Series', triggered: 1247, completed: 1089, conversion: 87.3, revenue: '$45,231' },
    { name: 'Abandoned Cart', triggered: 892, completed: 634, conversion: 71.1, revenue: '$28,457' },
    { name: 'Lead Nurture', triggered: 2341, completed: 1876, conversion: 80.1, revenue: '$67,892' },
    { name: 'Post Purchase', triggered: 567, completed: 534, conversion: 94.2, revenue: '$12,345' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track performance, conversions, and A/B test results</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnels">Conversion Funnels</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="workflows">Workflow Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className="flex items-center mt-1">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          ) : metric.trend === 'down' ? (
                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          ) : null}
                          <span className={`text-sm ${
                            metric.trend === 'up' ? 'text-green-500' : 
                            metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowPerformance.slice(0, 3).map((workflow, index) => (
                    <div key={workflow.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{workflow.name}</p>
                          <p className="text-sm text-gray-500">{workflow.triggered} triggered</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{workflow.conversion}%</p>
                        <p className="text-sm text-gray-500">{workflow.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>Email Open Rate</span>
                    </div>
                    <span className="font-medium">24.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MousePointer className="h-4 w-4 text-green-500" />
                      <span>Click Through Rate</span>
                    </div>
                    <span className="font-medium">4.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                      <span>SMS Response Rate</span>
                    </div>
                    <span className="font-medium">18.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      <span>Goal Completion</span>
                    </div>
                    <span className="font-medium">12.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => (
                  <div key={stage.stage} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium">{stage.stage}</h3>
                          <p className="text-sm text-gray-500">{stage.count.toLocaleString()} contacts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{stage.percentage}%</p>
                        {stage.dropOff && (
                          <p className="text-sm text-red-500">-{stage.dropOff}% drop-off</p>
                        )}
                      </div>
                    </div>
                    <div 
                      className="h-2 bg-blue-600 rounded-full mt-2"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abtests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">A/B Tests</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Create New Test
            </Button>
          </div>

          <div className="space-y-4">
            {abTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <Badge variant={
                      test.status === 'running' ? 'default' : 
                      test.status === 'completed' ? 'secondary' : 'outline'
                    }>
                      {test.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Test Details</h4>
                      <p className="text-sm text-gray-600">Goal: {test.goal}</p>
                      <p className="text-sm text-gray-600">
                        Started: {test.startDate.toLocaleDateString()}
                      </p>
                      {test.endDate && (
                        <p className="text-sm text-gray-600">
                          Ended: {test.endDate.toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Significance: {test.significance}%
                      </p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <h4 className="font-medium mb-2">Variants Performance</h4>
                      <div className="space-y-3">
                        {test.variants.map((variant) => (
                          <div key={variant.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{variant.name}</span>
                              {variant.isWinner && (
                                <Badge className="bg-green-100 text-green-700">Winner</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-6 text-sm">
                              <div>
                                <span className="text-gray-500">Traffic: </span>
                                <span className="font-medium">{variant.traffic}%</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Conversions: </span>
                                <span className="font-medium">{variant.conversions}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Rate: </span>
                                <span className="font-medium">{variant.conversionRate}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Workflow</th>
                      <th className="text-left p-2">Triggered</th>
                      <th className="text-left p-2">Completed</th>
                      <th className="text-left p-2">Conversion Rate</th>
                      <th className="text-left p-2">Revenue</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflowPerformance.map((workflow) => (
                      <tr key={workflow.name} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{workflow.name}</td>
                        <td className="p-2">{workflow.triggered.toLocaleString()}</td>
                        <td className="p-2">{workflow.completed.toLocaleString()}</td>
                        <td className="p-2">
                          <span className="font-medium">{workflow.conversion}%</span>
                        </td>
                        <td className="p-2 font-medium">{workflow.revenue}</td>
                        <td className="p-2">
                          <Button size="sm" variant="outline">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
