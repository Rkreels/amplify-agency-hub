
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Copy,
  Trash2,
  Settings,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  GitBranch,
  Target,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAutomationStore, type Workflow } from '@/store/useAutomationStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';

const triggerTypes = [
  { id: 'contact_created', name: 'New Contact Created', icon: Users, description: 'When a new contact is added' },
  { id: 'form_submitted', name: 'Form Submitted', icon: Target, description: 'When a form is submitted' },
  { id: 'email_opened', name: 'Email Opened', icon: Mail, description: 'When an email is opened' },
  { id: 'appointment_booked', name: 'Appointment Booked', icon: Calendar, description: 'When an appointment is scheduled' },
  { id: 'tag_added', name: 'Tag Added', icon: Target, description: 'When a specific tag is added' },
  { id: 'no_response', name: 'No Response', icon: Clock, description: 'After a period of inactivity' }
];

const actionTypes = [
  { id: 'send_email', name: 'Send Email', icon: Mail, description: 'Send an email message' },
  { id: 'send_sms', name: 'Send SMS', icon: MessageSquare, description: 'Send an SMS message' },
  { id: 'add_tag', name: 'Add Tag', icon: Target, description: 'Add a tag to contact' },
  { id: 'create_task', name: 'Create Task', icon: Calendar, description: 'Create a task or reminder' },
  { id: 'update_contact', name: 'Update Contact', icon: Users, description: 'Update contact information' },
  { id: 'webhook', name: 'Send Webhook', icon: Zap, description: 'Send data to external service' }
];

export function WorkflowBuilder() {
  const {
    workflows,
    selectedWorkflow,
    isEditing,
    searchQuery,
    statusFilter,
    addWorkflow,
    updateWorkflow,
    deleteWorkflow,
    duplicateWorkflow,
    toggleWorkflowStatus,
    setSelectedWorkflow,
    setEditing,
    setSearchQuery,
    setStatusFilter,
    getFilteredWorkflows
  } = useAutomationStore();

  const { announceFeature } = useVoiceTraining();
  const [isCreating, setIsCreating] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    status: 'draft' as const,
    trigger: '',
    nodes: [],
    edges: [],
    stats: { triggered: 0, completed: 0, failed: 0 }
  });

  useEffect(() => {
    announceFeature(
      'Workflow Builder',
      'Create and manage automated workflows for your business. Set up triggers, actions, and conditions to automate repetitive tasks like email sequences, lead nurturing, and follow-ups.'
    );
  }, [announceFeature]);

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.trigger) {
      toast.error('Please fill in required fields');
      return;
    }

    addWorkflow(newWorkflow);
    setNewWorkflow({
      name: '',
      description: '',
      status: 'draft',
      trigger: '',
      nodes: [],
      edges: [],
      stats: { triggered: 0, completed: 0, failed: 0 }
    });
    setIsCreating(false);
    toast.success('Workflow created successfully');
  };

  const handleToggleStatus = (workflow: Workflow) => {
    toggleWorkflowStatus(workflow.id);
    toast.success(`Workflow ${workflow.status === 'active' ? 'paused' : 'activated'}`);
  };

  const handleDuplicate = (workflow: Workflow) => {
    duplicateWorkflow(workflow.id);
    toast.success('Workflow duplicated successfully');
  };

  const handleDelete = (workflow: Workflow) => {
    if (confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      deleteWorkflow(workflow.id);
      toast.success('Workflow deleted successfully');
    }
  };

  const WorkflowCard = ({ workflow }: { workflow: Workflow }) => {
    const triggerType = triggerTypes.find(t => t.id === workflow.trigger);
    const TriggerIcon = triggerType?.icon || Zap;
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TriggerIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={workflow.status === 'active' ? 'default' : workflow.status === 'inactive' ? 'secondary' : 'outline'}
              >
                {workflow.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStatus(workflow)}
              >
                {workflow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium">Trigger:</span>
            <span className="ml-2">{triggerType?.name || workflow.trigger}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{workflow.stats.triggered}</div>
              <div className="text-xs text-muted-foreground">Triggered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{workflow.stats.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{workflow.stats.failed}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Updated {workflow.updatedAt.toLocaleDateString()}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingWorkflow(workflow);
                  setSelectedWorkflow(workflow.id);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDuplicate(workflow)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(workflow)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workflow Builder</h1>
          <p className="text-muted-foreground">
            Automate your business processes with intelligent workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up a new automated workflow for your business
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name *</Label>
                  <Input
                    id="workflow-name"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                    placeholder="Welcome Email Sequence"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea
                    id="workflow-description"
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                    placeholder="Send welcome emails to new leads"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-trigger">Trigger *</Label>
                  <Select value={newWorkflow.trigger} onValueChange={(value) => setNewWorkflow({...newWorkflow, trigger: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((trigger) => (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          <div className="flex items-center space-x-2">
                            <trigger.icon className="h-4 w-4" />
                            <span>{trigger.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWorkflow}>
                    Create Workflow
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workflow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <GitBranch className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">
                  {workflows.reduce((acc, w) => acc + w.stats.triggered, 0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {workflows.length > 0 ? Math.round(
                    (workflows.reduce((acc, w) => acc + w.stats.completed, 0) / 
                     Math.max(workflows.reduce((acc, w) => acc + w.stats.triggered, 0), 1)) * 100
                  ) : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Lead Nurturing', description: 'Automated email sequence for new leads', trigger: 'contact_created' },
              { name: 'Appointment Reminders', description: 'Send reminders before appointments', trigger: 'appointment_booked' },
              { name: 'Follow-up Sequence', description: 'Follow up with prospects after no response', trigger: 'no_response' }
            ].map((template, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => {
                    setNewWorkflow({
                      ...newWorkflow,
                      name: template.name,
                      description: template.description,
                      trigger: template.trigger
                    });
                    setIsCreating(true);
                  }}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredWorkflows().map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>

      {/* Edit Workflow Dialog */}
      {editingWorkflow && (
        <Dialog open={!!editingWorkflow} onOpenChange={() => setEditingWorkflow(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Workflow</DialogTitle>
              <DialogDescription>
                Modify your workflow settings and configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Workflow Name</Label>
                  <Input
                    id="edit-name"
                    value={editingWorkflow.name}
                    onChange={(e) => setEditingWorkflow({...editingWorkflow, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={editingWorkflow.status} 
                    onValueChange={(value: any) => setEditingWorkflow({...editingWorkflow, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingWorkflow.description}
                  onChange={(e) => setEditingWorkflow({...editingWorkflow, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Workflow Steps</h4>
                <div className="space-y-3">
                  {/* Trigger */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Zap className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Trigger</p>
                      <p className="text-sm text-muted-foreground">
                        {triggerTypes.find(t => t.id === editingWorkflow.trigger)?.name || editingWorkflow.trigger}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Mail className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Send Welcome Email</p>
                      <p className="text-sm text-muted-foreground">Send automated welcome message</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingWorkflow(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  updateWorkflow(editingWorkflow.id, editingWorkflow);
                  setEditingWorkflow(null);
                  toast.success('Workflow updated successfully');
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
