
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
import { useWorkflowStore, WorkflowNode, ActionConfig } from '@/store/useWorkflowStore';
import { toast } from 'sonner';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Eye, 
  Tag, 
  User, 
  UserMinus, 
  FileText, 
  Phone, 
  Target, 
  DollarSign, 
  Workflow, 
  Users, 
  Calendar, 
  Clock, 
  GitBranch 
} from 'lucide-react';

interface ActionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: WorkflowNode | null;
}

export function ActionConfigModal({ isOpen, onClose, node }: ActionConfigModalProps) {
  const { updateNode } = useWorkflowStore();
  const [actionName, setActionName] = useState('');
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [delay, setDelay] = useState({ amount: 0, unit: 'minutes' as const });

  useEffect(() => {
    if (node) {
      setActionName(node.data.label || '');
      const config = node.data.config as ActionConfig;
      if (config) {
        setSettings(config.settings || {});
        setDelay(config.delay || { amount: 0, unit: 'minutes' });
      }
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    try {
      if (!actionName.trim()) {
        toast.error('Please enter an action name');
        return;
      }

      const actionConfig: ActionConfig = {
        id: node.id,
        type: getActionTypeFromNodeId(node.id),
        name: actionName,
        settings,
        delay: delay.amount > 0 ? delay : undefined
      };

      updateNode(node.id, {
        data: {
          ...node.data,
          label: actionName,
          config: actionConfig,
          isConfigured: true
        }
      });

      toast.success('Action configured successfully');
      onClose();
    } catch (error) {
      console.error('Error saving action config:', error);
      toast.error('Failed to save action configuration');
    }
  };

  const getActionTypeFromNodeId = (nodeId: string): string => {
    const actionType = nodeId.split('-')[0];
    return actionType.replace(/_/g, '-');
  };

  const renderActionSettings = () => {
    const actionType = getActionTypeFromNodeId(node.id);
    
    try {
      switch (actionType) {
        case 'send-email':
          return (
            <div className="space-y-4">
              <div>
                <Label>Email Template</Label>
                <Select value={settings.templateId || ''} onValueChange={(value) => setSettings({ ...settings, templateId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="follow-up">Follow-up Email</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
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
                  placeholder="Email message content"
                  value={settings.message || ''}
                  onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          );

        case 'send-sms':
          return (
            <div className="space-y-4">
              <div>
                <Label>Message</Label>
                <Textarea
                  placeholder="SMS message content"
                  value={settings.message || ''}
                  onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label>From Number</Label>
                <Select value={settings.fromNumber || ''} onValueChange={(value) => setSettings({ ...settings, fromNumber: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phone number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1234567890">+1 (234) 567-890</SelectItem>
                    <SelectItem value="+1987654321">+1 (987) 654-321</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );

        case 'add-contact-tag':
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
              <div>
                <Label>Tag Color</Label>
                <Select value={settings.tagColor || 'blue'} onValueChange={(value) => setSettings({ ...settings, tagColor: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );

        case 'assign-user':
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
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={settings.notifyUser || false} 
                  onCheckedChange={(checked) => setSettings({ ...settings, notifyUser: checked })}
                />
                <Label>Notify user via email</Label>
              </div>
            </div>
          );

        case 'create-opportunity':
          return (
            <div className="space-y-4">
              <div>
                <Label>Opportunity Title</Label>
                <Input
                  placeholder="Enter opportunity title"
                  value={settings.title || ''}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.value || ''}
                  onChange={(e) => setSettings({ ...settings, value: e.target.value })}
                />
              </div>
              <div>
                <Label>Stage</Label>
                <Select value={settings.stage || ''} onValueChange={(value) => setSettings({ ...settings, stage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="won">Won</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );

        case 'wait':
          return (
            <div className="space-y-4">
              <div>
                <Label>Wait Duration</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={delay.amount}
                    onChange={(e) => setDelay({ ...delay, amount: parseInt(e.target.value) || 0 })}
                    className="flex-1"
                  />
                  <Select value={delay.unit} onValueChange={(value: 'minutes' | 'hours' | 'days') => setDelay({ ...delay, unit: value })}>
                    <SelectTrigger className="w-32">
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

        case 'condition':
          return (
            <div className="space-y-4">
              <div>
                <Label>Condition Field</Label>
                <Select value={settings.conditionField || ''} onValueChange={(value) => setSettings({ ...settings, conditionField: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="tags">Tags</SelectItem>
                    <SelectItem value="source">Source</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Operator</Label>
                <Select value={settings.operator || ''} onValueChange={(value) => setSettings({ ...settings, operator: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="exists">Exists</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  placeholder="Enter value"
                  value={settings.value || ''}
                  onChange={(e) => setSettings({ ...settings, value: e.target.value })}
                />
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-8 text-gray-500">
              <p>No configuration required for this action type.</p>
              <p className="text-sm mt-2">Action will execute with default settings.</p>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering action settings:', error);
      return (
        <div className="text-center py-8 text-red-500">
          <p>Error loading configuration options.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Action: {node.data.label}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label>Action Name</Label>
            <Input
              placeholder="Enter action name"
              value={actionName}
              onChange={(e) => setActionName(e.target.value)}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Action Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {renderActionSettings()}
            </CardContent>
          </Card>
          
          {getActionTypeFromNodeId(node.id) !== 'wait' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delay (Optional)</CardTitle>
                <CardDescription>Add a delay before this action executes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={delay.amount}
                    onChange={(e) => setDelay({ ...delay, amount: parseInt(e.target.value) || 0 })}
                    className="flex-1"
                  />
                  <Select value={delay.unit} onValueChange={(value: 'minutes' | 'hours' | 'days') => setDelay({ ...delay, unit: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minutes">Minutes</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Action</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
