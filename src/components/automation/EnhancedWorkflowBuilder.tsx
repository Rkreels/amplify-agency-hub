import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { WorkflowNode, WorkflowConnection, useWorkflowStore } from '@/store/useWorkflowStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHotkeys } from '@/hooks/useHotkeys';
import { toast } from 'sonner';
import { 
  Trash2, 
  Copy, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut, 
  Move,
  Save,
  Grid
} from 'lucide-react';

import { NodeRenderer } from './workflow/NodeRenderer';
import { ConnectionRenderer } from './workflow/ConnectionRenderer';
import { CanvasControls } from './workflow/CanvasControls';
import { MiniMap } from './workflow/MiniMap';
import { WorkflowValidationStatus } from './workflow/WorkflowValidationStatus';
import { EmptyWorkflowState } from './workflow/EmptyWorkflowState';

interface ConnectionPath {
  d: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

interface ConnectionData {
  connection: WorkflowConnection;
  path: ConnectionPath;
  sourcePos: { x: number; y: number; };
  targetPos: { x: number; y: number; };
}

export function EnhancedWorkflowBuilder() {
  const {
    currentWorkflow,
    selectedNode,
    setSelectedNode,
    updateNode,
    addConnection,
    deleteNode,
    duplicateNode,
    openConfigModal,
    saveWorkflow
  } = useWorkflowStore();

  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Node interaction state
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<{ nodeId: string; type: 'input' | 'output'; handle?: string } | null>(null);

  // Connection state
  const [connecting, setConnecting] = useState<{ sourceId: string; sourceHandle?: string } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Grid size for snapping
  const GRID_SIZE = 20;

  const snapToGridHelper = useCallback((position: { x: number; y: number }) => {
    if (!snapToGrid) return position;
    return {
      x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
    };
  }, [snapToGrid]);

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
    if (node) {
      updateNode(nodeId, { ...node, position });
    }
  }, [currentWorkflow, updateNode]);

  const getNodeConnectionPoint = useCallback((node: WorkflowNode, handle?: string) => {
    const nodeWidth = 200;
    const nodeHeight = node.type === 'trigger' ? 100 : 80;
    
    if (handle === 'true') {
      return {
        x: node.position.x + nodeWidth / 4,
        y: node.position.y + nodeHeight + 2
      };
    } else if (handle === 'false') {
      return {
        x: node.position.x + (3 * nodeWidth) / 4,
        y: node.position.y + nodeHeight + 2
      };
    } else if (handle === 'output' || !handle) {
      return {
        x: node.position.x + nodeWidth / 2,
        y: node.position.y + nodeHeight + 2
      };
    } else {
      // input handle
      return {
        x: node.position.x + nodeWidth / 2,
        y: node.position.y - 2
      };
    }
  }, []);

  const calculateConnectionPath = useCallback((sourceX: number, sourceY: number, targetX: number, targetY: number, sourceHandle?: string): ConnectionPath => {
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    
    // Control points for smooth curves
    const controlPoint1X = sourceX;
    const controlPoint1Y = sourceY + Math.max(50, Math.abs(deltaY) * 0.3);
    const controlPoint2X = targetX;
    const controlPoint2Y = targetY - Math.max(50, Math.abs(deltaY) * 0.3);
    
    // Create smooth bezier curve
    const path = `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;
    
    return {
      d: path,
      sourceX,
      sourceY,
      targetX,
      targetY
    };
  }, []);

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left) / zoom - node.position.x,
        y: (e.clientY - rect.top) / zoom - node.position.y
      });
    }
  }, [currentWorkflow, zoom, setSelectedNode]);

  const handleConnectionStart = useCallback((sourceId: string, sourceHandle?: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    console.log('Starting connection from:', sourceId, sourceHandle);
    setConnecting({ sourceId, sourceHandle });
  }, []);

  const handleConnectionEnd = useCallback((targetId: string, targetHandle?: string) => {
    if (!connecting || connecting.sourceId === targetId) {
      setConnecting(null);
      return;
    }

    console.log('Ending connection to:', targetId, targetHandle);
    
    const connectionId = `${connecting.sourceId}-${targetId}-${Date.now()}`;
    const newConnection: WorkflowConnection = {
      id: connectionId,
      source: connecting.sourceId,
      target: targetId,
      sourceHandle: connecting.sourceHandle || 'output',
      targetHandle: targetHandle || 'input'
    };

    addConnection(newConnection);
    setConnecting(null);
    toast.success('Connection created');
  }, [connecting, addConnection]);

  // Mouse handlers for canvas interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.metaKey)) {
      // Middle mouse or Cmd+click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      e.preventDefault();
    } else if (e.button === 0) {
      // Left click for selection
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setIsSelecting(true);
        setSelectionBox({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          width: 0,
          height: 0
        });
      }
    }
  }, [canvasOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setMousePosition({
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    });

    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (isSelecting && !draggedNode) {
      setSelectionBox(prev => ({
        ...prev,
        width: e.clientX - rect.left - prev.x,
        height: e.clientY - rect.top - prev.y
      }));
    } else if (draggedNode) {
      const newPosition = snapToGridHelper({
        x: (e.clientX - rect.left) / zoom - dragOffset.x,
        y: (e.clientY - rect.top) / zoom - dragOffset.y
      });
      updateNodePosition(draggedNode, newPosition);
    }
  }, [isPanning, isSelecting, draggedNode, panStart, zoom, dragOffset, updateNodePosition, snapToGridHelper]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsSelecting(false);
    setDraggedNode(null);
    setConnecting(null);
    setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
  }, []);

  // Keyboard shortcuts
  useHotkeys('Delete', () => {
    if (selectedNode) {
      deleteNode(selectedNode);
    }
  });

  useHotkeys('cmd+c,ctrl+c', () => {
    if (selectedNode) {
      duplicateNode(selectedNode);
    }
  });

  useHotkeys('cmd+s,ctrl+s', (e) => {
    e.preventDefault();
    saveWorkflow();
  });

  // Fit view function
  const fitView = useCallback(() => {
    if (!currentWorkflow?.nodes.length) return;

    const padding = 50;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const minX = Math.min(...currentWorkflow.nodes.map(n => n.position.x)) - padding;
    const minY = Math.min(...currentWorkflow.nodes.map(n => n.position.y)) - padding;
    const maxX = Math.max(...currentWorkflow.nodes.map(n => n.position.x + 200)) + padding;
    const maxY = Math.max(...currentWorkflow.nodes.map(n => n.position.y + 100)) + padding;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const scaleX = canvasRect.width / contentWidth;
    const scaleY = canvasRect.height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    setZoom(scale);
    setCanvasOffset({
      x: (canvasRect.width - contentWidth * scale) / 2 - minX * scale,
      y: (canvasRect.height - contentHeight * scale) / 2 - minY * scale
    });
  }, [currentWorkflow?.nodes]);

  // Calculate connections with paths
  const connectionsWithPaths = useMemo((): (ConnectionData | null)[] => {
    if (!currentWorkflow) return [];
    
    return currentWorkflow.connections.map(connection => {
      const sourceNode = currentWorkflow.nodes.find(n => n.id === connection.source);
      const targetNode = currentWorkflow.nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourcePos = getNodeConnectionPoint(sourceNode, connection.sourceHandle);
      const targetPos = getNodeConnectionPoint(targetNode, connection.targetHandle);
      
      return {
        connection,
        path: calculateConnectionPath(sourcePos.x, sourcePos.y, targetPos.x, targetPos.y, connection.sourceHandle),
        sourcePos,
        targetPos
      };
    });
  }, [currentWorkflow, getNodeConnectionPoint, calculateConnectionPath]);

  // Render empty state if no workflow
  if (!currentWorkflow) {
    return <EmptyWorkflowState />;
  }

  const hasNodes = currentWorkflow.nodes && currentWorkflow.nodes.length > 0;

  return (
    <div className="relative h-full bg-gray-50 overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
          backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
        }}
      />

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="relative h-full w-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`
        }}
      >
        {/* Nodes */}
        {hasNodes && currentWorkflow.nodes.map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isHovered={hoveredNode === node.id}
            isDragging={draggedNode === node.id}
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
        {isSelecting && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 pointer-events-none"
            style={{
              left: selectionBox.x,
              top: selectionBox.y,
              width: Math.abs(selectionBox.width),
              height: Math.abs(selectionBox.height)
            }}
          />
        )}
      </div>

      {/* Connections SVG Overlay */}
      <ConnectionRenderer
        svgRef={svgRef}
        connections={connectionsWithPaths}
        selectedConnection={selectedConnection}
        connecting={connecting}
        mousePosition={mousePosition}
        currentWorkflow={currentWorkflow}
        getNodeConnectionPoint={getNodeConnectionPoint}
        calculateConnectionPath={calculateConnectionPath}
        setSelectedConnection={setSelectedConnection}
      />

      {/* Workflow Status */}
      <WorkflowValidationStatus />

      {/* Canvas Controls */}
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

      {/* Mini Map */}
      {showMiniMap && hasNodes && (
        <MiniMap
          nodes={currentWorkflow.nodes}
          connections={currentWorkflow.connections}
          canvasOffset={canvasOffset}
          zoom={zoom}
          setCanvasOffset={setCanvasOffset}
          canvasRef={canvasRef}
        />
      )}

      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex space-x-2 z-20">
        <Button
          size="sm"
          variant="outline"
          onClick={saveWorkflow}
          className="bg-white"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      {/* Selection Info */}
      {selectedNodes.length > 1 && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-lg border">
          <span className="text-sm text-gray-600">
            {selectedNodes.length} nodes selected
          </span>
        </div>
      )}
    </div>
  );
}
