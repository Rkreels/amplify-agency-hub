
import React, { useState, useRef, useEffect } from 'react';
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
  Maximize2
} from 'lucide-react';

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  onElementClick: (element: Element) => void;
  isPreviewMode?: boolean;
  onUpdateElement?: (elementId: string, updates: Partial<Element>) => void;
  onDeleteElement?: (elementId: string) => void;
  onDuplicateElement?: (element: Element) => void;
}

export function ElementRenderer({ 
  element, 
  isSelected, 
  onElementClick,
  isPreviewMode = false,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement
}: ElementRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    onElementClick(element);
    
    if (e.target === elementRef.current) {
      setIsDragging(true);
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !elementRef.current || !onUpdateElement) return;
    
    const parentRect = elementRef.current.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    const newX = e.clientX - parentRect.left - dragOffset.x;
    const newY = e.clientY - parentRect.top - dragOffset.y;

    onUpdateElement(element.id, {
      styles: {
        ...element.styles,
        position: 'absolute',
        left: `${Math.max(0, newX)}px`,
        top: `${Math.max(0, newY)}px`
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const renderElementContent = () => {
    const baseStyles: React.CSSProperties = {
      ...element.styles,
      cursor: isPreviewMode ? 'default' : 'pointer',
      userSelect: isPreviewMode ? 'text' : 'none',
    };

    switch (element.type) {
      case 'text':
        return (
          <div 
            style={{ 
              ...baseStyles,
              minHeight: '20px',
              outline: element.content ? 'none' : '2px dashed #ccc'
            }}
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (onUpdateElement) {
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
            style={{ 
              ...baseStyles,
              fontSize: element.props?.level === 'h1' ? '2.5rem' : 
                       element.props?.level === 'h2' ? '2rem' : 
                       element.props?.level === 'h3' ? '1.5rem' : '1.25rem',
              fontWeight: 'bold',
              minHeight: '40px',
              outline: element.content ? 'none' : '2px dashed #ccc'
            }}
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (onUpdateElement) {
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
            style={{
              ...baseStyles,
              backgroundColor: element.styles?.backgroundColor || '#3b82f6',
              color: element.styles?.color || 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              minWidth: '120px',
              minHeight: '44px'
            }}
            onClick={isPreviewMode ? undefined : (e) => e.preventDefault()}
          >
            {element.content || 'Button Text'}
          </button>
        );

      case 'image':
        return (
          <div style={{ ...baseStyles, minHeight: '200px', minWidth: '200px' }}>
            {element.props?.src ? (
              <img
                src={element.props.src}
                alt={element.props?.alt || 'Image'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' as const,
                  borderRadius: element.styles?.borderRadius || '0px'
                }}
              />
            ) : (
              <div 
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '14px'
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
            style={{
              ...baseStyles,
              minHeight: '100px',
              border: isSelected ? '2px solid #3b82f6' : '1px dashed #d1d5db',
              backgroundColor: element.styles?.backgroundColor || 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}
          >
            {element.children?.length ? 'Container with elements' : 'Empty Container - Drop elements here'}
          </div>
        );

      case 'form':
        return (
          <form style={{ ...baseStyles, minHeight: '200px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
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
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
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
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </form>
        );

      case 'divider':
        return (
          <hr style={{
            ...baseStyles,
            border: 'none',
            borderTop: `2px solid ${element.styles?.borderColor || '#e5e7eb'}`,
            margin: '20px 0',
            width: '100%'
          }} />
        );

      case 'spacer':
        return (
          <div style={{
            ...baseStyles,
            height: element.styles?.height || '40px',
            width: '100%',
            backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            border: isSelected ? '1px dashed #3b82f6' : 'none'
          }} />
        );

      default:
        return (
          <div style={{ ...baseStyles, padding: '16px', border: '1px dashed #ccc' }}>
            Unknown element type: {element.type}
          </div>
        );
    }
  };

  if (isPreviewMode) {
    return renderElementContent();
  }

  return (
    <div
      ref={elementRef}
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging ? 'opacity-75 z-50' : ''}`}
      style={{
        position: element.styles?.position === 'absolute' ? 'absolute' : 'relative',
        left: element.styles?.left,
        top: element.styles?.top,
        zIndex: isSelected ? 1000 : parseInt(element.styles?.zIndex || '1')
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {renderElementContent()}
      
      {/* Selection Overlay */}
      {(isSelected || isHovered) && !isPreviewMode && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Element Label */}
          <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-t font-medium">
            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
          </div>
          
          {/* Resize Handles */}
          {isSelected && (
            <>
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-nw-resize"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-n-resize"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-ne-resize"></div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-e-resize"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-se-resize"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-s-resize"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-sw-resize"></div>
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white rounded-full cursor-w-resize"></div>
            </>
          )}
        </div>
      )}

      {/* Quick Actions Toolbar */}
      {isSelected && !isPreviewMode && (
        <div className="absolute -top-12 right-0 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1 pointer-events-auto">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => onDuplicateElement?.(element)}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => {
              // Toggle visibility
              if (onUpdateElement) {
                onUpdateElement(element.id, {
                  styles: {
                    ...element.styles,
                    opacity: element.styles?.opacity === '0.5' ? '1' : '0.5'
                  }
                });
              }
            }}
          >
            {element.styles?.opacity === '0.5' ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            onClick={() => onDeleteElement?.(element.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
