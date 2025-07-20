
import React, { useState } from 'react';
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
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    onElementClick(element);
    
    if (element.locked) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || element.locked) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const snappedX = snapToGrid ? Math.round(newX / gridSize) * gridSize : newX;
    const snappedY = snapToGrid ? Math.round(newY / gridSize) * gridSize : newY;
    
    onUpdateElement(element.id, {
      position: { x: Math.max(0, snappedX), y: Math.max(0, snappedY) }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const renderElementContent = () => {
    const commonStyles = {
      ...element.styles,
      width: '100%',
      height: '100%',
      display: element.styles?.display || 'block'
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
            style={commonStyles}
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
        className={`
          absolute border-2 cursor-move transition-all
          ${isSelected ? 'border-blue-500 bg-blue-50/10' : 'border-transparent'}
          ${isHovered ? 'border-blue-300' : ''}
          ${isDragging ? 'shadow-lg scale-105' : ''}
          ${element.locked ? 'cursor-not-allowed' : ''}
        `}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: isSelected ? 1000 : element.styles?.zIndex || 1
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={(e) => {
          e.stopPropagation();
          onElementClick(element);
        }}
      >
        {renderElementContent()}
        
        {/* Selection handles */}
        {isSelected && !isPreviewMode && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 border border-white rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 border border-white rounded-full" />
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
