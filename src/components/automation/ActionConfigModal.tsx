
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkflowStore, WorkflowNode, ActionConfig } from '@/store/useWorkflowStore';
import { toast } from 'sonner';
import { 
  Mail, 
  MessageSquare, 
  User, 
  Tag, 
  FileText, 
  Bell, 
  Calendar,
  Target,
  Clock,
  Send,
  TestTube
} from 'lucide-react';

const actionTypes = [
  {
    id: 'send_email',
    name: 'Send Email',
    description: 'Send an email to the contact',
    icon: Mail,
    category: 'Communication'
  },
  {
    id: 'send_sms',
    name: 'Send SMS',
    description: 'Send an SMS to the contact',
    icon: MessageSquare,
    category: 'Communication'
  },
  {
    id: 'add_tag',
    name: 'Add Tag',
    description: 'Add a tag to the contact',
    icon: Tag,
    category: 'Contact Management'
  },
  {
    id: 'remove_tag',
    name: 'Remove Tag',
    description: 'Remove a tag from the contact',
    icon: Tag,
    category: 'Contact Management'
  },
  {
    id: 'assign_user',
    name: 'Assign User',
    description: 'Assign contact to a team member',
    icon: User,
    category: 'Contact Management'
  },
  {
    id: 'create_task',
    name: 'Create Task',
    description: 'Create a task for the contact',
    icon: FileText,
    category: 'Task Management'
  },
  {
    id: 'send_notification',
    name: 'Send Notification',
    description: 'Send internal notification',
    icon: Bell,
    category: 'Internal'
  },
  {
    id: 'create_opportunity',
    name: 'Create Opportunity',
    description: 'Create sales opportunity',
    icon: Target,
    category: 'Sales'
  },
  {
    id: 'schedule_appointment',
    name: 'Schedule Appointment',
    description: 'Schedule an appointment',
    icon: Calendar,
    category: 'Calendar'
  },
  {
    id: 'wait',
    name: 'Wait',
    description: 'Add a delay in the workflow',
    icon: Clock,
    category: 'Flow Control'
  }
];

interface ActionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: WorkflowNode | null;
}

export function ActionConfigModal({ isOpen, onClose, node }: ActionConfigModalProps) {
  const { updateNode } = useWorkflowStore();
  const [selectedType, setSelectedType] = useState<string>('');
  const [actionName, setActionName] = useState('');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [delay, setDelay] = useState<{ amount: number; unit: 'minutes' | 'hours' | 'days' }>({ amount: 0, unit: 'minutes' });

  const handleSave = () => {
    if (!node || !selectedType || !actionName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const actionConfig: ActionConfig = {
      id: node.id,
      type: selectedType,
      name: actionName,
      settings,
      delay: delay.amount > 0 ? delay : undefined
    };

    const selectedActionType = actionTypes.find(a => a.id === selectedType);
    
    updateNode(node.id, {
      data: {
        ...node.data,
        label: actionName,
        icon: selectedActionType?.icon || node.data.icon,
        config: actionConfig,
        isConfigured: true
      }
    });

    toast.success('Action configured successfully');
    onClose();
  };

  const renderSettingsForm = () => {
    switch (selectedType) {
      case 'send_email':
        return (
          <div className="space-y-4">
            <div>
              <Label>Email Template</Label>
              <Select value={settings.templateId || ''} onValueChange={(value) => setSettings({ ...settings, templateId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="follow-up">Follow-up Email</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Subject</Label>
              <Input
                placeholder="Email subject"
                value={settings.subject || ''}
                onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Email content... Use {{first_name}}, {{last_name}} for personalization"
                rows={6}
                value={settings.message || ''}
                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              />
            </div>
            
            <div>
              <Label>From Email</Label>
              <Select value={settings.fromEmail || ''} onValueChange={(value) => setSettings({ ...settings, fromEmail: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noreply@company.com">noreply@company.com</SelectItem>
                  <SelectItem value="support@company.com">support@company.com</SelectItem>
                  <SelectItem value="sales@company.com">sales@company.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'send_sms':
        return (
          <div className="space-y-4">
            <div>
              <Label>SMS Message</Label>
              <Textarea
                placeholder="SMS content... Use {{first_name}}, {{last_name}} for personalization"
                rows={4}
                maxLength={160}
                value={settings.message || ''}
                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {(settings.message || '').length}/160 characters
              </div>
            </div>
            
            <div>
              <Label>From Number</Label>
              <Select value={settings.fromNumber || ''} onValueChange={(value) => setSettings({ ...settings, fromNumber: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1234567890">+1 (234) 567-8900</SelectItem>
                  <SelectItem value="+1987654321">+1 (987) 654-3210</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'add_tag':
      case 'remove_tag':
        return (
          <div className="space-y-4">
            <div>
              <Label>Tag Name</Label>
              <Input
                placeholder="Enter tag name"
                value={settings.tagName || ''}
                onChange={(e) => setSettings({ ...settings, tagName: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'assign_user':
        return (
          <div className="space-y-4">
            <div>
              <Label>Assign To</Label>
              <Select value={settings.userId || ''} onValueChange={(value) => setSettings({ ...settings, userId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">John Doe</SelectItem>
                  <SelectItem value="user2">Jane Smith</SelectItem>
                  <SelectItem value="user3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'create_task':
        return (
          <div className="space-y-4">
            <div>
              <Label>Task Title</Label>
              <Input
                placeholder="Task title"
                value={settings.title || ''}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Task description"
                rows={3}
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              />
            </div>
            
            <div>
              <Label>Priority</Label>
              <Select value={settings.priority || ''} onValueChange={(value) => setSettings({ ...settings, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'wait':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Duration</Label>
                <Input
                  type="number"
                  min="1"
                  value={delay.amount}
                  onChange={(e) => setDelay({ ...delay, amount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={delay.unit} onValueChange={(value: 'minutes' | 'hours' | 'days') => setDelay({ ...delay, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-4 text-muted-foreground">
            Select an action type to configure settings.
          </div>
        );
    }
  };

  const groupedActions = actionTypes.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, typeof actionTypes>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Action</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">Select Action</TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedType}>Configure</TabsTrigger>
            <TabsTrigger value="test" disabled={!selectedType}>Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(groupedActions).map(([category, actions]) => (
                <div key={category}>
                  <h3 className="font-medium mb-2">{category}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Card 
                          key={action.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedType === action.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedType(action.id)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                              <Icon className="h-5 w-5" />
                              <CardTitle className="text-sm">{action.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-xs">
                              {action.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="configure" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Action Name</Label>
                <Input
                  placeholder="Enter action name"
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                />
              </div>
              
              {selectedType !== 'wait' && (
                <div>
                  <Label>Delay (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={delay.amount}
                      onChange={(e) => setDelay({ ...delay, amount: parseInt(e.target.value) || 0 })}
                    />
                    <Select value={delay.unit} onValueChange={(value: 'minutes' | 'hours' | 'days') => setDelay({ ...delay, unit: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div>
                <Label>Settings</Label>
                <Card>
                  <CardContent className="pt-6">
                    {renderSettingsForm()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Action</CardTitle>
                <CardDescription>
                  Test your action configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <TestTube className="h-4 w-4 mr-2" />
                  Run Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedType || !actionName}>
            Save Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
