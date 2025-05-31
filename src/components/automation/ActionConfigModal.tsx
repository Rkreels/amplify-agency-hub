
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  TestTube,
  Users,
  Phone,
  DollarSign,
  Workflow,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap
} from 'lucide-react';

// Comprehensive action types mapping
const actionTypes = [
  // Communication Actions
  {
    id: 'send_email',
    name: 'Send Email',
    description: 'Send personalized email to contact',
    icon: Mail,
    category: 'Communication',
    fields: ['templateId', 'subject', 'message', 'fromEmail']
  },
  {
    id: 'send-email', // Alternative ID for compatibility
    name: 'Send Email',
    description: 'Send personalized email to contact',
    icon: Mail,
    category: 'Communication',
    fields: ['templateId', 'subject', 'message', 'fromEmail']
  },
  {
    id: 'send_sms',
    name: 'Send SMS',
    description: 'Send SMS message to contact',
    icon: MessageSquare,
    category: 'Communication',
    fields: ['message', 'fromNumber']
  },
  {
    id: 'send-sms',
    name: 'Send SMS',
    description: 'Send SMS message to contact',
    icon: MessageSquare,
    category: 'Communication',
    fields: ['message', 'fromNumber']
  },
  {
    id: 'send_notification',
    name: 'Send Internal Notification',
    description: 'Send notification to team members',
    icon: Bell,
    category: 'Communication',
    fields: ['message', 'recipientType', 'recipients']
  },
  {
    id: 'send-internal-notification',
    name: 'Send Internal Notification',
    description: 'Send notification to team members',
    icon: Bell,
    category: 'Communication',
    fields: ['message', 'recipientType', 'recipients']
  },
  {
    id: 'send-review-request',
    name: 'Send Review Request',
    description: 'Send a review request',
    icon: Bell,
    category: 'Communication',
    fields: ['message', 'platform']
  },
  
  // Contact Management
  {
    id: 'add_tag',
    name: 'Add Contact Tag',
    description: 'Add a tag to the contact',
    icon: Tag,
    category: 'Contact Management',
    fields: ['tagName', 'tagColor']
  },
  {
    id: 'add-contact-tag',
    name: 'Add Contact Tag',
    description: 'Add a tag to the contact',
    icon: Tag,
    category: 'Contact Management',
    fields: ['tagName', 'tagColor']
  },
  {
    id: 'remove_tag',
    name: 'Remove Contact Tag',
    description: 'Remove a tag from the contact',
    icon: Tag,
    category: 'Contact Management',
    fields: ['tagName']
  },
  {
    id: 'remove-contact-tag',
    name: 'Remove Contact Tag',
    description: 'Remove a tag from the contact',
    icon: Tag,
    category: 'Contact Management',
    fields: ['tagName']
  },
  {
    id: 'assign_user',
    name: 'Assign To User',
    description: 'Assign contact to a team member',
    icon: User,
    category: 'Contact Management',
    fields: ['userId', 'notifyUser']
  },
  {
    id: 'assign-user',
    name: 'Assign To User',
    description: 'Assign contact to a team member',
    icon: User,
    category: 'Contact Management',
    fields: ['userId', 'notifyUser']
  },
  {
    id: 'remove-assigned-user',
    name: 'Remove Assigned User',
    description: 'Remove assigned user from contact',
    icon: User,
    category: 'Contact Management',
    fields: ['userId']
  },
  {
    id: 'add_notes',
    name: 'Add To Notes',
    description: 'Add notes to the contact record',
    icon: FileText,
    category: 'Contact Management',
    fields: ['noteContent', 'noteType']
  },
  {
    id: 'add-to-notes',
    name: 'Add To Notes',
    description: 'Add notes to the contact record',
    icon: FileText,
    category: 'Contact Management',
    fields: ['noteContent', 'noteType']
  },
  {
    id: 'set_dnd',
    name: 'Set Contact DND',
    description: 'Set do not disturb for contact',
    icon: Phone,
    category: 'Contact Management',
    fields: ['dndType', 'duration']
  },
  {
    id: 'set-contact-dnd',
    name: 'Set Contact DND',
    description: 'Set do not disturb for contact',
    icon: Phone,
    category: 'Contact Management',
    fields: ['dndType', 'duration']
  },
  
  // Sales & Opportunities
  {
    id: 'create_opportunity',
    name: 'Create/Update Opportunity',
    description: 'Create or update sales opportunity',
    icon: Target,
    category: 'Sales & Opportunities',
    fields: ['title', 'value', 'stage', 'probability', 'closeDate']
  },
  {
    id: 'create-opportunity',
    name: 'Create/Update Opportunity',
    description: 'Create or update sales opportunity',
    icon: Target,
    category: 'Sales & Opportunities',
    fields: ['title', 'value', 'stage', 'probability', 'closeDate']
  },
  {
    id: 'remove_opportunity',
    name: 'Remove Opportunity',
    description: 'Remove an opportunity from contact',
    icon: DollarSign,
    category: 'Sales & Opportunities',
    fields: ['opportunityId', 'reason']
  },
  {
    id: 'remove-opportunity',
    name: 'Remove Opportunity',
    description: 'Remove an opportunity from contact',
    icon: DollarSign,
    category: 'Sales & Opportunities',
    fields: ['opportunityId', 'reason']
  },
  
  // Workflow Management
  {
    id: 'add_to_workflow',
    name: 'Add To Workflow',
    description: 'Add contact to another workflow',
    icon: Workflow,
    category: 'Workflow Management',
    fields: ['workflowId', 'startImmediately']
  },
  {
    id: 'add-to-workflow',
    name: 'Add To Workflow',
    description: 'Add contact to another workflow',
    icon: Workflow,
    category: 'Workflow Management',
    fields: ['workflowId', 'startImmediately']
  },
  {
    id: 'remove_from_workflow',
    name: 'Remove From Workflow',
    description: 'Remove contact from specific workflow',
    icon: Workflow,
    category: 'Workflow Management',
    fields: ['workflowId']
  },
  {
    id: 'remove-from-workflow',
    name: 'Remove From Workflow',
    description: 'Remove contact from specific workflow',
    icon: Workflow,
    category: 'Workflow Management',
    fields: ['workflowId']
  },
  {
    id: 'remove_from_all_workflows',
    name: 'Remove From All Workflows',
    description: 'Remove contact from all active workflows',
    icon: Users,
    category: 'Workflow Management',
    fields: ['excludeCurrentWorkflow']
  },
  {
    id: 'remove-from-all-workflows',
    name: 'Remove From All Workflows',
    description: 'Remove contact from all active workflows',
    icon: Users,
    category: 'Workflow Management',
    fields: ['excludeCurrentWorkflow']
  },
  
  // Scheduling
  {
    id: 'schedule_appointment',
    name: 'Schedule Appointment',
    description: 'Schedule an appointment with contact',
    icon: Calendar,
    category: 'Scheduling',
    fields: ['appointmentType', 'duration', 'dateTime', 'notes']
  },
  {
    id: 'set_event_date',
    name: 'Set Event Start Date',
    description: 'Set an event start date for contact',
    icon: Calendar,
    category: 'Scheduling',
    fields: ['eventType', 'eventDate', 'reminder']
  },
  {
    id: 'set-event-date',
    name: 'Set Event Start Date',
    description: 'Set an event start date for contact',
    icon: Calendar,
    category: 'Scheduling',
    fields: ['eventType', 'eventDate', 'reminder']
  },
  
  // Flow Control
  {
    id: 'wait',
    name: 'Wait/Delay',
    description: 'Add a delay in the workflow execution',
    icon: Clock,
    category: 'Flow Control',
    fields: ['delayAmount', 'delayUnit']
  },
  {
    id: 'condition',
    name: 'If/Then Branch',
    description: 'Create conditional logic in workflow',
    icon: GitBranch,
    category: 'Flow Control',
    fields: ['conditionField', 'operator', 'value']
  },
  {
    id: 'create_task',
    name: 'Create Task',
    description: 'Create a task for team member',
    icon: FileText,
    category: 'Task Management',
    fields: ['title', 'description', 'assignedTo', 'priority', 'dueDate']
  },
  {
    id: 'end',
    name: 'End Workflow',
    description: 'Stop the workflow execution',
    icon: Target,
    category: 'Flow Control',
    fields: []
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
  const [delay, setDelay] = useState<{ amount: number; unit: 'minutes' | 'hours' | 'days' }>({ 
    amount: 0, 
    unit: 'minutes' 
  });
  const [activeTab, setActiveTab] = useState('select');

  // Initialize form when node changes
  useEffect(() => {
    if (node && node.data.config) {
      const config = node.data.config as any;
      setSelectedType(config.type || '');
      setActionName(config.name || '');
      setSettings(config.settings || {});
      if (config.delay) {
        setDelay(config.delay);
      }
      setActiveTab('configure');
    } else {
      setSelectedType('');
      setActionName('');
      setSettings({});
      setDelay({ amount: 0, unit: 'minutes' });
      setActiveTab('select');
    }
  }, [node]);

  const handleSave = () => {
    if (!node || !selectedType || !actionName.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedActionType = actionTypes.find(a => a.id === selectedType);
    if (!selectedActionType) {
      toast.error('Invalid action type selected');
      return;
    }

    const actionConfig: ActionConfig = {
      id: node.id,
      type: selectedType,
      name: actionName.trim(),
      settings,
      delay: delay.amount > 0 ? delay : undefined
    };

    updateNode(node.id, {
      data: {
        ...node.data,
        label: actionName.trim(),
        icon: selectedActionType.icon,
        config: actionConfig,
        isConfigured: true
      }
    });

    toast.success('Action configured successfully');
    onClose();
  };

  const handleTest = async () => {
    if (!selectedType || !actionName) {
      toast.error('Please configure the action first');
      return;
    }

    try {
      toast.info('Testing action...');
      
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        success: true,
        message: `${actionName} executed successfully`,
        executionTime: '1.2s'
      };

      if (mockResult.success) {
        toast.success(`Test successful: ${mockResult.message}`);
      } else {
        toast.error(`Test failed: ${mockResult.message}`);
      }
    } catch (error) {
      toast.error('Test execution failed');
      console.error('Test error:', error);
    }
  };

  const renderActionSettings = () => {
    const selectedAction = actionTypes.find(a => a.id === selectedType);
    if (!selectedAction) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Select an action type to configure its settings.</p>
        </div>
      );
    }

    // Normalize action type for consistent handling
    const normalizedType = selectedType.replace(/-/g, '_');

    switch (normalizedType) {
      case 'send_email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-template">Email Template *</Label>
              <Select value={settings.templateId || ''} onValueChange={(value) => setSettings({ ...settings, templateId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select email template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome">Welcome Email</SelectItem>
                  <SelectItem value="follow-up">Follow-up Email</SelectItem>
                  <SelectItem value="promotional">Promotional Email</SelectItem>
                  <SelectItem value="custom">Custom Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="email-subject">Subject Line *</Label>
              <Input
                id="email-subject"
                placeholder="Enter email subject"
                value={settings.subject || ''}
                onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="email-message">Message Content *</Label>
              <Textarea
                id="email-message"
                placeholder="Email content... Use variables for personalization"
                rows={6}
                value={settings.message || ''}
                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Available variables: {`{{first_name}}, {{last_name}}, {{email}}, {{company}}`}
              </p>
            </div>
            
            <div>
              <Label htmlFor="from-email">From Email</Label>
              <Select value={settings.fromEmail || ''} onValueChange={(value) => setSettings({ ...settings, fromEmail: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sender email" />
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
              <Label htmlFor="sms-message">SMS Message *</Label>
              <Textarea
                id="sms-message"
                placeholder="SMS content... Use variables for personalization"
                rows={4}
                maxLength={160}
                value={settings.message || ''}
                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Available variables: {`{{first_name}}, {{last_name}}, {{phone}}`}</span>
                <span>{(settings.message || '').length}/160 characters</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="from-number">From Number</Label>
              <Select value={settings.fromNumber || ''} onValueChange={(value) => setSettings({ ...settings, fromNumber: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select phone number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1234567890">+1 (234) 567-8900</SelectItem>
                  <SelectItem value="+1987654321">+1 (987) 654-3210</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'send_notification':
      case 'send_internal_notification':
      case 'send_review_request':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="notification-message">Message *</Label>
              <Textarea
                id="notification-message"
                placeholder="Notification message"
                rows={4}
                value={settings.message || ''}
                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="recipient-type">Recipient Type</Label>
              <Select value={settings.recipientType || ''} onValueChange={(value) => setSettings({ ...settings, recipientType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="assigned">Assigned User</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="custom">Custom Recipients</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {normalizedType === 'send_review_request' && (
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={settings.platform || ''} onValueChange={(value) => setSettings({ ...settings, platform: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Reviews</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="yelp">Yelp</SelectItem>
                    <SelectItem value="custom">Custom Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );

      case 'add_tag':
      case 'add_contact_tag':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tag-name">Tag Name *</Label>
              <Input
                id="tag-name"
                placeholder="Enter tag name"
                value={settings.tagName || ''}
                onChange={(e) => setSettings({ ...settings, tagName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tag-color">Tag Color</Label>
              <Select value={settings.tagColor || 'blue'} onValueChange={(value) => setSettings({ ...settings, tagColor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tag color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'remove_tag':
      case 'remove_contact_tag':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tag-name">Tag Name to Remove *</Label>
              <Input
                id="tag-name"
                placeholder="Enter tag name to remove"
                value={settings.tagName || ''}
                onChange={(e) => setSettings({ ...settings, tagName: e.target.value })}
              />
            </div>
          </div>
        );

      case 'assign_user':
      case 'remove_assigned_user':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="assign-user">{normalizedType === 'assign_user' ? 'Assign To' : 'Remove User'} *</Label>
              <Select value={settings.userId || ''} onValueChange={(value) => setSettings({ ...settings, userId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">John Doe</SelectItem>
                  <SelectItem value="user2">Jane Smith</SelectItem>
                  <SelectItem value="user3">Mike Johnson</SelectItem>
                  <SelectItem value="user4">Sarah Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {normalizedType === 'assign_user' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="notify-user"
                  checked={settings.notifyUser || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifyUser: checked })}
                />
                <Label htmlFor="notify-user">Notify user via email</Label>
              </div>
            )}
          </div>
        );

      case 'add_notes':
      case 'add_to_notes':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-content">Note Content *</Label>
              <Textarea
                id="note-content"
                placeholder="Enter note content"
                rows={4}
                value={settings.noteContent || ''}
                onChange={(e) => setSettings({ ...settings, noteContent: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="note-type">Note Type</Label>
              <Select value={settings.noteType || ''} onValueChange={(value) => setSettings({ ...settings, noteType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Note</SelectItem>
                  <SelectItem value="call">Call Note</SelectItem>
                  <SelectItem value="meeting">Meeting Note</SelectItem>
                  <SelectItem value="task">Task Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'set_dnd':
      case 'set_contact_dnd':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dnd-type">DND Type *</Label>
              <Select value={settings.dndType || ''} onValueChange={(value) => setSettings({ ...settings, dndType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select DND type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Communications</SelectItem>
                  <SelectItem value="calls">Calls Only</SelectItem>
                  <SelectItem value="sms">SMS Only</SelectItem>
                  <SelectItem value="emails">Emails Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dnd-duration">Duration</Label>
              <Input
                id="dnd-duration"
                placeholder="Duration in hours (0 for permanent)"
                type="number"
                value={settings.duration || ''}
                onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        );

      case 'create_opportunity':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="opp-title">Opportunity Title *</Label>
              <Input
                id="opp-title"
                placeholder="Enter opportunity title"
                value={settings.title || ''}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="opp-value">Value ($)</Label>
                <Input
                  id="opp-value"
                  type="number"
                  placeholder="0"
                  value={settings.value || ''}
                  onChange={(e) => setSettings({ ...settings, value: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="opp-probability">Probability (%)</Label>
                <Input
                  id="opp-probability"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="50"
                  value={settings.probability || ''}
                  onChange={(e) => setSettings({ ...settings, probability: parseInt(e.target.value) || 50 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="opp-stage">Stage</Label>
              <Select value={settings.stage || ''} onValueChange={(value) => setSettings({ ...settings, stage: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'remove_opportunity':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="opp-id">Opportunity ID</Label>
              <Input
                id="opp-id"
                placeholder="Enter opportunity ID (leave blank to remove all)"
                value={settings.opportunityId || ''}
                onChange={(e) => setSettings({ ...settings, opportunityId: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="remove-reason">Reason</Label>
              <Textarea
                id="remove-reason"
                placeholder="Reason for removing opportunity"
                rows={3}
                value={settings.reason || ''}
                onChange={(e) => setSettings({ ...settings, reason: e.target.value })}
              />
            </div>
          </div>
        );

      case 'add_to_workflow':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-id">Target Workflow *</Label>
              <Select value={settings.workflowId || ''} onValueChange={(value) => setSettings({ ...settings, workflowId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow1">Follow-up Sequence</SelectItem>
                  <SelectItem value="workflow2">Nurture Campaign</SelectItem>
                  <SelectItem value="workflow3">Onboarding Flow</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="start-immediately"
                checked={settings.startImmediately || false}
                onCheckedChange={(checked) => setSettings({ ...settings, startImmediately: checked })}
              />
              <Label htmlFor="start-immediately">Start immediately</Label>
            </div>
          </div>
        );

      case 'remove_from_workflow':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-id">Workflow to Remove From *</Label>
              <Select value={settings.workflowId || ''} onValueChange={(value) => setSettings({ ...settings, workflowId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workflow1">Follow-up Sequence</SelectItem>
                  <SelectItem value="workflow2">Nurture Campaign</SelectItem>
                  <SelectItem value="workflow3">Onboarding Flow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'remove_from_all_workflows':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="exclude-current"
                checked={settings.excludeCurrentWorkflow || false}
                onCheckedChange={(checked) => setSettings({ ...settings, excludeCurrentWorkflow: checked })}
              />
              <Label htmlFor="exclude-current">Exclude current workflow</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              This will remove the contact from all active workflows {settings.excludeCurrentWorkflow ? 'except the current one' : 'including the current one'}.
            </p>
          </div>
        );

      case 'schedule_appointment':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="appointment-type">Appointment Type *</Label>
              <Select value={settings.appointmentType || ''} onValueChange={(value) => setSettings({ ...settings, appointmentType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="demo">Demo Call</SelectItem>
                  <SelectItem value="follow-up">Follow-up Meeting</SelectItem>
                  <SelectItem value="onboarding">Onboarding Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={settings.duration || ''}
                  onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) || 30 })}
                />
              </div>
              <div>
                <Label htmlFor="date-time">Date & Time</Label>
                <Input
                  id="date-time"
                  type="datetime-local"
                  value={settings.dateTime || ''}
                  onChange={(e) => setSettings({ ...settings, dateTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="appointment-notes">Notes</Label>
              <Textarea
                id="appointment-notes"
                placeholder="Appointment notes"
                rows={3}
                value={settings.notes || ''}
                onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
              />
            </div>
          </div>
        );

      case 'set_event_date':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-type">Event Type *</Label>
              <Select value={settings.eventType || ''} onValueChange={(value) => setSettings({ ...settings, eventType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="contract-renewal">Contract Renewal</SelectItem>
                  <SelectItem value="follow-up">Follow-up Date</SelectItem>
                  <SelectItem value="custom">Custom Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="event-date">Event Date *</Label>
              <Input
                id="event-date"
                type="date"
                value={settings.eventDate || ''}
                onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="set-reminder"
                checked={settings.reminder || false}
                onCheckedChange={(checked) => setSettings({ ...settings, reminder: checked })}
              />
              <Label htmlFor="set-reminder">Set reminder</Label>
            </div>
          </div>
        );

      case 'create_task':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Task Title *</Label>
              <Input
                id="task-title"
                placeholder="Enter task title"
                value={settings.title || ''}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Task description"
                rows={3}
                value={settings.description || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="task-assigned">Assigned To</Label>
                <Select value={settings.assignedTo || ''} onValueChange={(value) => setSettings({ ...settings, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">John Doe</SelectItem>
                    <SelectItem value="user2">Jane Smith</SelectItem>
                    <SelectItem value="user3">Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select value={settings.priority || ''} onValueChange={(value) => setSettings({ ...settings, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={settings.dueDate || ''}
                onChange={(e) => setSettings({ ...settings, dueDate: e.target.value })}
              />
            </div>
          </div>
        );

      case 'wait':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="delay-amount">Duration *</Label>
                <Input
                  id="delay-amount"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={delay.amount}
                  onChange={(e) => setDelay({ ...delay, amount: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label htmlFor="delay-unit">Unit *</Label>
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
            <p className="text-sm text-muted-foreground">
              The workflow will pause for the specified duration before continuing to the next action.
            </p>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition-field">Field to Check *</Label>
              <Select value={settings.conditionField || ''} onValueChange={(value) => setSettings({ ...settings, conditionField: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="tags">Tags</SelectItem>
                  <SelectItem value="source">Source</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="state">State</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition-operator">Operator *</Label>
              <Select value={settings.operator || ''} onValueChange={(value) => setSettings({ ...settings, operator: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="not_contains">Does Not Contain</SelectItem>
                  <SelectItem value="exists">Exists</SelectItem>
                  <SelectItem value="not_exists">Does Not Exist</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition-value">Value</Label>
              <Input
                id="condition-value"
                placeholder="Enter comparison value"
                value={settings.value || ''}
                onChange={(e) => setSettings({ ...settings, value: e.target.value })}
              />
            </div>
          </div>
        );

      case 'end':
        return (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">End Workflow</p>
            <p className="text-sm text-muted-foreground">
              This action will stop the workflow execution. No additional configuration is required.
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Configuration for "{selectedAction.name}" is not yet implemented.</p>
            <p className="text-xs mt-2">Action type: {selectedType}</p>
          </div>
        );
    }
  };

  const groupedActions = actionTypes.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    // Avoid duplicates
    if (!acc[action.category].find(a => a.id === action.id)) {
      acc[action.category].push(action);
    }
    return acc;
  }, {} as Record<string, typeof actionTypes>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Configure Action</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Select Action</span>
            </TabsTrigger>
            <TabsTrigger value="configure" disabled={!selectedType} className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </TabsTrigger>
            <TabsTrigger value="test" disabled={!selectedType || !actionName} className="flex items-center space-x-2">
              <TestTube className="h-4 w-4" />
              <span>Test</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="space-y-6 mt-6">
            {Object.entries(groupedActions).map(([category, actions]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    const isSelected = selectedType === action.id;
                    return (
                      <Card 
                        key={action.id}
                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedType(action.id);
                          setActionName(action.name);
                          setActiveTab('configure');
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{action.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {action.description}
                              </CardDescription>
                            </div>
                            {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="configure" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="action-name">Action Name *</Label>
                <Input
                  id="action-name"
                  placeholder="Enter a descriptive name for this action"
                  value={actionName}
                  onChange={(e) => setActionName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              {selectedType !== 'wait' && (
                <div>
                  <Label>Execution Delay (Optional)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Add a delay before executing this action
                  </p>
                </div>
              )}
              
              <div>
                <Label className="text-base font-medium">Action Settings</Label>
                <Card className="mt-2">
                  <CardContent className="pt-6">
                    {renderActionSettings()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Test Action Configuration</span>
                </CardTitle>
                <CardDescription>
                  Test your action with sample data to ensure it works correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Test Data</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Contact:</strong> John Doe (john.doe@example.com)</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Tags:</strong> prospect, interested</p>
                    <p><strong>Company:</strong> Acme Corp</p>
                  </div>
                </div>
                
                <Button onClick={handleTest} className="w-full">
                  <TestTube className="h-4 w-4 mr-2" />
                  Run Test
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedType || !actionName.trim()}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Save Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
