
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Mail, 
  Clock, 
  User, 
  UserMinus, 
  Tag, 
  TagIcon,
  FileText, 
  Calendar, 
  Bell, 
  MessageSquare,
  Phone,
  DollarSign,
  Target,
  Workflow,
  Users,
  Eye,
  Save,
  Play,
  ChevronRight,
  ChevronDown,
  Edit,
  Zap,
  GitBranch,
  PlayCircle,
  Settings2,
  BarChart3,
  History,
  Pause
} from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { TriggerConfigModal } from './TriggerConfigModal';
import { ActionConfigModal } from './ActionConfigModal';
import { EnhancedWorkflowBuilder } from './EnhancedWorkflowBuilder';

interface ActionType {
  id: string;
  label: string;
  icon: any;
  category: string;
  description: string;
}

const actionTypes: ActionType[] = [
  // Communication Actions
  { id: 'send-email', label: 'Send Email', icon: Mail, category: 'communication', description: 'Send an email to the contact' },
  { id: 'send-sms', label: 'Send SMS', icon: MessageSquare, category: 'communication', description: 'Send an SMS to the contact' },
  { id: 'send-internal-notification', label: 'Send Internal Notification', icon: Bell, category: 'communication', description: 'Send notification to team members' },
  { id: 'send-review-request', label: 'Send Review Request', icon: Eye, category: 'communication', description: 'Send a review request' },
  
  // Contact Management
  { id: 'add-contact-tag', label: 'Add Contact Tag', icon: Tag, category: 'contact', description: 'Add a tag to the contact' },
  { id: 'remove-contact-tag', label: 'Remove Contact Tag', icon: TagIcon, category: 'contact', description: 'Remove a tag from the contact' },
  { id: 'assign-user', label: 'Assign To User', icon: User, category: 'contact', description: 'Assign contact to a user' },
  { id: 'remove-assigned-user', label: 'Remove Assigned User', icon: UserMinus, category: 'contact', description: 'Remove assigned user from contact' },
  { id: 'add-to-notes', label: 'Add To Notes', icon: FileText, category: 'contact', description: 'Add notes to the contact' },
  { id: 'set-contact-dnd', label: 'Set Contact DND', icon: Phone, category: 'contact', description: 'Set do not disturb for contact' },
  
  // Sales & Opportunities
  { id: 'create-opportunity', label: 'Create/Update Opportunity', icon: Target, category: 'sales', description: 'Create or update an opportunity' },
  { id: 'remove-opportunity', label: 'Remove Opportunity', icon: DollarSign, category: 'sales', description: 'Remove an opportunity' },
  
  // Workflow Management
  { id: 'add-to-workflow', label: 'Add To Workflow', icon: Workflow, category: 'automation', description: 'Add contact to another workflow' },
  { id: 'remove-from-workflow', label: 'Remove From Workflow', icon: Workflow, category: 'automation', description: 'Remove contact from workflow' },
  { id: 'remove-from-all-workflows', label: 'Remove From All Workflows', icon: Users, category: 'automation', description: 'Remove contact from all workflows' },
  
  // Scheduling
  { id: 'set-event-date', label: 'Set Event Start Date', icon: Calendar, category: 'scheduling', description: 'Set an event start date' },
  
  // Flow Control
  { id: 'wait', label: 'Wait', icon: Clock, category: 'flow', description: 'Add a delay in the workflow' },
  { id: 'condition', label: 'If/Then Branch', icon: GitBranch, category: 'flow', description: 'Create conditional logic' },
  { id: 'end', label: 'End Workflow', icon: Target, category: 'flow', description: 'Stop the workflow execution' }
];

