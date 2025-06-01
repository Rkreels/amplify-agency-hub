import { useCallback } from 'react';
import { WorkflowNode, WorkflowConnection } from '@/store/useWorkflowStore';

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

interface ConnectionRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
  connections: (ConnectionData | null)[];
  selectedConnection: string | null;
  connecting: { sourceId: string; sourceHandle?: string; } | null;
  mousePosition: { x: number; y: number; };
  currentWorkflow: {
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  } | null;
  getNodeConnectionPoint: (node: WorkflowNode, handle?: string) => { x: number; y: number; };
  calculateConnectionPath: (sourceX: number, sourceY: number, targetX: number, targetY: number, sourceHandle?: string) => ConnectionPath;
  setSelectedConnection: (connectionId: string | null) => void;
}

export const ConnectionRenderer = ({
  svgRef,
  connections,
  selectedConnection,
  connecting,
  mousePosition,
  currentWorkflow,
  getNodeConnectionPoint,
  calculateConnectionPath,
  setSelectedConnection
}: ConnectionRendererProps) => {

  const handleConnectionClick = useCallback((e: React.MouseEvent, connectionId: string) => {
    e.stopPropagation();
    setSelectedConnection(connectionId);
  }, [setSelectedConnection]);

  return (
    <svg 
      ref={svgRef}
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: '100%', height: '100%', zIndex: 1 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          fill="#6b7280"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
        <marker
          id="arrowhead-selected"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          fill="#3b82f6"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
        <marker
          id="arrowhead-success"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          fill="#10b981"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
        <marker
          id="arrowhead-error"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
          fill="#ef4444"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
        
        {/* Glow effect for selected connection */}
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Existing connections */}
      {connections.map((connection) => {
        if (!connection) return null;
        
        const isSelected = selectedConnection === connection.connection.id;
        const strokeColor = isSelected ? "#3b82f6" : 
                          connection.connection.sourceHandle === 'true' ? "#10b981" :
                          connection.connection.sourceHandle === 'false' ? "#ef4444" : "#6b7280";
        const markerEnd = isSelected ? "url(#arrowhead-selected)" :
                        connection.connection.sourceHandle === 'true' ? "url(#arrowhead-success)" :
                        connection.connection.sourceHandle === 'false' ? "url(#arrowhead-error)" : "url(#arrowhead)";
        
        return (
          <g key={connection.connection.id}>
            {/* Shadow/glow effect for selected */}
            {isSelected && (
              <path
                d={connection.path.d}
                stroke="#3b82f6"
                strokeWidth="6"
                strokeOpacity="0.3"
                fill="none"
                filter="url(#glow)"
              />
            )}
            
            <path
              d={connection.path.d}
              stroke={strokeColor}
              strokeWidth={isSelected ? "3" : "2"}
              fill="none"
              markerEnd={markerEnd}
              className={`transition-colors duration-200 ${isSelected ? 'animate-pulse' : ''}`}
              style={{ pointerEvents: 'stroke' }}
              onClick={(e) => handleConnectionClick(e, connection.connection.id)}
            />
            
            {/* Animated flow along the path */}
            {isSelected && (
              <circle r="3" fill="#3b82f6">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={connection.path.d}
                />
              </circle>
            )}
            
            {connection.connection.label && (
              <text
                x={(connection.sourcePos.x + connection.targetPos.x) / 2}
                y={(connection.sourcePos.y + connection.targetPos.y) / 2 - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium drop-shadow"
                style={{ fontSize: '12px', pointerEvents: 'none' }}
              >
                {connection.connection.label}
              </text>
            )}
            
            {/* Connection labels for condition branches */}
            {connection.connection.sourceHandle === 'true' && (
              <text
                x={connection.sourcePos.x + 20}
                y={connection.sourcePos.y + 15}
                className="text-xs fill-green-600 font-medium drop-shadow"
                style={{ fontSize: '11px', pointerEvents: 'none' }}
              >
                Yes
              </text>
            )}
            {connection.connection.sourceHandle === 'false' && (
              <text
                x={connection.sourcePos.x - 20}
                y={connection.sourcePos.y + 15}
                className="text-xs fill-red-600 font-medium drop-shadow"
                style={{ fontSize: '11px', pointerEvents: 'none' }}
              >
                No
              </text>
            )}
          </g>
        );
      })}
      
      {/* Temporary connection line */}
      {connecting && currentWorkflow && (
        <path
          d={calculateConnectionPath(
            getNodeConnectionPoint(
              currentWorkflow.nodes.find(n => n.id === connecting.sourceId)!, 
              connecting.sourceHandle || 'output'
            ).x,
            getNodeConnectionPoint(
              currentWorkflow.nodes.find(n => n.id === connecting.sourceId)!, 
              connecting.sourceHandle || 'output'
            ).y,
            mousePosition.x,
            mousePosition.y,
            connecting.sourceHandle
          ).d}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          className="pointer-events-none animate-pulse"
        />
      )}
    </svg>
  );
};
