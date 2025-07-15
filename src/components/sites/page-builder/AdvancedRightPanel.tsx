
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
  Download, Upload, Code, Star, Heart, Mail, Phone, MapPin,
  Calendar, Clock, User, Users, Database, Zap, Wifi, Camera,
  Play, Music, FileText, ShoppingCart, CreditCard, TrendingUp
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
  onDragStart: (elementData: any) => void;
}

const elementCategories = [
  {
    name: 'Basic Elements',
    elements: [
      { type: 'text', label: 'Text', icon: Type, description: 'Add text content' },
      { type: 'heading', label: 'Heading', icon: Type, description: 'Add headings H1-H6' },
      { type: 'button', label: 'Button', icon: Square, description: 'Call-to-action buttons' },
      { type: 'image', label: 'Image', icon: Image, description: 'Add images and photos' },
      { type: 'video', label: 'Video', icon: Video, description: 'Embed videos' },
    ]
  },
  {
    name: 'Layout & Structure',
    elements: [
      { type: 'container', label: 'Container', icon: Box, description: 'Group elements together' },
      { type: 'columns', label: 'Columns', icon: Grid, description: 'Multi-column layouts' },
      { type: 'divider', label: 'Divider', icon: Minus, description: 'Horizontal separator' },
      { type: 'spacer', label: 'Spacer', icon: MoreHorizontal, description: 'Add vertical spacing' },
    ]
  },
  {
    name: 'Forms & Input',
    elements: [
      { type: 'form', label: 'Contact Form', icon: FormInput, description: 'Complete contact form' },
      { type: 'input', label: 'Text Input', icon: FormInput, description: 'Single text input' },
      { type: 'textarea', label: 'Text Area', icon: FormInput, description: 'Multi-line text input' },
      { type: 'select', label: 'Dropdown', icon: FormInput, description: 'Selection dropdown' },
      { type: 'checkbox', label: 'Checkbox', icon: FormInput, description: 'Checkbox input' },
      { type: 'radio', label: 'Radio Button', icon: FormInput, description: 'Radio button group' },
    ]
  },
  {
    name: 'Media & Content',
    elements: [
      { type: 'gallery', label: 'Image Gallery', icon: Image, description: 'Image gallery grid' },
      { type: 'slider', label: 'Image Slider', icon: Image, description: 'Carousel slider' },
      { type: 'audio', label: 'Audio Player', icon: Music, description: 'Audio player widget' },
      { type: 'map', label: 'Google Maps', icon: Globe, description: 'Interactive map' },
    ]
  },
  {
    name: 'Business Elements',
    elements: [
      { type: 'testimonial', label: 'Testimonial', icon: Star, description: 'Customer testimonials' },
      { type: 'pricing', label: 'Pricing Table', icon: CreditCard, description: 'Pricing plans' },
      { type: 'team', label: 'Team Member', icon: Users, description: 'Team member card' },
      { type: 'countdown', label: 'Countdown Timer', icon: Clock, description: 'Countdown widget' },
      { type: 'progress', label: 'Progress Bar', icon: TrendingUp, description: 'Progress indicator' },
    ]
  },
  {
    name: 'Social & Contact',
    elements: [
      { type: 'social', label: 'Social Icons', icon: Heart, description: 'Social media links' },
      { type: 'contact', label: 'Contact Info', icon: Phone, description: 'Contact information' },
      { type: 'calendar', label: 'Calendar', icon: Calendar, description: 'Event calendar' },
      { type: 'chat', label: 'Live Chat', icon: Mail, description: 'Live chat widget' },
    ]
  }
];

