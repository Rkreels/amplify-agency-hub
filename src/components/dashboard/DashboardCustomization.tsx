
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Layout, 
  Grid, 
  Palette, 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet,
  Eye,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Move,
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number };
  config: Record<string, any>;
  isVisible: boolean;
}

interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
    cardStyle: 'modern' | 'classic' | 'minimal';
    spacing: 'compact' | 'normal' | 'relaxed';
  };
  settings: {
    showWelcomeMessage: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
    showQuickActions: boolean;
  };
}

const availableWidgets = [
  {
    type: 'revenue',
    title: 'Revenue Overview',
    icon: DollarSign,
    category: 'Analytics',
    description: 'Track total revenue and growth',
    defaultSize: 'medium' as const
  },
  {
    type: 'leads',
    title: 'Lead Generation',
    icon: Users,
    category: 'Sales',
    description: 'Monitor lead count and sources',
    defaultSize: 'medium' as const
  },
  {
    type: 'appointments',
    title: 'Appointments',
    icon: Calendar,
    category: 'Calendar',
    description: 'Upcoming appointments overview',
    defaultSize: 'medium' as const
  },
  {
    type: 'pipeline',
    title: 'Sales Pipeline',
    icon: Target,
    category: 'Sales',
    description: 'Visual pipeline progress',
    defaultSize: 'large' as const
  },
  {
    type: 'conversations',
    title: 'Conversations',
    icon: MessageSquare,
    category: 'Communication',
    description: 'Recent conversations activity',
    defaultSize: 'medium' as const
  },
  {
    type: 'performance',
    title: 'Performance Metrics',
    icon: TrendingUp,
    category: 'Analytics',
    description: 'Key performance indicators',
    defaultSize: 'large' as const
  },
  {
    type: 'tasks',
    title: 'Tasks & Reminders',
    icon: Clock,
    category: 'Productivity',
    description: 'Pending tasks and reminders',
    defaultSize: 'medium' as const
  },
  {
    type: 'locations',
    title: 'Location Performance',
    icon: MapPin,
    category: 'Analytics',
    description: 'Multi-location analytics',
    defaultSize: 'medium' as const
  },
  {
    type: 'reviews',
    title: 'Reviews & Ratings',
    icon: Star,
    category: 'Reputation',
    description: 'Customer reviews overview',
    defaultSize: 'medium' as const
  },
  {
    type: 'activity',
    title: 'Recent Activity',
    icon: BarChart3,
    category: 'General',
    description: 'Latest system activities',
    defaultSize: 'large' as const
  }
];

