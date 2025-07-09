
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Plus, 
  Zap, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Filter,
  Users,
  Settings,
  Save,
  Eye
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  title: string;
  description: string;
  icon: React.ReactNode;
  config: Record<string, any>;
  connections: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: WorkflowStep;
  steps: WorkflowStep[];
  stats: {
    enrolled: number;
    completed: number;
    failed: number;
  };
}

const triggerTypes = [
  {
    id: 'contact_added',
    title: 'Contact Added',
    description: 'When a new contact is added',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'form_submitted',
    title: 'Form Submitted',
    description: 'When a form is submitted',
    icon: <Filter className="h-4 w-4" />
  },
  {
    id: 'tag_added',
    title: 'Tag Added',
    description: 'When a tag is added to contact',
    icon: <Badge className="h-4 w-4" />
  }
];

const actionTypes = [
  {
    id: 'send_email',
    title: 'Send Email',
    description: 'Send an email to the contact',
    icon: <Mail className="h-4 w-4" />
  },
  {
    id: 'send_sms',
    title: 'Send SMS',
    description: 'Send an SMS to the contact',
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    id: 'make_call',
    title: 'Make Call',
    description: 'Make a phone call',
    icon: <Phone className="h-4 w-4" />
  },
  {
    id: 'add_delay',
    title: 'Add Delay',
    description: 'Wait for a specified time',
    icon: <Clock className="h-4 w-4" />
  }
];

const mockWorkflow: Workflow = {
  id: '1',
  name: 'Welcome Series',
  description: 'Automated welcome sequence for new contacts',
  isActive: true,
  trigger: {
    id: 'trigger_1',
    type: 'trigger',
    title: 'Contact Added',
    description: 'When a new contact is added',
    icon: <Users className="h-4 w-4" />,
    config: {},
    connections: ['step_1']
  },
  steps: [
    {
      id: 'step_1',
      type: 'action',
      title: 'Send Welcome Email',
      description: 'Send welcome email immediately',
      icon: <Mail className="h-4 w-4" />,
      config: { template: 'welcome_email' },
      connections: ['step_2']
    },
    {
      id: 'step_2',
      type: 'delay',
      title: 'Wait 1 Day',
      description: 'Wait 24 hours',
      icon: <Clock className="h-4 w-4" />,
      config: { delay: 24, unit: 'hours' },
      connections: ['step_3']
    },
    {
      id: 'step_3',
      type: 'action',
      title: 'Send Follow-up SMS',
      description: 'Send follow-up SMS message',
      icon: <MessageSquare className="h-4 w-4" />,
      config: { message: 'Thanks for joining! How can we help?' },
      connections: []
    }
  ],
  stats: {
    enrolled: 245,
    completed: 189,
    failed: 12
  }
};

export function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState(mockWorkflow);
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [showTriggerPanel, setShowTriggerPanel] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(workflow.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkflow(prev => ({ ...prev, steps: items }));
  }, [workflow.steps]);

  const addStep = (type: any) => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      type: 'action',
      title: type.title,
      description: type.description,
      icon: type.icon,
      config: {},
      connections: []
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    setShowActionPanel(false);
  };

  const toggleWorkflow = () => {
    setWorkflow(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const getStepColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'trigger': return 'border-green-500 bg-green-50';
      case 'action': return 'border-blue-500 bg-blue-50';
      case 'condition': return 'border-yellow-500 bg-yellow-50';
      case 'delay': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflow Builder</h2>
          <p className="text-muted-foreground">Create and manage automated workflows</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            onClick={toggleWorkflow}
            variant={workflow.isActive ? "destructive" : "default"}
          >
            {workflow.isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workflow Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{workflow.name}</CardTitle>
                  <p className="text-muted-foreground">{workflow.description}</p>
                </div>
                <Badge variant={workflow.isActive ? "default" : "secondary"}>
                  {workflow.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trigger */}
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-lg border-2 ${getStepColor('trigger')} min-w-[200px]`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {workflow.trigger.icon}
                    <h3 className="font-medium">{workflow.trigger.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{workflow.trigger.description}</p>
                </div>
                <div className="h-0.5 w-8 bg-gray-300" />
              </div>

              {/* Steps */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="workflow-steps">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4"
                    >
                      {workflow.steps.map((step, index) => (
                        <Draggable key={step.id} draggableId={step.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center space-x-4"
                            >
                              <div 
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all min-w-[200px] ${
                                  getStepColor(step.type)
                                } ${
                                  selectedStep?.id === step.id ? 'ring-2 ring-primary' : ''
                                } ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                                onClick={() => setSelectedStep(step)}
                              >
                                <div className="flex items-center space-x-2 mb-2">
                                  {step.icon}
                                  <h3 className="font-medium">{step.title}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                              {index < workflow.steps.length - 1 && (
                                <div className="h-0.5 w-8 bg-gray-300" />
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Add Step Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowActionPanel(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled</p>
                  <p className="text-2xl font-bold">{workflow.stats.enrolled}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{workflow.stats.completed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{workflow.stats.failed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">
                    {Math.round((workflow.stats.completed / workflow.stats.enrolled) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowTriggerPanel(true)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Change Trigger
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowActionPanel(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Action Panel */}
          {showActionPanel && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actionTypes.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addStep(action)}
                  >
                    {action.icon}
                    <span className="ml-2">{action.title}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowActionPanel(false)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
