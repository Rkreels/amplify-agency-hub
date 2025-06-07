
import React from 'react';
import { Card } from '@/components/ui/card';

interface MiniMapProps {
  nodes: any[];
  connections: any[];
  canvasOffset: { x: number; y: number };
  zoom: number;
  setCanvasOffset: (offset: { x: number; y: number }) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function MiniMap({
  nodes,
  connections,
  canvasOffset,
  zoom,
  setCanvasOffset,
  canvasRef
}: MiniMapProps) {
  const miniMapScale = 0.1;
  const miniMapWidth = 200;
  const miniMapHeight = 150;

  const handleMiniMapClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const newOffset = {
      x: -(x / miniMapScale - canvasRect.width / 2),
      y: -(y / miniMapScale - canvasRect.height / 2)
    };
    
    setCanvasOffset(newOffset);
  };

  return (
    <Card className="absolute top-4 right-4 w-50 h-40 bg-white/90 backdrop-blur border shadow-lg">
      <div
        className="w-full h-full relative cursor-pointer overflow-hidden"
        onClick={handleMiniMapClick}
        style={{ 
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '10px 10px'
        }}
      >
        {/* Render nodes in minimap */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute bg-blue-500 rounded"
            style={{
              left: node.position.x * miniMapScale,
              top: node.position.y * miniMapScale,
              width: 20,
              height: 10,
              transform: `scale(${zoom})`
            }}
          />
        ))}
        
        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-red-500 bg-red-100/20"
          style={{
            left: -canvasOffset.x * miniMapScale,
            top: -canvasOffset.y * miniMapScale,
            width: (canvasRef.current?.getBoundingClientRect().width || 800) * miniMapScale / zoom,
            height: (canvasRef.current?.getBoundingClientRect().height || 600) * miniMapScale / zoom
          }}
        />
      </div>
    </Card>
  );
}
