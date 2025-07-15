
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Element } from './types';
import { Button } from '@/components/ui/button';
import { 
  Move, 
  Trash2, 
  Copy, 
  Settings, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  Maximize2,
  Grip
} from 'lucide-react';

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  isHovered?: boolean;
  onElementClick: (element: Element) => void;
  isPreviewMode?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  onUpdateElement?: (elementId: string, updates: Partial<Element>) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (element: Element) => void;
}

export function ElementRenderer({ 
  element, 
  isSelected, 
  isHovered = false,
  onElementClick,
  isPreviewMode = false,
  snapToGrid = false,
  gridSize = 10,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement
}: ElementRendererProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isPreviewMode || element.locked) return;
    
    e.stopPropagation();
    onElementClick(element);
    
    if (e.target === elementRef.current || (e.target as HTMLElement).classList.contains('element-content')) {
      setIsDragging(true);
      const rect = elementRef.current!.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  }, [isPreviewMode, element, onElementClick]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
    if (isPreviewMode || element.locked) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialSize({ width: element.size.width, height: element.size.height });
    setInitialPosition({ x: element.position.x, y: element.position.y });
  }, [isPreviewMode, element]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!onUpdateElement) return;

    if (isDragging && elementRef.current) {
      const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
      if (!parentRect) return;

      let newX = e.clientX - parentRect.left - dragOffset.x;
      let newY = e.clientY - parentRect.top - dragOffset.y;

      // Snap to grid
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      // Constrain to parent bounds
      newX = Math.max(0, Math.min(newX, parentRect.width - element.size.width));
      newY = Math.max(0, Math.min(newY, parentRect.height - element.size.height));

      onUpdateElement(element.id, {
        position: { x: newX, y: newY }
      });
    }

    if (isResizing) {
      const deltaX = e.clientX - (elementRef.current?.getBoundingClientRect().left || 0);
      const deltaY = e.clientY - (elementRef.current?.getBoundingClientRect().top || 0);

      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = initialPosition.x;
      let newY = initialPosition.y;

      switch (resizeDirection) {
        case 'se': // Southeast
          newWidth = Math.max(20, deltaX);
          newHeight = Math.max(20, deltaY);
          break;
        case 'sw': // Southwest
          newWidth = Math.max(20, initialSize.width + (initialPosition.x - (e.clientX - (elementRef.current?.parentElement?.getBoundingClientRect().left || 0))));
          newHeight = Math.max(20, deltaY);
          newX = Math.min(initialPosition.x, e.clientX - (elementRef.current?.parentElement?.getBoundingClientRect().left || 0));
          break;
        case 'ne': // Northeast
          newWidth = Math.max(20, deltaX);
          newHeight = Math.max(20, initialSize.height + (initialPosition.y - (e.clientY - (elementRef.current?.parentElement?.getBoundingClientRect().top || 0))));
          newY = Math.min(initialPosition.y, e.clientY - (elementRef.current?.parentElement?.getBoundingClientRect().top || 0));
          break;
        case 'nw': // Northwest
          newWidth = Math.max(20, initialSize.width + (initialPosition.x - (e.clientX - (elementRef.current?.parentElement?.getBoundingClientRect().left || 0))));
          newHeight = Math.max(20, initialSize.height + (initialPosition.y - (e.clientY - (elementRef.current?.parentElement?.getBoundingClientRect().top || 0))));
          newX = Math.min(initialPosition.x, e.clientX - (elementRef.current?.parentElement?.getBoundingClientRect().left || 0));
          newY = Math.min(initialPosition.y, e.clientY - (elementRef.current?.parentElement?.getBoundingClientRect().top || 0));
          break;
        case 'e': // East
          newWidth = Math.max(20, deltaX);
          break;
        case 'w': // West
          newWidth = Math.max(20, initialSize.width + (initialPosition.x - (e.clientX - (elementRef.current?.parentElement?.getBoundingClientRect().left || 0))));
          newX = Math.min(initialPosition.x, e.clientX - (elementRef.current?.parentElement?.getBoundingClientRect().left || 0));
          break;
        case 's': // South
          newHeight = Math.max(20, deltaY);
          break;
        case 'n': // North
          newHeight = Math.max(20, initialSize.height + (initialPosition.y - (e.clientY - (elementRef.current?.parentElement?.getBoundingClientRect().top || 0))));
          newY = Math.min(initialPosition.y, e.clientY - (elementRef.current?.parentElement?.getBoundingClientRect().top || 0));
          break;
      }

      // Snap to grid
      if (snapToGrid) {
        newWidth = Math.round(newWidth / gridSize) * gridSize;
        newHeight = Math.round(newHeight / gridSize) * gridSize;
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      onUpdateElement(element.id, {
        size: { width: newWidth, height: newHeight },
        position: { x: newX, y: newY }
      });
    }
  }, [isDragging, isResizing, element, dragOffset, resizeDirection, initialSize, initialPosition, snapToGrid, gridSize, onUpdateElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  }, []);

  useEffect(() => {
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
    const baseStyles: React.CSSProperties = {
      ...element.styles,
      cursor: isPreviewMode ? 'default' : isDragging ? 'grabbing' : 'grab',
      userSelect: isPreviewMode ? 'text' : 'none',
      pointerEvents: element.locked && !isPreviewMode ? 'none' : 'auto',
      opacity: element.styles?.display === 'none' ? 0.5 : (element.styles?.opacity || 1)
    };

    switch (element.type) {
      case 'text':
        return (
          <div 
            className="element-content w-full h-full p-2"
            style={{ 
              ...baseStyles,
              minHeight: '20px',
              outline: element.content ? 'none' : '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center'
            }}
            contentEditable={isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (onUpdateElement && isPreviewMode) {
                onUpdateElement(element.id, { content: e.currentTarget.textContent || '' });
              }
            }}
          >
            {element.content || 'Add your text here...'}
          </div>
        );

      case 'heading':
        const HeadingTag = (element.props?.level || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag 
            className="element-content w-full h-full p-2"
            style={{ 
              ...baseStyles,
              fontSize: element.props?.level === 'h1' ? '2.5rem' : 
                       element.props?.level === 'h2' ? '2rem' : 
                       element.props?.level === 'h3' ? '1.5rem' : '1.25rem',
              fontWeight: 'bold',
              minHeight: '40px',
              outline: element.content ? 'none' : '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center'
            }}
            contentEditable={isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (onUpdateElement && isPreviewMode) {
                onUpdateElement(element.id, { content: e.currentTarget.textContent || '' });
              }
            }}
          >
            {element.content || 'Heading Text'}
          </HeadingTag>
        );

      case 'button':
        return (
          <button
            className="element-content w-full h-full"
            style={{
              ...baseStyles,
              backgroundColor: element.styles?.backgroundColor || '#3b82f6',
              color: element.styles?.color || 'white',
              border: element.styles?.border || 'none',
              borderRadius: element.styles?.borderRadius || '8px',
              fontSize: element.styles?.fontSize || '16px',
              fontWeight: element.styles?.fontWeight || '500',
              cursor: isPreviewMode ? 'pointer' : baseStyles.cursor,
              minWidth: '120px',
              minHeight: '44px'
            }}
            onClick={isPreviewMode && element.props?.href ? () => {
              if (element.props?.target === '_blank') {
                window.open(element.props.href, '_blank');
              } else {
                window.location.href = element.props.href;
              }
            } : undefined}
          >
            {element.content || 'Button Text'}
          </button>
        );

      case 'image':
        return (
          <div className="element-content w-full h-full" style={baseStyles}>
            {element.props?.src ? (
              <img
                src={element.props.src}
                alt={element.props?.alt || 'Image'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: element.styles?.objectFit || 'cover',
                  borderRadius: element.styles?.borderRadius || '0px'
                }}
                draggable={false}
              />
            ) : (
              <div 
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  borderRadius: element.styles?.borderRadius || '0px'
                }}
              >
                Click to add image
              </div>
            )}
          </div>
        );

      case 'container':
        return (
          <div 
            className="element-content w-full h-full"
            style={{
              ...baseStyles,
              minHeight: '100px',
              border: isSelected ? '2px solid #3b82f6' : element.styles?.border || '1px dashed #d1d5db',
              backgroundColor: element.styles?.backgroundColor || 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              borderRadius: element.styles?.borderRadius || '0px'
            }}
          >
            {element.children?.length ? `Container with ${element.children.length} elements` : 'Empty Container'}
          </div>
        );

      case 'form':
        return (
          <form className="element-content w-full h-full p-4" style={{ ...baseStyles, minHeight: '200px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Name
              </label>
              <input 
                type="text" 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter your name"
                disabled={!isPreviewMode}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Email
              </label>
              <input 
                type="email" 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                placeholder="Enter your email"
                disabled={!isPreviewMode}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '14px' }}>
                Message
              </label>
              <textarea 
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Enter your message"
                disabled={!isPreviewMode}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isPreviewMode ? 'pointer' : 'default'
              }}
              disabled={!isPreviewMode}
            >
              Submit
            </button>
          </form>
        );

      case 'divider':
        return (
          <hr 
            className="element-content"
            style={{
              ...baseStyles,
              border: 'none',
              borderTop: `2px solid ${element.styles?.borderColor || '#e5e7eb'}`,
              margin: '0',
              width: '100%',
              height: element.styles?.height || '2px'
            }} 
          />
        );

      case 'spacer':
        return (
          <div 
            className="element-content w-full h-full"
            style={{
              ...baseStyles,
              backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              border: isSelected ? '1px dashed #3b82f6' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '12px'
            }} 
          >
            {!isPreviewMode && 'Spacer'}
          </div>
        );

      default:
        return (
          <div className="element-content w-full h-full p-4" style={{ ...baseStyles, border: '1px dashed #ccc' }}>
            Unknown element type: {element.type}
          </div>
        );
    }
  };

  if (isPreviewMode) {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {renderElementContent()}
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className={`
        relative transition-all duration-200 
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''} 
        ${isHovered ? 'ring-1 ring-blue-300 ring-offset-1' : ''}
        ${isDragging ? 'opacity-75 z-50' : ''}
        ${element.locked ? 'opacity-60' : ''}
      `}
      style={{
        width: '100%',
        height: '100%',
        zIndex: isSelected ? 1000 : parseInt(element.styles?.zIndex || '1')
      }}
      onMouseDown={handleMouseDown}
    >
      {renderElementContent()}
      
      {/* Selection Overlay */}
      {(isSelected || isHovered) && !isPreviewMode && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Element Label */}
          <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-t font-medium flex items-center gap-1">
            {element.locked && <Lock className="h-3 w-3" />}
            <span className="capitalize">{element.type}</span>
          </div>
        </div>
      )}

      {/* Resize Handles */}
      {isSelected && !isPreviewMode && !element.locked && (
        <>
          {/* Corner handles */}
          <div 
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div 
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          <div 
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          
          {/* Edge handles */}
          <div 
            className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-n-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div 
            className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-e-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
          <div 
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-s-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div 
            className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-w-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
        </>
      )}
    </div>
  );
}
