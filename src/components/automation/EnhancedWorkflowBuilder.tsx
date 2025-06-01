
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
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
import { NodeRenderer } from './workflow/NodeRenderer';
import { ConnectionRenderer } from './workflow/ConnectionRenderer';
import { CanvasControls } from './workflow/CanvasControls';
import { WorkflowValidationStatus } from './workflow/WorkflowValidationStatus';
import { EmptyWorkflowState } from './workflow/EmptyWorkflowState';
import { MiniMap } from './workflow/MiniMap';
import { useHotkeys } from '@/hooks/useHotkeys';

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
    validateWorkflow,
    moveWorkflowNodes
  } = useWorkflowStore();

  // Enhanced canvas state management
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
  const [multiSelect, setMultiSelect] = useState<{ active: boolean; nodes: string[] }>({ active: false, nodes: [] });
  const [selectionBox, setSelectionBox] = useState<{ active: boolean; start: { x: number, y: number }, end: { x: number, y: number } }>({
    active: false,
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 }
  });
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Get nodes within the current view
  const visibleNodes = useMemo(() => {
    if (!currentWorkflow || !canvasRef.current) return [];
    
    const rect = canvasRef.current.getBoundingClientRect();
    const viewportWidth = rect.width / zoom;
    const viewportHeight = rect.height / zoom;
    const viewportLeft = -canvasOffset.x / zoom;
    const viewportTop = -canvasOffset.y / zoom;
    
    return currentWorkflow.nodes.filter(node => {
      return (
        node.position.x + 200 >= viewportLeft &&
        node.position.x <= viewportLeft + viewportWidth &&
        node.position.y + 100 >= viewportTop &&
        node.position.y <= viewportTop + viewportHeight
      );
    });
  }, [currentWorkflow, canvasOffset, zoom]);

  // Calculate connection paths for better performance
  const connectionPaths = useMemo(() => {
    if (!currentWorkflow) return [];
    
    return currentWorkflow.connections.map(connection => {
      const sourceNode = currentWorkflow.nodes.find(n => n.id === connection.source);
      const targetNode = currentWorkflow.nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourcePos = getNodeConnectionPoint(sourceNode, connection.sourceHandle || 'output');
      const targetPos = getNodeConnectionPoint(targetNode, connection.targetHandle || 'input');
      
      return {
        connection,
        path: calculateConnectionPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y, connection.sourceHandle),
        sourcePos,
        targetPos
      };
    }).filter(Boolean);
  }, [currentWorkflow]);

  // Handle mouse move for all drag operations with improved performance
  const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newMousePosition = {
      x: (e.clientX - rect.left - canvasOffset.x) / zoom,
      y: (e.clientY - rect.top - canvasOffset.y) / zoom
    };
    
    setMousePosition(newMousePosition);

    // Handle node dragging
    if (dragState.isDragging && dragState.dragType === 'node') {
      e.preventDefault();
      
      const deltaX = newMousePosition.x - dragState.startPosition.x;
      const deltaY = newMousePosition.y - dragState.startPosition.y;
      
      if (dragState.draggedNodeId) {
        // Single node drag
        let newX = dragState.currentPosition.x + deltaX;
        let newY = dragState.currentPosition.y + deltaY;
        
        // Apply grid snapping if enabled
        if (snapToGrid) {
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }
        
        updateNode(dragState.draggedNodeId, {
          position: { x: newX, y: newY }
        });
      } else if (multiSelect.active && multiSelect.nodes.length > 0) {
        // Multi-select drag
        const nodesToUpdate = currentWorkflow?.nodes.filter(n => multiSelect.nodes.includes(n.id)) || [];
        
        const updates = nodesToUpdate.map(node => {
          let newX = node.position.x + deltaX;
          let newY = node.position.y + deltaY;
          
          // Apply grid snapping if enabled
          if (snapToGrid) {
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;
          }
          
          return {
            id: node.id,
            position: { x: newX, y: newY }
          };
        });
        
        moveWorkflowNodes(updates);
        
        // Update drag start position for next frame
        setDragState(prev => ({
          ...prev,
          startPosition: newMousePosition
        }));
      }
    }

    // Handle canvas panning with improved performance
    if (dragState.isDragging && dragState.dragType === 'canvas') {
      e.preventDefault();
      
      const deltaX = e.clientX - dragState.startPosition.x;
      const deltaY = e.clientY - dragState.startPosition.y;
      
      setCanvasOffset({
        x: dragState.currentPosition.x + deltaX,
        y: dragState.currentPosition.y + deltaY
      });
    }

    // Handle selection box
    if (selectionBox.active) {
      e.preventDefault();
      
      setSelectionBox(prev => ({
        ...prev,
        end: {
          x: newMousePosition.x,
          y: newMousePosition.y
        }
      }));
      
      // Select nodes within box
      if (currentWorkflow) {
        const minX = Math.min(selectionBox.start.x, newMousePosition.x);
        const maxX = Math.max(selectionBox.start.x, newMousePosition.x);
        const minY = Math.min(selectionBox.start.y, newMousePosition.y);
        const maxY = Math.max(selectionBox.start.y, newMousePosition.y);
        
        const selectedNodes = currentWorkflow.nodes
          .filter(node => {
            const nodeRight = node.position.x + 200;
            const nodeBottom = node.position.y + (node.type === 'trigger' ? 100 : 80);
            
            return (
              node.position.x < maxX &&
              nodeRight > minX &&
              node.position.y < maxY &&
              nodeBottom > minY
            );
          })
          .map(node => node.id);
        
        if (selectedNodes.length > 0) {
          setMultiSelect({
            active: true,
            nodes: selectedNodes
          });
        } else if (multiSelect.active) {
          setMultiSelect({ active: false, nodes: [] });
        }
      }
    }
  }, [dragState, canvasOffset, zoom, updateNode, snapToGrid, gridSize, multiSelect, currentWorkflow, selectionBox, moveWorkflowNodes]);

  // Handle mouse up for all drag operations
  const handleMouseUp = useCallback((e: MouseEvent) => {
    // End the selection box
    if (selectionBox.active) {
      setSelectionBox({
        active: false,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 }
      });
    }
    
    setDragState({
      isDragging: false,
      dragType: null,
      draggedNodeId: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 }
    });
    
    setConnecting(null);
    setHoveredHandle(null);
  }, [selectionBox.active]);

  // Handle node mouse down
  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.stopPropagation();
    
    const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
    if (!node) return;

    if (!canvasRef.current) return;
    
    // Check if we're in multi-select mode (Shift key)
    if (e.shiftKey) {
      setMultiSelect(prev => {
        const isSelected = prev.nodes.includes(nodeId);
        return {
          active: true,
          nodes: isSelected 
            ? prev.nodes.filter(id => id !== nodeId) 
            : [...prev.nodes, nodeId]
        };
      });
      setSelectedNode(nodeId);
      return;
    }
    
    // If we click on a node that's not in the multi-select, clear multi-select
    if (multiSelect.active && !multiSelect.nodes.includes(nodeId)) {
      setMultiSelect({ active: false, nodes: [] });
    }

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
  }, [currentWorkflow, canvasOffset, zoom, setSelectedNode, multiSelect.active, multiSelect.nodes]);

  // Handle canvas mouse down for panning and selection box
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    
    // Handle selection box (if Alt key is pressed)
    if (e.altKey) {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: (e.clientX - rect.left - canvasOffset.x) / zoom,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom
      };
      
      setSelectionBox({
        active: true,
        start: position,
        end: position
      });
      
      // Clear selections
      setSelectedNode(null);
      setSelectedConnection(null);
      setMultiSelect({ active: false, nodes: [] });
      return;
    }
    
    // Middle click or space+click for panning
    if (e.button === 1 || e.ctrlKey) {
      e.preventDefault();
      
      setDragState({
        isDragging: true,
        dragType: 'canvas',
        draggedNodeId: null,
        startPosition: { x: e.clientX, y: e.clientY },
        currentPosition: canvasOffset
      });
      return;
    }
    
    // Normal click - just clear selections
    if (!e.shiftKey) {
      setSelectedNode(null);
      setSelectedConnection(null);
      setMultiSelect({ active: false, nodes: [] });
    }
  }, [canvasOffset, zoom, setSelectedNode, setSelectedConnection]);

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
    // Calculate horizontal and vertical distance
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Adjust control points based on distance
    let controlPointOffset = Math.min(distance * 0.4, 150);
    
    // Special handling for close nodes
    if (distance < 100) {
      controlPointOffset = distance * 0.8;
    }
    
    let cp1X, cp1Y, cp2X, cp2Y;
    
    if (sourceHandle === 'true' || sourceHandle === 'false') {
      // For condition branches, create angled paths
      cp1X = sourceX + (deltaX * 0.25);
      cp1Y = sourceY + (controlPointOffset * 0.5);
      cp2X = sourceX + (deltaX * 0.75);
      cp2Y = targetY - (controlPointOffset * 0.5);
    } else if (Math.abs(deltaY) < 50 && Math.abs(deltaX) > 200) {
      // For nearly horizontal connections, make a straighter line
      cp1X = sourceX + (deltaX * 0.3);
      cp1Y = sourceY;
      cp2X = targetX - (deltaX * 0.3);
      cp2Y = targetY;
    } else {
      // Standard vertical flow with improved curvature
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
    toast.success('Workflow test started');
  }, [validateWorkflow, testWorkflow]);

  // Fit view to show all nodes
  const fitView = useCallback(() => {
    if (!currentWorkflow || !canvasRef.current || currentWorkflow.nodes.length === 0) return;
    
    const padding = 100;
    const rect = canvasRef.current.getBoundingClientRect();
    
    // Find bounds of all nodes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    currentWorkflow.nodes.forEach(node => {
      const nodeWidth = 200;
      const nodeHeight = node.type === 'trigger' ? 100 : 80;
      
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });
    
    // Calculate zoom level and offset
    const contentWidth = maxX - minX + (padding * 2);
    const contentHeight = maxY - minY + (padding * 2);
    
    const zoomX = rect.width / contentWidth;
    const zoomY = rect.height / contentHeight;
    const newZoom = Math.min(Math.min(zoomX, zoomY), 1);
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    const offsetX = (rect.width / 2 / newZoom) - centerX;
    const offsetY = (rect.height / 2 / newZoom) - centerY;
    
    setZoom(newZoom);
    setCanvasOffset({ x: offsetX * newZoom, y: offsetY * newZoom });
  }, [currentWorkflow]);

  // Register keyboard shortcuts
  useHotkeys('delete', () => {
    if (selectedNode) {
      deleteNode(selectedNode);
    } else if (selectedConnection) {
      deleteConnection(selectedConnection);
    }
  }, [selectedNode, selectedConnection]);

  useHotkeys('ctrl+d', (e) => {
    e.preventDefault();
    if (selectedNode) {
      duplicateNode(selectedNode);
    }
  }, [selectedNode]);

  useHotkeys('ctrl+c', (e) => {
    e.preventDefault();
    if (selectedNode) {
      toast.info('Node copied to clipboard');
    }
  }, [selectedNode]);

  useHotkeys('escape', () => {
    setSelectedNode(null);
    setSelectedConnection(null);
    setConnecting(null);
    setMultiSelect({ active: false, nodes: [] });
  }, []);

  useHotkeys('f', () => {
    fitView();
  }, [fitView]);

  useHotkeys('g', () => {
    setSnapToGrid(!snapToGrid);
    toast.info(snapToGrid ? 'Grid snapping disabled' : 'Grid snapping enabled');
  }, [snapToGrid]);

  useHotkeys('m', () => {
    setShowMiniMap(!showMiniMap);
  }, [showMiniMap]);

  // Global event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      handleMouseUp(e);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key for panning (when held down)
      if (e.code === 'Space' && !dragState.isDragging) {
        document.body.style.cursor = 'grab';
      }
      
      // Prevent browser zoom
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-')) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        document.body.style.cursor = '';
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = '';
    };
  }, [handleMouseMove, handleMouseUp, dragState.isDragging]);

  // Auto-fit view when workflow changes or on first load
  useEffect(() => {
    if (currentWorkflow?.nodes.length && !canvasOffset.x && !canvasOffset.y) {
      fitView();
    }
  }, [currentWorkflow?.id, fitView, canvasOffset.x, canvasOffset.y]);

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
          style={{
            cursor: dragState.dragType === 'canvas' ? 'grabbing' : 
                  connecting ? 'crosshair' : 
                  selectionBox.active ? 'crosshair' : 'default',
            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove as any}
        >
          {/* Render connection lines */}
          <ConnectionRenderer 
            svgRef={svgRef}
            connections={connectionPaths} 
            selectedConnection={selectedConnection}
            connecting={connecting}
            mousePosition={mousePosition}
            currentWorkflow={currentWorkflow}
            getNodeConnectionPoint={getNodeConnectionPoint}
            calculateConnectionPath={calculateConnectionPath}
            setSelectedConnection={setSelectedConnection}
          />
          
          {/* Render nodes */}
          {currentWorkflow?.nodes.map(node => (
            <NodeRenderer
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id || (multiSelect.active && multiSelect.nodes.includes(node.id))}
              isHovered={hoveredNode === node.id}
              isDragging={dragState.draggedNodeId === node.id}
              zoom={zoom}
              hoveredHandle={hoveredHandle}
              connecting={connecting}
              handleNodeMouseDown={handleNodeMouseDown}
              handleConnectionStart={handleConnectionStart}
              handleConnectionEnd={handleConnectionEnd}
              setHoveredNode={setHoveredNode}
              setHoveredHandle={setHoveredHandle}
              openConfigModal={openConfigModal}
              duplicateNode={duplicateNode}
              deleteNode={deleteNode}
              setSelectedNode={setSelectedNode}
            />
          ))}
          
          {/* Selection box */}
          {selectionBox.active && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10 pointer-events-none z-10"
              style={{
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                height: Math.abs(selectionBox.end.y - selectionBox.start.y),
                transform: `scale(${zoom})`
              }}
            />
          )}
          
          {/* Empty state */}
          {!hasTrigger && <EmptyWorkflowState />}
          
          {/* Selection indicator */}
          {selectedConnection && (
            <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-30">
              Connection selected - Press Delete to remove
            </div>
          )}

          {/* Multi-select indicator */}
          {multiSelect.active && multiSelect.nodes.length > 0 && (
            <div className="absolute top-4 left-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm z-30">
              {multiSelect.nodes.length} nodes selected
            </div>
          )}
        </div>
        
        {/* Canvas controls */}
        <CanvasControls
          zoom={zoom}
          setZoom={setZoom}
          canvasOffset={canvasOffset}
          setCanvasOffset={setCanvasOffset}
          fitView={fitView}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          showMiniMap={showMiniMap}
          setShowMiniMap={setShowMiniMap}
        />
        
        {/* Quick actions */}
        <div className="absolute top-4 right-4 flex space-x-2 z-30">
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

        {/* Mini-map */}
        {showMiniMap && currentWorkflow && currentWorkflow.nodes.length > 0 && (
          <MiniMap
            nodes={currentWorkflow.nodes}
            connections={currentWorkflow.connections}
            canvasRef={canvasRef}
            zoom={zoom}
            canvasOffset={canvasOffset}
            setCanvasOffset={setCanvasOffset}
          />
        )}
      </div>
    </div>
  );
}
