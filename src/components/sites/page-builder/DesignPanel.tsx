
import React from 'react';
import { Element } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Copy, Trash2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface DesignPanelProps {
  selectedElement: Element | null;
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void;
  onDuplicateElement: (elementId: string) => void;
  onDeleteElement: (elementId: string) => void;
}

export function DesignPanel({ 
  selectedElement, 
  onUpdateElement, 
  onDuplicateElement, 
  onDeleteElement 
}: DesignPanelProps) {
  if (!selectedElement) {
    return (
      <div className="text-center text-gray-500 py-8">
        Select an element to edit its properties
      </div>
    );
  }

  const updateElementStyle = (styleKey: string, styleValue: string) => {
    onUpdateElement(selectedElement.id, { 
      styles: { ...selectedElement.styles, [styleKey]: styleValue }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Element: {selectedElement.type}</Label>
      </div>
      
      {selectedElement.type === 'text' && (
        <div className="space-y-3">
          <div>
            <Label>Content</Label>
            <Textarea
              value={selectedElement.content || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
              placeholder="Enter text content"
            />
          </div>
        </div>
      )}

      {selectedElement.type === 'button' && (
        <div className="space-y-3">
          <div>
            <Label>Button Text</Label>
            <Input
              value={selectedElement.content || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
              placeholder="Button text"
            />
          </div>
          <div>
            <Label>Link URL</Label>
            <Input
              value={selectedElement.href || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { href: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>
      )}

      {selectedElement.type === 'image' && (
        <div className="space-y-3">
          <div>
            <Label>Image URL</Label>
            <Input
              value={selectedElement.src || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { src: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={selectedElement.alt || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { alt: e.target.value })}
              placeholder="Image description"
            />
          </div>
        </div>
      )}

      <Separator />
      <div className="space-y-3">
        <Label className="font-medium">Styling</Label>
        
        {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Input
                value={selectedElement.styles.fontSize || ''}
                onChange={(e) => updateElementStyle('fontSize', e.target.value)}
                placeholder="16px"
              />
            </div>
            <div>
              <Label className="text-xs">Font Weight</Label>
              <Select
                value={selectedElement.styles.fontWeight || '400'}
                onValueChange={(value) => updateElementStyle('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="400">Normal</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Text Color</Label>
              <Input
                type="color"
                value={selectedElement.styles.color || '#000000'}
                onChange={(e) => updateElementStyle('color', e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div>
            <Label className="text-xs">Background Color</Label>
            <Input
              type="color"
              value={selectedElement.styles.backgroundColor || '#ffffff'}
              onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              value={selectedElement.styles.padding || ''}
              onChange={(e) => updateElementStyle('padding', e.target.value)}
              placeholder="10px"
            />
          </div>
          <div>
            <Label className="text-xs">Margin</Label>
            <Input
              value={selectedElement.styles.margin || ''}
              onChange={(e) => updateElementStyle('margin', e.target.value)}
              placeholder="10px"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Label className="text-xs">Border Radius</Label>
            <Input
              value={selectedElement.styles.borderRadius || ''}
              onChange={(e) => updateElementStyle('borderRadius', e.target.value)}
              placeholder="4px"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Text Alignment</Label>
          <div className="flex gap-1 mt-1">
            <Button
              size="sm"
              variant={selectedElement.styles.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => updateElementStyle('textAlign', 'left')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.styles.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => updateElementStyle('textAlign', 'center')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={selectedElement.styles.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => updateElementStyle('textAlign', 'right')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedElement.type === 'container' && (
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Flex Direction</Label>
              <Select
                value={selectedElement.styles.flexDirection || 'column'}
                onValueChange={(value: 'row' | 'column' | 'row-reverse' | 'column-reverse') => updateElementStyle('flexDirection', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <Separator />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDuplicateElement(selectedElement.id)}
        >
          <Copy className="h-4 w-4 mr-1" />
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDeleteElement(selectedElement.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
