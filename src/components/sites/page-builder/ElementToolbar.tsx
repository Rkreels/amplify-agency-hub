
import React from 'react';
import { Button } from '@/components/ui/button';
import { Element } from './types';
import { 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

interface ElementToolbarProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (element: Element) => void;
}

export function ElementToolbar({ element, onUpdate, onDelete, onDuplicate }: ElementToolbarProps) {
  const isVisible = element.styles?.display !== 'none';
  const isLocked = element.locked || false;

  const toggleVisibility = () => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        display: isVisible ? 'none' : 'block'
      }
    });
  };

  const toggleLock = () => {
    onUpdate(element.id, { locked: !isLocked });
  };

  const moveLayer = (direction: 'up' | 'down') => {
    const currentZ = parseInt(element.styles?.zIndex || '1');
    const newZ = direction === 'up' ? currentZ + 1 : Math.max(1, currentZ - 1);
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        zIndex: newZ.toString()
      }
    });
  };

  const handleTextAlign = (align: string) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        textAlign: align
      }
    });
  };

  const handleTextStyle = (style: string) => {
    const currentValue = element.styles?.[style];
    let newValue;
    
    switch (style) {
      case 'fontWeight':
        newValue = currentValue === 'bold' ? 'normal' : 'bold';
        break;
      case 'fontStyle':
        newValue = currentValue === 'italic' ? 'normal' : 'italic';
        break;
      case 'textDecoration':
        newValue = currentValue === 'underline' ? 'none' : 'underline';
        break;
      default:
        return;
    }
    
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [style]: newValue
      }
    });
  };

  const position = {
    top: element.position.y - 60,
    left: element.position.x + element.size.width / 2 - 150
  };

  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center gap-1 z-[1001]"
      style={position}
    >
      {/* Text formatting tools for text elements */}
      {(element.type === 'text' || element.type === 'heading') && (
        <>
          <Button
            size="sm"
            variant={element.styles?.fontWeight === 'bold' ? 'default' : 'ghost'}
            onClick={() => handleTextStyle('fontWeight')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={element.styles?.fontStyle === 'italic' ? 'default' : 'ghost'}
            onClick={() => handleTextStyle('fontStyle')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={element.styles?.textDecoration === 'underline' ? 'default' : 'ghost'}
            onClick={() => handleTextStyle('textDecoration')}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            size="sm"
            variant={element.styles?.textAlign === 'left' ? 'default' : 'ghost'}
            onClick={() => handleTextAlign('left')}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={element.styles?.textAlign === 'center' ? 'default' : 'ghost'}
            onClick={() => handleTextAlign('center')}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={element.styles?.textAlign === 'right' ? 'default' : 'ghost'}
            onClick={() => handleTextAlign('right')}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
        </>
      )}

      {/* Layer controls */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => moveLayer('up')}
        className="h-8 w-8 p-0"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => moveLayer('down')}
        className="h-8 w-8 p-0"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* General controls */}
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleVisibility}
        className="h-8 w-8 p-0"
      >
        {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleLock}
        className="h-8 w-8 p-0"
      >
        {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDuplicate(element)}
        className="h-8 w-8 p-0"
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDelete(element.id)}
        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
