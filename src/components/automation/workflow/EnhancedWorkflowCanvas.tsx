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
  Phone,
  FileText,
  Tag,
  DollarSign,
  BarChart3,
  Settings,
  Copy,
  Trash2,
  Play,
  Pause
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'goal';
  position: { x: number; y: number };
  data: {
    label: string;
    icon: string; // Store icon name as string instead of component
    config: Record<string, any>;
    isConfigured: boolean;
  };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// Icon mapping
const iconMap = {
  FileText,
  Tag,
  Calendar,
  Zap,
  Mail,
  MessageSquare,
  Users,
  GitBranch,
  Clock,
  Target,
  Phone,
  DollarSign,
  BarChart3,
  Settings
};

const nodeTypes = [
  {
    category: 'Triggers',
    items: [
      { type: 'form_submit', label: 'Form Submitted', icon: 'FileText', color: 'bg-green-100 border-green-300' },
      { type: 'tag_added', label: 'Tag Added', icon: 'Tag', color: 'bg-blue-100 border-blue-300' },
      { type: 'date_time', label: 'Date/Time', icon: 'Calendar', color: 'bg-purple-100 border-purple-300' },
      { type: 'webhook', label: 'Webhook', icon: 'Zap', color: 'bg-yellow-100 border-yellow-300' }
    ]
  },
  {
    category: 'Actions',
    items: [
      { type: 'send_email', label: 'Send Email', icon: 'Mail', color: 'bg-red-100 border-red-300' },
      { type: 'send_sms', label: 'Send SMS', icon: 'MessageSquare', color: 'bg-green-100 border-green-300' },
      { type: 'add_tag', label: 'Add Tag', icon: 'Tag', color: 'bg-blue-100 border-blue-300' },
      { type: 'create_task', label: 'Create Task', icon: 'FileText', color: 'bg-orange-100 border-orange-300' },
      { type: 'update_contact', label: 'Update Contact', icon: 'Users', color: 'bg-teal-100 border-teal-300' }
    ]
  },
  {
    category: 'Logic',
    items: [
      { type: 'if_else', label: 'If/Else', icon: 'GitBranch', color: 'bg-purple-100 border-purple-300' },
      { type: 'delay', label: 'Wait/Delay', icon: 'Clock', color: 'bg-gray-100 border-gray-300' },
      { type: 'goal', label: 'Goal', icon: 'Target', color: 'bg-green-100 border-green-300' }
    ]
  }
];

