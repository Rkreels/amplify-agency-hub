
import React from 'react';
import { Element } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Trash2, 
  Palette, 
  Type, 
  Layout, 
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCcw,
  Link,
  Image,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

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
      <div className="p-4 text-center">
        <div className="mb-4">
          <Settings className="h-12 w-12 mx-auto text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Element Selected</h3>
        <p className="text-sm text-gray-500">
          Click on any element in the canvas to edit its properties
        </p>
      </div>
    );
  }

  const updateStyle = (property: string, value: string) => {
    onUpdateElement(selectedElement.id, {
      styles: {
        ...selectedElement.styles,
        [property]: value
      }
    });
  };

  const updateContent = (content: string) => {
    onUpdateElement(selectedElement.id, { content });
  };

  const updateAttribute = (attribute: string, value: any) => {
    onUpdateElement(selectedElement.id, {
      attributes: {
        ...selectedElement.attributes,
        [attribute]: value
      }
    });
  };

  const updateProp = (prop: string, value: any) => {
    onUpdateElement(selectedElement.id, {
      props: {
        ...selectedElement.props,
        [prop]: value
      }
    });
  };

  const resetStyles = () => {
    onUpdateElement(selectedElement.id, { styles: {} });
    toast.success('Styles reset to default');
  };

  return (
    <div className="space-y-4">
      {/* Element Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {selectedElement.type}
          </Badge>
          <span className="text-sm font-medium text-gray-700">
            Element #{selectedElement.id.slice(-4)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDuplicateElement(selectedElement.id)}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetStyles}
            title="Reset Styles"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteElement(selectedElement.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Type className="h-4 w-4" />
                Content Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Content */}
              {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                <div>
                  <Label className="text-sm font-medium">Text Content</Label>
                  <Textarea
                    value={selectedElement.content || ''}
                    onChange={(e) => updateContent(e.target.value)}
                    placeholder="Enter your text here..."
                    className="mt-1"
                  />
                </div>
              )}

              {/* Heading Level */}
              {selectedElement.type === 'heading' && (
                <div>
                  <Label className="text-sm font-medium">Heading Level</Label>
                  <Select 
                    value={selectedElement.props?.level || 'h2'} 
                    onValueChange={(value) => updateProp('level', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h1">H1 - Main Heading</SelectItem>
                      <SelectItem value="h2">H2 - Section Heading</SelectItem>
                      <SelectItem value="h3">H3 - Subsection</SelectItem>
                      <SelectItem value="h4">H4 - Minor Heading</SelectItem>
                      <SelectItem value="h5">H5 - Small Heading</SelectItem>
                      <SelectItem value="h6">H6 - Tiny Heading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Link Settings */}
              {selectedElement.type === 'button' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Link URL</Label>
                    <Input
                      value={selectedElement.href || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { href: e.target.value })}
                      placeholder="https://example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Link Target</Label>
                    <Select 
                      value={selectedElement.target || '_self'} 
                      onValueChange={(value: '_blank' | '_self') => onUpdateElement(selectedElement.id, { target: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">Same Window</SelectItem>
                        <SelectItem value="_blank">New Window</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Image Settings */}
              {selectedElement.type === 'image' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Image URL</Label>
                    <Input
                      value={selectedElement.src || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { src: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Alt Text</Label>
                    <Input
                      value={selectedElement.alt || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { alt: e.target.value })}
                      placeholder="Describe the image"
                      className="mt-1"
                    />
                  </div>
                </>
              )}

              {/* Video Settings */}
              {selectedElement.type === 'video' && (
                <div>
                  <Label className="text-sm font-medium">Video URL</Label>
                  <Input
                    value={selectedElement.src || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { src: e.target.value })}
                    placeholder="YouTube embed URL"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Input Settings */}
              {selectedElement.type === 'input' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Input Type</Label>
                    <Select 
                      value={selectedElement.attributes?.type || 'text'} 
                      onValueChange={(value) => updateAttribute('type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="password">Password</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Placeholder</Label>
                    <Input
                      value={selectedElement.attributes?.placeholder || ''}
                      onChange={(e) => updateAttribute('placeholder', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Field Name</Label>
                    <Input
                      value={selectedElement.attributes?.name || ''}
                      onChange={(e) => updateAttribute('name', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedElement.attributes?.required || false}
                      onCheckedChange={(checked) => updateAttribute('required', checked)}
                    />
                    <Label className="text-sm">Required Field</Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Typography */}
              {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Font Size</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Slider
                        value={[parseInt(selectedElement.styles?.fontSize || '16')]}
                        onValueChange={([value]) => updateStyle('fontSize', `${value}px`)}
                        max={72}
                        min={8}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-12">
                        {selectedElement.styles?.fontSize || '16px'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Font Weight</Label>
                    <Select 
                      value={selectedElement.styles?.fontWeight || 'normal'} 
                      onValueChange={(value) => updateStyle('fontWeight', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                        <SelectItem value="bolder">Bolder</SelectItem>
                        <SelectItem value="lighter">Lighter</SelectItem>
                        <SelectItem value="100">Thin</SelectItem>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                        <SelectItem value="900">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Text Alignment</Label>
                    <Select 
                      value={selectedElement.styles?.textAlign || 'left'} 
                      onValueChange={(value) => updateStyle('textAlign', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="justify">Justify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Text Color</Label>
                    <Input
                      type="color"
                      value={selectedElement.styles?.color || '#000000'}
                      onChange={(e) => updateStyle('color', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>
                </>
              )}

              {/* Background & Colors */}
              <div>
                <Label className="text-sm font-medium">Background Color</Label>
                <Input
                  type="color"
                  value={selectedElement.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                  className="mt-1 h-10"
                />
              </div>

              {/* Border */}
              <div>
                <Label className="text-sm font-medium">Border</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Border width"
                    value={selectedElement.styles?.borderWidth || ''}
                    onChange={(e) => updateStyle('borderWidth', e.target.value)}
                  />
                  <Select 
                    value={selectedElement.styles?.borderStyle || 'solid'} 
                    onValueChange={(value) => updateStyle('borderStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="color"
                  value={selectedElement.styles?.borderColor || '#000000'}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="mt-2 h-10"
                  placeholder="Border color"
                />
              </div>

              {/* Border Radius */}
              <div>
                <Label className="text-sm font-medium">Border Radius</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    value={[parseInt(selectedElement.styles?.borderRadius || '0')]}
                    onValueChange={([value]) => updateStyle('borderRadius', `${value}px`)}
                    max={50}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-12">
                    {selectedElement.styles?.borderRadius || '0px'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Layout & Spacing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm font-medium">Width</Label>
                  <Input
                    value={selectedElement.styles?.width || ''}
                    onChange={(e) => updateStyle('width', e.target.value)}
                    placeholder="auto"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Height</Label>
                  <Input
                    value={selectedElement.styles?.height || ''}
                    onChange={(e) => updateStyle('height', e.target.value)}
                    placeholder="auto"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Padding */}
              <div>
                <Label className="text-sm font-medium">Padding</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Top"
                    value={selectedElement.styles?.paddingTop || ''}
                    onChange={(e) => updateStyle('paddingTop', e.target.value)}
                  />
                  <Input
                    placeholder="Right"
                    value={selectedElement.styles?.paddingRight || ''}
                    onChange={(e) => updateStyle('paddingRight', e.target.value)}
                  />
                  <Input
                    placeholder="Bottom"
                    value={selectedElement.styles?.paddingBottom || ''}
                    onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                  />
                  <Input
                    placeholder="Left"
                    value={selectedElement.styles?.paddingLeft || ''}
                    onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                  />
                </div>
              </div>

              {/* Margin */}
              <div>
                <Label className="text-sm font-medium">Margin</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Top"
                    value={selectedElement.styles?.marginTop || ''}
                    onChange={(e) => updateStyle('marginTop', e.target.value)}
                  />
                  <Input
                    placeholder="Right"
                    value={selectedElement.styles?.marginRight || ''}
                    onChange={(e) => updateStyle('marginRight', e.target.value)}
                  />
                  <Input
                    placeholder="Bottom"
                    value={selectedElement.styles?.marginBottom || ''}
                    onChange={(e) => updateStyle('marginBottom', e.target.value)}
                  />
                  <Input
                    placeholder="Left"
                    value={selectedElement.styles?.marginLeft || ''}
                    onChange={(e) => updateStyle('marginLeft', e.target.value)}
                  />
                </div>
              </div>

              {/* Display & Position */}
              <div>
                <Label className="text-sm font-medium">Display</Label>
                <Select 
                  value={selectedElement.styles?.display || 'block'} 
                  onValueChange={(value) => updateStyle('display', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="inline-block">Inline Block</SelectItem>
                    <SelectItem value="flex">Flex</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Position</Label>
                <Select 
                  value={selectedElement.styles?.position || 'static'} 
                  onValueChange={(value) => updateStyle('position', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="absolute">Absolute</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="sticky">Sticky</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Opacity */}
              <div>
                <Label className="text-sm font-medium">Opacity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    value={[parseFloat(selectedElement.styles?.opacity || '1') * 100]}
                    onValueChange={([value]) => updateStyle('opacity', (value / 100).toString())}
                    max={100}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-12">
                    {Math.round(parseFloat(selectedElement.styles?.opacity || '1') * 100)}%
                  </span>
                </div>
              </div>

              {/* Z-Index */}
              <div>
                <Label className="text-sm font-medium">Z-Index</Label>
                <Input
                  type="number"
                  value={selectedElement.styles?.zIndex || ''}
                  onChange={(e) => updateStyle('zIndex', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>

              {/* Transform */}
              <div>
                <Label className="text-sm font-medium">Transform</Label>
                <Input
                  value={selectedElement.styles?.transform || ''}
                  onChange={(e) => updateStyle('transform', e.target.value)}
                  placeholder="rotate(0deg) scale(1)"
                  className="mt-1"
                />
              </div>

              {/* Transition */}
              <div>
                <Label className="text-sm font-medium">Transition</Label>
                <Input
                  value={selectedElement.styles?.transition || ''}
                  onChange={(e) => updateStyle('transition', e.target.value)}
                  placeholder="all 0.3s ease"
                  className="mt-1"
                />
              </div>

              {/* Box Shadow */}
              <div>
                <Label className="text-sm font-medium">Box Shadow</Label>
                <Input
                  value={selectedElement.styles?.boxShadow || ''}
                  onChange={(e) => updateStyle('boxShadow', e.target.value)}
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                  className="mt-1"
                />
              </div>

              {/* Custom CSS */}
              <div>
                <Label className="text-sm font-medium">Custom CSS</Label>
                <Textarea
                  value={selectedElement.styles?.customCSS || ''}
                  onChange={(e) => updateStyle('customCSS', e.target.value)}
                  placeholder="Add custom CSS properties..."
                  className="mt-1 font-mono text-sm"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
