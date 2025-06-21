
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  Plus, 
  Minus,
  LayoutDashboard,
  DollarSign,
  Users,
  Target,
  Activity,
  Clock,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  category: 'metrics' | 'actions' | 'data' | 'reports';
}

interface DashboardCustomizerProps {
  widgets: DashboardWidget[];
  onWidgetsChange: (widgets: DashboardWidget[]) => void;
}

export function DashboardCustomizer({ widgets, onWidgetsChange }: DashboardCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('widgets');

  const availableWidgets: Omit<DashboardWidget, 'enabled' | 'position' | 'size'>[] = [
    {
      id: 'metrics-sales',
      name: 'Sales Metrics',
      description: 'Revenue, opportunities, and conversion rates',
      icon: <DollarSign className="h-4 w-4" />,
      category: 'metrics'
    },
    {
      id: 'metrics-contacts',
      name: 'Contact Metrics',
      description: 'Total contacts, leads, and response rates',
      icon: <Users className="h-4 w-4" />,
      category: 'metrics'
    },
    {
      id: 'metrics-activity',
      name: 'Activity Metrics',
      description: 'Appointments, emails, and calls',
      icon: <Activity className="h-4 w-4" />,
      category: 'metrics'
    },
    {
      id: 'quick-actions',
      name: 'Quick Actions',
      description: 'Fast access to common tasks',
      icon: <Plus className="h-4 w-4" />,
      category: 'actions'
    },
    {
      id: 'pipeline',
      name: 'Sales Pipeline',
      description: 'Opportunity stages and conversion funnel',
      icon: <Target className="h-4 w-4" />,
      category: 'data'
    },
    {
      id: 'recent-activity',
      name: 'Recent Activity',
      description: 'Latest actions and system events',
      icon: <Clock className="h-4 w-4" />,
      category: 'data'
    },
    {
      id: 'performance-chart',
      name: 'Performance Chart',
      description: 'Visual performance analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'reports'
    }
  ];

  const toggleWidget = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled }
        : widget
    );
    onWidgetsChange(updatedWidgets);
  };

  const addWidget = (widgetId: string) => {
    const availableWidget = availableWidgets.find(w => w.id === widgetId);
    if (!availableWidget) return;

    const newWidget: DashboardWidget = {
      ...availableWidget,
      enabled: true,
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 }
    };

    const existingWidget = widgets.find(w => w.id === widgetId);
    if (existingWidget) {
      toggleWidget(widgetId);
    } else {
      onWidgetsChange([...widgets, newWidget]);
    }
  };

  const resetToDefault = () => {
    const defaultWidgets: DashboardWidget[] = availableWidgets.map((widget, index) => ({
      ...widget,
      enabled: ['metrics-sales', 'quick-actions', 'pipeline', 'recent-activity'].includes(widget.id),
      position: { x: index % 3, y: Math.floor(index / 3) },
      size: { width: 1, height: 1 }
    }));
    onWidgetsChange(defaultWidgets);
  };

  const categorizeWidgets = (category: string) => {
    return availableWidgets.filter(widget => widget.category === category);
  };

  const getWidgetStatus = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    return widget?.enabled || false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" />
            Customize Dashboard
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Available Widgets</h3>
                <p className="text-sm text-gray-600">Enable or disable widgets on your dashboard</p>
              </div>
              <Button variant="outline" onClick={resetToDefault}>
                Reset to Default
              </Button>
            </div>

            <div className="space-y-6">
              {['metrics', 'actions', 'data', 'reports'].map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize">{category} Widgets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorizeWidgets(category).map((widget) => (
                        <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {widget.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{widget.name}</h4>
                              <p className="text-sm text-gray-600">{widget.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getWidgetStatus(widget.id) ? 'default' : 'secondary'}>
                              {getWidgetStatus(widget.id) ? (
                                <Eye className="h-3 w-3 mr-1" />
                              ) : (
                                <EyeOff className="h-3 w-3 mr-1" />
                              )}
                              {getWidgetStatus(widget.id) ? 'Enabled' : 'Disabled'}
                            </Badge>
                            <Switch
                              checked={getWidgetStatus(widget.id)}
                              onCheckedChange={() => addWidget(widget.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Layout Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-gray-50 border-2">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-1 mb-3">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded col-span-2"></div>
                    </div>
                    <p className="text-sm font-medium">Grid Layout</p>
                    <p className="text-xs text-gray-500">Organized in a grid</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50 border-2 border-primary">
                  <CardContent className="p-4">
                    <div className="space-y-1 mb-3">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                    <p className="text-sm font-medium">Flexible Layout</p>
                    <p className="text-xs text-gray-500">Drag and resize widgets</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Widget Sizes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {widgets.filter(w => w.enabled).map((widget) => (
                    <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {widget.icon}
                        <span className="font-medium">{widget.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`${widget.id}-size`} className="text-sm">Size:</Label>
                        <select 
                          id={`${widget.id}-size`}
                          className="text-sm border rounded px-2 py-1"
                          value={`${widget.size.width}x${widget.size.height}`}
                        >
                          <option value="1x1">Small (1x1)</option>
                          <option value="2x1">Medium (2x1)</option>
                          <option value="2x2">Large (2x2)</option>
                          <option value="3x1">Wide (3x1)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                    <p className="text-sm text-gray-600">Automatically refresh dashboard data</p>
                  </div>
                  <Switch id="auto-refresh" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-gray-600">Show more widgets in less space</p>
                  </div>
                  <Switch id="compact-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-theme">Dark Theme</Label>
                    <p className="text-sm text-gray-600">Use dark theme for dashboard</p>
                  </div>
                  <Switch id="dark-theme" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Refresh Interval</Label>
                  <select id="refresh-interval" className="w-full border rounded p-2">
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                    <option value="600">10 minutes</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export & Import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    Export Settings
                  </Button>
                  <Button variant="outline">
                    Import Settings
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Save your dashboard configuration or import settings from another account
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
