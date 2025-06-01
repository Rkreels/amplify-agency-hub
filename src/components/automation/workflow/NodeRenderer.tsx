
import React, { memo } from 'react';
import { WorkflowNode } from '@/store/useWorkflowStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  Trash2,
  Zap, 
  Mail, 
  MessageSquare, 
  Tag, 
  User, 
  DollarSign, 
  Clock, 
  Filter, 
  GitBranch, 
  Settings
} from 'lucide-react';

// Get icon component for node types
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

interface NodeRendererProps {
  node: WorkflowNode;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  zoom: number;
  hoveredHandle: { nodeId: string; type: 'input' | 'output'; handle?: string } | null;
  connecting: { sourceId: string; sourceHandle?: string } | null;
  handleNodeMouseDown: (nodeId: string, e: React.MouseEvent) => void;
  handleConnectionStart: (sourceId: string, sourceHandle?: string, e?: React.MouseEvent) => void;
  handleConnectionEnd: (targetId: string, targetHandle?: string) => void;
  setHoveredNode: (nodeId: string | null) => void;
  setHoveredHandle: (handle: { nodeId: string; type: 'input' | 'output'; handle?: string } | null) => void;
  openConfigModal: (node: WorkflowNode) => void;
  duplicateNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
}

export const NodeRenderer = memo(({
  node,
  isSelected,
  isHovered,
  isDragging,
  zoom,
  hoveredHandle,
  connecting,
  handleNodeMouseDown,
  handleConnectionStart,
  handleConnectionEnd,
  setHoveredNode,
  setHoveredHandle,
  openConfigModal,
  duplicateNode,
  deleteNode,
  setSelectedNode
}: NodeRendererProps) => {
  const IconComponent = getIconComponent(node.id);
  const isConfigured = node.data.isConfigured;
  
  const nodeWidth = 200;
  const nodeHeight = node.type === 'trigger' ? 100 : 80;

  // Helper to check if a node is a valid connection target
  const isValidConnectionTarget = connecting && connecting.sourceId !== node.id;
  
  // Connection handles styles based on state
  const getHandleStyles = (type: 'input' | 'output', handleId?: string) => {
    const isHandleHovered = hoveredHandle?.nodeId === node.id && 
                           hoveredHandle?.type === type && 
                           hoveredHandle?.handle === handleId;
    
    const baseClasses = `transition-all duration-200 border-2 border-white rounded-full`;
    
    if (type === 'input') {
      return `${baseClasses} w-3 h-3 ${
        isHandleHovered ? 'scale-125 bg-gray-600' : 'bg-gray-400'
      } ${isValidConnectionTarget ? 'hover:bg-green-500 animate-pulse' : 'hover:bg-gray-600'}`;
    } else {
      // Output handles
      if (handleId === 'true') {
        return `${baseClasses} w-3 h-3 ${
          isHandleHovered ? 'scale-125 bg-green-600' : 'bg-green-500'
        } hover:bg-green-600`;
      } else if (handleId === 'false') {
        return `${baseClasses} w-3 h-3 ${
          isHandleHovered ? 'scale-125 bg-red-600' : 'bg-red-500'
        } hover:bg-red-600`;
      } else {
        return `${baseClasses} w-3 w-3 ${
          isHandleHovered ? 'scale-125 bg-blue-600' : 'bg-blue-500'
        } hover:bg-blue-600`;
      }
    }
  };
  
  return (
    <div
      key={node.id}
      className={`absolute transition-all duration-200 group ${
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
        <div 
          className={`bg-white border-2 rounded-lg p-4 w-full h-full shadow-lg transition-all duration-200 ${
            isConfigured ? 'border-green-400' : 'border-orange-400'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isHovered ? 'shadow-xl' : ''}`}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className={`p-2 rounded-full ${isConfigured ? 'bg-green-100' : 'bg-orange-100'}`}>
              <IconComponent className={`h-5 w-5 ${isConfigured ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            {!isConfigured && <AlertCircle className="h-4 w-4 text-red-500" />}
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
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 cursor-crosshair"
            onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output' })}
            onMouseLeave={() => setHoveredHandle(null)}
          >
            <div
              className={getHandleStyles('output')}
              onMouseDown={(e) => {
                e.stopPropagation();
                handleConnectionStart(node.id, 'output', e);
              }}
            />
          </div>
        </div>
      ) : (
        <div 
          className={`bg-white border-2 rounded-lg p-3 w-full h-full shadow-lg transition-all duration-200 ${
            isConfigured ? 'border-green-300' : 'border-gray-300'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isHovered ? 'shadow-xl' : ''}`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-1 rounded ${isConfigured ? 'bg-green-100' : 'bg-gray-100'}`}>
              <IconComponent className={`h-4 w-4 ${isConfigured ? 'text-green-600' : 'text-gray-500'}`} />
            </div>
            <span className="text-sm font-medium truncate flex-1">{node.data.label}</span>
            {!isConfigured && <AlertCircle className="h-3 w-3 text-red-500" />}
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
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 cursor-crosshair"
            onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'input' })}
            onMouseLeave={() => setHoveredHandle(null)}
          >
            <div
              className={getHandleStyles('input')}
              onMouseUp={() => connecting && handleConnectionEnd(node.id, 'input')}
            />
          </div>
          
          {/* Output handle */}
          <div 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 cursor-crosshair"
            onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output' })}
            onMouseLeave={() => setHoveredHandle(null)}
          >
            <div
              className={getHandleStyles('output')}
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
                className="absolute -bottom-2 left-1/4 transform -translate-x-1/2 cursor-crosshair"
                onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output', handle: 'true' })}
                onMouseLeave={() => setHoveredHandle(null)}
              >
                <div
                  className={getHandleStyles('output', 'true')}
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
                className="absolute -bottom-2 right-1/4 transform translate-x-1/2 cursor-crosshair"
                onMouseEnter={() => setHoveredHandle({ nodeId: node.id, type: 'output', handle: 'false' })}
                onMouseLeave={() => setHoveredHandle(null)}
              >
                <div
                  className={getHandleStyles('output', 'false')}
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
});

NodeRenderer.displayName = 'NodeRenderer';
