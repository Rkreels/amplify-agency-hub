
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Copy, Trash2, Lock, Unlock, Palette } from 'lucide-react';
import { Element } from './types';

interface DesignPanelProps {
  selectedElement: Element | null;
  onUpdateElement: (id: string, updates: Partial<Element>) => void;
  onDuplicateElement: (element: Element) => void;
  onDeleteElement: (id: string) => void;
}

export function DesignPanel({
  selectedElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement
}: DesignPanelProps) {
  if (!selectedElement) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select an element to edit its design</p>
      </div>
    );
  }

  const toggleLock = () => {
    onUpdateElement(selectedElement.id, { locked: !selectedElement.locked });
  };

  return (
    <div className="space-y-6">
      {/* Element Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onDuplicateElement(selectedElement)}>
          <Copy className="h-4 w-4 mr-1" />
          Duplicate
        </Button>
        <Button size="sm" variant="outline" onClick={toggleLock}>
          {selectedElement.locked ? <Unlock className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
          {selectedElement.locked ? 'Unlock' : 'Lock'}
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onDeleteElement(selectedElement.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Position & Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Position & Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">X Position</Label>
            <Input
              type="number"
              value={selectedElement.position.x}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div>
            <Label className="text-xs">Y Position</Label>
            <Input
              type="number"
              value={selectedElement.position.y}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={selectedElement.size.width}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                size: { ...selectedElement.size, width: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={selectedElement.size.height}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 }
              })}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Content</Label>
          <Textarea
            value={selectedElement.content || ''}
            onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
            rows={3}
          />
        </div>
      )}

      {/* Typography */}
      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Typography</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Font Size</Label>
              <Input
                value={selectedElement.styles?.fontSize || '16px'}
                onChange={(e) => onUpdateElement(selectedElement.id, {
                  styles: { ...selectedElement.styles, fontSize: e.target.value }
                })}
              />
            </div>
            <div>
              <Label className="text-xs">Font Weight</Label>
              <Select
                value={selectedElement.styles?.fontWeight || 'normal'}
                onValueChange={(value) => onUpdateElement(selectedElement.id, {
                  styles: { ...selectedElement.styles, fontWeight: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Text Color</Label>
            <Input
              type="color"
              value={selectedElement.styles?.color || '#000000'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, color: e.target.value }
              })}
            />
          </div>
        </div>
      )}

      {/* Background & Border */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Background & Border</Label>
        <div>
          <Label className="text-xs">Background Color</Label>
          <Input
            type="color"
            value={selectedElement.styles?.backgroundColor || '#ffffff'}
            onChange={(e) => onUpdateElement(selectedElement.id, {
              styles: { ...selectedElement.styles, backgroundColor: e.target.value }
            })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Border Width</Label>
            <Input
              value={selectedElement.styles?.borderWidth || '0px'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, borderWidth: e.target.value }
              })}
            />
          </div>
          <div>
            <Label className="text-xs">Border Radius</Label>
            <Input
              value={selectedElement.styles?.borderRadius || '0px'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, borderRadius: e.target.value }
              })}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Border Color</Label>
          <Input
            type="color"
            value={selectedElement.styles?.borderColor || '#000000'}
            onChange={(e) => onUpdateElement(selectedElement.id, {
              styles: { ...selectedElement.styles, borderColor: e.target.value }
            })}
          />
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Spacing</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              value={selectedElement.styles?.padding || '0px'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, padding: e.target.value }
              })}
            />
          </div>
          <div>
            <Label className="text-xs">Margin</Label>
            <Input
              value={selectedElement.styles?.margin || '0px'}
              onChange={(e) => onUpdateElement(selectedElement.id, {
                styles: { ...selectedElement.styles, margin: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      {/* Link Settings for Buttons */}
      {selectedElement.type === 'button' && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Link Settings</Label>
          <div>
            <Label className="text-xs">URL</Label>
            <Input
              value={selectedElement.href || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { href: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <Label className="text-xs">Target</Label>
            <Select
              value={selectedElement.target || '_self'}
              onValueChange={(value) => onUpdateElement(selectedElement.id, { target: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_self">Same Window</SelectItem>
                <SelectItem value="_blank">New Window</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Media Settings */}
      {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Media Settings</Label>
          <div>
            <Label className="text-xs">Source URL</Label>
            <Input
              value={selectedElement.src || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { src: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <Label className="text-xs">Alt Text</Label>
            <Input
              value={selectedElement.alt || ''}
              onChange={(e) => onUpdateElement(selectedElement.id, { alt: e.target.value })}
              placeholder="Description"
            />
          </div>
        </div>
      )}
    </div>
  );
}