export function EnhancedWorkflowCanvas() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{nodeId: string, handle: string} | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback((nodeType: any, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type: nodeType.type.includes('trigger') ? 'trigger' : 
            nodeType.type.includes('condition') || nodeType.type.includes('if') ? 'condition' : 
            nodeType.type.includes('delay') || nodeType.type.includes('wait') ? 'delay' :
            nodeType.type.includes('goal') ? 'goal' : 'action',
      position,
      data: {
        label: nodeType.label,
        icon: nodeType.icon, // Store icon name as string
        config: {},
        isConfigured: false
      }
    };

    setNodes(prev => [...prev, newNode]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeData = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = canvasRef.current?.getBoundingClientRect();
    
    if (rect) {
      const position = {
        x: e.clientX - rect.left - 100,
        y: e.clientY - rect.top - 50
      };
      addNode(nodeData, position);
    }
  }, [addNode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleNodeDragStart = useCallback((node: WorkflowNode, e: React.MouseEvent) => {
    setDraggedNode(node);
    setSelectedNode(node.id);
  }, []);

  const handleNodeDrag = useCallback((e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left - 100,
        y: e.clientY - rect.top - 50
      };

      setNodes(prev => prev.map(node => 
        node.id === draggedNode.id 
          ? { ...node, position: newPosition }
          : node
      ));
    }
  }, [draggedNode]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
    setSelectedNode(null);
  }, []);

  const duplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode = {
        ...node,
        id: `node-${Date.now()}`,
        position: { x: node.position.x + 50, y: node.position.y + 50 }
      };
      setNodes(prev => [...prev, newNode]);
    }
  }, [nodes]);

  const startConnection = useCallback((nodeId: string, handle: string) => {
    setIsConnecting(true);
    setConnectionStart({ nodeId, handle });
  }, []);

  const completeConnection = useCallback((targetNodeId: string, targetHandle: string) => {
    if (connectionStart && connectionStart.nodeId !== targetNodeId) {
      const newConnection: WorkflowConnection = {
        id: `connection-${Date.now()}`,
        source: connectionStart.nodeId,
        target: targetNodeId,
        sourceHandle: connectionStart.handle,
        targetHandle: targetHandle
      };
      
      setConnections(prev => [...prev, newConnection]);
    }
    
    setIsConnecting(false);
    setConnectionStart(null);
  }, [connectionStart]);

  return (
    <div className="flex h-full">
      {/* Node Palette */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Workflow Elements</h3>
          
          {nodeTypes.map((category) => (
            <div key={category.category} className="mb-6">
              <h4 className="text-sm font-medium text-gray-600 mb-3">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((item) => {
                  const IconComponent = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={item.type}
                      className={`p-3 rounded-lg border cursor-move hover:shadow-md transition-shadow ${item.color}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify(item));
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-gray-50">
        <div
          ref={canvasRef}
          className="w-full h-full relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onMouseMove={handleNodeDrag}
          onMouseUp={handleMouseUp}
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Render Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {connections.map((connection) => {
              const sourceNode = nodes.find(n => n.id === connection.source);
              const targetNode = nodes.find(n => n.id === connection.target);
              
              if (!sourceNode || !targetNode) return null;
              
              const sourceX = sourceNode.position.x + 100;
              const sourceY = sourceNode.position.y + 50;
              const targetX = targetNode.position.x + 100;
              const targetY = targetNode.position.y + 50;
              
              const midX = (sourceX + targetX) / 2;
              
              return (
                <path
                  key={connection.id}
                  d={`M ${sourceX} ${sourceY} C ${midX} ${sourceY} ${midX} ${targetY} ${targetX} ${targetY}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3b82f6"
                />
              </marker>
            </defs>
          </svg>

          {/* Render Nodes */}
          {nodes.map((node) => {
            const IconComponent = iconMap[node.data.icon as keyof typeof iconMap];
            return (
              <div
                key={node.id}
                className={`absolute bg-white rounded-lg shadow-lg border-2 cursor-move ${
                  selectedNode === node.id ? 'border-blue-500' : 'border-gray-200'
                } hover:shadow-xl transition-shadow`}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  width: 200,
                  zIndex: selectedNode === node.id ? 10 : 5
                }}
                onMouseDown={(e) => handleNodeDragStart(node, e)}
                onClick={() => setSelectedNode(node.id)}
              >
                {/* Connection handles */}
                <div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isConnecting) {
                      completeConnection(node.id, 'input');
                    } else {
                      startConnection(node.id, 'input');
                    }
                  }}
                />
                <div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isConnecting) {
                      completeConnection(node.id, 'output');
                    } else {
                      startConnection(node.id, 'output');
                    }
                  }}
                />

                <Card className="border-0 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-4 w-4" />
                      <span className="font-medium text-sm">{node.data.label}</span>
                      {!node.data.isConfigured && (
                        <Badge variant="outline" className="text-xs">
                          Setup Required
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-1 mt-2">
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateNode(node.id);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-6 text-xs text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNode(node.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Build Your Workflow
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag elements from the left panel to create your automation workflow
                </p>
                <Badge variant="outline">
                  Start with a Trigger
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="outline">
            <Play className="h-4 w-4 mr-1" />
            Test
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-1" />
            Activate
          </Button>
        </div>

        {/* Workflow Stats */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{nodes.length} Elements</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{connections.length} Connections</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>{nodes.filter(n => !n.data.isConfigured).length} Unconfigured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
