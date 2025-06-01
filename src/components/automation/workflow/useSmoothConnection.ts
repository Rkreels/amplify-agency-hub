
import { useCallback, useState } from 'react';
import { WorkflowNode, WorkflowConnection } from '@/store/useWorkflowStore';

interface ConnectionPoint {
  x: number;
  y: number;
  nodeId: string;
  handleId: string;
  type: 'input' | 'output';
}

interface UseSmoothConnectionProps {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  onConnectionCreate: (connection: WorkflowConnection) => void;
  onConnectionDelete: (connectionId: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  canvasOffset: { x: number; y: number };
}

export const useSmoothConnection = ({
  nodes,
  connections,
  onConnectionCreate,
  onConnectionDelete,
  canvasRef,
  zoom,
  canvasOffset
}: UseSmoothConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<ConnectionPoint | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<{ x: number; y: number } | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<ConnectionPoint | null>(null);
  const [previewPath, setPreviewPath] = useState<string>('');

  // Calculate smooth bezier curve
  const calculateSmoothPath = useCallback((
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number,
    startType: 'input' | 'output' = 'output'
  ): string => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Control points for smooth S-curve
    const controlOffset = Math.min(Math.max(Math.abs(deltaY) * 0.5, 50), 200);
    
    let cp1X, cp1Y, cp2X, cp2Y;
    
    if (startType === 'output') {
      // Output handle - curve downward
      cp1X = startX;
      cp1Y = startY + controlOffset;
      cp2X = endX;
      cp2Y = endY - controlOffset;
    } else {
      // Input handle - curve upward
      cp1X = startX;
      cp1Y = startY - controlOffset;
      cp2X = endX;
      cp2Y = endY + controlOffset;
    }
    
    return `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
  }, []);

  // Get connection point for a node handle
  const getConnectionPoint = useCallback((
    nodeId: string, 
    handleId: string, 
    type: 'input' | 'output'
  ): ConnectionPoint | null => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const nodeWidth = 200;
    const nodeHeight = node.type === 'trigger' ? 100 : 80;
    
    let x = node.position.x + nodeWidth / 2;
    let y: number;
    
    if (type === 'output') {
      y = node.position.y + nodeHeight + 2;
      
      // Adjust for condition node handles
      if (node.type === 'condition') {
        if (handleId === 'true') {
          x = node.position.x + nodeWidth / 4;
        } else if (handleId === 'false') {
          x = node.position.x + (3 * nodeWidth) / 4;
        }
      }
    } else {
      y = node.position.y - 2;
    }
    
    return { x, y, nodeId, handleId, type };
  }, [nodes]);

  // Handle connection start
  const handleConnectionStart = useCallback((
    nodeId: string, 
    handleId: string, 
    type: 'input' | 'output',
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    
    const point = getConnectionPoint(nodeId, handleId, type);
    if (!point) return;
    
    setIsConnecting(true);
    setConnectionStart(point);
    setConnectionEnd({ x: point.x, y: point.y });
  }, [getConnectionPoint]);

  // Handle mouse move during connection
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isConnecting || !connectionStart || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - canvasOffset.x) / zoom;
    const y = (event.clientY - rect.top - canvasOffset.y) / zoom;
    
    setConnectionEnd({ x, y });
    
    // Calculate preview path
    const path = calculateSmoothPath(
      connectionStart.x,
      connectionStart.y,
      x,
      y,
      connectionStart.type
    );
    setPreviewPath(path);
  }, [isConnecting, connectionStart, canvasRef, canvasOffset, zoom, calculateSmoothPath]);

  // Handle connection end
  const handleConnectionEnd = useCallback((
    nodeId: string,
    handleId: string,
    type: 'input' | 'output'
  ) => {
    if (!isConnecting || !connectionStart) return;
    
    // Prevent self-connection
    if (connectionStart.nodeId === nodeId) {
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionEnd(null);
      setPreviewPath('');
      return;
    }
    
    // Create connection
    const newConnection: WorkflowConnection = {
      id: `${connectionStart.nodeId}-${nodeId}-${Date.now()}`,
      source: connectionStart.nodeId,
      target: nodeId,
      sourceHandle: connectionStart.handleId,
      targetHandle: handleId
    };
    
    onConnectionCreate(newConnection);
    
    // Reset state
    setIsConnecting(false);
    setConnectionStart(null);
    setConnectionEnd(null);
    setPreviewPath('');
  }, [isConnecting, connectionStart, onConnectionCreate]);

  // Handle mouse up to cancel connection
  const handleMouseUp = useCallback(() => {
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionEnd(null);
      setPreviewPath('');
    }
  }, [isConnecting]);

  // Render existing connections
  const renderConnections = useCallback(() => {
    return connections.map(connection => {
      const sourcePoint = getConnectionPoint(connection.source, connection.sourceHandle || 'output', 'output');
      const targetPoint = getConnectionPoint(connection.target, connection.targetHandle || 'input', 'input');
      
      if (!sourcePoint || !targetPoint) return null;
      
      const path = calculateSmoothPath(
        sourcePoint.x,
        sourcePoint.y,
        targetPoint.x,
        targetPoint.y,
        'output'
      );
      
      const strokeColor = connection.sourceHandle === 'true' ? '#10b981' :
                         connection.sourceHandle === 'false' ? '#ef4444' : '#6b7280';
      
      return {
        id: connection.id,
        path,
        strokeColor,
        connection,
        sourcePoint,
        targetPoint
      };
    }).filter(Boolean);
  }, [connections, getConnectionPoint, calculateSmoothPath]);

  return {
    isConnecting,
    connectionStart,
    connectionEnd,
    hoveredHandle,
    previewPath,
    handleConnectionStart,
    handleMouseMove,
    handleConnectionEnd,
    handleMouseUp,
    setHoveredHandle,
    renderConnections,
    calculateSmoothPath
  };
};