const templates = [
  {
    id: 'hero-modern',
    name: 'Modern Hero Section',
    category: 'Hero Sections',
    thumbnail: '/api/placeholder/200/120',
    description: 'Clean modern hero with video background'
  },
  {
    id: 'hero-split',
    name: 'Split Hero Layout',
    category: 'Hero Sections',
    thumbnail: '/api/placeholder/200/120',
    description: 'Split layout with image and content'
  },
  {
    id: 'features-grid',
    name: 'Feature Grid',
    category: 'Features',
    thumbnail: '/api/placeholder/200/120',
    description: '6-column feature showcase'
  },
  {
    id: 'features-cards',
    name: 'Feature Cards',
    category: 'Features',
    thumbnail: '/api/placeholder/200/120',
    description: 'Card-based feature layout'
  },
  {
    id: 'testimonial-slider',
    name: 'Testimonial Slider',
    category: 'Social Proof',
    thumbnail: '/api/placeholder/200/120',
    description: 'Rotating customer testimonials'
  },
  {
    id: 'testimonial-grid',
    name: 'Testimonial Grid',
    category: 'Social Proof',
    thumbnail: '/api/placeholder/200/120',
    description: 'Grid layout testimonials'
  },
  {
    id: 'pricing-3col',
    name: '3-Column Pricing',
    category: 'Pricing',
    thumbnail: '/api/placeholder/200/120',
    description: 'Classic 3-tier pricing table'
  },
  {
    id: 'pricing-comparison',
    name: 'Pricing Comparison',
    category: 'Pricing',
    thumbnail: '/api/placeholder/200/120',
    description: 'Feature comparison table'
  },
  {
    id: 'contact-split',
    name: 'Contact Split Layout',
    category: 'Contact',
    thumbnail: '/api/placeholder/200/120',
    description: 'Form with contact information'
  },
  {
    id: 'contact-map',
    name: 'Contact with Map',
    category: 'Contact',
    thumbnail: '/api/placeholder/200/120',
    description: 'Contact form with embedded map'
  },
  {
    id: 'footer-comprehensive',
    name: 'Comprehensive Footer',
    category: 'Footers',
    thumbnail: '/api/placeholder/200/120',
    description: 'Full-featured website footer'
  },
  {
    id: 'footer-minimal',
    name: 'Minimal Footer',
    category: 'Footers',
    thumbnail: '/api/placeholder/200/120',
    description: 'Clean minimal footer design'
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
  onPageSettingsChange,
  onDragStart
}: AdvancedRightPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [templateCategory, setTemplateCategory] = useState('all');
  const [openCategories, setOpenCategories] = useState<string[]>(['Basic Elements']);

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

  const handleDragStart = (elementData: any) => {
    onDragStart({ template: elementData });
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = templateCategory === 'all' || template.category === templateCategory;
    return matchesSearch && matchesCategory;
  });

  const templateCategories = [...new Set(templates.map(t => t.category))];

  return (
    <div className="w-80 bg-white border-l flex flex-col h-full shadow-lg">
      {/* Panel Header */}
      <div className="p-4 border-b bg-gray-50">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search elements..."
                  className="pl-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {elementCategories.map((category) => (
                <Collapsible
                  key={category.name}
                  open={openCategories.includes(category.name)}
                  onOpenChange={() => toggleCategory(category.name)}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                      <span className="font-medium text-sm">{category.name}</span>
                      {openCategories.includes(category.name) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 mt-2">
                    {category.elements
                      .filter(element => 
                        searchTerm === '' || 
                        element.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        element.description.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((element) => (
                      <div
                        key={element.type}
                        draggable
                        onDragStart={() => handleDragStart(element)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start h-auto p-3 hover:bg-blue-50 hover:border-blue-200 transition-all"
                          onClick={() => onAddElement(element.type)}
                        >
                          <element.icon className="h-5 w-5 mr-3 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{element.label}</div>
                            <div className="text-xs text-gray-500">{element.description}</div>
                          </div>
                        </Button>
                      </div>
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm capitalize">{selectedElement.type} Element</CardTitle>
                      <Badge variant="outline" className="text-xs">{selectedElement.id.slice(-8)}</Badge>
                    </div>
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

                    {/* Image Controls */}
                    {selectedElement.type === 'image' && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Image URL</Label>
                          <Input
                            value={selectedElement.props?.src || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              props: { ...selectedElement.props, src: e.target.value }
                            })}
                            placeholder="https://example.com/image.jpg"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Alt Text</Label>
                          <Input
                            value={selectedElement.props?.alt || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              props: { ...selectedElement.props, alt: e.target.value }
                            })}
                            placeholder="Image description"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Button Controls */}
                    {selectedElement.type === 'button' && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Link URL</Label>
                          <Input
                            value={selectedElement.props?.href || ''}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              props: { ...selectedElement.props, href: e.target.value }
                            })}
                            placeholder="https://example.com"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium">Target</Label>
                          <Select
                            value={selectedElement.props?.target || '_self'}
                            onValueChange={(value) => onUpdateElement(selectedElement.id, { 
                              props: { ...selectedElement.props, target: value }
                            })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_self">Same window</SelectItem>
                              <SelectItem value="_blank">New window</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Typography Controls */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                      <div className="space-y-4">
                        <Label className="text-xs font-medium">Typography</Label>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Font Size</Label>
                            <div className="flex items-center space-x-2">
                              <Slider
                                value={[parseInt(selectedElement.styles?.fontSize?.replace('px', '') || '16')]}
                                onValueChange={([value]) => handleStyleChange('fontSize', `${value}px`)}
                                min={8}
                                max={72}
                                step={1}
                                className="flex-1"
                              />
                              <span className="text-xs w-8">{selectedElement.styles?.fontSize || '16px'}</span>
                            </div>
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

                        <div className="space-y-2">
                          <Label className="text-xs">Font Family</Label>
                          <Select
                            value={selectedElement.styles?.fontFamily || 'Arial, sans-serif'}
                            onValueChange={(value) => handleStyleChange('fontFamily', value)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                              <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                              <SelectItem value="Georgia, serif">Georgia</SelectItem>
                              <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                              <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                              <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-between">
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

                        <div className="flex justify-between">
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
                    )}

                    {/* Color Controls */}
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Colors</Label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
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
                        <div className="space-y-2">
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
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Padding</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.padding || '0px'}
                            onChange={(e) => handleStyleChange('padding', e.target.value)}
                            className="text-xs"
                            placeholder="10px"
                          />
                        </div>
                        <div className="space-y-2">
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
                      <Label className="text-xs font-medium">Border & Effects</Label>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Border</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.border || 'none'}
                            onChange={(e) => handleStyleChange('border', e.target.value)}
                            className="text-xs"
                            placeholder="1px solid #ccc"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Border Radius</Label>
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[parseInt(selectedElement.styles?.borderRadius?.replace('px', '') || '0')]}
                              onValueChange={([value]) => handleStyleChange('borderRadius', `${value}px`)}
                              min={0}
                              max={50}
                              step={1}
                              className="flex-1"
                            />
                            <span className="text-xs w-8">{selectedElement.styles?.borderRadius || '0px'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Box Shadow</Label>
                          <Input
                            type="text"
                            value={selectedElement.styles?.boxShadow || 'none'}
                            onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
                            className="text-xs"
                            placeholder="0px 4px 8px rgba(0,0,0,0.1)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Position Controls */}
                    <div className="space-y-4">
                      <Label className="text-xs font-medium">Position & Size</Label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Width</Label>
                          <Input
                            type="number"
                            value={selectedElement.size.width}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              size: { ...selectedElement.size, width: parseInt(e.target.value) }
                            })}
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Height</Label>
                          <Input
                            type="number"
                            value={selectedElement.size.height}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              size: { ...selectedElement.size, height: parseInt(e.target.value) }
                            })}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">X Position</Label>
                          <Input
                            type="number"
                            value={selectedElement.position.x}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              position: { ...selectedElement.position, x: parseInt(e.target.value) }
                            })}
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Y Position</Label>
                          <Input
                            type="number"
                            value={selectedElement.position.y}
                            onChange={(e) => onUpdateElement(selectedElement.id, { 
                              position: { ...selectedElement.position, y: parseInt(e.target.value) }
                            })}
                            className="text-xs"
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
                <div className="space-y-2">
                  <Label className="text-xs">Favicon URL</Label>
                  <Input
                    name="favicon"
                    value={pageSettings.favicon}
                    onChange={onPageSettingsChange}
                    className="text-sm"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Open Graph Image</Label>
                  <Input
                    name="ogImage"
                    value={pageSettings.ogImage}
                    onChange={onPageSettingsChange}
                    className="text-sm"
                    placeholder="https://example.com/og-image.jpg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Custom Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Custom CSS</Label>
                  <Textarea
                    name="customCSS"
                    value={pageSettings.customCSS}
                    onChange={onPageSettingsChange}
                    className="text-sm font-mono"
                    rows={5}
                    placeholder="/* Add your custom CSS here */"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Custom JavaScript</Label>
                  <Textarea
                    name="customJS"
                    value={pageSettings.customJS}
                    onChange={onPageSettingsChange}
                    className="text-sm font-mono"
                    rows={5}
                    placeholder="// Add your custom JavaScript here"
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
                  Export HTML
                </Button>
                <Button variant="outline" className="w-full text-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Page
                </Button>
                <Button variant="outline" className="w-full text-sm">
                  <Code className="h-4 w-4 mr-2" />
                  View Source Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="m-0 p-4 space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm pl-10"
                  />
                </div>
                <Select value={templateCategory} onValueChange={setTemplateCategory}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {templateCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-all hover:border-blue-200">
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center">
                      <div className="text-blue-400">
                        <Layout className="h-8 w-8" />
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                      <Button size="sm" className="w-full text-xs">
                        <Plus className="h-3 w-3 mr-1" />
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
