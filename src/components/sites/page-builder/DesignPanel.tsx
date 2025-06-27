
import React from 'react';
import { Element } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Palette,
  Layout,
  Spacing,
  Type,
  Image,
  Link,
  Settings,
  Eye,
  EyeOff,
  Move,
  RotateCw,
  Layers,
  Box,
  Border,
  Shadow,
  Zap,
  MousePointer,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

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
        <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="font-medium mb-2">No Element Selected</h3>
        <p className="text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  const updateElementStyle = (styleKey: string, styleValue: string) => {
    onUpdateElement(selectedElement.id, { 
      styles: { ...selectedElement.styles, [styleKey]: styleValue }
    });
  };

  const updateElementAttribute = (attrKey: string, attrValue: string) => {
    onUpdateElement(selectedElement.id, { 
      attributes: { ...selectedElement.attributes, [attrKey]: attrValue }
    });
  };

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '60px', '72px'];
  const fontWeights = [
    { label: 'Thin', value: '100' },
    { label: 'Light', value: '300' },
    { label: 'Normal', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semi Bold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Extra Bold', value: '800' },
    { label: 'Black', value: '900' }
  ];

  return (
    <div className="space-y-4">
      {/* Element Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg capitalize">{selectedElement.type}</CardTitle>
            <Badge variant="outline">{selectedElement.id.slice(-6)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDuplicateElement(selectedElement.id)}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDeleteElement(selectedElement.id)}
              className="flex-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Content Settings */}
          {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Content</Label>
                  {selectedElement.type === 'text' ? (
                    <Textarea
                      value={selectedElement.content || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                      placeholder="Enter text content"
                      rows={3}
                    />
                  ) : (
                    <Input
                      value={selectedElement.content || ''}
                      onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                      placeholder="Button text"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedElement.type === 'button' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Link Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Link URL</Label>
                  <Input
                    value={selectedElement.href || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { href: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label>Target</Label>
                  <Select
                    value={selectedElement.target || '_self'}
                    onValueChange={(value: '_blank' | '_self') => onUpdateElement(selectedElement.id, { target: value })}
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
              </CardContent>
            </Card>
          )}

          {selectedElement.type === 'image' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Image Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>
          )}

          {selectedElement.type === 'video' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Video Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Video URL</Label>
                  <Input
                    value={selectedElement.src || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { src: e.target.value })}
                    placeholder="https://youtube.com/embed/..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          {/* Typography */}
          {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Font Size</Label>
                    <Select
                      value={selectedElement.styles.fontSize || '16px'}
                      onValueChange={(value) => updateElementStyle('fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        {fontWeights.map(weight => (
                          <SelectItem key={weight.value} value={weight.value}>{weight.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={selectedElement.styles.color || '#000000'}
                      onChange={(e) => updateElementStyle('color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={selectedElement.styles.color || '#000000'}
                      onChange={(e) => updateElementStyle('color', e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Text Alignment</Label>
                  <div className="flex gap-1 mt-1">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight },
                      { value: 'justify', icon: AlignJustify }
                    ].map(({ value, icon: Icon }) => (
                      <Button
                        key={value}
                        size="sm"
                        variant={selectedElement.styles.textAlign === value ? 'default' : 'outline'}
                        onClick={() => updateElementStyle('textAlign', value)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={selectedElement.styles.lineHeight || '1.5'}
                    onChange={(e) => updateElementStyle('lineHeight', e.target.value)}
                    placeholder="1.5"
                  />
                </div>

                <div>
                  <Label className="text-xs">Letter Spacing</Label>
                  <Input
                    value={selectedElement.styles.letterSpacing || '0px'}
                    onChange={(e) => updateElementStyle('letterSpacing', e.target.value)}
                    placeholder="0px"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Colors & Background */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors & Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateElementStyle('backgroundColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Background Image</Label>
                <Input
                  value={selectedElement.styles.backgroundImage || ''}
                  onChange={(e) => updateElementStyle('backgroundImage', e.target.value ? `url(${e.target.value})` : '')}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label className="text-xs">Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[parseFloat(selectedElement.styles.opacity || '1') * 100]}
                    onValueChange={(value) => updateElementStyle('opacity', (value[0] / 100).toString())}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm w-12 text-right">
                    {Math.round(parseFloat(selectedElement.styles.opacity || '1') * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Border & Shadow */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Border className="h-4 w-4" />
                Border & Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Border Radius</Label>
                <Input
                  value={selectedElement.styles.borderRadius || '0px'}
                  onChange={(e) => updateElementStyle('borderRadius', e.target.value)}
                  placeholder="0px"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Border Width</Label>
                  <Input
                    value={selectedElement.styles.borderWidth || '0px'}
                    onChange={(e) => updateElementStyle('borderWidth', e.target.value)}
                    placeholder="0px"
                  />
                </div>
                <div>
                  <Label className="text-xs">Border Style</Label>
                  <Select
                    value={selectedElement.styles.borderStyle || 'solid'}
                    onValueChange={(value) => updateElementStyle('borderStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                      <SelectItem value="dotted">Dotted</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs">Border Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={selectedElement.styles.borderColor || '#000000'}
                    onChange={(e) => updateElementStyle('borderColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={selectedElement.styles.borderColor || '#000000'}
                    onChange={(e) => updateElementStyle('borderColor', e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Box Shadow</Label>
                <Input
                  value={selectedElement.styles.boxShadow || ''}
                  onChange={(e) => updateElementStyle('boxShadow', e.target.value)}
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          {/* Spacing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Spacing className="h-4 w-4" />
                Spacing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
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
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Box className="h-4 w-4" />
                Dimensions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    value={selectedElement.styles.width || ''}
                    onChange={(e) => updateElementStyle('width', e.target.value)}
                    placeholder="auto"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    value={selectedElement.styles.height || ''}
                    onChange={(e) => updateElementStyle('height', e.target.value)}
                    placeholder="auto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Max Width</Label>
                  <Input
                    value={selectedElement.styles.maxWidth || ''}
                    onChange={(e) => updateElementStyle('maxWidth', e.target.value)}
                    placeholder="none"
                  />
                </div>
                <div>
                  <Label className="text-xs">Max Height</Label>
                  <Input
                    value={selectedElement.styles.maxHeight || ''}
                    onChange={(e) => updateElementStyle('maxHeight', e.target.value)}
                    placeholder="none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flexbox */}
          {selectedElement.type === 'container' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Flexbox Layout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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

                <div>
                  <Label className="text-xs">Justify Content</Label>
                  <Select
                    value={selectedElement.styles.justifyContent || 'flex-start'}
                    onValueChange={(value) => updateElementStyle('justifyContent', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flex-start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="flex-end">End</SelectItem>
                      <SelectItem value="space-between">Space Between</SelectItem>
                      <SelectItem value="space-around">Space Around</SelectItem>
                      <SelectItem value="space-evenly">Space Evenly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Align Items</Label>
                  <Select
                    value={selectedElement.styles.alignItems || 'stretch'}
                    onValueChange={(value) => updateElementStyle('alignItems', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stretch">Stretch</SelectItem>
                      <SelectItem value="flex-start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="flex-end">End</SelectItem>
                      <SelectItem value="baseline">Baseline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Gap</Label>
                  <Input
                    value={selectedElement.styles.gap || ''}
                    onChange={(e) => updateElementStyle('gap', e.target.value)}
                    placeholder="10px"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {/* Position */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Move className="h-4 w-4" />
                Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Position</Label>
                <Select
                  value={selectedElement.styles.position || 'relative'}
                  onValueChange={(value) => updateElementStyle('position', value)}
                >
                  <SelectTrigger>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Top</Label>
                  <Input
                    value={selectedElement.styles.top || ''}
                    onChange={(e) => updateElementStyle('top', e.target.value)}
                    placeholder="auto"
                  />
                </div>
                <div>
                  <Label className="text-xs">Right</Label>
                  <Input
                    value={selectedElement.styles.right || ''}
                    onChange={(e) => updateElementStyle('right', e.target.value)}
                    placeholder="auto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Bottom</Label>
                  <Input
                    value={selectedElement.styles.bottom || ''}
                    onChange={(e) => updateElementStyle('bottom', e.target.value)}
                    placeholder="auto"
                  />
                </div>
                <div>
                  <Label className="text-xs">Left</Label>
                  <Input
                    value={selectedElement.styles.left || ''}
                    onChange={(e) => updateElementStyle('left', e.target.value)}
                    placeholder="auto"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Z-Index</Label>
                <Input
                  value={selectedElement.styles.zIndex || ''}
                  onChange={(e) => updateElementStyle('zIndex', e.target.value)}
                  placeholder="auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Transform & Animation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <RotateCw className="h-4 w-4" />
                Transform & Animation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Transform</Label>
                <Input
                  value={selectedElement.styles.transform || ''}
                  onChange={(e) => updateElementStyle('transform', e.target.value)}
                  placeholder="rotate(0deg) scale(1)"
                />
              </div>

              <div>
                <Label className="text-xs">Transition</Label>
                <Input
                  value={selectedElement.styles.transition || ''}
                  onChange={(e) => updateElementStyle('transition', e.target.value)}
                  placeholder="all 0.3s ease"
                />
              </div>

              <div>
                <Label className="text-xs">Animation</Label>
                <Input
                  value={selectedElement.styles.animation || ''}
                  onChange={(e) => updateElementStyle('animation', e.target.value)}
                  placeholder="fadeIn 1s ease-in-out"
                />
              </div>
            </CardContent>
          </Card>

          {/* Responsive Design */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Responsive Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Hide on Mobile</Label>
                <Switch
                  checked={selectedElement.styles.display === 'none'}
                  onCheckedChange={(checked) => updateElementStyle('display', checked ? 'none' : 'block')}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                More responsive options coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
