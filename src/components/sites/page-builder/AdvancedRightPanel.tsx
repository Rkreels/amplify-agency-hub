
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Settings, Palette, Type, Image, Square, Layout, 
  Copy, Trash2, ChevronDown, ChevronRight, Layers, Grid, 
  Box, Text, FormInput, Video, Minus, MoreHorizontal, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  MousePointer, Smartphone, Monitor, Globe, Search, Filter,
  Download, Upload, Code
} from 'lucide-react';
import { Element } from './types';

interface AdvancedRightPanelProps {
  activeTab: 'elements' | 'design' | 'settings' | 'templates';
  onTabChange: (tab: 'elements' | 'design' | 'settings' | 'templates') => void;
  selectedElement: Element | null;
  onAddElement: (elementType: string) => void;
  onUpdateElement: (id: string, updates: Partial<Element>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (element: Element) => void;
  pageSettings: any;
  onPageSettingsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const elementCategories = [
  {
    name: 'Basic',
    elements: [
      { type: 'text', label: 'Text', icon: Type, description: 'Add text content' },
      { type: 'heading', label: 'Heading', icon: Type, description: 'Add headings' },
      { type: 'image', label: 'Image', icon: Image, description: 'Add images' },
      { type: 'button', label: 'Button', icon: Square, description: 'Add buttons' },
    ]
  },
  {
    name: 'Layout',
    elements: [
      { type: 'container', label: 'Container', icon: Box, description: 'Group elements' },
      { type: 'divider', label: 'Divider', icon: Minus, description: 'Add separators' },
      { type: 'spacer', label: 'Spacer', icon: MoreHorizontal, description: 'Add spacing' },
      { type: 'columns', label: 'Columns', icon: Grid, description: 'Multi-column layout' },
    ]
  },
  {
    name: 'Forms',
    elements: [
      { type: 'form', label: 'Form', icon: FormInput, description: 'Contact forms' },
      { type: 'input', label: 'Input', icon: FormInput, description: 'Text inputs' },
      { type: 'textarea', label: 'Textarea', icon: FormInput, description: 'Text areas' },
      { type: 'select', label: 'Select', icon: FormInput, description: 'Dropdown menus' },
    ]
  },
  {
    name: 'Media',
    elements: [
      { type: 'video', label: 'Video', icon: Video, description: 'Embed videos' },
      { type: 'gallery', label: 'Gallery', icon: Image, description: 'Image galleries' },
      { type: 'slider', label: 'Slider', icon: Image, description: 'Image sliders' },
      { type: 'map', label: 'Map', icon: Globe, description: 'Google Maps' },
    ]
  }
];

const templates = [
  {
    id: 'hero-1',
    name: 'Hero Section',
    category: 'Hero',
    thumbnail: '/api/placeholder/200/120',
    description: 'Professional hero section with CTA'
  },
  {
    id: 'feature-grid',
    name: 'Feature Grid',
    category: 'Features',
    thumbnail: '/api/placeholder/200/120',
    description: '3-column feature showcase'
  },
  {
    id: 'testimonial',
    name: 'Testimonials',
    category: 'Social Proof',
    thumbnail: '/api/placeholder/200/120',
    description: 'Customer testimonial cards'
  },
  {
    id: 'pricing',
    name: 'Pricing Table',
    category: 'Pricing',
    thumbnail: '/api/placeholder/200/120',
    description: 'Professional pricing plans'
  },
  {
    id: 'contact',
    name: 'Contact Form',
    category: 'Forms',
    thumbnail: '/api/placeholder/200/120',
    description: 'Contact form with validation'
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'Layout',
    thumbnail: '/api/placeholder/200/120',
    description: 'Complete footer section'
  }
];

export function AdvancedRightPanel({
  activeTab,
  onTabChange,
  selectedElement,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  pageSettings,
  onPageSettingsChange
}: AdvancedRightPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [templateCategory, setTemplateCategory] = useState('all');
  const [openCategories, setOpenCategories] = useState<string[]>(['Basic']);

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleStyleChange = (styleKey: string, value: string | number) => {
    if (!selectedElement) return;
    onUpdateElement(selectedElement.id, { 
      styles: { ...selectedElement.styles, [styleKey]: value } 
    });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = templateCategory === 'all' || template.category === templateCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-4 border-b">
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="elements" className="text-xs">Elements</TabsTrigger>
            <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Panel Content */}
      <ScrollArea className="flex-1">
        <Tabs value={activeTab} className="w-full">
          {/* Elements Tab */}
          <TabsContent value="elements" className="m-0 p-4 space-y-4">
            <div className="space-y-4">
              {elementCategories.map((category) => (
                <Collapsible
                  key={category.name}
                  open={openCategories.includes(category.name)}
                  onOpenChange={() => toggleCategory(category.name)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                      <span className="font-medium">{category.name}</span>
                      {openCategories.includes(category.name) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {category.elements.map((element) => (
                      <Button
                        key={element.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => onAddElement(element.type)}
                      >
                        <element.icon className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{element.label}</div>
                          <div className="text-xs text-gray-500">{element.description}</div>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </TabsContent>

          {/* Design Tab */}
          <TabsContent value="design" className="m-0 p-4 space-y-4">
            {selectedElement ? (
              <div className="space-y-6">
                {/* Element Info */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="capitalize">{selectedElement.type} Element</span>
                      <Badge variant="outline" className="text-xs">{selectedElement.id}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Content Controls */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">Content</Label>
                        <Textarea
                          value={selectedElement.content}
                          onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                          placeholder="Enter content..."
                          className="text-sm"
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Typography Controls */}
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Typography</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Font Size</Label>
                          <Input
                            type="number"
                            value={parseInt(selectedElement.styles?.fontSize || '16')}
                            onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Line Height</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={parseFloat(selectedElement.styles?.lineHeight || '1.5')}
                            onChange={(e) => handleStyleChange('lineHeight', e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-1">
                        <Button
                          variant={selectedElement.styles?.fontWeight === 'bold' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStyleChange('fontWeight', selectedElement.styles?.fontWeight === 'bold' ? 'normal' : 'bold')}
                        >
                          <Bold className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={selectedElement.styles?.fontStyle === 'italic' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStyleChange('fontStyle', selectedElement.styles?.fontStyle === 'italic' ? 'normal' : 'italic')}
                        >
                          <Italic className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={selectedElement.styles?.textDecoration === 'underline' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStyleChange('textDecoration', selectedElement.styles?.textDecoration === 'underline' ? 'none' : 'underline')}
                        >
                          <Underline className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex space-x-1">
                        <Button
                          variant={selectedElement.styles?.textAlign === 'left' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStyleChange('textAlign', 'left')}
                        >
                          <AlignLeft className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={selectedElement.styles?.textAlign === 'center' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStyleChange('textAlign', 'center')}
                        >
                          <AlignCenter className="h-3 w-3" />
                        </Button>
                        <Button
                          variant={selectedElement.styles?.textAlign === 'right' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStyleChange('textAlign', 'right')}
                        >
                          <AlignRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Color Controls */}
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Colors</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Text Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="color"
                              value={selectedElement.styles?.color || '#000000'}
                              onChange={(e) => handleStyleChange('color', e.target.value)}
                              className="w-12 h-8 p-1 border rounded"
                            />
                            <Input
                              type="text"
                              value={selectedElement.styles?.color || '#000000'}
                              onChange={(e) => handleStyleChange('color', e.target.value)}
                              className="flex-1 text-xs"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Background</Label>
                          <div className="flex space-x-2">
                            <Input
                              type="color"
                              value={selectedElement.styles?.backgroundColor || '#ffffff'}
                              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                              className="w-12 h-8 p-1 border rounded"
                            />
                            <Input
                              type="text"
                              value={selectedElement.styles?.backgroundColor || '#ffffff'}
                              onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                              className="flex-1 text-xs"
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacing Controls */}
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Spacing</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Padding</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.padding || '10px'}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                            className="text-xs"
                            placeholder="10px"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Margin</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.margin || '0px'}
                            onChange={(e) => handleStyleChange('margin', e.target.value)}
                            className="text-xs"
                            placeholder="0px"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Border Controls */}
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Border</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs">Border</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.border || 'none'}
                            onChange={(e) => handleStyleChange('border', e.target.value)}
                            className="text-xs"
                            placeholder="1px solid #ccc"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Border Radius</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.borderRadius || '0px'}
                            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                            className="text-xs"
                            placeholder="4px"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Element Actions */}
                <Card>
                  <CardContent className="pt-6 space-y-2">
                    <Button
                      onClick={() => onDuplicateElement(selectedElement)}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate Element
                    </Button>
                    <Button
                      onClick={() => onDeleteElement(selectedElement.id)}
                      variant="destructive"
                      className="w-full text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Element
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Select an element to edit its design</p>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="m-0 p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Page Title</Label>
                  <Input
                    name="title"
                    value={pageSettings.title}
                    onChange={onPageSettingsChange}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Meta Description</Label>
                  <Textarea
                    name="description"
                    value={pageSettings.description}
                    onChange={onPageSettingsChange}
                    className="text-sm"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Keywords</Label>
                  <Input
                    name="keywords"
                    value={pageSettings.keywords}
                    onChange={onPageSettingsChange}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Page Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full text-sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Page
                </Button>
                <Button variant="outline" className="w-full text-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Page
                </Button>
                <Button variant="outline" className="w-full text-sm">
                  <Code className="h-4 w-4 mr-2" />
                  View HTML
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="m-0 p-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
                <Select value={templateCategory} onValueChange={setTemplateCategory}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Hero">Hero</SelectItem>
                    <SelectItem value="Features">Features</SelectItem>
                    <SelectItem value="Social Proof">Social Proof</SelectItem>
                    <SelectItem value="Pricing">Pricing</SelectItem>
                    <SelectItem value="Forms">Forms</SelectItem>
                    <SelectItem value="Layout">Layout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-t-lg"></div>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                      <Button size="sm" className="w-full text-xs">
                        Add Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
