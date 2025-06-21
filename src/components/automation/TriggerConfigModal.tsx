
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkflowStore, WorkflowNode, TriggerConfig } from '@/store/useWorkflowStore';
import { toast } from 'sonner';
import { 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Tag, 
  Target,
  MessageSquare,
  Clock,
  Settings,
  CheckCircle
} from 'lucide-react';

const triggerTypes = [
  {
    id: 'contact_created',
    name: 'Contact Created',
    description: 'Triggers when a new contact is added',
    icon: 'User',
    category: 'Contact Events'
  },
  {
    id: 'appointment_booked',
    name: 'Appointment Booked',
    description: 'Triggers when an appointment is scheduled',
    icon: 'Calendar',
    category: 'Calendar Events'
  },
  {
    id: 'appointment_cancelled',
    name: 'Appointment Cancelled',
    description: 'Triggers when an appointment is cancelled',
    icon: 'Calendar',
    category: 'Calendar Events'
  },
  {
    id: 'form_submitted',
    name: 'Form Submitted',
    description: 'Triggers when a form is submitted',
    icon: 'FileText',
    category: 'Form Events'
  },
  {
    id: 'tag_applied',
    name: 'Tag Applied',
    description: 'Triggers when a tag is added to a contact',
    icon: 'Tag',
    category: 'Contact Events'
  },
  {
    id: 'opportunity_created',
    name: 'Opportunity Created',
    description: 'Triggers when a new opportunity is created',
    icon: 'Target',
    category: 'Sales Events'
  },
  {
    id: 'email_opened',
    name: 'Email Opened',
    description: 'Triggers when an email is opened',
    icon: 'Mail',
    category: 'Communication Events'
  },
  {
    id: 'sms_received',
    name: 'SMS Received',
    description: 'Triggers when an SMS is received',
    icon: 'MessageSquare',
    category: 'Communication Events'
  },
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'Triggers via external webhook',
    icon: 'Settings',
    category: 'External Events'
  }
];

// Icon mapping
const iconMap = {
  User,
  Calendar,
  FileText,
  Tag,
  Target,
  Mail,
  MessageSquare,
  Settings
};

interface TriggerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: WorkflowNode | null;
}

export function TriggerConfigModal({ isOpen, onClose, node }: TriggerConfigModalProps) {
  const { updateNode } = useWorkflowStore();
  const [selectedType, setSelectedType] = useState<string>('');
  const [triggerName, setTriggerName] = useState('');
  const [conditions, setConditions] = useState<Record<string, any>>({});
  const [isActive, setIsActive] = useState(true);

  const handleSave = () => {
    if (!node || !selectedType || !triggerName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const triggerConfig: TriggerConfig = {
      id: node.id,
      type: selectedType,
      name: triggerName,
      conditions,
      isActive
    };

    const selectedTriggerType = triggerTypes.find(t => t.id === selectedType);
    
    updateNode(node.id, {
      data: {
        ...node.data,
        label: triggerName,
        icon: selectedTriggerType?.icon || node.data.icon,
        config: triggerConfig,
        isConfigured: true
      }
    });

    toast.success('Trigger configured successfully');
    onClose();
  };

  const renderConditionsForm = () => {
    switch (selectedType) {
      case 'tag_applied':
        return (
          <div className="space-y-3">
            <div>
              <Label>Tag Name</Label>
              <Input
                placeholder="Enter tag name"
                value={conditions.tagName || ''}
                onChange={(e) => setConditions({ ...conditions, tagName: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'form_submitted':
        return (
          <div className="space-y-3">
            <div>
              <Label>Form Name</Label>
              <Select value={conditions.formId || ''} onValueChange={(value) => setConditions({ ...conditions, formId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact-form">Contact Form</SelectItem>
                  <SelectItem value="lead-form">Lead Generation Form</SelectItem>
                  <SelectItem value="survey-form">Survey Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'opportunity_created':
        return (
          <div className="space-y-3">
            <div>
              <Label>Pipeline</Label>
              <Select value={conditions.pipelineId || ''} onValueChange={(value) => setConditions({ ...conditions, pipelineId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales-pipeline">Sales Pipeline</SelectItem>
                  <SelectItem value="lead-pipeline">Lead Pipeline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Minimum Value</Label>
              <Input
                type="number"
                placeholder="0"
                value={conditions.minValue || ''}
                onChange={(e) => setConditions({ ...conditions, minValue: e.target.value })}
              />
            </div>
          </div>
        );
      
      case 'webhook':
        return (
          <div className="space-y-3">
            <div>
              <Label>Webhook URL</Label>
              <Input
                placeholder="https://your-domain.com/webhook"
                value={conditions.webhookUrl || ''}
                onChange={(e) => setConditions({ ...conditions, webhookUrl: e.target.value })}
              />
            </div>
            <div>
              <Label>Authentication</Label>
              <Select value={conditions.authType || 'none'} onValueChange={(value) => setConditions({ ...conditions, authType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-4 text-muted-foreground">
            No additional configuration required for this trigger type.
          </div>
        );
    }
  };

  const groupedTriggers = triggerTypes.reduce((acc, trigger) => {
    if (!acc[trigger.category]) {
      acc[trigger.category] = [];
    }
    acc[trigger.category].push(trigger);
    return acc;
  }, {} as Record<string, typeof triggerTypes>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Trigger</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">Select Trigger</TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedType}>Configure</TabsTrigger>
            <TabsTrigger value="test" disabled={!selectedType}>Test</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(groupedTriggers).map(([category, triggers]) => (
                <div key={category}>
                  <h3 className="font-medium mb-2">{category}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {triggers.map((trigger) => {
                      const IconComponent = iconMap[trigger.icon as keyof typeof iconMap];
                      return (
                        <Card 
                          key={trigger.id}
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedType === trigger.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedType(trigger.id)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center space-x-2">
                              <IconComponent className="h-5 w-5" />
                              <CardTitle className="text-sm">{trigger.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-xs">
                              {trigger.description}
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
                <Label>Trigger Name</Label>
                <Input
                  placeholder="Enter trigger name"
                  value={triggerName}
                  onChange={(e) => setTriggerName(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label>Active</Label>
              </div>
              
              <div>
                <Label>Conditions</Label>
                <Card>
                  <CardContent className="pt-6">
                    {renderConditionsForm()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Trigger</CardTitle>
                <CardDescription>
                  Test your trigger configuration to ensure it works correctly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Run Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!selectedType || !triggerName}>
            Save Trigger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
