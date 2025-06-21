
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Save, 
  Settings, 
  Plus, 
  Zap, 
  Mail, 
  MessageSquare, 
  Clock, 
  Target,
  Users,
  Calendar,
  Phone,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { EnhancedWorkflowCanvas } from './workflow/EnhancedWorkflowCanvas';
import { ActionsPanel } from './workflow/ActionsPanel';
import { WorkflowSettings } from './workflow/WorkflowSettings';
import { WorkflowValidationStatus } from './workflow/WorkflowValidationStatus';
import { toast } from 'sonner';

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: 'bg-green-500' },
  { type: 'action', label: 'Action', icon: Play, color: 'bg-blue-500' },
  { type: 'condition', label: 'Condition', icon: Target, color: 'bg-yellow-500' },
  { type: 'delay', label: 'Delay', icon: Clock, color: 'bg-purple-500' },
  { type: 'goal', label: 'Goal', icon: CheckCircle, color: 'bg-red-500' }
];

export function AutomationWorkflowBuilder() {
  const {
    currentWorkflow,
    selectedNode,
    isConfigModalOpen,
    configModalNode,
    createNewWorkflow,
    saveWorkflow,
    updateWorkflowName,
    activateWorkflow,
    deactivateWorkflow,
    testWorkflow,
    validateWorkflow,
    addNode,
    setSelectedNode,
    openConfigModal,
    closeConfigModal
  } = useWorkflowStore();

  const [workflowName, setWorkflowName] = useState(currentWorkflow?.name || 'New Workflow');
  const [showSettings, setShowSettings] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleCreateNew = () => {
    createNewWorkflow({
      name: 'New Workflow',
      description: 'Created from workflow builder'
    });
    setWorkflowName('New Workflow');
  };

  const handleSave = () => {
    if (currentWorkflow) {
      updateWorkflowName(workflowName);
      saveWorkflow();
    }
  };

  const handleTest = async () => {
    if (!currentWorkflow) return;
    
    const validation = validateWorkflow();
    if (!validation.isValid) {
      toast.error(`Cannot test workflow: ${validation.errors.join(', ')}`);
      return;
    }

    await testWorkflow({ id: 'test-contact', name: 'Test Contact', email: 'test@example.com' });
  };

  const handleToggleActive = () => {
    if (!currentWorkflow) return;
    
    if (currentWorkflow.isActive) {
      deactivateWorkflow(currentWorkflow.id);
      toast.success('Workflow deactivated');
    } else {
      const validation = validateWorkflow();
      if (!validation.isValid) {
        toast.error(`Cannot activate workflow: ${validation.errors.join(', ')}`);
        setShowValidation(true);
        return;
      }
      
      activateWorkflow(currentWorkflow.id);
      toast.success('Workflow activated');
    }
  };

  const handleAddNode = useCallback((nodeType: string, position: { x: number; y: number }) => {
    const nodeConfig = nodeTypes.find(n => n.type === nodeType);
    if (!nodeConfig) return;

    const newNode = {
      type: nodeType as any,
      position,
      data: {
        label: nodeConfig.label,
        icon: nodeConfig.type,
        config: {},
        isConfigured: false
      }
    };

    addNode(newNode);
  }, [addNode]);

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Workflow Selected</h3>
          <p className="text-gray-600 mb-4">Create a new workflow to get started</p>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Workflow
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Node Types */}
      <div className="w-64 bg-white border-r p-4 space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Workflow Elements</h3>
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <div
                key={nodeType.type}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/reactflow', nodeType.type);
                  e.dataTransfer.effectAllowed = 'move';
                }}
              >
                <div className={`p-2 rounded-full ${nodeType.color} text-white`}>
                  <nodeType.icon className="h-4 w-4" />
                </div>
                <span className="font-medium">{nodeType.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send SMS
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add to List
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="font-medium text-lg border-none shadow-none p-0 h-auto"
              placeholder="Workflow Name"
            />
            <Badge variant={currentWorkflow.isActive ? 'default' : 'secondary'}>
              {currentWorkflow.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowValidation(true)}>
              <AlertCircle className="h-4 w-4 mr-1" />
              Validate
            </Button>
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="h-4 w-4 mr-1" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button 
              size="sm" 
              onClick={handleToggleActive}
              variant={currentWorkflow.isActive ? 'destructive' : 'default'}
            >
              {currentWorkflow.isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Activate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <EnhancedWorkflowCanvas
            workflow={currentWorkflow}
            onAddNode={handleAddNode}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            onConfigureNode={openConfigModal}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-white border-t p-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Nodes: {currentWorkflow.nodes.length}</span>
            <span>Connections: {currentWorkflow.connections.length}</span>
            <span>Status: {currentWorkflow.isActive ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Last saved: {currentWorkflow.updatedAt.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedNode && (
        <div className="w-80 bg-white border-l">
          <ActionsPanel
            node={currentWorkflow.nodes.find(n => n.id === selectedNode)}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <WorkflowSettings
          workflow={currentWorkflow}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Validation Modal */}
      {showValidation && (
        <WorkflowValidationStatus
          validation={validateWorkflow()}
          onClose={() => setShowValidation(false)}
        />
      )}
    </div>
  );
}
