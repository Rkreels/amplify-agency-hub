
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Settings, 
  Plus,
  BarChart3,
  Users,
  Target,
  Calendar,
  Activity,
  DollarSign
} from 'lucide-react';
import { SalesMetricsWidget, ContactMetricsWidget, ActivityMetricsWidget } from './MetricsWidget';
import { QuickActionsWidget } from './QuickActionsWidget';
import { RecentActivityWidget } from './RecentActivityWidget';
import { PipelineWidget } from './PipelineWidget';
import { DashboardCustomizer, type DashboardWidget } from './DashboardCustomizer';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';

export function WidgetManager() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'metrics-sales',
      name: 'Sales Metrics',
      description: 'Revenue, opportunities, and conversion rates',
      icon: <DollarSign className="h-4 w-4" />,
      enabled: true,
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
      category: 'metrics'
    },
    {
      id: 'metrics-contacts',
      name: 'Contact Metrics',
      description: 'Total contacts, leads, and response rates',
      icon: <Users className="h-4 w-4" />,
      enabled: true,
      position: { x: 1, y: 0 },
      size: { width: 1, height: 1 },
      category: 'metrics'
    },
    {
      id: 'metrics-activity',
      name: 'Activity Metrics',
      description: 'Appointments, emails, and calls',
      icon: <Activity className="h-4 w-4" />,
      enabled: true,
      position: { x: 2, y: 0 },
      size: { width: 1, height: 1 },
      category: 'metrics'
    },
    {
      id: 'quick-actions',
      name: 'Quick Actions',
      description: 'Fast access to common tasks',
      icon: <Plus className="h-4 w-4" />,
      enabled: true,
      position: { x: 0, y: 1 },
      size: { width: 3, height: 1 },
      category: 'actions'
    },
    {
      id: 'pipeline',
      name: 'Sales Pipeline',
      description: 'Opportunity stages and conversion funnel',
      icon: <Target className="h-4 w-4" />,
      enabled: true,
      position: { x: 0, y: 2 },
      size: { width: 2, height: 1 },
      category: 'data'
    },
    {
      id: 'recent-activity',
      name: 'Recent Activity',
      description: 'Latest actions and system events',
      icon: <Activity className="h-4 w-4" />,
      enabled: true,
      position: { x: 2, y: 2 },
      size: { width: 1, height: 1 },
      category: 'data'
    }
  ]);

  const { announceFeature } = useVoiceTraining();

  React.useEffect(() => {
    announceFeature(
      'Dashboard Overview',
      'Welcome to your dashboard. Here you can see sales metrics, pipeline status, recent activities, and quick actions to manage your business efficiently. Use the customize button to personalize your dashboard widgets.'
    );
  }, [announceFeature]);

  const renderWidget = (widgetId: string) => {
    switch (widgetId) {
      case 'metrics-sales': return <SalesMetricsWidget />;
      case 'metrics-contacts': return <ContactMetricsWidget />;
      case 'metrics-activity': return <ActivityMetricsWidget />;
      case 'quick-actions': return <QuickActionsWidget />;
      case 'pipeline': return <PipelineWidget />;
      case 'recent-activity': return <RecentActivityWidget />;
      default: return null;
    }
  };

  const enabledWidgets = widgets.filter(widget => widget.enabled);

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex gap-2">
          <DashboardCustomizer widgets={widgets} onWidgetsChange={setWidgets} />
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Revenue</p>
                <p className="text-3xl font-bold">$127,350</p>
                <p className="text-sm text-blue-100 mt-1">+12.5% from last month</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Total Contacts</p>
                <p className="text-3xl font-bold">2,847</p>
                <p className="text-sm text-green-100 mt-1">+156 new this week</p>
              </div>
              <Users className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Active Opportunities</p>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-purple-100 mt-1">$85K in pipeline</p>
              </div>
              <Target className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Appointments</p>
                <p className="text-3xl font-bold">18</p>
                <p className="text-sm text-orange-100 mt-1">This week</p>
              </div>
              <Calendar className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Quick Actions - Always First and Full Width if enabled */}
        {enabledWidgets.find(w => w.id === 'quick-actions') && (
          <div className="xl:col-span-3">
            {renderWidget('quick-actions')}
          </div>
        )}

        {/* Sales Pipeline - Take 2 columns if enabled */}
        {enabledWidgets.find(w => w.id === 'pipeline') && (
          <div className="lg:col-span-2">
            {renderWidget('pipeline')}
          </div>
        )}

        {/* Recent Activity */}
        {enabledWidgets.find(w => w.id === 'recent-activity') && (
          <div>
            {renderWidget('recent-activity')}
          </div>
        )}

        {/* Metrics Widgets */}
        {enabledWidgets.find(w => w.id === 'metrics-sales') && renderWidget('metrics-sales')}
        {enabledWidgets.find(w => w.id === 'metrics-contacts') && renderWidget('metrics-contacts')}
        {enabledWidgets.find(w => w.id === 'metrics-activity') && renderWidget('metrics-activity')}
      </div>

      {/* Additional Dashboard Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Tasks</span>
              <Badge variant="outline">5 pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { task: 'Follow up with John Smith', due: 'Today 2:00 PM', priority: 'high' },
                { task: 'Send proposal to ABC Corp', due: 'Tomorrow 9:00 AM', priority: 'medium' },
                { task: 'Review marketing campaign results', due: 'Dec 23', priority: 'low' },
                { task: 'Schedule demo with new prospect', due: 'Dec 24', priority: 'high' }
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-gray-500">{task.due}</p>
                  </div>
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>This Month's Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Open Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                  <span className="text-sm font-medium">68.4%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Lead Conversion</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
                  </div>
                  <span className="text-sm font-medium">23.4%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Customer Satisfaction</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-5/6"></div>
                  </div>
                  <span className="text-sm font-medium">94.2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Response Time</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full w-4/5"></div>
                  </div>
                  <span className="text-sm font-medium">2.3 hrs avg</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
