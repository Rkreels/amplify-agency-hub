
import { useState, useCallback, useRef } from 'react';

interface UseSmoothConnectionProps {
  nodes: any[];
  connections: any[];
  onConnectionCreate: (connection: any) => void;
  onConnectionDelete: (connectionId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  canvasOffset: { x: number; y: number };
}

export function useSmoothConnection({
  nodes,
  connections,
  onConnectionCreate,
  onConnectionDelete,
  canvasRef,
  zoom,
  canvasOffset
}: UseSmoothConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{
    nodeId: string;
    handleId: string;
    type: 'input' | 'output';
  } | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<{
    nodeId: string;
    handleId: string;
    type: 'input' | 'output';
  } | null>(null);
  const [previewPath, setPreviewPath] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const calculateSmoothPath = useCallback((
    x1: number, 
    y1: number, 
    x2: number, 
    y2: number, 
    type: 'input' | 'output'
  ) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const offsetY = Math.abs(dy) * 0.3;
    
    const cp1x = x1;
    const cp1y = y1 + offsetY;
    const cp2x = x2;
    const cp2y = y2 - offsetY;
    
    return `M ${x1} ${y1} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`;
  }, []);

  const handleConnectionStart = useCallback((
    nodeId: string, 
    handleId: string, 
    type: 'input' | 'output', 
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart({ nodeId, handleId, type });
  }, []);

  const handleConnectionEnd = useCallback((
    nodeId: string, 
    handleId: string, 
    type: 'input' | 'output'
  ) => {
    if (connectionStart && connectionStart.nodeId !== nodeId) {
      const newConnection = {
        id: `connection-${Date.now()}`,
        source: connectionStart.type === 'output' ? connectionStart.nodeId : nodeId,
        target: connectionStart.type === 'output' ? nodeId : connectionStart.nodeId,
        sourceHandle: connectionStart.type === 'output' ? connectionStart.handleId : handleId,
        targetHandle: connectionStart.type === 'output' ? handleId : connectionStart.handleId
      };
      
      onConnectionCreate(newConnection);
    }
    
    setIsConnecting(false);
    setConnectionStart(null);
    setPreviewPath(null);
  }, [connectionStart, onConnectionCreate]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = (e.clientX - rect.left - canvasOffset.x) / zoom;
    const mouseY = (e.clientY - rect.top - canvasOffset.y) / zoom;
    setMousePosition({ x: mouseX, y: mouseY });

    if (isConnecting && connectionStart) {
      const sourceNode = nodes.find(n => n.id === connectionStart.nodeId);
      if (sourceNode) {
        const sourceX = sourceNode.position.x + 100;
        const sourceY = sourceNode.position.y + (connectionStart.type === 'output' ? 80 : 0);
        
        const path = calculateSmoothPath(sourceX, sourceY, mouseX, mouseY, 'output');
        setPreviewPath(path);
      }
    }
  }, [isConnecting, connectionStart, nodes, canvasRef, zoom, canvasOffset, calculateSmoothPath]);

  const handleMouseUp = useCallback(() => {
    setIsConnecting(false);
    setConnectionStart(null);
    setPreviewPath(null);
  }, []);

  const handleHoverHandle = useCallback((
    nodeId: string, 
    handleId: string, 
    type: 'input' | 'output'
  ) => {
    setHoveredHandle({ nodeId, handleId, type });
  }, []);

  const handleHoverLeave = useCallback(() => {
    setHoveredHandle(null);
  }, []);

  return {
    isConnecting,
    connectionStart,
    hoveredHandle,
    previewPath,
    mousePosition,
    calculateSmoothPath,
    handleConnectionStart,
    handleConnectionEnd,
    handleMouseMove,
    handleMouseUp,
    handleHoverHandle,
    handleHoverLeave
  };
}
