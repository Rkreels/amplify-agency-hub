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

import { EnhancedNodeRenderer } from './workflow/EnhancedNodeRenderer';
import { SmoothConnectionRenderer } from './workflow/SmoothConnectionRenderer';
import { useSmoothConnection } from './workflow/useSmoothConnection';
import { CanvasControls } from './workflow/CanvasControls';
import { MiniMap } from './workflow/MiniMap';
import { WorkflowValidationStatus } from './workflow/WorkflowValidationStatus';
import { EmptyWorkflowState } from './workflow/EmptyWorkflowState';

export function EnhancedWorkflowBuilder() {
  const {
    currentWorkflow,
    selectedNode,
    setSelectedNode,
    updateNode,
    addConnection,
    deleteConnection,
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
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Node interaction state
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);

  // Grid size for snapping
  const GRID_SIZE = 20;

  // Initialize smooth connection system
  const connectionSystem = useSmoothConnection({
    nodes: currentWorkflow?.nodes || [],
    connections: currentWorkflow?.connections || [],
    onConnectionCreate: addConnection,
    onConnectionDelete: deleteConnection,
    canvasRef,
    zoom,
    canvasOffset
  });

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

  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const node = currentWorkflow?.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggedNode(nodeId);
    setSelectedNode(nodeId);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left - canvasOffset.x) / zoom - node.position.x,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom - node.position.y
      });
    }
  }, [currentWorkflow, zoom, canvasOffset, setSelectedNode]);

  // Mouse handlers for canvas interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.metaKey)) {
      // Middle mouse or Cmd+click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      e.preventDefault();
    }
  }, [canvasOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Handle connection system mouse move
    connectionSystem.handleMouseMove(e);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggedNode) {
      const newPosition = snapToGridHelper({
        x: (e.clientX - rect.left - canvasOffset.x) / zoom - dragOffset.x,
        y: (e.clientY - rect.top - canvasOffset.y) / zoom - dragOffset.y
      });
      updateNodePosition(draggedNode, newPosition);
    }
  }, [
    connectionSystem, 
    isPanning, 
    draggedNode, 
    panStart, 
    zoom, 
    canvasOffset, 
    dragOffset, 
    updateNodePosition, 
    snapToGridHelper
  ]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggedNode(null);
    connectionSystem.handleMouseUp();
  }, [connectionSystem]);

  // Connection handlers
  const handleConnectionClick = useCallback((connectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedConnection === connectionId) {
      // Double click to delete
      deleteConnection(connectionId);
      setSelectedConnection(null);
      toast.success('Connection deleted');
    } else {
      setSelectedConnection(connectionId);
    }
  }, [selectedConnection, deleteConnection]);

  // Keyboard shortcuts
  useHotkeys('Delete', () => {
    if (selectedNode) {
      deleteNode(selectedNode);
    } else if (selectedConnection) {
      deleteConnection(selectedConnection);
      setSelectedConnection(null);
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

  // Calculate connections with smooth paths
  const connectionsWithPaths = useMemo(() => {
    if (!currentWorkflow) return [];
    
    return currentWorkflow.connections.map(connection => {
      const sourceNode = currentWorkflow.nodes.find(n => n.id === connection.source);
      const targetNode = currentWorkflow.nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      // Calculate connection points
      const sourcePos = getConnectionPoint(sourceNode, connection.sourceHandle || 'output', 'output');
      const targetPos = getConnectionPoint(targetNode, connection.targetHandle || 'input', 'input');
      
      // Calculate smooth path
      const path = connectionSystem.calculateSmoothPath(
        sourcePos.x, 
        sourcePos.y, 
        targetPos.x, 
        targetPos.y, 
        'output'
      );
      
      return {
        connection,
        path,
        sourcePos,
        targetPos
      };
    }).filter(Boolean);
  }, [currentWorkflow, connectionSystem]);

  // Helper function to get connection point
  const getConnectionPoint = useCallback((
    node: WorkflowNode, 
    handle: string, 
    type: 'input' | 'output'
  ) => {
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
    } else if (type === 'output') {
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

  // Render empty state if no workflow
  if (!currentWorkflow) {
    return <EmptyWorkflowState />;
  }

  const hasNodes = currentWorkflow.nodes && currentWorkflow.nodes.length > 0;

  return (
    <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Enhanced Grid background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0),
            linear-gradient(to right, #f3f4f6 1px, transparent 1px),
            linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
          backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
        }}
      />

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="relative h-full w-full cursor-default select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
        }}
        onClick={() => {
          setSelectedNode(null);
          setSelectedConnection(null);
        }}
      >
        {/* Render Nodes */}
        {hasNodes && currentWorkflow.nodes.map((node) => (
          <EnhancedNodeRenderer
            key={node.id}
            node={node}
            isSelected={selectedNode === node.id}
            isHovered={hoveredNode === node.id}
            isDragging={draggedNode === node.id}
            zoom={zoom}
            onNodeMouseDown={handleNodeMouseDown}
            onConnectionStart={connectionSystem.handleConnectionStart}
            onConnectionEnd={connectionSystem.handleConnectionEnd}
            onHoverHandle={connectionSystem.handleHoverHandle}
            onHoverLeave={connectionSystem.handleHoverLeave}
            openConfigModal={openConfigModal}
            duplicateNode={duplicateNode}
            deleteNode={deleteNode}
            setSelectedNode={setSelectedNode}
            isConnecting={connectionSystem.isConnecting}
            hoveredHandle={connectionSystem.hoveredHandle}
          />
        ))}
      </div>

      {/* Connections SVG Overlay */}
      <SmoothConnectionRenderer
        svgRef={useRef<SVGSVGElement>(null)}
        connections={connectionsWithPaths}
        selectedConnection={selectedConnection}
        isConnecting={connectionSystem.isConnecting}
        previewPath={connectionSystem.previewPath}
        onConnectionClick={handleConnectionClick}
        zoom={zoom}
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
          className="bg-white/90 backdrop-blur shadow-lg hover:bg-white"
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      {/* Status indicators */}
      {selectedConnection && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connection selected</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Click again to delete
          </div>
        </div>
      )}
    </div>
  );
}
