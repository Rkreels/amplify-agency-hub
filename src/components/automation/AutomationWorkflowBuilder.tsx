
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
  Pause,
  Grip,
  Grid,
  MoveVertical,
  MoveHorizontal,
  CornerUpLeft,
  SidebarRight,
  SidebarLeft
} from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { TriggerConfigModal } from './TriggerConfigModal';
import { ActionConfigModal } from './ActionConfigModal';
import { EnhancedWorkflowBuilder } from './EnhancedWorkflowBuilder';
import { WorkflowExecutionEngine } from './WorkflowExecutionEngine';
import { ActionsPanel } from './workflow/ActionsPanel';
import { WorkflowSettings } from './workflow/WorkflowSettings';
import { WorkflowAnalytics } from './workflow/WorkflowAnalytics';
import { WorkflowHistory } from './workflow/WorkflowHistory';

interface ActionType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
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
  { id: 'schedule-appointment', label: 'Schedule Appointment', icon: Calendar, category: 'scheduling', description: 'Schedule an appointment' },
  
  // Flow Control
  { id: 'wait', label: 'Wait', icon: Clock, category: 'flow', description: 'Add a delay in the workflow' },
  { id: 'condition', label: 'If/Then Branch', icon: GitBranch, category: 'flow', description: 'Create conditional logic' },
  { id: 'create-task', label: 'Create Task', icon: FileText, category: 'flow', description: 'Create a task for team member' },
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
    addNode,
    openConfigModal
  } = useWorkflowStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('builder');
  const [draggedAction, setDraggedAction] = useState<ActionType | null>(null);

  const handleDragStart = (action: ActionType, e: React.DragEvent) => {
    try {
      setDraggedAction(action);
      e.dataTransfer.setData('application/json', JSON.stringify(action));
      e.dataTransfer.effectAllowed = 'copy';
      
      // Create a custom drag image
      const dragImage = document.createElement('div');
      dragImage.className = 'bg-white border-2 border-blue-400 rounded-lg p-3 shadow-lg';
      dragImage.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-blue-500 rounded"></div>
          <span class="font-medium">${action.label}</span>
        </div>
      `;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 75, 25);
      
      setTimeout(() => document.body.removeChild(dragImage), 0);
      
      console.log('Drag started for action:', action.id);
    } catch (error) {
      console.error('Error starting drag:', error);
      toast.error('Failed to start dragging action');
    }
  };

  const handleDragEnd = () => {
    setDraggedAction(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedAction(null);
    
    try {
      const actionData = JSON.parse(e.dataTransfer.getData('application/json'));
      console.log('Dropped action data:', actionData);
      
      if (!actionData || !actionData.id) {
        throw new Error('Invalid action data');
      }

      // Get the canvas element and calculate position
      const canvasElement = e.currentTarget as HTMLElement;
      const rect = canvasElement.getBoundingClientRect();
      const x = Math.max(50, e.clientX - rect.left - 100);
      const y = Math.max(50, e.clientY - rect.top - 40);

      // Determine node type based on action category
      let nodeType = 'action';
      if (actionData.category === 'flow') {
        if (actionData.id === 'condition') nodeType = 'condition';
        else if (actionData.id === 'wait') nodeType = 'wait';
        else if (actionData.id === 'end') nodeType = 'end';
      }

      const newNode = {
        id: `${actionData.id}-${Date.now()}`,
        type: nodeType as 'trigger' | 'condition' | 'action' | 'wait' | 'decision' | 'end',
        position: { x, y },
        data: {
          label: actionData.label,
          icon: actionData.icon,
          isConfigured: false,
          handles: {
            source: ['default'],
            target: ['default']
          }
        }
      };

      console.log('Creating new node:', newNode);
      addNode(newNode);
      
      // Auto-open config modal for new nodes
      setTimeout(() => {
        openConfigModal(newNode);
      }, 100);
      
      toast.success(`Added ${actionData.label} to workflow`);
      
    } catch (error) {
      console.error('Error dropping action:', error);
      toast.error('Failed to add action to workflow');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const addTrigger = () => {
    try {
      const existingTriggers = currentWorkflow?.nodes.filter(n => n.type === 'trigger') || [];
      if (existingTriggers.length > 0) {
        toast.error('Only one trigger is allowed per workflow');
        return;
      }

      const newNode = {
        id: `trigger-${Date.now()}`,
        type: 'trigger' as const,
        position: { x: 400, y: 100 },
        data: {
          label: 'New Trigger',
          icon: Zap,
          isConfigured: false,
          handles: {
            source: ['default'],
            target: []
          }
        }
      };
      
      console.log('Adding trigger node:', newNode);
      addNode(newNode);
      setTimeout(() => openConfigModal(newNode), 100);
      toast.success('Trigger added to workflow');
    } catch (error) {
      console.error('Error adding trigger:', error);
      toast.error('Failed to add trigger');
    }
  };

  const handleTestWorkflow = async () => {
    try {
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
        phone: '+1234567890',
        company: 'Test Company',
        tags: ['test', 'prospect']
      };

      console.log('Testing workflow with mock data:', mockContactData);
      await testWorkflow(mockContactData);
    } catch (error) {
      console.error('Error testing workflow:', error);
      toast.error('Failed to test workflow');
    }
  };

  const handleActivateWorkflow = () => {
    try {
      if (!currentWorkflow) {
        toast.error('No workflow selected');
        return;
      }

      const validation = validateWorkflow();
      if (!validation.isValid) {
        toast.error(`Cannot activate workflow: ${validation.errors.join(', ')}`);
        return;
      }

      if (currentWorkflow.isActive) {
        deactivateWorkflow(currentWorkflow.id);
        toast.success('Workflow deactivated');
      } else {
        activateWorkflow(currentWorkflow.id);
        toast.success('Workflow activated');
      }
    } catch (error) {
      console.error('Error toggling workflow activation:', error);
      toast.error('Failed to toggle workflow activation');
    }
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
              onClick={handleActivateWorkflow}
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
                <Grid className="h-4 w-4 mr-2" />
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <History className="h-4 w-4 mr-2" />
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
      <div className={`bg-white border-l transition-all duration-300 flex flex-col relative ${sidebarOpen ? 'w-80' : 'w-12'}`}>
        {/* Collapse/Expand button that overlaps the border */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full border shadow-sm bg-white z-10"
        >
          {sidebarOpen ? (
            <SidebarRight className="h-3 w-3" />
          ) : (
            <SidebarLeft className="h-3 w-3" />
          )}
        </Button>

        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-3 border-b">
            {sidebarOpen ? (
              <h3 className="font-medium text-gray-700">Actions & Tools</h3>
            ) : (
              <div className="h-6" /> {/* Empty space to match height */}
            )}
          </div>
          
          {sidebarOpen && (
            <ActionsPanel 
              actionTypes={actionTypes} 
              draggedAction={draggedAction}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              addTrigger={addTrigger}
              currentWorkflow={currentWorkflow}
            />
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
      
      {(configModalNode?.type === 'action' || configModalNode?.type === 'condition' || configModalNode?.type === 'wait' || configModalNode?.type === 'end') && (
        <ActionConfigModal
          isOpen={isConfigModalOpen}
          onClose={closeConfigModal}
          node={configModalNode}
        />
      )}

      {/* Workflow Execution Engine */}
      <WorkflowExecutionEngine />
    </div>
  );
}
