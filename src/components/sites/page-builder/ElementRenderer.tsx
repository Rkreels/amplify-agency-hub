
import React, { useState, useRef, useCallback } from 'react';
import { Element } from './types';
import { ElementToolbar } from './ElementToolbar';

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  isHovered?: boolean;
  isPreviewMode?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  onElementClick: (element: Element) => void;
  onUpdateElement: (id: string, updates: Partial<Element>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: Element) => void;
}

export function ElementRenderer({
  element,
  isSelected,
  isHovered,
  isPreviewMode = false,
  snapToGrid = false,
  gridSize = 20,
  onElementClick,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement
}: ElementRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode || element.locked) return;
    
    e.stopPropagation();
    onElementClick(element);
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y
    });
  }, [isPreviewMode, element, onElementClick]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && !element.locked) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const snappedX = snapToGrid ? Math.round(newX / gridSize) * gridSize : newX;
      const snappedY = snapToGrid ? Math.round(newY / gridSize) * gridSize : newY;
      
      onUpdateElement(element.id, {
        position: { x: Math.max(0, snappedX), y: Math.max(0, snappedY) }
      });
    }

    if (isResizing && !element.locked) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(50, resizeStart.width + deltaX);
      const newHeight = Math.max(30, resizeStart.height + deltaY);
      
      onUpdateElement(element.id, {
        size: { width: newWidth, height: newHeight }
      });
    }
  }, [isDragging, isResizing, element.locked, dragStart, resizeStart, snapToGrid, gridSize, onUpdateElement, element.id]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode || element.locked) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: element.size.width,
      height: element.size.height
    });
  }, [isPreviewMode, element.locked, element.size]);

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const renderElementContent = () => {
    const commonStyles = {
      ...element.styles,
      width: '100%',
      height: '100%',
      display: element.styles?.display || 'block',
      pointerEvents: isPreviewMode ? 'auto' : 'none'
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            style={commonStyles}
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateElement(element.id, { content: e.target.textContent || '' })}
          >
            {element.content || 'Text Element'}
          </div>
        );

      case 'heading':
        const HeadingTag = (element.styles?.headingLevel || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={commonStyles}
            contentEditable={isSelected && !isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => onUpdateElement(element.id, { content: e.target.textContent || '' })}
          >
            {element.content || 'Heading'}
          </HeadingTag>
        );

      case 'button':
        return (
          <button
            style={{...commonStyles, pointerEvents: isPreviewMode ? 'auto' : 'none'}}
            onClick={(e) => {
              if (!isPreviewMode) e.preventDefault();
              if (element.href && isPreviewMode) {
                window.open(element.href, element.target || '_self');
              }
            }}
          >
            {element.content || 'Button'}
          </button>
        );

      case 'image':
        return (
          <img
            src={element.src || 'https://via.placeholder.com/300x200'}
            alt={element.alt || 'Image'}
            style={commonStyles}
            draggable={false}
          />
        );

      case 'container':
        return (
          <div style={commonStyles}>
            {element.children?.map(child => (
              <ElementRenderer
                key={child.id}
                element={child}
                isSelected={false}
                isPreviewMode={isPreviewMode}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
                onElementClick={onElementClick}
                onUpdateElement={onUpdateElement}
                onDeleteElement={onDeleteElement}
                onDuplicateElement={onDuplicateElement}
              />
            ))}
          </div>
        );

      case 'input':
        return (
          <input
            type="text"
            placeholder={element.content || 'Enter text...'}
            style={commonStyles}
            disabled={!isPreviewMode}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.content || 'Enter text...'}
            style={commonStyles}
            disabled={!isPreviewMode}
          />
        );

      case 'video':
        return (
          <video
            src={element.src}
            controls={isPreviewMode}
            style={commonStyles}
            poster={element.alt}
          />
        );

      case 'audio':
        return (
          <audio
            src={element.src}
            controls={isPreviewMode}
            style={commonStyles}
          />
        );

      default:
        return (
          <div style={commonStyles}>
            {element.content || `${element.type} Element`}
          </div>
        );
    }
  };

  return (
    <>
      <div
        ref={elementRef}
        className={`
          absolute border-2 transition-all duration-200
          ${isSelected ? 'border-blue-500 bg-blue-50/10' : 'border-transparent'}
          ${isHovered ? 'border-blue-300' : ''}
          ${isDragging ? 'shadow-lg scale-105 z-50' : ''}
          ${isResizing ? 'shadow-lg z-50' : ''}
          ${element.locked ? 'cursor-not-allowed opacity-75' : ''}
          ${!isPreviewMode && !element.locked ? 'cursor-move' : ''}
        `}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: isSelected ? 1000 : element.styles?.zIndex || 1
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.stopPropagation();
          onElementClick(element);
        }}
      >
        {renderElementContent()}
        
        {/* Selection handles */}
        {isSelected && !isPreviewMode && !element.locked && (
          <>
            {/* Corner resize handles */}
            <div 
              className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize hover:bg-blue-600"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleResizeStart(e);
              }}
            />
            <div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize hover:bg-blue-600"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleResizeStart(e);
              }}
            />
            <div 
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize hover:bg-blue-600"
              onMouseDown={(e) => {
                e.stopPropagagation();
                handleResizeStart(e);
              }}
            />
            <div 
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize hover:bg-blue-600"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleResizeStart(e);
              }}
            />
            
            {/* Lock indicator */}
            {element.locked && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Element Toolbar */}
      {isSelected && !isPreviewMode && (
        <ElementToolbar
          element={element}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
          onDuplicate={onDuplicateElement}
        />
      )}
    </>
  );
}