export function DashboardCustomization() {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>({
    id: 'default',
    name: 'Default Layout',
    widgets: [
      {
        id: 'revenue-1',
        type: 'revenue',
        title: 'Revenue Overview',
        size: 'medium',
        position: { x: 0, y: 0 },
        config: { showGrowth: true, period: '30d' },
        isVisible: true
      },
      {
        id: 'leads-1',
        type: 'leads',
        title: 'Lead Generation',
        size: 'medium',
        position: { x: 1, y: 0 },
        config: { showSources: true },
        isVisible: true
      },
      {
        id: 'pipeline-1',
        type: 'pipeline',
        title: 'Sales Pipeline',
        size: 'large',
        position: { x: 0, y: 1 },
        config: { showValues: true },
        isVisible: true
      }
    ],
    theme: {
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      cardStyle: 'modern',
      spacing: 'normal'
    },
    settings: {
      showWelcomeMessage: true,
      autoRefresh: true,
      refreshInterval: 300,
      showQuickActions: true
    }
  });

  const [activeTab, setActiveTab] = useState('widgets');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [draggedWidget, setDraggedWidget] = useState<any>(null);

  const addWidget = (widgetType: string) => {
    const widgetTemplate = availableWidgets.find(w => w.type === widgetType);
    if (!widgetTemplate) return;

    const newWidget: DashboardWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      title: widgetTemplate.title,
      size: widgetTemplate.defaultSize,
      position: { x: 0, y: currentLayout.widgets.length },
      config: {},
      isVisible: true
    };

    setCurrentLayout(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }));

    toast.success(`${widgetTemplate.title} widget added`);
  };

  const removeWidget = (widgetId: string) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId)
    }));
    toast.success('Widget removed');
  };

  const duplicateWidget = (widgetId: string) => {
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    if (!widget) return;

    const duplicatedWidget = {
      ...widget,
      id: `${widget.type}-${Date.now()}`,
      position: { x: widget.position.x + 1, y: widget.position.y }
    };

    setCurrentLayout(prev => ({
      ...prev,
      widgets: [...prev.widgets, duplicatedWidget]
    }));

    toast.success('Widget duplicated');
  };

  const updateWidgetConfig = (widgetId: string, config: Record<string, any>) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, config: { ...w.config, ...config } } : w
      )
    }));
  };

  const updateTheme = (themeUpdates: Partial<DashboardLayout['theme']>) => {
    setCurrentLayout(prev => ({
      ...prev,
      theme: { ...prev.theme, ...themeUpdates }
    }));
  };

  const updateSettings = (settingsUpdates: Partial<DashboardLayout['settings']>) => {
    setCurrentLayout(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settingsUpdates }
    }));
  };

  const saveLayout = () => {
    // Save to localStorage or backend
    localStorage.setItem('dashboardLayout', JSON.stringify(currentLayout));
    toast.success('Dashboard layout saved');
  };

  const resetLayout = () => {
    setCurrentLayout({
      id: 'default',
      name: 'Default Layout',
      widgets: [],
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        cardStyle: 'modern',
        spacing: 'normal'
      },
      settings: {
        showWelcomeMessage: true,
        autoRefresh: true,
        refreshInterval: 300,
        showQuickActions: true
      }
    });
    toast.success('Layout reset to default');
  };

  const getWidgetGridClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-2 row-span-2';
      case 'large': return 'col-span-4 row-span-2';
      case 'full': return 'col-span-6 row-span-3';
      default: return 'col-span-2 row-span-2';
    }
  };

  const renderWidgetPreview = (widget: DashboardWidget) => {
    const baseClass = `${getWidgetGridClass(widget.size)} border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white/50`;
    
    return (
      <div key={widget.id} className={baseClass}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-sm">{widget.title}</h4>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => duplicateWidget(widget.id)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeWidget(widget.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="bg-gray-100 rounded h-16 flex items-center justify-center">
          <span className="text-xs text-gray-500">{widget.type} widget</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Preview Area */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm h-full">
          {/* Preview Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Dashboard Preview</h2>
              <Badge variant="outline">{currentLayout.name}</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
              <Button onClick={saveLayout}>
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="p-6 h-full overflow-auto">
            <div 
              className={`grid gap-4 h-full ${
                previewMode === 'mobile' ? 'grid-cols-2' : 
                previewMode === 'tablet' ? 'grid-cols-4' : 'grid-cols-6'
              }`}
              style={{
                backgroundColor: currentLayout.theme.backgroundColor,
                gap: currentLayout.theme.spacing === 'compact' ? '8px' : 
                     currentLayout.theme.spacing === 'relaxed' ? '24px' : '16px'
              }}
            >
              {currentLayout.widgets.filter(w => w.isVisible).map(renderWidgetPreview)}
              
              {currentLayout.widgets.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Layout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-2">No widgets added yet</p>
                    <p className="text-sm text-gray-400">Start customizing your dashboard</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Customization Panel */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Customize Dashboard</h3>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="widgets" className="p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-3">Available Widgets</h4>
              <div className="space-y-2">
                {Object.entries(
                  availableWidgets.reduce((acc, widget) => {
                    if (!acc[widget.category]) acc[widget.category] = [];
                    acc[widget.category].push(widget);
                    return acc;
                  }, {} as Record<string, typeof availableWidgets>)
                ).map(([category, widgets]) => (
                  <div key={category}>
                    <h5 className="text-sm font-medium text-gray-600 mb-2">{category}</h5>
                    <div className="space-y-1">
                      {widgets.map((widget) => {
                        const Icon = widget.icon;
                        return (
                          <div
                            key={widget.type}
                            className="flex items-center gap-3 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer"
                            onClick={() => addWidget(widget.type)}
                          >
                            <Icon className="h-4 w-4" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{widget.title}</div>
                              <div className="text-xs text-gray-500">{widget.description}</div>
                            </div>
                            <Plus className="h-4 w-4 text-gray-400" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3">Current Widgets</h4>
              <div className="space-y-2">
                {currentLayout.widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{widget.title}</div>
                      <div className="text-xs text-gray-500">Size: {widget.size}</div>
                    </div>
                    <div className="flex gap-1">
                      <Switch
                        checked={widget.isVisible}
                        onCheckedChange={(checked) => 
                          setCurrentLayout(prev => ({
                            ...prev,
                            widgets: prev.widgets.map(w => 
                              w.id === widget.id ? { ...w, isVisible: checked } : w
                            )
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeWidget(widget.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="p-4 space-y-4">
            <div>
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={currentLayout.theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
              />
            </div>

            <div>
              <Label>Background Color</Label>
              <Input
                type="color"
                value={currentLayout.theme.backgroundColor}
                onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
              />
            </div>

            <div>
              <Label>Card Style</Label>
              <Select
                value={currentLayout.theme.cardStyle}
                onValueChange={(value: any) => updateTheme({ cardStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Spacing</Label>
              <Select
                value={currentLayout.theme.spacing}
                onValueChange={(value: any) => updateTheme({ spacing: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Show Welcome Message</Label>
              <Switch
                checked={currentLayout.settings.showWelcomeMessage}
                onCheckedChange={(checked) => updateSettings({ showWelcomeMessage: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto Refresh</Label>
              <Switch
                checked={currentLayout.settings.autoRefresh}
                onCheckedChange={(checked) => updateSettings({ autoRefresh: checked })}
              />
            </div>

            {currentLayout.settings.autoRefresh && (
              <div>
                <Label>Refresh Interval (seconds)</Label>
                <Input
                  type="number"
                  value={currentLayout.settings.refreshInterval}
                  onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label>Show Quick Actions</Label>
              <Switch
                checked={currentLayout.settings.showQuickActions}
                onCheckedChange={(checked) => updateSettings({ showQuickActions: checked })}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Button onClick={resetLayout} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
