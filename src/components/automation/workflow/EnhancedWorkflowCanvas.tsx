
import React, { useState, useRef, useCallback } from 'react';
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
import { Workflow, WorkflowNode } from '@/store/useWorkflowStore';

interface EnhancedWorkflowCanvasProps {
  workflow: Workflow;
  onAddNode: (nodeType: string, position: { x: number; y: number }) => void;
  selectedNode: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onConfigureNode: (node: WorkflowNode) => void;
}

const nodeTypes = [
  {
    category: 'Triggers',
    items: [
      { type: 'form_submit', label: 'Form Submitted', icon: FileText, color: 'bg-green-100 border-green-300' },
      { type: 'tag_added', label: 'Tag Added', icon: Tag, color: 'bg-blue-100 border-blue-300' },
      { type: 'date_time', label: 'Date/Time', icon: Calendar, color: 'bg-purple-100 border-purple-300' },
      { type: 'webhook', label: 'Webhook', icon: Zap, color: 'bg-yellow-100 border-yellow-300' }
    ]
  },
  {
    category: 'Actions',
    items: [
      { type: 'send_email', label: 'Send Email', icon: Mail, color: 'bg-red-100 border-red-300' },
      { type: 'send_sms', label: 'Send SMS', icon: MessageSquare, color: 'bg-green-100 border-green-300' },
      { type: 'add_tag', label: 'Add Tag', icon: Tag, color: 'bg-blue-100 border-blue-300' },
      { type: 'create_task', label: 'Create Task', icon: FileText, color: 'bg-orange-100 border-orange-300' },
      { type: 'update_contact', label: 'Update Contact', icon: Users, color: 'bg-teal-100 border-teal-300' }
    ]
  },
  {
    category: 'Logic',
    items: [
      { type: 'if_else', label: 'If/Else', icon: GitBranch, color: 'bg-purple-100 border-purple-300' },
      { type: 'delay', label: 'Wait/Delay', icon: Clock, color: 'bg-gray-100 border-gray-300' },
      { type: 'goal', label: 'Goal', icon: Target, color: 'bg-green-100 border-green-300' }
    ]
  }
];

export function EnhancedWorkflowCanvas({ 
  workflow, 
  onAddNode, 
  selectedNode, 
  onSelectNode, 
  onConfigureNode 
}: EnhancedWorkflowCanvasProps) {
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/reactflow');
    const rect = canvasRef.current?.getBoundingClientRect();
    
    if (rect) {
      const position = {
        x: e.clientX - rect.left - 100,
        y: e.clientY - rect.top - 50
      };
      onAddNode(nodeType, position);
    }
  }, [onAddNode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

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
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.type}
                      className={`p-3 rounded-lg border cursor-move hover:shadow-md transition-shadow ${item.color}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/reactflow', item.type);
                        e.dataTransfer.effectAllowed = 'move';
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
          style={{
            backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Render Nodes */}
          {workflow.nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute bg-white rounded-lg shadow-lg border-2 cursor-pointer ${
                selectedNode === node.id ? 'border-blue-500' : 'border-gray-200'
              } hover:shadow-xl transition-shadow`}
              style={{
                left: node.position.x,
                top: node.position.y,
                width: 200,
                zIndex: selectedNode === node.id ? 10 : 5
              }}
              onClick={() => onSelectNode(node.id)}
            >
              <Card className="border-0 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{node.data.label}</span>
                    {!node.data.isConfigured && (
                      <Badge variant="outline" className="text-xs">
                        Setup Required
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConfigureNode(node);
                      }}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Empty State */}
          {workflow.nodes.length === 0 && (
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
      </div>
    </div>
  );
}
