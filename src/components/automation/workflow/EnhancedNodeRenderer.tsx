
import React, { memo, useState } from 'react';
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

interface ConnectionHandle {
  id: string;
  type: 'input' | 'output';
  position: { x: number; y: number };
  active: boolean;
}

interface EnhancedNodeRendererProps {
  node: WorkflowNode;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  zoom: number;
  onNodeMouseDown: (nodeId: string, e: React.MouseEvent) => void;
  onConnectionStart: (nodeId: string, handleId: string, type: 'input' | 'output', e: React.MouseEvent) => void;
  onConnectionEnd: (nodeId: string, handleId: string, type: 'input' | 'output') => void;
  onHoverHandle: (nodeId: string, handleId: string, type: 'input' | 'output') => void;
  onHoverLeave: () => void;
  openConfigModal: (node: WorkflowNode) => void;
  duplicateNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  isConnecting: boolean;
  hoveredHandle: { nodeId: string; handleId: string; type: 'input' | 'output' } | null;
}

export const EnhancedNodeRenderer = memo(({
  node,
  isSelected,
  isHovered,
  isDragging,
  zoom,
  onNodeMouseDown,
  onConnectionStart,
  onConnectionEnd,
  onHoverHandle,
  onHoverLeave,
  openConfigModal,
  duplicateNode,
  deleteNode,
  setSelectedNode,
  isConnecting,
  hoveredHandle
}: EnhancedNodeRendererProps) => {
  const [isNodeHovered, setIsNodeHovered] = useState(false);
  const IconComponent = getIconComponent(node.id);
  const isConfigured = node.data.isConfigured;
  
  const nodeWidth = 200;
  const nodeHeight = node.type === 'trigger' ? 100 : 80;

  // Handle styles with smooth transitions
  const getHandleStyles = (type: 'input' | 'output', handleId?: string) => {
    const isHandleHovered = hoveredHandle?.nodeId === node.id && 
                           hoveredHandle?.type === type && 
                           hoveredHandle?.handleId === handleId;
    
    const baseClasses = `absolute transition-all duration-200 border-2 border-white rounded-full cursor-crosshair z-10`;
    
    let sizeClasses = 'w-3 h-3';
    let colorClasses = '';
    
    if (isConnecting) {
      sizeClasses = 'w-4 h-4 animate-pulse';
    }
    
    if (isHandleHovered) {
      sizeClasses = 'w-4 h-4';
    }
    
    if (type === 'input') {
      colorClasses = isHandleHovered ? 'bg-blue-500 border-blue-600' : 'bg-gray-400 hover:bg-blue-400';
    } else {
      if (handleId === 'true') {
        colorClasses = isHandleHovered ? 'bg-green-600 border-green-700' : 'bg-green-500 hover:bg-green-600';
      } else if (handleId === 'false') {
        colorClasses = isHandleHovered ? 'bg-red-600 border-red-700' : 'bg-red-500 hover:bg-red-600';
      } else {
        colorClasses = isHandleHovered ? 'bg-blue-600 border-blue-700' : 'bg-blue-500 hover:bg-blue-600';
      }
    }
    
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  };

  return (
    <div
      className={`absolute transition-all duration-200 group ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 z-20' : 'z-10'
      } ${isDragging ? 'opacity-80 scale-105 rotate-1' : ''} ${
        isHovered || isNodeHovered ? 'shadow-xl scale-105' : 'shadow-lg'
      }`}
      style={{ 
        left: node.position.x, 
        top: node.position.y,
        width: nodeWidth,
        height: nodeHeight,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left'
      }}
      onMouseDown={(e) => onNodeMouseDown(node.id, e)}
      onMouseEnter={() => setIsNodeHovered(true)}
      onMouseLeave={() => {
        setIsNodeHovered(false);
        onHoverLeave();
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNode(node.id);
      }}
      onDoubleClick={() => openConfigModal(node)}
    >
      {node.type === 'trigger' ? (
        // Trigger Node
        <div 
          className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-4 w-full h-full shadow-lg transition-all duration-300 ${
            isConfigured 
              ? 'border-green-400 shadow-green-100' 
              : 'border-orange-400 shadow-orange-100'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
            isHovered || isNodeHovered ? 'shadow-2xl border-opacity-80' : ''
          }`}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className={`p-2 rounded-full transition-colors ${
              isConfigured ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <IconComponent className={`h-5 w-5 ${
                isConfigured ? 'text-green-600' : 'text-orange-600'
              }`} />
            </div>
            {!isConfigured && <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />}
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm text-gray-800">{node.data.label}</div>
            {isConfigured ? (
              <Badge variant="secondary" className="mt-2 bg-green-50 text-green-700 border-green-200">
                Configured
              </Badge>
            ) : (
              <Badge variant="outline" className="mt-2 text-orange-600 border-orange-300 animate-pulse">
                Click to Configure
              </Badge>
            )}
          </div>
          
          {/* Output handle for trigger */}
          <div 
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            onMouseEnter={() => onHoverHandle(node.id, 'output', 'output')}
            onMouseLeave={onHoverLeave}
          >
            <div
              className={getHandleStyles('output', 'output')}
              onMouseDown={(e) => {
                e.stopPropagation();
                onConnectionStart(node.id, 'output', 'output', e);
              }}
              onMouseUp={() => onConnectionEnd(node.id, 'output', 'output')}
            />
          </div>
        </div>
      ) : (
        // Action/Condition Node
        <div 
          className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-lg p-3 w-full h-full shadow-lg transition-all duration-300 ${
            isConfigured 
              ? 'border-green-300 shadow-green-100' 
              : 'border-gray-300 shadow-gray-100'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
            isHovered || isNodeHovered ? 'shadow-2xl border-opacity-80 scale-105' : ''
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-2 rounded-lg transition-colors ${
              isConfigured ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <IconComponent className={`h-4 w-4 ${
                isConfigured ? 'text-green-600' : 'text-gray-500'
              }`} />
            </div>
            <span className="text-sm font-semibold truncate flex-1 text-gray-800">
              {node.data.label}
            </span>
            <div className="flex items-center space-x-1">
              {!isConfigured && <AlertCircle className="h-3 w-3 text-red-500 animate-pulse" />}
              {isConfigured && <CheckCircle className="h-3 w-3 text-green-500" />}
            </div>
          </div>
          
          {/* Node actions */}
          <div className={`absolute -top-2 -right-2 flex space-x-1 transition-opacity duration-200 ${
            isNodeHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-white shadow-md border hover:bg-gray-50 hover:scale-110 transition-all"
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
              className="h-6 w-6 p-0 bg-white shadow-md border hover:bg-red-50 hover:scale-110 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
            >
              <Trash2 className="h-3 w-3 text-red-500" />
            </Button>
          </div>
          
          {/* Input handle */}
          <div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2"
            onMouseEnter={() => onHoverHandle(node.id, 'input', 'input')}
            onMouseLeave={onHoverLeave}
          >
            <div
              className={getHandleStyles('input', 'input')}
              onMouseUp={() => onConnectionEnd(node.id, 'input', 'input')}
            />
          </div>
          
          {/* Output handle */}
          {node.type !== 'condition' && (
            <div 
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
              onMouseEnter={() => onHoverHandle(node.id, 'output', 'output')}
              onMouseLeave={onHoverLeave}
            >
              <div
                className={getHandleStyles('output', 'output')}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onConnectionStart(node.id, 'output', 'output', e);
                }}
                onMouseUp={() => onConnectionEnd(node.id, 'output', 'output')}
              />
            </div>
          )}
          
          {/* Condition node special handles */}
          {node.type === 'condition' && (
            <>
              <div 
                className="absolute -bottom-2 left-1/4 transform -translate-x-1/2"
                onMouseEnter={() => onHoverHandle(node.id, 'true', 'output')}
                onMouseLeave={onHoverLeave}
              >
                <div
                  className={getHandleStyles('output', 'true')}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onConnectionStart(node.id, 'true', 'output', e);
                  }}
                  onMouseUp={() => onConnectionEnd(node.id, 'true', 'output')}
                />
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-green-600 font-medium whitespace-nowrap">
                  Yes
                </span>
              </div>
              <div 
                className="absolute -bottom-2 right-1/4 transform translate-x-1/2"
                onMouseEnter={() => onHoverHandle(node.id, 'false', 'output')}
                onMouseLeave={onHoverLeave}
              >
                <div
                  className={getHandleStyles('output', 'false')}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onConnectionStart(node.id, 'false', 'output', e);
                  }}
                  onMouseUp={() => onConnectionEnd(node.id, 'false', 'output')}
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

EnhancedNodeRenderer.displayName = 'EnhancedNodeRenderer';
