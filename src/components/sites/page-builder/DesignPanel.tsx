import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Layout, Copy, Trash2 } from 'lucide-react';

import { Element } from './types';

interface DesignPanelProps {
  selectedElement: Element | null;
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void;
  onDuplicateElement: (elementId: string) => void;
  onDeleteElement: (elementId: string) => void;
}

export function DesignPanel({ selectedElement, onUpdateElement, onDuplicateElement, onDeleteElement }: DesignPanelProps) {

  const handleStyleChange = (styleKey: string, value: string) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, { styles: { ...selectedElement.styles, [styleKey]: value } });
  };

  return (
    <div className="space-y-6">
      {!selectedElement ? (
        <div className="text-center py-8 text-muted-foreground">
          <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an element to edit its properties</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Element Info */}
          <div className="p-3 bg-muted rounded-lg">
            <h3 className="font-medium capitalize">{selectedElement.type} Element</h3>
            <p className="text-sm text-muted-foreground">ID: {selectedElement.id}</p>
          </div>

          {/* Content */}
          {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
            <div>
              <Label>Content</Label>
              <Textarea
                value={selectedElement.content}
                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                placeholder="Enter content..."
              />
            </div>
          )}

          {/* URL for images and buttons */}
          {selectedElement.type === 'image' && (
            <div>
              <Label>Image URL</Label>
              <Input
                value={selectedElement.src || ''}
                onChange={(e) => onUpdateElement(selectedElement.id, { src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {selectedElement.type === 'button' && (
            <div>
              <Label>Button URL</Label>
              <Input
                value={selectedElement.href || ''}
                onChange={(e) => onUpdateElement(selectedElement.id, { href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          )}

          {/* Styling Options */}
          <div className="space-y-2">
            <Label>Font Size</Label>
            <Input
              type="number"
              value={selectedElement.styles?.fontSize || ''}
              onChange={(e) => handleStyleChange('fontSize', e.target.value)}
              placeholder="16px"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Input
              type="color"
              value={selectedElement.styles?.color || '#000000'}
              onChange={(e) => handleStyleChange('color', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Background Color</Label>
            <Input
              type="color"
              value={selectedElement.styles?.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t space-y-2">
            <Button
              onClick={() => onDuplicateElement(selectedElement.id)}
              variant="outline"
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Element
            </Button>
            <Button
              onClick={() => onDeleteElement(selectedElement.id)}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Element
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
