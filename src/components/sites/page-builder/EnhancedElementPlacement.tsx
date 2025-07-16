
import React from 'react';
import { Element } from './types';

interface ElementPlacementProps {
  elements: Element[];
  draggedElement: Element | null;
  mousePosition: { x: number; y: number };
  onElementPlace: (position: { x: number; y: number }) => void;
}

export function EnhancedElementPlacement({ 
  elements, 
  draggedElement, 
  mousePosition,
  onElementPlace 
}: ElementPlacementProps) {
  // Calculate snap zones for better element placement
  const getSnapZones = () => {
    const zones: Array<{ x: number; y: number; element?: Element }> = [];
    
    // Add grid snap points
    for (let x = 0; x < 1200; x += 20) {
      for (let y = 0; y < 800; y += 20) {
        zones.push({ x, y });
      }
    }
    
    // Add element edge snap points
    elements.forEach(element => {
      if (element.id !== draggedElement?.id) {
        zones.push(
          { x: element.position.x, y: element.position.y + element.size.height + 10, element },
          { x: element.position.x, y: element.position.y - 10, element },
          { x: element.position.x + element.size.width + 10, y: element.position.y, element },
          { x: element.position.x - 10, y: element.position.y, element }
        );
      }
    });
    
    return zones;
  };

  const findNearestSnapZone = (x: number, y: number) => {
    const zones = getSnapZones();
    let nearest = { x, y };
    let minDistance = Infinity;
    
    zones.forEach(zone => {
      const distance = Math.sqrt(Math.pow(zone.x - x, 2) + Math.pow(zone.y - y, 2));
      if (distance < minDistance && distance < 20) {
        minDistance = distance;
        nearest = { x: zone.x, y: zone.y };
      }
    });
    
    return nearest;
  };

  const handleElementDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const snappedPosition = findNearestSnapZone(mousePosition.x, mousePosition.y);
    onElementPlace(snappedPosition);
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onDrop={handleElementDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Snap guides */}
      {draggedElement && (
        <>
          {/* Vertical guides */}
          {elements.map(element => (
            <div
              key={`v-${element.id}`}
              className="absolute w-px bg-blue-400 opacity-50"
              style={{
                left: element.position.x,
                top: 0,
                height: '100%'
              }}
            />
          ))}
          
          {/* Horizontal guides */}
          {elements.map(element => (
            <div
              key={`h-${element.id}`}
              className="absolute h-px bg-blue-400 opacity-50"
              style={{
                top: element.position.y,
                left: 0,
                width: '100%'
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
