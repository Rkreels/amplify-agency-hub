
import React from 'react';
import { Element } from './types';
import { Play, Quote } from 'lucide-react';

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  onElementClick: (element: Element) => void;
}

export function ElementRenderer({ element, isSelected, onElementClick }: ElementRendererProps) {
  const baseStyles: React.CSSProperties = {
    position: element.styles.position as React.CSSProperties['position'] || 'relative',
    fontSize: element.styles.fontSize,
    fontWeight: element.styles.fontWeight as React.CSSProperties['fontWeight'],
    fontFamily: element.styles.fontFamily,
    color: element.styles.color,
    backgroundColor: element.styles.backgroundColor,
    backgroundImage: element.styles.backgroundImage,
    padding: element.styles.padding,
    margin: element.styles.margin,
    textAlign: element.styles.textAlign as React.CSSProperties['textAlign'],
    borderRadius: element.styles.borderRadius,
    borderWidth: element.styles.borderWidth,
    borderColor: element.styles.borderColor,
    borderStyle: element.styles.borderStyle as React.CSSProperties['borderStyle'],
    boxShadow: element.styles.boxShadow,
    width: element.styles.width,
    height: element.styles.height,
    minWidth: element.styles.minWidth,
    minHeight: element.styles.minHeight,
    maxWidth: element.styles.maxWidth,
    maxHeight: element.styles.maxHeight,
    top: element.styles.top,
    left: element.styles.left,
    right: element.styles.right,
    bottom: element.styles.bottom,
    zIndex: element.styles.zIndex,
    opacity: element.styles.opacity,
    transform: element.styles.transform,
    transition: element.styles.transition,
    cursor: element.styles.cursor as React.CSSProperties['cursor'],
    overflow: element.styles.overflow as React.CSSProperties['overflow'],
    display: element.styles.display as React.CSSProperties['display'],
    flexDirection: element.styles.flexDirection as React.CSSProperties['flexDirection'],
    flexWrap: element.styles.flexWrap as React.CSSProperties['flexWrap'],
    justifyContent: element.styles.justifyContent as React.CSSProperties['justifyContent'],
    alignItems: element.styles.alignItems as React.CSSProperties['alignItems'],
    alignContent: element.styles.alignContent as React.CSSProperties['alignContent'],
    gap: element.styles.gap,
    gridTemplateColumns: element.styles.gridTemplateColumns,
    gridTemplateRows: element.styles.gridTemplateRows,
    gridGap: element.styles.gridGap,
    animation: element.styles.animation,
    animationDuration: element.styles.animationDuration,
    animationDelay: element.styles.animationDelay,
    animationIterationCount: element.styles.animationIterationCount as React.CSSProperties['animationIterationCount'],
    animationDirection: element.styles.animationDirection as React.CSSProperties['animationDirection'],
    animationFillMode: element.styles.animationFillMode as React.CSSProperties['animationFillMode'],
    animationPlayState: element.styles.animationPlayState as React.CSSProperties['animationPlayState'],
    animationTimingFunction: element.styles.animationTimingFunction as React.CSSProperties['animationTimingFunction'],
  };

  const wrapperStyles: React.CSSProperties = {
    outline: isSelected ? '2px solid #007bff' : 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementClick(element);
  };

  switch (element.type) {
    case 'text':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }} dangerouslySetInnerHTML={{ __html: element.content || '' }} />
        </div>
      );

    case 'button':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <button style={{ ...baseStyles, border: 'none' }} onClick={(e) => e.preventDefault()}>
            {element.content}
          </button>
        </div>
      );

    case 'image':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <img 
            src={element.src} 
            alt={element.alt || ''} 
            style={{ ...baseStyles }}
          />
        </div>
      );

    case 'container':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            {element.children?.map(child => 
              <ElementRenderer 
                key={child.id} 
                element={child} 
                isSelected={false} 
                onElementClick={onElementClick} 
              />
            )}
          </div>
        </div>
      );

    case 'divider':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <hr style={{ ...baseStyles, height: baseStyles.height || '1px', backgroundColor: 'transparent' }} />
        </div>
      );

    case 'form':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <form style={{ ...baseStyles }} onClick={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <input type="email" placeholder="Email" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
              Submit
            </button>
          </form>
        </div>
      );

    case 'video':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <Play size={48} />
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <Quote size={24} style={{ marginBottom: '10px', color: '#007bff' }} />
            <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>
              {element.content || 'This is a great product! I highly recommend it to everyone.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', marginRight: '10px' }}></div>
              <div>
                <div style={{ fontWeight: 'bold' }}>John Doe</div>
                <div style={{ fontSize: '14px', color: '#666' }}>CEO, Company</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles, border: '1px solid #e9ecef', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Basic Plan</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '20px 0' }}>$29<span style={{ fontSize: '16px', fontWeight: 'normal' }}>/month</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
              <li style={{ padding: '5px 0' }}>✓ Feature 1</li>
              <li style={{ padding: '5px 0' }}>✓ Feature 2</li>
              <li style={{ padding: '5px 0' }}>✓ Feature 3</li>
            </ul>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px' }}>
              Choose Plan
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            Unknown Element Type: {element.type}
          </div>
        </div>
      );
  }
}
