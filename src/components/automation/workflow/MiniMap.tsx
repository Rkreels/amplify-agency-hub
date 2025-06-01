
import { useEffect, useRef, useState } from 'react';
import { WorkflowNode, WorkflowConnection } from '@/store/useWorkflowStore';

interface MiniMapProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: (offset: { x: number; y: number }) => void;
}

export function MiniMap({ 
  nodes, 
  connections,
  canvasRef,
  zoom,
  canvasOffset,
  setCanvasOffset
}: MiniMapProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mapBounds, setMapBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const miniMapRef = useRef<HTMLDivElement>(null);
  const miniMapDimensions = { width: 150, height: 100 };
  
  // Calculate map bounds based on all nodes
  useEffect(() => {
    if (nodes.length === 0) return;
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      const nodeWidth = 200;
      const nodeHeight = node.type === 'trigger' ? 100 : 80;
      
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
    });
    
    // Add padding
    const padding = 100;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    setMapBounds({ minX, maxX, minY, maxY });
  }, [nodes]);

  // Calculate viewport dimensions (in map coordinates)
  const viewportBounds = (() => {
    if (!canvasRef.current) return { x: 0, y: 0, width: 0, height: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const viewportWidth = rect.width / zoom;
    const viewportHeight = rect.height / zoom;
    
    // Calculate viewport position in workflow coordinates
    const viewportX = -canvasOffset.x / zoom;
    const viewportY = -canvasOffset.y / zoom;
    
    return { x: viewportX, y: viewportY, width: viewportWidth, height: viewportHeight };
  })();

  // Handle minimap dragging
  const handleMapMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateViewport(e);
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    updateViewport(e);
  };

  const handleMapMouseUp = () => {
    setIsDragging(false);
  };

  // Update viewport position based on minimap interaction
  const updateViewport = (e: React.MouseEvent) => {
    if (!miniMapRef.current || !canvasRef.current) return;
    
    const mapRect = miniMapRef.current.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // Get click position relative to minimap
    const relativeX = (e.clientX - mapRect.left) / mapRect.width;
    const relativeY = (e.clientY - mapRect.top) / mapRect.height;
    
    // Convert to workflow coordinates
    const mapWidth = mapBounds.maxX - mapBounds.minX;
    const mapHeight = mapBounds.maxY - mapBounds.minY;
    const targetX = mapBounds.minX + (relativeX * mapWidth);
    const targetY = mapBounds.minY + (relativeY * mapHeight);
    
    // Center viewport on that point
    const newOffsetX = -(targetX * zoom - canvasRect.width / 2);
    const newOffsetY = -(targetY * zoom - canvasRect.height / 2);
    
    setCanvasOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Scale node positions to minimap size
  const scaleToMiniMap = (x: number, y: number) => {
    const mapWidth = mapBounds.maxX - mapBounds.minX;
    const mapHeight = mapBounds.maxY - mapBounds.minY;
    
    if (mapWidth === 0 || mapHeight === 0) return { x: 0, y: 0 };
    
    const scaleX = miniMapDimensions.width / mapWidth;
    const scaleY = miniMapDimensions.height / mapHeight;
    
    return {
      x: (x - mapBounds.minX) * scaleX,
      y: (y - mapBounds.minY) * scaleY
    };
  };

  // Calculate viewport rectangle on minimap
  const viewportRect = (() => {
    const { x: viewX, y: viewY, width: viewW, height: viewH } = viewportBounds;
    const { x: scaledX, y: scaledY } = scaleToMiniMap(viewX, viewY);
    const { x: scaledRight, y: scaledBottom } = scaleToMiniMap(viewX + viewW, viewY + viewH);
    
    return {
      x: scaledX,
      y: scaledY,
      width: scaledRight - scaledX,
      height: scaledBottom - scaledY
    };
  })();

  return (
    <div 
      ref={miniMapRef}
      className="absolute bottom-4 left-4 bg-white border rounded shadow-lg z-30"
      style={{ width: miniMapDimensions.width, height: miniMapDimensions.height }}
      onMouseDown={handleMapMouseDown}
      onMouseMove={handleMapMouseMove}
      onMouseUp={handleMapMouseUp}
      onMouseLeave={handleMapMouseUp}
    >
      {/* Nodes */}
      {nodes.map(node => {
        const { x, y } = scaleToMiniMap(node.position.x, node.position.y);
        const width = node.type === 'trigger' ? 5 : 4;
        const height = node.type === 'trigger' ? 4 : 3;
        const color = node.type === 'trigger' ? 'bg-orange-500' : 
                      node.type === 'condition' ? 'bg-blue-500' : 'bg-gray-500';
        
        return (
          <div
            key={node.id}
            className={`absolute ${color} border-white border`}
            style={{
              left: x,
              top: y,
              width: width,
              height: height
            }}
          />
        );
      })}
      
      {/* Connections as thin lines */}
      <svg 
        className="absolute inset-0 pointer-events-none"
        width={miniMapDimensions.width}
        height={miniMapDimensions.height}
      >
        {connections.map(connection => {
          const sourceNode = nodes.find(n => n.id === connection.source);
          const targetNode = nodes.find(n => n.id === connection.target);
          
          if (!sourceNode || !targetNode) return null;
          
          const sourceWidth = 5;
          const sourceHeight = sourceNode.type === 'trigger' ? 4 : 3;
          const targetWidth = 4;
          const targetHeight = 3;
          
          const sourceCenter = scaleToMiniMap(
            sourceNode.position.x + 100, // Half of actual node width
            sourceNode.position.y + (sourceNode.type === 'trigger' ? 100 : 80) // Bottom of node
          );
          
          const targetCenter = scaleToMiniMap(
            targetNode.position.x + 100, // Half of actual node width
            targetNode.position.y // Top of node
          );
          
          return (
            <line
              key={connection.id}
              x1={sourceCenter.x}
              y1={sourceCenter.y}
              x2={targetCenter.x}
              y2={targetCenter.y}
              stroke="#6b7280"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
      
      {/* Viewport rectangle */}
      <div 
        className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10"
        style={{
          left: viewportRect.x,
          top: viewportRect.y,
          width: viewportRect.width,
          height: viewportRect.height
        }}
      />
    </div>
  );
}
