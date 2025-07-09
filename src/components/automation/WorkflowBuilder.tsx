
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Mail, 
  MessageSquare, 
  Phone,
  Calendar,
  Users,
  Target,
  Clock,
  BarChart3,
  Edit,
  Trash2,
  Copy,
  Save,
  Download,
  Upload
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  title: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  trigger: string;
  nodes: WorkflowNode[];
  stats: {
    triggered: number;
    completed: number;
    active: number;
  };
  createdAt: string;
  updatedAt: string;
}

const initialWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Lead Nurturing Campaign',
    description: 'Automated email sequence for new leads',
    status: 'active',
    trigger: 'New Lead Added',
    nodes: [],
    stats: { triggered: 245, completed: 198, active: 47 },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Appointment Reminders',
    description: 'SMS and email reminders for scheduled appointments',
    status: 'active',
    trigger: 'Appointment Scheduled',
    nodes: [],
    stats: { triggered: 156, completed: 142, active: 14 },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-22'
  },
  {
    id: '3',
    name: 'Customer Follow-up',
    description: 'Post-purchase follow-up sequence',
    status: 'paused',
    trigger: 'Purchase Completed',
    nodes: [],
    stats: { triggered: 89, completed: 76, active: 0 },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-18'
  }
];

const triggerTypes = [
  { id: 'contact_created', name: 'Contact Created', icon: Users },
  { id: 'form_submitted', name: 'Form Submitted', icon: Target },
  { id: 'email_opened', name: 'Email Opened', icon: Mail },
  { id: 'appointment_scheduled', name: 'Appointment Scheduled', icon: Calendar },
  { id: 'tag_added', name: 'Tag Added', icon: Target },
  { id: 'purchase_made', name: 'Purchase Made', icon: Target }
];

const actionTypes = [
  { id: 'send_email', name: 'Send Email', icon: Mail },
  { id: 'send_sms', name: 'Send SMS', icon: MessageSquare },
  { id: 'add_tag', name: 'Add Tag', icon: Target },
  { id: 'create_task', name: 'Create Task', icon: Clock },
  { id: 'send_notification', name: 'Send Notification', icon: Target },
  { id: 'update_contact', name: 'Update Contact', icon: Users }
];

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [activeTab, setActiveTab] = useState("workflows");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [builderMode, setBuilderMode] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  const workflowStats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    totalTriggered: workflows.reduce((sum, w) => sum + w.stats.triggered, 0),
    totalCompleted: workflows.reduce((sum, w) => sum + w.stats.completed, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8 text-primary" />
            Automation Workflows
          </h1>
          <p className="text-muted-foreground">Create and manage automated workflows for your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={showNewWorkflow} onOpenChange={setShowNewWorkflow}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input placeholder="Enter workflow name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe what this workflow does" />
                </div>
                <div>
                  <label className="text-sm font-medium">Trigger</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger event" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map(trigger => (
                        <SelectItem key={trigger.id} value={trigger.id}>
                          {trigger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Start Active</span>
                  <Switch />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewWorkflow(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewWorkflow(false)}>
                    Create & Build
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{workflowStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Triggered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflowStats.totalTriggered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((workflowStats.totalCompleted / workflowStats.totalTriggered) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Trigger: {workflow.trigger}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {workflow.stats.triggered}
                      </div>
                      <div className="text-xs text-muted-foreground">Triggered</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        {workflow.stats.completed}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-orange-600">
                        {workflow.stats.active}
                      </div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Updated {workflow.updatedAt}
                    </span>
                    <Button
                      variant={workflow.status === 'active' ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => toggleWorkflowStatus(workflow.id)}
                    >
                      {workflow.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Welcome Email Series',
                description: 'Automated welcome sequence for new subscribers',
                category: 'Email Marketing',
                uses: 1250
              },
              {
                name: 'Abandoned Cart Recovery',
                description: 'Recover abandoned carts with targeted emails',
                category: 'E-commerce',
                uses: 890
              },
              {
                name: 'Lead Scoring',
                description: 'Automatically score leads based on behavior',
                category: 'Lead Management',
                uses: 567
              },
              {
                name: 'Appointment Reminders',
                description: 'Send SMS and email reminders for appointments',
                category: 'Scheduling',
                uses: 2100
              },
              {
                name: 'Customer Feedback',
                description: 'Collect feedback after service completion',
                category: 'Customer Service',
                uses: 450
              },
              {
                name: 'Birthday Campaign',
                description: 'Send birthday wishes and special offers',
                category: 'Customer Retention',
                uses: 780
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.uses} uses
                    </span>
                  </div>
                  <Button className="w-full">Use Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{workflow.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {workflow.stats.completed}/{workflow.stats.triggered} completed
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {Math.round((workflow.stats.completed / workflow.stats.triggered) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">completion</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trigger Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {triggerTypes.slice(0, 4).map((trigger, index) => (
                    <div key={trigger.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <trigger.icon className="h-4 w-4 text-muted-foreground" />
                        <span>{trigger.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {Math.floor(Math.random() * 100) + 50}
                        </div>
                        <div className="text-sm text-muted-foreground">triggers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Enable Automation</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Send Error Notifications</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span>Debug Mode</span>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-retry Failed Actions</span>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limits & Quotas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Monthly Workflow Executions</span>
                  <span className="font-semibold">2,450 / 10,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Workflows</span>
                  <span className="font-semibold">{workflowStats.active} / 50</span>
                </div>
                <div className="flex justify-between">
                  <span>Email Actions</span>
                  <span className="font-semibold">1,240 / 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS Actions</span>
                  <span className="font-semibold">890 / 2,000</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
