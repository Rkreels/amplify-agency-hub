
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Grid,
  Map
} from 'lucide-react';

interface CanvasControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  canvasOffset: { x: number; y: number };
  setCanvasOffset: (offset: { x: number; y: number }) => void;
  fitView: () => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  showMiniMap: boolean;
  setShowMiniMap: (show: boolean) => void;
}

export function CanvasControls({
  zoom,
  setZoom,
  canvasOffset,
  setCanvasOffset,
  fitView,
  snapToGrid,
  setSnapToGrid,
  showMiniMap,
  setShowMiniMap
}: CanvasControlsProps) {
  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.2));
  };

  const resetView = () => {
    setZoom(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border">
      <Button
        size="sm"
        variant="outline"
        onClick={handleZoomIn}
        className="h-8 w-8 p-0"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={handleZoomOut}
        className="h-8 w-8 p-0"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={fitView}
        className="h-8 w-8 p-0"
      >
        <Move className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant={snapToGrid ? "default" : "outline"}
        onClick={() => setSnapToGrid(!snapToGrid)}
        className="h-8 w-8 p-0"
      >
        <Grid className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant={showMiniMap ? "default" : "outline"}
        onClick={() => setShowMiniMap(!showMiniMap)}
        className="h-8 w-8 p-0"
      >
        <Map className="h-4 w-4" />
      </Button>
      
      <div className="text-xs text-gray-500 text-center mt-1">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
