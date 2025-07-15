
import React, { forwardRef, useCallback, useState, useRef, useEffect } from 'react';
import { Element } from './types';
import { ElementRenderer } from './ElementRenderer';

interface DragDropCanvasProps {
  elements: Element[];
  selectedElement: Element | null;
  hoveredElement: Element | null;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  zoomLevel: number;
  isPreviewMode: boolean;
  showGrid: boolean;
  gridSize: number;
  snapToGrid: boolean;
  onElementSelect: (element: Element | null) => void;
  onElementHover: (element: Element | null) => void;
  onElementUpdate: (id: string, updates: Partial<Element>) => void;
  onElementDelete: (id: string) => void;
  onElementDuplicate: (element: Element) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const DragDropCanvas = forwardRef<HTMLDivElement, DragDropCanvasProps>(
  ({
    elements,
    selectedElement,
    hoveredElement,
    deviceView,
    zoomLevel,
    isPreviewMode,
    showGrid,
    gridSize,
    snapToGrid,
    onElementSelect,
    onElementHover,
    onElementUpdate,
    onElementDelete,
    onElementDuplicate,
    onDrop,
    onDragOver
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectionBox, setSelectionBox] = useState<{
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    } | null>(null);
    const [isSelecting, setIsSelecting] = useState(false);

    const getCanvasWidth = () => {
      switch (deviceView) {
        case 'mobile': return 375;
        case 'tablet': return 768;
        default: return '100%';
      }
    };

    const getCanvasWidthNumber = () => {
      switch (deviceView) {
        case 'mobile': return 375;
        case 'tablet': return 768;
        default: return 1200;
      }
    };

    const getCanvasMaxWidth = () => {
      switch (deviceView) {
        case 'mobile': return '375px';
        case 'tablet': return '768px';
        default: return '1200px';
      }
    };

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onElementSelect(null);
      }
    }, [onElementSelect]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (isPreviewMode || e.target !== e.currentTarget) return;
      
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSelectionBox({
        startX: e.clientX - rect.left,
        startY: e.clientY - rect.top,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
      });
      setIsSelecting(true);
    }, [isPreviewMode]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!isSelecting || !selectionBox) return;
      
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setSelectionBox(prev => prev ? {
        ...prev,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
      } : null);
    }, [isSelecting, selectionBox]);

    const handleMouseUp = useCallback(() => {
      setIsSelecting(false);
      setSelectionBox(null);
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      onDrop(e);
    }, [onDrop]);

    const gridStyle = showGrid ? {
      backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
      `,
      backgroundSize: `${gridSize}px ${gridSize}px`
    } : {};

    return (
      <div className="flex-1 bg-gray-100 p-4 overflow-auto relative">
        <div className="h-full flex items-center justify-center">
          <div
            ref={ref}
            className={`
              bg-white shadow-lg transition-all duration-300 relative overflow-hidden
              ${deviceView === 'mobile' ? 'min-h-[600px]' : 'min-h-[800px]'}
              ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
            `}
            style={{ 
              width: getCanvasWidth(),
              maxWidth: getCanvasMaxWidth(),
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              ...gridStyle
            }}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={onDragOver}
            onDrop={handleDrop}
          >
            {/* Drop Zone Indicator */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 flex items-center justify-center z-50">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                  Drop element here
                </div>
              </div>
            )}

            {/* Selection Box */}
            {selectionBox && isSelecting && (
              <div
                className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none z-40"
                style={{
                  left: Math.min(selectionBox.startX, selectionBox.endX),
                  top: Math.min(selectionBox.startY, selectionBox.endY),
                  width: Math.abs(selectionBox.endX - selectionBox.startX),
                  height: Math.abs(selectionBox.endY - selectionBox.startY)
                }}
              />
            )}

            {/* Empty State */}
            {elements.length === 0 && !isDragOver && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-gray-400 rounded"></div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start building your page</h3>
                  <p className="text-sm">Drag elements from the right panel to get started</p>
                </div>
              </div>
            )}

            {/* Elements */}
            {elements.map((element) => (
              <div
                key={element.id}
                className="absolute"
                style={{
                  left: snapToGrid ? Math.round(element.position.x / gridSize) * gridSize : element.position.x,
                  top: snapToGrid ? Math.round(element.position.y / gridSize) * gridSize : element.position.y,
                  width: element.size.width,
                  height: element.size.height,
                  zIndex: selectedElement?.id === element.id ? 1000 : element.styles?.zIndex || 1
                }}
                onMouseEnter={() => !isPreviewMode && onElementHover(element)}
                onMouseLeave={() => !isPreviewMode && onElementHover(null)}
              >
                <ElementRenderer
                  element={element}
                  isSelected={selectedElement?.id === element.id}
                  isHovered={hoveredElement?.id === element.id}
                  isPreviewMode={isPreviewMode}
                  snapToGrid={snapToGrid}
                  gridSize={gridSize}
                  onElementClick={onElementSelect}
                  onUpdateElement={onElementUpdate}
                  onDeleteElement={onElementDelete}
                  onDuplicateElement={onElementDuplicate}
                />
              </div>
            ))}

            {/* Rulers (when not in preview mode) */}
            {!isPreviewMode && (
              <>
                {/* Horizontal Ruler */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 border-b border-gray-300 flex items-end text-xs text-gray-600 z-30">
                  {Array.from({ length: Math.ceil(getCanvasWidthNumber() / 50) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute border-l border-gray-400"
                      style={{ left: i * 50, height: '6px' }}
                    >
                      <span className="absolute -top-4 left-1 text-xs">{i * 50}</span>
                    </div>
                  ))}
                </div>
                
                {/* Vertical Ruler */}
                <div className="absolute top-0 left-0 bottom-0 w-6 bg-gray-200 border-r border-gray-300 flex flex-col justify-end text-xs text-gray-600 z-30">
                  {Array.from({ length: Math.ceil(800 / 50) }, (_, i) => (
                    <div
                      key={i}
                      className="absolute border-t border-gray-400"
                      style={{ top: i * 50, width: '6px' }}
                    >
                      <span className="absolute left-1 -top-2 text-xs transform -rotate-90 origin-left">{i * 50}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

DragDropCanvas.displayName = 'DragDropCanvas';
