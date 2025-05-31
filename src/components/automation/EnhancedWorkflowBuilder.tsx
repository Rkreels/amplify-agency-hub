import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Plus, 
  Zap, 
  Copy,
  Trash2,
  Settings,
  Play,
  Pause,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  GitBranch,
  Target
} from 'lucide-react';
import { useWorkflowStore, WorkflowNode, WorkflowConnection } from '@/store/useWorkflowStore';

interface ConnectionPath {
  d: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export function EnhancedWorkflowBuilder() {
  const {
    currentWorkflow,
    selectedNode,
    selectedConnection,
    isExecuting,
    setSelectedNode,
    setSelectedConnection,
    addNode,
    updateNode,
    deleteNode,
    duplicateNode,
    addConnection,
    deleteConnection,
    canConnect,
    openConfigModal,
    testWorkflow,
    validateWorkflow
  } = useWorkflowStore();

  const [draggedAction, setDraggedAction] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{ sourceId: string; sourceHandle?: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Handle mouse move for temporary connection line
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left - canvasOffset.x) / zoom,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom
      });
    }
  }, [canvasOffset, zoom]);

  // Handle node dragging
  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setDraggedNode(nodeId);
      e.stopPropagation();
    }
  }, []);

  const handleNodeDrag = useCallback((e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasOffset.x) / zoom - 100; // Offset for node center
      const y = (e.clientY - rect.top - canvasOffset.y) / zoom - 25;
      
      updateNode(draggedNode, {
        position: { x, y }
      });
    }
  }, [draggedNode, updateNode, canvasOffset, zoom]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setConnecting(null);
  }, []);

  // Handle connection creation
  const handleConnectionStart = useCallback((sourceId: string, sourceHandle?: string) => {
    setConnecting({ sourceId, sourceHandle });
  }, []);

  const handleConnectionEnd = useCallback((targetId: string, targetHandle?: string) => {
    if (connecting && connecting.sourceId !== targetId) {
      if (canConnect(connecting.sourceId, targetId)) {
        const connection: WorkflowConnection = {
          id: `${connecting.sourceId}-${targetId}-${Date.now()}`,
          source: connecting.sourceId,
          target: targetId,
          sourceHandle: connecting.sourceHandle,
          targetHandle,
          type: 'default'
        };
        
        addConnection(connection);
        toast.success('Connection created');
      } else {
        toast.error('Cannot create connection (would create a cycle)');
      }
    }
    setConnecting(null);
  }, [connecting, canConnect, addConnection]);

  // Calculate connection path
  const calculateConnectionPath = useCallback((
    sourceX: number, 
    sourceY: number, 
    targetX: number, 
    targetY: number
  ): ConnectionPath => {
    const midX = (sourceX + targetX) / 2;
    const d = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
    
    return { d, sourceX, sourceY, targetX, targetY };
  }, []);

  // Get node center position
  const getNodeCenter = useCallback((node: WorkflowNode) => {
    return {
      x: node.position.x + 100, // Node width / 2
      y: node.position.y + 25   // Node height / 2
    };
  }, []);

  // Render connection lines
  const renderConnections = useCallback(() => {
    if (!currentWorkflow) return null;

    return (
      <svg 
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill="#6b7280"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        
        {/* Existing connections */}
        {currentWorkflow.connections.map((connection) => {
          const sourceNode = currentWorkflow.nodes.find(n => n.id === connection.source);
          const targetNode = currentWorkflow.nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;
          
          const sourcePos = getNodeCenter(sourceNode);
          const targetPos = getNodeCenter(targetNode);
          const path = calculateConnectionPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y);
          
          return (
            <g key={connection.id}>
              <path
                d={path.d}
                stroke={selectedConnection === connection.id ? "#3b82f6" : "#6b7280"}
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
                className="cursor-pointer"
                onClick={() => setSelectedConnection(connection.id)}
              />
              {connection.label && (
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2 - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {connection.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Temporary connection line */}
        {connecting && (
          <path
            d={calculateConnectionPath(
              getNodeCenter(currentWorkflow.nodes.find(n => n.id === connecting.sourceId)!).x,
              getNodeCenter(currentWorkflow.nodes.find(n => n.id === connecting.sourceId)!).y,
              mousePosition.x,
              mousePosition.y
            ).d}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
          />
        )}
      </svg>
    );
  }, [currentWorkflow, selectedConnection, connecting, mousePosition, getNodeCenter, calculateConnectionPath, setSelectedConnection]);

  // Render workflow node
  const renderNode = useCallback((node: WorkflowNode) => {
    const Icon = node.data.icon;
    const isSelected = selectedNode === node.id;
    const isConfigured = node.data.isConfigured;
    const validation = useWorkflowStore.getState().validateNode(node.id);
    
    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer transition-all group ${
          isSelected ? 'ring-2 ring-blue-500 z-20' : 'z-10'
        } ${draggedNode === node.id ? 'opacity-50' : ''}`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          transform: `scale(${zoom})`
        }}
        onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
        onClick={() => setSelectedNode(node.id)}
        onDoubleClick={() => openConfigModal(node)}
      >
        {node.type === 'trigger' ? (
          <div className={`bg-white border-2 rounded-lg p-4 min-w-[250px] shadow-lg ${
            isConfigured ? 'border-green-400' : 'border-orange-400'
          }`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={`p-2 rounded-full ${isConfigured ? 'bg-green-100' : 'bg-orange-100'}`}>
                <Icon className={`h-5 w-5 ${isConfigured ? 'text-green-600' : 'text-orange-600'}`} />
              </div>
              {!validation.isValid && <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{node.data.label}</div>
              {isConfigured ? (
                <Badge variant="secondary" className="mt-2">Configured</Badge>
              ) : (
                <Badge variant="outline" className="mt-2 text-orange-600 border-orange-600">
                  Click to Configure
                </Badge>
              )}
            </div>
            
            {/* Connection handles */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div
                className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:bg-blue-600"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleConnectionStart(node.id, 'output');
                }}
              />
            </div>
          </div>
        ) : (
          <div className={`bg-white border-2 rounded-lg p-3 min-w-[200px] shadow-lg ${
            isConfigured ? 'border-green-300' : 'border-gray-300'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1 rounded ${isConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Icon className={`h-4 w-4 ${isConfigured ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <span className="text-sm font-medium truncate flex-1">{node.data.label}</span>
              {!validation.isValid && <AlertCircle className="h-3 w-3 text-red-500" />}
              {isConfigured && <CheckCircle className="h-3 w-3 text-green-500" />}
            </div>
            
            {/* Node actions */}
            <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm border"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateNode(node.id);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm border"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Connection handles */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div
                className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white cursor-pointer hover:bg-gray-600"
                onMouseUp={() => handleConnectionEnd(node.id, 'input')}
              />
            </div>
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div
                className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-pointer hover:bg-blue-600"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleConnectionStart(node.id, 'output');
                }}
              />
            </div>
            
            {/* Condition node additional handles */}
            {node.type === 'condition' && (
              <>
                <div className="absolute -bottom-2 left-1/4 transform -translate-x-1/2">
                  <div
                    className="w-3 h-3 bg-green-500 rounded-full border-2 border-white cursor-pointer hover:bg-green-600"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleConnectionStart(node.id, 'true');
                    }}
                    title="True path"
                  />
                </div>
                <div className="absolute -bottom-2 right-1/4 transform translate-x-1/2">
                  <div
                    className="w-3 h-3 bg-red-500 rounded-full border-2 border-white cursor-pointer hover:bg-red-600"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleConnectionStart(node.id, 'false');
                    }}
                    title="False path"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }, [selectedNode, draggedNode, zoom, handleNodeMouseDown, setSelectedNode, openConfigModal, duplicateNode, deleteNode, handleConnectionStart, handleConnectionEnd]);

  // Handle workflow testing
  const handleTestWorkflow = useCallback(async () => {
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
    toast.success('Workflow test completed');
  }, [validateWorkflow, testWorkflow]);

  // Event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggedNode) {
        handleNodeDrag(e as any);
      }
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (draggedNode || connecting) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggedNode, connecting, handleNodeDrag, handleMouseUp]);

  const hasTrigger = currentWorkflow?.nodes.some(node => node.type === 'trigger');

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Workflow validation status */}
      {currentWorkflow && (
        <div className="bg-white border-b p-2">
          <WorkflowValidationStatus />
        </div>
      )}
      
      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative bg-gray-50"
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
          }}
        >
          {/* Render connections */}
          {renderConnections()}
          
          {/* Render nodes */}
          {currentWorkflow?.nodes.map(renderNode)}
          
          {/* Empty state */}
          {!hasTrigger && <EmptyWorkflowState />}
        </div>
        
        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            -
          </Button>
          <span className="px-2 py-1 bg-white border rounded text-sm">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            +
          </Button>
        </div>
        
        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestWorkflow}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test Workflow
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Workflow validation status component
function WorkflowValidationStatus() {
  const { validateWorkflow } = useWorkflowStore();
  const validation = validateWorkflow();
  
  if (validation.isValid) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Workflow is valid and ready to run</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2 text-red-600">
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">
        {validation.errors.length} issue(s): {validation.errors.join(', ')}
      </span>
    </div>
  );
}

// Empty workflow state component
function EmptyWorkflowState() {
  const { addNode } = useWorkflowStore();
  
  const addTrigger = () => {
    const newNode: WorkflowNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger',
      position: { x: 400, y: 200 },
      data: {
        label: 'New Trigger',
        icon: Zap,
        isConfigured: false
      }
    };
    addNode(newNode);
    setTimeout(() => useWorkflowStore.getState().openConfigModal(newNode), 100);
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div 
        className="bg-white border-2 border-dashed border-orange-400 rounded-lg p-8 cursor-pointer hover:border-orange-500 transition-colors hover:shadow-lg"
        onClick={addTrigger}
      >
        <div className="text-center">
          <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <div className="text-gray-600 text-xl font-medium">
            Add Workflow Trigger
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Click to start building your automation
          </div>
        </div>
      </div>
    </div>
  );
}
