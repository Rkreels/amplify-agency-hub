
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Clock, 
  GitBranch, 
  Target, 
  Users, 
  Calendar,
  Tag,
  Settings,
  Plus,
  Trash2,
  Copy,
  Play,
  Square
} from 'lucide-react';
import { WorkflowNode, WorkflowConnection } from '@/store/useWorkflowStore';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  onNodeDelete: (nodeId: string) => void;
  onNodeDuplicate: (nodeId: string) => void;
  onConnectionCreate: (connection: Omit<WorkflowConnection, 'id'>) => void;
  onConnectionDelete: (connectionId: string) => void;
  onNodeAdd: (node: Omit<WorkflowNode, 'id'>) => void;
}

interface DragState {
  isDragging: boolean;
  dragNode: string | null;
  dragOffset: { x: number; y: number };
  isConnecting: boolean;
  connectionStart: { nodeId: string; handle: string } | null;
  previewConnection: { start: { x: number; y: number }; end: { x: number; y: number } } | null;
}

export function WorkflowCanvas({
  nodes,
  connections,
  selectedNode,
  onNodeSelect,
  onNodeUpdate,
  onNodeDelete,
  onNodeDuplicate,
  onConnectionCreate,
  onConnectionDelete,
  onNodeAdd
}: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragNode: null,
    dragOffset: { x: 0, y: 0 },
    isConnecting: false,
    connectionStart: null,
    previewConnection: null
  });
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const getNodeIcon = (type: string) => {
    const icons = {
      trigger: Zap,
      action: Play,
      condition: GitBranch,
      delay: Clock,
      goal: Target,
      wait: Square
    };
    return icons[type as keyof typeof icons] || Settings;
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      ...dragState,
      isDragging: true,
      dragNode: nodeId,
      dragOffset: {
        x: e.clientX - rect.left - node.position.x,
        y: e.clientY - rect.top - node.position.y
      }
    });

    onNodeSelect(nodeId);
  }, [dragState, nodes, onNodeSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.dragNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - rect.left - dragState.dragOffset.x,
      y: e.clientY - rect.top - dragState.dragOffset.y
    };

    onNodeUpdate(dragState.dragNode, { position: newPosition });
  }, [dragState, onNodeUpdate]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      ...dragState,
      isDragging: false,
      dragNode: null,
      dragOffset: { x: 0, y: 0 }
    });
  }, [dragState]);

  const handleConnectionStart = useCallback((nodeId: string, handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragState({
      ...dragState,
      isConnecting: true,
      connectionStart: { nodeId, handle },
      previewConnection: {
        start: { x: e.clientX - rect.left, y: e.clientY - rect.top },
        end: { x: e.clientX - rect.left, y: e.clientY - rect.top }
      }
    });
  }, [dragState]);

  const handleConnectionEnd = useCallback((targetNodeId: string, targetHandle: string) => {
    if (!dragState.connectionStart) return;

    const sourceNodeId = dragState.connectionStart.nodeId;
    const sourceHandle = dragState.connectionStart.handle;

    if (sourceNodeId !== targetNodeId) {
      onConnectionCreate({
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle,
        targetHandle
      });
    }

    setDragState({
      ...dragState,
      isConnecting: false,
      connectionStart: null,
      previewConnection: null
    });
  }, [dragState, onConnectionCreate]);

  const renderConnections = () => {
    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
        
        {connections.map((connection) => {
          const sourceNode = nodes.find(n => n.id === connection.source);
          const targetNode = nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;

          const startX = sourceNode.position.x + 100; // Node width / 2
          const startY = sourceNode.position.y + 40; // Node height / 2
          const endX = targetNode.position.x + 100;
          const endY = targetNode.position.y + 40;

          const path = `M ${startX} ${startY} C ${startX + 50} ${startY} ${endX - 50} ${endY} ${endX} ${endY}`;

          return (
            <path
              key={connection.id}
              d={path}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="pointer-events-auto cursor-pointer hover:stroke-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                onConnectionDelete(connection.id);
              }}
            />
          );
        })}

        {/* Preview connection while dragging */}
        {dragState.previewConnection && (
          <path
            d={`M ${dragState.previewConnection.start.x} ${dragState.previewConnection.start.y} L ${dragState.previewConnection.end.x} ${dragState.previewConnection.end.y}`}
            stroke="#6b7280"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
        )}
      </svg>
    );
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const nodeType = e.dataTransfer.getData('application/json');
    if (!nodeType) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const position = {
      x: e.clientX - rect.left - 100,
      y: e.clientY - rect.top - 40
    };

    const template = JSON.parse(nodeType);
    
    onNodeAdd({
      type: template.type,
      position,
      data: {
        label: template.label,
        icon: template.type,
        config: {},
        isConfigured: false
      }
    });
  }, [onNodeAdd]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative h-full overflow-hidden bg-gray-50">
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => onNodeSelect(null)}
      >
        {renderConnections()}
        
        {nodes.map((node) => {
          const IconComponent = getNodeIcon(node.type);
          const isSelected = selectedNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`absolute bg-white rounded-lg shadow-lg border-2 cursor-pointer transition-all ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: 200,
                zIndex: isSelected ? 10 : 5
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
            >
              <Card className="border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-blue-50">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{node.data.label}</h4>
                      {!node.data.isConfigured && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Setup Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="flex gap-1 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open config modal
                        }}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNodeDuplicate(node.id);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-xs text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNodeDelete(node.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Connection handles */}
                  {node.type !== 'trigger' && (
                    <div 
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white cursor-crosshair hover:bg-blue-500"
                      onMouseUp={() => dragState.connectionStart && handleConnectionEnd(node.id, 'input')}
                    />
                  )}
                  
                  <div 
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white cursor-crosshair hover:bg-blue-600"
                    onMouseDown={(e) => handleConnectionStart(node.id, 'output', e)}
                  />
                </CardContent>
              </Card>
            </div>
          );
        })}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Build Your Workflow
              </h3>
              <p className="text-gray-500 mb-4">
                Drag elements from the sidebar to create your automation workflow
              </p>
              <Badge variant="outline">
                Start with a Trigger
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
