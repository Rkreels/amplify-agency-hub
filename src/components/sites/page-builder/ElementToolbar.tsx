
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Move, Lock, Unlock, MoreHorizontal } from 'lucide-react';
import { Element } from './types';

interface ElementToolbarProps {
  element: Element;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (element: Element) => void;
}

export function ElementToolbar({
  element,
  onUpdate,
  onDelete,
  onDuplicate
}: ElementToolbarProps) {
  const toggleLock = () => {
    onUpdate(element.id, { locked: !element.locked });
  };

  return (
    <div 
      className="absolute -top-10 left-0 flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-sm p-1 z-50"
      style={{
        left: element.position.x,
        top: element.position.y - 40
      }}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDuplicate(element)}
        title="Duplicate"
        className="h-8 w-8 p-0"
      >
        <Copy className="h-3 w-3" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleLock}
        title={element.locked ? 'Unlock' : 'Lock'}
        className="h-8 w-8 p-0"
      >
        {element.locked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDelete(element.id)}
        title="Delete"
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
