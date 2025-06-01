
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, ZoomOut, Move, Grid3x3, Grid, Map
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  const [expanded, setExpanded] = useState(false);

  return (
    <TooltipProvider>
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-30">
        {expanded && (
          <>
            <div className="flex flex-col space-y-2 bg-white p-2 rounded-lg shadow-lg border">
              {/* Zoom controls */}
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white"
                      onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom out</p>
                  </TooltipContent>
                </Tooltip>
                <span className="px-2 py-1 bg-white border rounded text-sm min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 bg-white"
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom in</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Preset zoom levels */}
              <div className="flex space-x-1">
                {[0.5, 0.75, 1, 1.5, 2].map(level => (
                  <Button
                    key={level}
                    size="sm"
                    variant={zoom === level ? "default" : "outline"}
                    className="h-6 text-xs flex-1"
                    onClick={() => setZoom(level)}
                  >
                    {level * 100}%
                  </Button>
                ))}
              </div>
              
              {/* Grid and map settings */}
              <div className="flex flex-col space-y-2 mt-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Grid className="h-4 w-4" />
                    <Label htmlFor="grid-snap" className="text-sm">Grid Snap</Label>
                  </div>
                  <Switch
                    id="grid-snap"
                    checked={snapToGrid}
                    onCheckedChange={setSnapToGrid}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Map className="h-4 w-4" />
                    <Label htmlFor="show-minimap" className="text-sm">Mini Map</Label>
                  </div>
                  <Switch
                    id="show-minimap"
                    checked={showMiniMap}
                    onCheckedChange={setShowMiniMap}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-white"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Canvas Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSnapToGrid(!snapToGrid)}>
                <Grid className="h-4 w-4 mr-2" />
                {snapToGrid ? "Disable" : "Enable"} Grid Snapping
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowMiniMap(!showMiniMap)}>
                <Map className="h-4 w-4 mr-2" />
                {showMiniMap ? "Hide" : "Show"} Mini Map
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={fitView}>
                <Move className="h-4 w-4 mr-2" />
                Fit to View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            size="sm"
            variant="outline"
            className="bg-white"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Controls" : "Show Controls"}
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 bg-white"
                onClick={() => {
                  setZoom(1);
                  setCanvasOffset({ x: 0, y: 0 });
                }}
              >
                <Move className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset view</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