export function AutomationWorkflowBuilder() {
  const {
    currentWorkflow,
    isConfigModalOpen,
    configModalNode,
    isExecuting,
    closeConfigModal,
    updateWorkflowName,
    saveWorkflow,
    activateWorkflow,
    deactivateWorkflow,
    testWorkflow,
    validateWorkflow,
    addNode
  } = useWorkflowStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('builder');

  const handleDragStart = (action: ActionType, e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(action));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const actionData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left - 100;
      const y = e.clientY - rect.top - 25;

      const newNode = {
        id: `${actionData.id}-${Date.now()}`,
        type: actionData.category === 'flow' ? actionData.id : 'action',
        position: { x: Math.max(0, x), y: Math.max(0, y) },
        data: {
          label: actionData.label,
          icon: actionData.icon,
          isConfigured: false
        }
      };

      addNode(newNode);
      
      // Auto-open config modal for new nodes
      setTimeout(() => {
        useWorkflowStore.getState().openConfigModal(newNode);
      }, 100);
      
    } catch (error) {
      console.error('Error dropping action:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const addTrigger = () => {
    const newNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger' as const,
      position: { x: 500, y: 200 },
      data: {
        label: 'New Trigger',
        icon: Zap,
        isConfigured: false
      }
    };
    addNode(newNode);
    setTimeout(() => useWorkflowStore.getState().openConfigModal(newNode), 100);
  };

  const handleTestWorkflow = async () => {
    const validation = validateWorkflow();
    if (!validation.isValid) {
      toast.error(`Cannot test workflow: ${validation.errors.join(', ')}`);
      return;
    }

    const mockContactData = {
      id: 'test-contact-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890'
    };

    await testWorkflow(mockContactData);
  };

  const groupedActions = actionTypes.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ActionType[]>);

  const categoryIcons = {
    communication: Mail,
    contact: User,
    sales: Target,
    automation: Workflow,
    scheduling: Calendar,
    flow: GitBranch
  };

  const categoryNames = {
    communication: 'Communication',
    contact: 'Contact Management',
    sales: 'Sales & Opportunities',
    automation: 'Workflow Management',
    scheduling: 'Scheduling',
    flow: 'Flow Control'
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Input
              value={currentWorkflow?.name || ''}
              onChange={(e) => updateWorkflowName(e.target.value)}
              className="bg-transparent border-none text-white text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[300px]"
              placeholder="Workflow Name"
            />
            <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
              <Edit className="h-4 w-4" />
            </Button>
            {currentWorkflow?.isActive && (
              <Badge className="bg-green-600 hover:bg-green-600">Active</Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-white text-white hover:bg-slate-600"
              onClick={handleTestWorkflow}
              disabled={isExecuting}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              {isExecuting ? 'Testing...' : 'Test'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-white text-white hover:bg-slate-600"
              onClick={saveWorkflow}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              size="sm" 
              className={currentWorkflow?.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              onClick={() => {
                if (currentWorkflow?.isActive) {
                  deactivateWorkflow(currentWorkflow.id);
                  toast.success('Workflow deactivated');
                } else if (currentWorkflow) {
                  activateWorkflow(currentWorkflow.id);
                  toast.success('Workflow activated');
                }
              }}
            >
              {currentWorkflow?.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Deactivate
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

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-b-0 h-12">
              <TabsTrigger 
                value="builder" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="mt-0 h-[calc(100vh-140px)]">
              <div 
                className="h-full"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <EnhancedWorkflowBuilder />
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 p-6">
              <WorkflowSettings />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0 p-6">
              <WorkflowAnalytics />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0 p-6">
              <WorkflowHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Enhanced Right Sidebar */}
      <div className={`bg-white border-l transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-12'}`}>
        <div className="h-full flex flex-col">
          {/* Collapse/Expand Button */}
          <div className="p-3 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full justify-start"
            >
              {sidebarOpen ? (
                <>
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Actions & Tools
                </>
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {sidebarOpen && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addTrigger}
                      className="h-auto flex-col gap-1 p-3"
                    >
                      <Zap className="h-4 w-4" />
                      <span className="text-xs">Add Trigger</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-auto flex-col gap-1 p-3"
                      onClick={() => toast.info('Drag an action from below to the canvas')}
                    >
                      <GitBranch className="h-4 w-4" />
                      <span className="text-xs">Add Action</span>
                    </Button>
                  </div>
                </div>

                {/* Workflow Stats */}
                {currentWorkflow && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Workflow Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-blue-50 p-2 rounded">
                        <div className="text-lg font-bold text-blue-600">{currentWorkflow.nodes.length}</div>
                        <div className="text-xs text-blue-600">Nodes</div>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <div className="text-lg font-bold text-green-600">{currentWorkflow.connections.length}</div>
                        <div className="text-xs text-green-600">Connections</div>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <div className="text-lg font-bold text-purple-600">{currentWorkflow.stats.triggered}</div>
                        <div className="text-xs text-purple-600">Triggered</div>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <div className="text-lg font-bold text-orange-600">{currentWorkflow.stats.completed}</div>
                        <div className="text-xs text-orange-600">Completed</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Available Actions</h3>
                  
                  {Object.entries(groupedActions).map(([category, actions]) => {
                    const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                    const categoryName = categoryNames[category as keyof typeof categoryNames];
                    
                    return (
                      <Collapsible key={category} defaultOpen={category === 'communication'}>
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-4 w-4" />
                            <h4 className="font-medium text-sm">{categoryName}</h4>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-1 mt-2">
                          {actions.map((action) => {
                            const Icon = action.icon;
                            return (
                              <div
                                key={action.id}
                                draggable
                                onDragStart={(e) => handleDragStart(action, e)}
                                className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move transition-all border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                              >
                                <div className="bg-gray-700 text-white p-2 rounded mr-3">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{action.label}</div>
                                  <div className="text-xs text-gray-500 truncate">{action.description}</div>
                                </div>
                              </div>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Configuration Modals */}
      {configModalNode?.type === 'trigger' && (
        <TriggerConfigModal
          isOpen={isConfigModalOpen}
          onClose={closeConfigModal}
          node={configModalNode}
        />
      )}
      
      {(configModalNode?.type === 'action' || configModalNode?.type === 'condition' || configModalNode?.type === 'wait') && (
        <ActionConfigModal
          isOpen={isConfigModalOpen}
          onClose={closeConfigModal}
          node={configModalNode}
        />
      )}
    </div>
  );
}

// Additional components for different tabs
function WorkflowSettings() {
  const { currentWorkflow, updateWorkflowSettings } = useWorkflowStore();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Workflow Settings</h3>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Execution Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Settings form would go here */}
              <div className="text-sm text-gray-500">
                Configure workflow execution parameters
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Error Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-500">
                Set how errors should be handled during execution
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WorkflowAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Workflow Analytics</h3>
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Execution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3s</div>
              <div className="text-sm text-gray-500">Avg Duration</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-gray-500">Last 30 Days</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WorkflowHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Execution History</h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Execution #{1000 + i}</div>
                    <div className="text-sm text-gray-500">
                      Started {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={i % 3 === 0 ? 'default' : 'secondary'}>
                    {i % 3 === 0 ? 'Completed' : 'Running'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
