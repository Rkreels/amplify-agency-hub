
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
  Target,
  Mail,
  MessageSquare,
  Tag,
  User,
  DollarSign,
  Users,
  Filter,
  ArrowDown,
  ArrowRight,
  CornerDownRight,
  Move,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useWorkflowStore, WorkflowNode, WorkflowConnection } from '@/store/useWorkflowStore';

interface ConnectionPath {
  d: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

interface DragState {
  isDragging: boolean;
  dragType: 'node' | 'canvas' | 'connection' | null;
  draggedNodeId: string | null;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

// Icon mapping for safe rendering
const getIconComponent = (nodeId: string) => {
  const actionType = nodeId.split('-')[0];
  
  switch (actionType) {
    case 'trigger':
      return Zap;
    case 'send_email':
    case 'send-email':
      return Mail;
    case 'send_sms':
    case 'send-sms':
      return MessageSquare;
    case 'add_contact_tag':
    case 'add-contact-tag':
      return Tag;
    case 'assign_user':
    case 'assign-user':
      return User;
    case 'create_opportunity':
    case 'create-opportunity':
      return DollarSign;
    case 'wait':
      return Clock;
    case 'condition':
      return Filter;
    case 'decision':
      return GitBranch;
    default:
      return Settings;
  }
};

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

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragType: null,
    draggedNodeId: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  });

  const [connecting, setConnecting] = useState<{ sourceId: string; sourceHandle?: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<{ nodeId: string; type: 'input' | 'output'; handle?: string } | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Handle mouse move for all drag operations
  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newMousePosition = {
      x: (e.clientX - rect.left - canvasOffset.x) / zoom,
      y: (e.clientY - rect.top - canvasOffset.y) / zoom
    };
    
    setMousePosition(newMousePosition);

    // Handle node dragging
    if (dragState.isDragging && dragState.dragType === 'node' && dragState.draggedNodeId) {
      const deltaX = newMousePosition.x - dragState.startPosition.x;
      const deltaY = newMousePosition.y - dragState.startPosition.y;
      
      updateNode(dragState.draggedNodeId, {
        position: {
          x: dragState.currentPosition.x + deltaX,
          y: dragState.currentPosition.y + deltaY
        }
      });
    }

    // Handle canvas panning
    if (dragState.isDragging && dragState.dragType === 'canvas') {
      const deltaX = e.clientX - dragState.startPosition.x;
      const deltaY = e.clientY - dragState.startPosition.y;
      
      setCanvasOffset({
        x: dragState.currentPosition.x + deltaX,
        y: dragState.currentPosition.y + deltaY
      });
    }
  }, [dragState, canvasOffset, zoom, updateNode]);

  // Handle mouse up for all drag operations
  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragType: null,
      draggedNodeId: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 }
    });
    setConnecting(null);
    setHoveredHandle(null);
  }, []);

  // Handle node mouse down
  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    
    const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    setDragState({
      isDragging: true,
      dragType: 'node',
      draggedNodeId: nodeId,
      startPosition: {
        x: (e.clientX - rect.left - canvasOffset.x) / zoom,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom
      },
      currentPosition: node.position
    });
    
    setSelectedNode(nodeId);
  }, [currentWorkflow, canvasOffset, zoom, setSelectedNode]);

  // Handle canvas mouse down for panning
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    
    setDragState({
      isDragging: true,
      dragType: 'canvas',
      draggedNodeId: null,
      startPosition: { x: e.clientX, y: e.clientY },
      currentPosition: canvasOffset
    });
    
    setSelectedNode(null);
    setSelectedConnection(null);
  }, [canvasOffset, setSelectedNode, setSelectedConnection]);

  // Handle connection start
  const handleConnectionStart = useCallback((sourceId: string, sourceHandle?: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setConnecting({ sourceId, sourceHandle });
    setSelectedNode(null);
    setSelectedConnection(null);
  }, [setSelectedNode, setSelectedConnection]);

  // Handle connection end
  const handleConnectionEnd = useCallback((targetId: string, targetHandle?: string) => {
    if (!connecting || connecting.sourceId === targetId) {
      setConnecting(null);
      return;
    }

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
    
    setConnecting(null);
  }, [connecting, canConnect, addConnection]);

  // Calculate smooth bezier curve for connections
  const calculateConnectionPath = useCallback((
    sourceX: number, 
    sourceY: number, 
    targetX: number, 
    targetY: number,
    sourceHandle?: string
  ): ConnectionPath => {
    const distance = Math.abs(targetX - sourceX);
    const controlPointOffset = Math.min(distance / 2, 100);
    
    let cp1X, cp1Y, cp2X, cp2Y;
    
    if (sourceHandle === 'true' || sourceHandle === 'false') {
      // For condition branches, create angled paths
      cp1X = sourceX + controlPointOffset;
      cp1Y = sourceY;
      cp2X = targetX - controlPointOffset;
      cp2Y = targetY;
    } else {
      // Standard vertical flow
      cp1X = sourceX;
      cp1Y = sourceY + controlPointOffset;
      cp2X = targetX;
      cp2Y = targetY - controlPointOffset;
    }
    
    const d = `M ${sourceX} ${sourceY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;
    
    return { d, sourceX, sourceY, targetX, targetY };
  }, []);

  // Get node connection points
  const getNodeConnectionPoint = useCallback((node: WorkflowNode, handle: string = 'default') => {
    const nodeWidth = 200;
    const nodeHeight = node.type === 'trigger' ? 100 : 80;
    
    switch (handle) {
      case 'input':
        return {
          x: node.position.x + nodeWidth / 2,
          y: node.position.y
        };
      case 'output':
      case 'default':
        return {
          x: node.position.x + nodeWidth / 2,
          y: node.position.y + nodeHeight
        };
      case 'true':
        return {
          x: node.position.x + nodeWidth * 0.25,
          y: node.position.y + nodeHeight
        };
      case 'false':
        return {
          x: node.position.x + nodeWidth * 0.75,
          y: node.position.y + nodeHeight
        };
      default:
        return {
          x: node.position.x + nodeWidth / 2,
          y: node.position.y + nodeHeight / 2
        };
    }
  }, []);

  // Render connection lines
  const renderConnections = useCallback(() => {
    if (!currentWorkflow) return null;

    return (
      <svg 
        ref={svgRef}
        className="absolute inset-0 pointer-events-none overflow-visible"
        style={{ width: '100%', height: '100%', zIndex: 1 }}
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
          <marker
            id="arrowhead-selected"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill="#3b82f6"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
          <marker
            id="arrowhead-success"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill="#10b981"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
          <marker
            id="arrowhead-error"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill="#ef4444"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        
        {/* Existing connections */}
        {currentWorkflow.connections.map((connection) => {
          const sourceNode = currentWorkflow.nodes.find(n => n.id === connection.source);
          const targetNode = currentWorkflow.nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;
          
          const sourcePos = getNodeConnectionPoint(sourceNode, connection.sourceHandle || 'output');
          const targetPos = getNodeConnectionPoint(targetNode, connection.targetHandle || 'input');
          const path = calculateConnectionPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y, connection.sourceHandle);
          
          const isSelected = selectedConnection === connection.id;
          const strokeColor = isSelected ? "#3b82f6" : 
                            connection.sourceHandle === 'true' ? "#10b981" :
                            connection.sourceHandle === 'false' ? "#ef4444" : "#6b7280";
          const markerEnd = isSelected ? "url(#arrowhead-selected)" :
                          connection.sourceHandle === 'true' ? "url(#arrowhead-success)" :
                          connection.sourceHandle === 'false' ? "url(#arrowhead-error)" : "url(#arrowhead)";
          
          return (
            <g key={connection.id}>
              <path
                d={path.d}
                stroke={strokeColor}
                strokeWidth={isSelected ? "3" : "2"}
                fill="none"
                markerEnd={markerEnd}
                className="cursor-pointer hover:stroke-blue-500 transition-colors"
                style={{ pointerEvents: 'stroke' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedConnection(connection.id);
                }}
              />
              {connection.label && (
                <text
                  x={(sourcePos.x + targetPos.x) / 2}
                  y={(sourcePos.y + targetPos.y) / 2 - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 pointer-events-none"
                  style={{ fontSize: '12px' }}
                >
                  {connection.label}
                </text>
              )}
              {/* Connection labels for condition branches */}
              {connection.sourceHandle === 'true' && (
                <text
                  x={sourcePos.x + 20}
                  y={sourcePos.y + 15}
                  className="text-xs fill-green-600 font-medium pointer-events-none"
                  style={{ fontSize: '11px' }}
                >
                  Yes
                </text>
              )}
              {connection.sourceHandle === 'false' && (
                <text
                  x={sourcePos.x - 20}
                  y={sourcePos.y + 15}
                  className="text-xs fill-red-600 font-medium pointer-events-none"
                  style={{ fontSize: '11px' }}
                >
                  No
                </text>
              )}
            </g>
          );
        })}
        
        {/* Temporary connection line */}
        {connecting && (
          <path
            d={calculateConnectionPath(
              getNodeConnectionPoint(currentWorkflow.nodes.find(n => n.id === connecting.sourceId)!, connecting.sourceHandle || 'output').x,
              getNodeConnectionPoint(currentWorkflow.nodes.find(n => n.id === connecting.sourceId)!, connecting.sourceHandle || 'output').y,
              mousePosition.x,
              mousePosition.y,
              connecting.sourceHandle
            ).d}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="none"
            className="pointer-events-none"
          />
        )}
      </svg>
    );
  }, [currentWorkflow, selectedConnection, connecting, mousePosition, getNodeConnectionPoint, calculateConnectionPath, setSelectedConnection]);

  // Render workflow node with proper handles
  const renderNode = useCallback((node: WorkflowNode) => {
    const IconComponent = getIconComponent(node.id);
    const isSelected = selectedNode === node.id;
    const isConfigured = node.data.isConfigured;
    const isHovered = hoveredNode === node.id;
    const isDragging = dragState.draggedNodeId === node.id;
    const validation = useWorkflowStore.getState().validateNode(node.id);
    
    const nodeWidth = 200;
    const nodeHeight = node.type === 'trigger' ? 100 : 80;
    
    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer transition-all duration-200 group ${
          isSelected ? 'ring-2 ring-blue-500 z-20' : 'z-10'
        } ${isDragging ? 'opacity-70 scale-105' : ''} ${isHovered ? 'shadow-lg' : ''}`}
        style={{ 
          left: node.position.x, 
          top: node.position.y,
          width: nodeWidth,
          height: nodeHeight,
          transform: `scale(${zoom})`
        }}
        onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedNode(node.id);
        }}
        onDoubleClick={() => openConfigModal(node)}
      >
        {node.type === 'trigger' ? (
          <div className={`bg-white border-2 rounded-lg p-4 w-full h-full shadow-lg transition-all duration-200 ${
            isConfigured ? 'border-green-400' : 'border-orange-400'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isHovered ? 'shadow-xl' : ''}`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={`p-2 rounded-full ${isConfigured ? 'bg-green-100' : 'bg-orange-100'}`}>
                <IconComponent className={`h-5 w-5 ${isConfigured ? 'text-green-600' : 'text-orange-600'}`} />
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
            
            {/* Output handle for trigger */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output' })}
              onMouseLeave={() => setHoveredHandle(null)}
            >
              <div
                className={`w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-pointer transition-all duration-200 ${
                  hoveredHandle?.nodeId === node.id && hoveredHandle?.type === 'output' ? 'scale-125 bg-blue-600' : ''
                } ${connecting ? 'hover:bg-green-500' : 'hover:bg-blue-600'}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleConnectionStart(node.id, 'output', e);
                }}
              />
            </div>
          </div>
        ) : (
          <div className={`bg-white border-2 rounded-lg p-3 w-full h-full shadow-lg transition-all duration-200 ${
            isConfigured ? 'border-green-300' : 'border-gray-300'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isHovered ? 'shadow-xl' : ''}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1 rounded ${isConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
                <IconComponent className={`h-4 w-4 ${isConfigured ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <span className="text-sm font-medium truncate flex-1">{node.data.label}</span>
              {!validation.isValid && <AlertCircle className="h-3 w-3 text-red-500" />}
              {isConfigured && <CheckCircle className="h-3 w-3 text-green-500" />}
            </div>
            
            {/* Node actions */}
            <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-gray-50"
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
                className="h-6 w-6 p-0 bg-white shadow-sm border hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNode(node.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Input handle */}
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2"
              onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'input' })}
              onMouseLeave={() => setHoveredHandle(null)}
            >
              <div
                className={`w-3 h-3 bg-gray-400 rounded-full border-2 border-white cursor-pointer transition-all duration-200 ${
                  hoveredHandle?.nodeId === node.id && hoveredHandle?.type === 'input' ? 'scale-125 bg-gray-600' : ''
                } ${connecting ? 'hover:bg-green-500' : 'hover:bg-gray-600'}`}
                onMouseUp={() => handleConnectionEnd(node.id, 'input')}
                onMouseEnter={() => {
                  if (connecting && connecting.sourceId !== node.id) {
                    // Visual feedback for valid drop target
                  }
                }}
              />
            </div>
            
            {/* Output handle */}
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output' })}
              onMouseLeave={() => setHoveredHandle(null)}
            >
              <div
                className={`w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-pointer transition-all duration-200 ${
                  hoveredHandle?.nodeId === node.id && hoveredHandle?.type === 'output' ? 'scale-125 bg-blue-600' : ''
                } ${connecting ? 'hover:bg-green-500' : 'hover:bg-blue-600'}`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleConnectionStart(node.id, 'output', e);
                }}
              />
            </div>
            
            {/* Condition node additional handles */}
            {node.type === 'condition' && (
              <>
                <div 
                  className="absolute -bottom-2 left-1/4 transform -translate-x-1/2"
                  onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output', handle: 'true' })}
                  onMouseLeave={() => setHoveredHandle(null)}
                >
                  <div
                    className={`w-3 h-3 bg-green-500 rounded-full border-2 border-white cursor-pointer transition-all duration-200 ${
                      hoveredHandle?.nodeId === node.id && hoveredHandle?.handle === 'true' ? 'scale-125 bg-green-600' : ''
                    }`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleConnectionStart(node.id, 'true', e);
                    }}
                    title="True path"
                  />
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-medium whitespace-nowrap">
                    Yes
                  </span>
                </div>
                <div 
                  className="absolute -bottom-2 right-1/4 transform translate-x-1/2"
                  onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output', handle: 'false' })}
                  onMouseLeave={() => setHoveredHandle(null)}
                >
                  <div
                    className={`w-3 h-3 bg-red-500 rounded-full border-2 border-white cursor-pointer transition-all duration-200 ${
                      hoveredHandle?.nodeId === node.id && hoveredHandle?.handle === 'false' ? 'scale-125 bg-red-600' : ''
                    }`}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleConnectionStart(node.id, 'false', e);
                    }}
                    title="False path"
                  />
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-red-600 font-medium whitespace-nowrap">
                    No
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }, [selectedNode, hoveredNode, hoveredHandle, dragState, zoom, connecting, handleNodeMouseDown, setSelectedNode, openConfigModal, duplicateNode, deleteNode, handleConnectionStart, handleConnectionEnd]);

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

  // Global event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNode) {
        deleteNode(selectedNode);
      }
      if (e.key === 'Delete' && selectedConnection) {
        deleteConnection(selectedConnection);
      }
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setSelectedConnection(null);
        setConnecting(null);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMouseMove, handleMouseUp, selectedNode, selectedConnection, deleteNode, deleteConnection, setSelectedNode, setSelectedConnection]);

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
          className="w-full h-full relative bg-gray-50 cursor-move"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
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
          
          {/* Selection indicator */}
          {selectedConnection && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Connection selected - Press Delete to remove
            </div>
          )}
        </div>
        
        {/* Zoom and pan controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-2 py-1 bg-white border rounded text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 bg-white"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="bg-white"
            onClick={() => {
              setZoom(1);
              setCanvasOffset({ x: 0, y: 0 });
            }}
          >
            <Move className="h-4 w-4 mr-2" />
            Reset View
          </Button>
        </div>
        
        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTestWorkflow}
            disabled={isExecuting}
            className="bg-white"
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
    <div className="flex flex-col items-center justify-center h-full pointer-events-none">
      <div 
        className="bg-white border-2 border-dashed border-orange-400 rounded-lg p-8 cursor-pointer hover:border-orange-500 transition-colors hover:shadow-lg pointer-events-auto"
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
