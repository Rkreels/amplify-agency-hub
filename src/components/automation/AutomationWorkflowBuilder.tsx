
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Save,
  Play,
  Pause,
  Settings2,
  BarChart3,
  History,
  Grid,
  Webhook,
  Layout,
  Mail,
  Target,
  Edit
} from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { TriggerConfigModal } from './TriggerConfigModal';
import { ActionConfigModal } from './ActionConfigModal';
import { EnhancedWorkflowCanvas } from './workflow/EnhancedWorkflowCanvas';
import { WorkflowExecutionEngine } from './WorkflowExecutionEngine';
import { WorkflowSettings } from './workflow/WorkflowSettings';
import { WorkflowAnalytics } from './workflow/WorkflowAnalytics';
import { WorkflowHistory } from './workflow/WorkflowHistory';
import { IntegrationSystem } from './workflow/IntegrationSystem';
import { AnalyticsDashboard } from './workflow/AnalyticsDashboard';
import { EmailSequenceBuilder } from './workflow/EmailSequenceBuilder';
import { LeadScoringEngine } from './workflow/LeadScoringEngine';
import { GoalTrackingSystem } from './workflow/GoalTrackingSystem';
import { FunnelPageBuilder } from './workflow/FunnelPageBuilder';

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
    validateWorkflow
  } = useWorkflowStore();

  const [activeTab, setActiveTab] = useState('builder');

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

      await testWorkflow(mockContactData);
    } catch (error) {
      console.error('Error testing workflow:', error);
      toast.error('Failed to test workflow');
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
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
              <Play className="h-4 w-4 mr-2" />
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

        {/* Enhanced Tab Navigation */}
        <div className="bg-white border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8 bg-transparent border-b-0 h-12">
              <TabsTrigger 
                value="builder" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Grid className="h-4 w-4 mr-2" />
                Builder
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Webhook className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="email-sequences" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email Sequences
              </TabsTrigger>
              <TabsTrigger 
                value="lead-scoring" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Target className="h-4 w-4 mr-2" />
                Lead Scoring
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Target className="h-4 w-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger 
                value="funnel-builder" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Layout className="h-4 w-4 mr-2" />
                Funnel Builder
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="border-b-2 border-transparent data-[state=active]:border-blue-500 rounded-none"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="mt-0 h-[calc(100vh-140px)]">
              <EnhancedWorkflowCanvas />
            </TabsContent>

            <TabsContent value="integrations" className="mt-0 p-6 h-[calc(100vh-140px)] overflow-y-auto">
              <IntegrationSystem />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0 p-6 h-[calc(100vh-140px)] overflow-y-auto">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="email-sequences" className="mt-0 p-6 h-[calc(100vh-140px)] overflow-y-auto">
              <EmailSequenceBuilder />
            </TabsContent>

            <TabsContent value="lead-scoring" className="mt-0 p-6 h-[calc(100vh-140px)] overflow-y-auto">
              <LeadScoringEngine />
            </TabsContent>

            <TabsContent value="goals" className="mt-0 p-6 h-[calc(100vh-140px)] overflow-y-auto">
              <GoalTrackingSystem />
            </TabsContent>

            <TabsContent value="funnel-builder" className="mt-0 h-[calc(100vh-140px)]">
              <FunnelPageBuilder />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0 p-6">
              <WorkflowSettings />
            </TabsContent>
          </Tabs>
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
      
      {(configModalNode?.type === 'action' || configModalNode?.type === 'condition' || configModalNode?.type === 'delay' || configModalNode?.type === 'wait' || configModalNode?.type === 'end' || configModalNode?.type === 'goal') && (
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
