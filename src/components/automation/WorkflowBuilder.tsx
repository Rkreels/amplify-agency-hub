
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Filter, 
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Zap,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Tag,
  Settings,
  ArrowRight,
  GitBranch,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'contact_created' | 'tag_applied' | 'form_submitted' | 'email_opened' | 'date_based' | 'manual';
    value: string;
  };
  actions: WorkflowAction[];
  status: 'active' | 'inactive' | 'draft';
  stats: {
    triggered: number;
    completed: number;
    active: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface WorkflowAction {
  id: string;
  type: 'send_email' | 'send_sms' | 'add_tag' | 'remove_tag' | 'wait' | 'create_task' | 'update_contact';
  config: any;
  delay?: number;
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Welcome Email Series',
    description: 'Send a series of welcome emails to new contacts',
    trigger: { type: 'contact_created', value: 'Any new contact' },
    actions: [
      { id: '1', type: 'send_email', config: { template: 'Welcome Email 1' } },
      { id: '2', type: 'wait', config: { days: 3 } },
      { id: '3', type: 'send_email', config: { template: 'Welcome Email 2' } }
    ],
    status: 'active',
    stats: { triggered: 145, completed: 132, active: 13 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Abandoned Cart Recovery',
    description: 'Follow up with customers who abandoned their cart',
    trigger: { type: 'tag_applied', value: 'abandoned-cart' },
    actions: [
      { id: '1', type: 'wait', config: { hours: 2 } },
      { id: '2', type: 'send_email', config: { template: 'Cart Reminder' } },
      { id: '3', type: 'wait', config: { days: 1 } },
      { id: '4', type: 'send_sms', config: { message: 'Complete your purchase and save 10%!' } }
    ],
    status: 'active',
    stats: { triggered: 89, completed: 67, active: 22 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  }
];

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  const [newWorkflowData, setNewWorkflowData] = useState({
    name: '',
    description: '',
    triggerType: 'contact_created',
    triggerValue: '',
    actions: [] as WorkflowAction[]
  });

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateWorkflow = () => {
    if (!newWorkflowData.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowData.name,
      description: newWorkflowData.description,
      trigger: {
        type: newWorkflowData.triggerType as any,
        value: newWorkflowData.triggerValue || 'Default trigger'
      },
      actions: newWorkflowData.actions,
      status: 'draft',
      stats: { triggered: 0, completed: 0, active: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setWorkflows(prev => [...prev, newWorkflow]);
    setNewWorkflowData({
      name: '',
      description: '',
      triggerType: 'contact_created',
      triggerValue: '',
      actions: []
    });
    setShowCreateDialog(false);
    toast.success('Workflow created successfully');
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setNewWorkflowData({
      name: workflow.name,
      description: workflow.description,
      triggerType: workflow.trigger.type,
      triggerValue: workflow.trigger.value,
      actions: workflow.actions
    });
    setShowEditDialog(true);
  };

  const handleUpdateWorkflow = () => {
    if (!editingWorkflow) return;

    setWorkflows(prev => prev.map(w => 
      w.id === editingWorkflow.id 
        ? {
            ...w,
            name: newWorkflowData.name,
            description: newWorkflowData.description,
            trigger: {
              type: newWorkflowData.triggerType as any,
              value: newWorkflowData.triggerValue
            },
            actions: newWorkflowData.actions,
            updatedAt: new Date()
          }
        : w
    ));
    setShowEditDialog(false);
    setEditingWorkflow(null);
    toast.success('Workflow updated successfully');
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.filter(w => w.id !== workflowId));
    toast.success('Workflow deleted successfully');
  };

  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const duplicate: Workflow = {
      ...workflow,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      status: 'draft',
      stats: { triggered: 0, completed: 0, active: 0 },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setWorkflows(prev => [...prev, duplicate]);
    toast.success('Workflow duplicated successfully');
  };

  const handleToggleWorkflow = (workflowId: string, currentStatus: Workflow['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, status: newStatus, updatedAt: new Date() } : w
    ));
    toast.success(`Workflow ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const addAction = (type: WorkflowAction['type']) => {
    const newAction: WorkflowAction = {
      id: Date.now().toString(),
      type,
      config: getDefaultConfig(type)
    };
    setNewWorkflowData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeAction = (actionId: string) => {
    setNewWorkflowData(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== actionId)
    }));
  };

  const getDefaultConfig = (type: WorkflowAction['type']) => {
    switch (type) {
      case 'send_email':
        return { template: 'Select template', subject: '' };
      case 'send_sms':
        return { message: '' };
      case 'add_tag':
      case 'remove_tag':
        return { tag: '' };
      case 'wait':
        return { days: 1, hours: 0 };
      case 'create_task':
        return { title: '', description: '', assignedTo: '' };
      case 'update_contact':
        return { field: '', value: '' };
      default:
        return {};
    }
  };

  const getActionIcon = (type: WorkflowAction['type']) => {
    const icons = {
      send_email: Mail,
      send_sms: MessageSquare,
      add_tag: Tag,
      remove_tag: Tag,
      wait: Timer,
      create_task: Calendar,
      update_contact: Users
    };
    return icons[type] || Zap;
  };

  const getStatusBadge = (status: Workflow['status']) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      draft: 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const totalStats = workflows.reduce((acc, workflow) => ({
    triggered: acc.triggered + workflow.stats.triggered,
    completed: acc.completed + workflow.stats.completed,
    active: acc.active + workflow.stats.active
  }), { triggered: 0, completed: 0, active: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workflow Builder</h1>
          <p className="text-muted-foreground">
            Automate your marketing and sales processes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>
                  Set up an automated workflow to streamline your processes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Workflow Name *</Label>
                    <Input
                      id="name"
                      value={newWorkflowData.name}
                      onChange={(e) => setNewWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter workflow name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="triggerType">Trigger Type</Label>
                    <Select
                      value={newWorkflowData.triggerType}
                      onValueChange={(value) => setNewWorkflowData(prev => ({ ...prev, triggerType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contact_created">Contact Created</SelectItem>
                        <SelectItem value="tag_applied">Tag Applied</SelectItem>
                        <SelectItem value="form_submitted">Form Submitted</SelectItem>
                        <SelectItem value="email_opened">Email Opened</SelectItem>
                        <SelectItem value="date_based">Date Based</SelectItem>
                        <SelectItem value="manual">Manual Trigger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newWorkflowData.description}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this workflow does"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="triggerValue">Trigger Value</Label>
                  <Input
                    id="triggerValue"
                    value={newWorkflowData.triggerValue}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, triggerValue: e.target.value }))}
                    placeholder="Enter trigger condition"
                  />
                </div>

                {/* Workflow Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Workflow Actions</Label>
                    <Select onValueChange={(value) => addAction(value as WorkflowAction['type'])}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Add Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="send_email">Send Email</SelectItem>
                        <SelectItem value="send_sms">Send SMS</SelectItem>
                        <SelectItem value="add_tag">Add Tag</SelectItem>
                        <SelectItem value="remove_tag">Remove Tag</SelectItem>
                        <SelectItem value="wait">Wait</SelectItem>
                        <SelectItem value="create_task">Create Task</SelectItem>
                        <SelectItem value="update_contact">Update Contact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {newWorkflowData.actions.map((action, index) => {
                      const ActionIcon = getActionIcon(action.type);
                      return (
                        <div key={action.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <div className="flex items-center space-x-2 flex-1">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">{index + 1}</span>
                            </div>
                            <ActionIcon className="h-4 w-4" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Configure action settings
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAction(action.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWorkflow}>
                  Create Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Total Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Active Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workflows.filter(w => w.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Triggered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.triggered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Active Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>All Workflows ({filteredWorkflows.length})</CardTitle>
          <CardDescription>
            Manage your automated workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWorkflows.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No workflows found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create your first workflow
                </Button>
              </div>
            ) : (
              filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{workflow.name}</h3>
                        {getStatusBadge(workflow.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {workflow.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Trigger: {workflow.trigger.type.replace('_', ' ')} • {workflow.actions.length} actions
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {workflow.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Workflow Stats */}
                    <div className="text-right text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="font-medium">{workflow.stats.triggered}</div>
                          <div className="text-muted-foreground text-xs">Triggered</div>
                        </div>
                        <div>
                          <div className="font-medium">{workflow.stats.completed}</div>
                          <div className="text-muted-foreground text-xs">Completed</div>
                        </div>
                        <div>
                          <div className="font-medium text-blue-600">{workflow.stats.active}</div>
                          <div className="text-muted-foreground text-xs">Active</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={workflow.status === 'active'}
                          onCheckedChange={() => handleToggleWorkflow(workflow.id, workflow.status)}
                        />
                        <span className="text-xs text-muted-foreground">
                          {workflow.status === 'active' ? 'On' : 'Off'}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditWorkflow(workflow)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateWorkflow(workflow)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteWorkflow(workflow.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Workflow</DialogTitle>
            <DialogDescription>
              Update workflow configuration
            </DialogDescription>
          </DialogHeader>
          {/* Same form structure as create dialog */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name *</Label>
                <Input
                  id="name"
                  value={newWorkflowData.name}
                  onChange={(e) => setNewWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="triggerType">Trigger Type</Label>
                <Select
                  value={newWorkflowData.triggerType}
                  onValueChange={(value) => setNewWorkflowData(prev => ({ ...prev, triggerType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact_created">Contact Created</SelectItem>
                    <SelectItem value="tag_applied">Tag Applied</SelectItem>
                    <SelectItem value="form_submitted">Form Submitted</SelectItem>
                    <SelectItem value="email_opened">Email Opened</SelectItem>
                    <SelectItem value="date_based">Date Based</SelectItem>
                    <SelectItem value="manual">Manual Trigger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newWorkflowData.description}
                onChange={(e) => setNewWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this workflow does"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggerValue">Trigger Value</Label>
              <Input
                id="triggerValue"
                value={newWorkflowData.triggerValue}
                onChange={(e) => setNewWorkflowData(prev => ({ ...prev, triggerValue: e.target.value }))}
                placeholder="Enter trigger condition"
              />
            </div>

            {/* Workflow Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Workflow Actions</Label>
                <Select onValueChange={(value) => addAction(value as WorkflowAction['type'])}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_email">Send Email</SelectItem>
                    <SelectItem value="send_sms">Send SMS</SelectItem>
                    <SelectItem value="add_tag">Add Tag</SelectItem>
                    <SelectItem value="remove_tag">Remove Tag</SelectItem>
                    <SelectItem value="wait">Wait</SelectItem>
                    <SelectItem value="create_task">Create Task</SelectItem>
                    <SelectItem value="update_contact">Update Contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {newWorkflowData.actions.map((action, index) => {
                  const ActionIcon = getActionIcon(action.type);
                  return (
                    <div key={action.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <ActionIcon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {action.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Configure action settings
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAction(action.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWorkflow}>
              Update Workflow
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
