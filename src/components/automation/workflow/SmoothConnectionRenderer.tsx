import React from 'react';
import { WorkflowConnection, WorkflowNode } from '@/store/useWorkflowStore';

interface ConnectionData {
  connection: WorkflowConnection;
  path: string;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
}

interface SmoothConnectionRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
  connections: ConnectionData[];
  selectedConnection: string | null;
  isConnecting: boolean;
  previewPath: string;
  onConnectionClick: (connectionId: string, e: React.MouseEvent) => void;
  zoom: number;
}

export const SmoothConnectionRenderer: React.FC<SmoothConnectionRendererProps> = ({
  svgRef,
  connections,
  selectedConnection,
  isConnecting,
  previewPath,
  onConnectionClick,
  zoom
}) => {
  return (
    <svg 
      ref={svgRef}
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ 
        width: '100%', 
        height: '100%', 
        zIndex: 1,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left'
      }}
    >
      <defs>
        {/* Arrow markers */}
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
          markerWidth="12"
          markerHeight="8"
          refX="11"
          refY="4"
          orient="auto"
          fill="#3b82f6"
        >
          <polygon points="0 0, 12 4, 0 8" />
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
        
        {/* Glow effects */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Existing connections */}
      {connections.map((connectionData) => {
        if (!connectionData) return null;
        
        const { connection, path } = connectionData;
        const isSelected = selectedConnection === connection.id;
        
        const strokeColor = isSelected ? "#3b82f6" : 
                          connection.sourceHandle === 'true' ? "#10b981" :
                          connection.sourceHandle === 'false' ? "#ef4444" : "#6b7280";
        
        const markerEnd = isSelected ? "url(#arrowhead-selected)" :
                        connection.sourceHandle === 'true' ? "url(#arrowhead-success)" :
                        connection.sourceHandle === 'false' ? "url(#arrowhead-error)" : "url(#arrowhead)";
        
        return (
          <g key={connection.id}>
            {/* Shadow path */}
            <path
              d={path}
              stroke="rgba(0,0,0,0.1)"
              strokeWidth={isSelected ? "4" : "3"}
              fill="none"
              transform="translate(1, 1)"
              className="pointer-events-none"
            />
            
            {/* Main connection path */}
            <path
              d={path}
              stroke={strokeColor}
              strokeWidth={isSelected ? "3" : "2"}
              fill="none"
              markerEnd={markerEnd}
              className={`transition-all duration-300 cursor-pointer ${
                isSelected ? 'filter-glow animate-pulse' : 'hover:stroke-blue-400'
              }`}
              style={{ 
                pointerEvents: 'stroke',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }}
              onClick={(e) => onConnectionClick(connection.id, e)}
              filter={isSelected ? "url(#glow)" : "url(#shadow)"}
            />
            
            {/* Invisible wider path for easier clicking */}
            <path
              d={path}
              stroke="transparent"
              strokeWidth="12"
              fill="none"
              className="cursor-pointer"
              style={{ pointerEvents: 'stroke' }}
              onClick={(e) => onConnectionClick(connection.id, e)}
            />
            
            {/* Animated flow dots for selected connection */}
            {isSelected && (
              <>
                <circle r="3" fill="#3b82f6" opacity="0.8">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
                <circle r="2" fill="white">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={path}
                    begin="0.5s"
                  />
                </circle>
              </>
            )}
            
            {/* Connection labels */}
            {connection.label && (
              <text
                x={(connectionData.sourcePos.x + connectionData.targetPos.x) / 2}
                y={(connectionData.sourcePos.y + connectionData.targetPos.y) / 2 - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium drop-shadow pointer-events-none"
                style={{ fontSize: '12px' }}
              >
                {connection.label}
              </text>
            )}
          </g>
        );
      })}
      
      {/* Preview connection line during dragging */}
      {isConnecting && previewPath && (
        <path
          d={previewPath}
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="8,4"
          fill="none"
          className="pointer-events-none animate-pulse"
          style={{ 
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }}
          opacity="0.8"
        />
      )}
    </svg>
  );
};
