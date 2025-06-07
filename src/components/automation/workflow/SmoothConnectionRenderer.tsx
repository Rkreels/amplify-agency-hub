
import React from 'react';

interface Connection {
  connection: any;
  path: string;
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
}

interface SmoothConnectionRendererProps {
  svgRef: React.RefObject<SVGSVGElement>;
  connections: (Connection | null)[];
  selectedConnection: string | null;
  isConnecting: boolean;
  previewPath: string | null;
  onConnectionClick: (connectionId: string, e: React.MouseEvent) => void;
  zoom: number;
}

export function SmoothConnectionRenderer({
  svgRef,
  connections,
  selectedConnection,
  isConnecting,
  previewPath,
  onConnectionClick,
  zoom
}: SmoothConnectionRendererProps) {
  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 1 }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3b82f6"
          />
        </marker>
      </defs>
      
      {/* Render actual connections */}
      {connections.map((conn, index) => {
        if (!conn) return null;
        
        const isSelected = selectedConnection === conn.connection.id;
        
        return (
          <g key={conn.connection.id}>
            <path
              d={conn.path}
              stroke={isSelected ? "#ef4444" : "#3b82f6"}
              strokeWidth={isSelected ? "3" : "2"}
              fill="none"
              markerEnd="url(#arrowhead)"
              className="pointer-events-auto cursor-pointer hover:stroke-blue-600"
              onClick={(e) => onConnectionClick(conn.connection.id, e)}
            />
          </g>
        );
      })}
      
      {/* Render preview connection while connecting */}
      {isConnecting && previewPath && (
        <path
          d={previewPath}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          className="animate-pulse"
        />
      )}
    </svg>
  );
}
