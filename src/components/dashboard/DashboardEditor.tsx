
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Plus, 
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Move,
  Copy,
  BarChart3,
  Users,
  Target,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Zap
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';

export interface DashboardComponent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  category: 'metrics' | 'charts' | 'actions' | 'data' | 'communications';
  settings?: Record<string, any>;
}

interface DashboardEditorProps {
  components: DashboardComponent[];
  onComponentsChange: (components: DashboardComponent[]) => void;
}

export function DashboardEditor({ components, onComponentsChange }: DashboardEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<DashboardComponent | null>(null);
  const [activeTab, setActiveTab] = useState('components');
  const { announceFeature } = useVoiceTraining();

  React.useEffect(() => {
    if (isOpen) {
      announceFeature(
        'Dashboard Editor',
        'Welcome to the dashboard editor. Here you can customize your dashboard by adding, removing, or configuring components. Choose from metrics, charts, quick actions, and communication tools to create your perfect workspace.'
      );
    }
  }, [isOpen, announceFeature]);

  const availableComponents: Omit<DashboardComponent, 'enabled' | 'position' | 'size'>[] = [
    // Metrics Components
    {
      id: 'revenue-metrics',
      name: 'Revenue Metrics',
      description: 'Total revenue, MRR, and growth rates',
      icon: <DollarSign className="h-4 w-4" />,
      category: 'metrics'
    },
    {
      id: 'contact-metrics',
      name: 'Contact Metrics',
      description: 'Total contacts, leads, and conversion rates',
      icon: <Users className="h-4 w-4" />,
      category: 'metrics'
    },
    {
      id: 'appointment-metrics',
      name: 'Appointment Metrics',
      description: 'Scheduled, completed, and no-shows',
      icon: <Calendar className="h-4 w-4" />,
      category: 'metrics'
    },
    {
      id: 'pipeline-metrics',
      name: 'Pipeline Metrics',
      description: 'Opportunities, win rates, and deal values',
      icon: <Target className="h-4 w-4" />,
      category: 'metrics'
    },
    
    // Charts Components
    {
      id: 'revenue-chart',
      name: 'Revenue Chart',
      description: 'Visual revenue trends over time',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'charts'
    },
    {
      id: 'conversion-funnel',
      name: 'Conversion Funnel',
      description: 'Lead to customer conversion visualization',
      icon: <Target className="h-4 w-4" />,
      category: 'charts'
    },
    {
      id: 'activity-timeline',
      name: 'Activity Timeline',
      description: 'Recent activities and events',
      icon: <Clock className="h-4 w-4" />,
      category: 'charts'
    },
    
    // Action Components
    {
      id: 'quick-add',
      name: 'Quick Add',
      description: 'Fast contact, opportunity, and task creation',
      icon: <Plus className="h-4 w-4" />,
      category: 'actions'
    },
    {
      id: 'campaign-launcher',
      name: 'Campaign Launcher',
      description: 'Start email and SMS campaigns quickly',
      icon: <Zap className="h-4 w-4" />,
      category: 'actions'
    },
    {
      id: 'automation-triggers',
      name: 'Automation Triggers',
      description: 'Manual automation triggers',
      icon: <Activity className="h-4 w-4" />,
      category: 'actions'
    },
    
    // Data Components
    {
      id: 'recent-contacts',
      name: 'Recent Contacts',
      description: 'Latest added contacts and interactions',
      icon: <Users className="h-4 w-4" />,
      category: 'data'
    },
    {
      id: 'hot-leads',
      name: 'Hot Leads',
      description: 'High-priority leads requiring attention',
      icon: <Target className="h-4 w-4" />,
      category: 'data'
    },
    {
      id: 'upcoming-tasks',
      name: 'Upcoming Tasks',
      description: 'Tasks and follow-ups due soon',
      icon: <Clock className="h-4 w-4" />,
      category: 'data'
    },
    
    // Communication Components
    {
      id: 'message-center',
      name: 'Message Center',
      description: 'Unread messages and notifications',
      icon: <MessageSquare className="h-4 w-4" />,
      category: 'communications'
    },
    {
      id: 'email-queue',
      name: 'Email Queue',
      description: 'Pending and scheduled emails',
      icon: <Mail className="h-4 w-4" />,
      category: 'communications'
    },
    {
      id: 'call-log',
      name: 'Call Log',
      description: 'Recent calls and call scheduling',
      icon: <Phone className="h-4 w-4" />,
      category: 'communications'
    }
  ];

  const toggleComponent = (componentId: string) => {
    const updatedComponents = components.map(component => 
      component.id === componentId 
        ? { ...component, enabled: !component.enabled }
        : component
    );
    onComponentsChange(updatedComponents);
  };

  const addComponent = (componentTemplate: any) => {
    const existingComponent = components.find(c => c.id === componentTemplate.id);
    
    if (existingComponent) {
      toggleComponent(componentTemplate.id);
    } else {
      const newComponent: DashboardComponent = {
        ...componentTemplate,
        enabled: true,
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 },
        settings: {}
      };
      onComponentsChange([...components, newComponent]);
    }
  };

  const removeComponent = (componentId: string) => {
    const updatedComponents = components.filter(c => c.id !== componentId);
    onComponentsChange(updatedComponents);
  };

  const duplicateComponent = (component: DashboardComponent) => {
    const newComponent: DashboardComponent = {
      ...component,
      id: `${component.id}-copy-${Date.now()}`,
      name: `${component.name} (Copy)`,
      position: { 
        x: component.position.x + 1, 
        y: component.position.y + 1 
      }
    };
    onComponentsChange([...components, newComponent]);
  };

  const getComponentStatus = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    return component?.enabled || false;
  };

  const categorizeComponents = (category: string) => {
    return availableComponents.filter(comp => comp.category === category);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" />
          Edit Dashboard
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Editor
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Available Components</h3>
                <p className="text-sm text-gray-600">Add or remove components from your dashboard</p>
              </div>
              <Badge variant="secondary">
                {components.filter(c => c.enabled).length} Active
              </Badge>
            </div>

            <div className="space-y-6">
              {['metrics', 'charts', 'actions', 'data', 'communications'].map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="capitalize text-base">{category} Components</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categorizeComponents(category).map((component) => (
                        <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {component.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">{component.name}</h4>
                              <p className="text-sm text-gray-600">{component.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getComponentStatus(component.id) ? 'default' : 'secondary'}>
                              {getComponentStatus(component.id) ? (
                                <Eye className="h-3 w-3 mr-1" />
                              ) : (
                                <EyeOff className="h-3 w-3 mr-1" />
                              )}
                              {getComponentStatus(component.id) ? 'Active' : 'Inactive'}
                            </Badge>
                            <Switch
                              checked={getComponentStatus(component.id)}
                              onCheckedChange={() => addComponent(component)}
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

          <TabsContent value="layout" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Component Layout</h3>
              <div className="space-y-4">
                {components.filter(c => c.enabled).map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {component.icon}
                      <div>
                        <span className="font-medium">{component.name}</span>
                        <div className="text-sm text-gray-500">
                          Position: ({component.position.x}, {component.position.y}) • 
                          Size: {component.size.width}x{component.size.height}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedComponent(component)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => duplicateComponent(component)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Move className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeComponent(component.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">Auto Refresh Interval</Label>
                    <select id="refresh-interval" className="w-full border rounded p-2">
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="300">5 minutes</option>
                      <option value="600">10 minutes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Dashboard Theme</Label>
                    <select id="theme" className="w-full border rounded p-2">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <Switch id="compact-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animations">Enable Animations</Label>
                    <Switch id="animations" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Desktop Notifications</Label>
                    <Switch id="notifications" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Dashboard Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.filter(c => c.enabled).map((component) => (
                  <div key={component.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      {component.icon}
                      <span className="font-medium text-sm">{component.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {component.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
