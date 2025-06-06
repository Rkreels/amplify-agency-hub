
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Layout, 
  Plus, 
  Eye, 
  Settings, 
  Smartphone,
  Monitor,
  Tablet,
  Type,
  Image,
  Square,
  Circle,
  MousePointer,
  Palette,
  Save,
  Play,
  Copy,
  Trash2,
  Grip,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface PageElement {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'form' | 'video' | 'spacer';
  content: string;
  styles: {
    fontSize?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontWeight?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface FunnelPage {
  id: string;
  name: string;
  type: 'landing' | 'sales' | 'checkout' | 'thank-you';
  elements: PageElement[];
  settings: {
    backgroundColor: string;
    maxWidth: string;
    seoTitle: string;
    seoDescription: string;
  };
  isPublished: boolean;
  url: string;
  analytics: {
    views: number;
    conversions: number;
    conversionRate: number;
  };
}

interface Funnel {
  id: string;
  name: string;
  description: string;
  pages: FunnelPage[];
  isActive: boolean;
  createdAt: Date;
}

export function FunnelPageBuilder() {
  const [funnels, setFunnels] = useState<Funnel[]>([
    {
      id: 'funnel-1',
      name: 'Lead Generation Funnel',
      description: 'Capture leads with free ebook offer',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      pages: [
        {
          id: 'page-1',
          name: 'Landing Page',
          type: 'landing',
          url: '/lead-magnet',
          isPublished: true,
          analytics: { views: 2547, conversions: 387, conversionRate: 15.2 },
          settings: {
            backgroundColor: '#ffffff',
            maxWidth: '1200px',
            seoTitle: 'Free Marketing Guide - Download Now',
            seoDescription: 'Get our comprehensive marketing guide and boost your business today.'
          },
          elements: [
            {
              id: 'elem-1',
              type: 'heading',
              content: 'Download Our Free Marketing Guide',
              position: { x: 0, y: 0 },
              size: { width: 100, height: 60 },
              styles: {
                fontSize: '2.5rem',
                color: '#1f2937',
                textAlign: 'center',
                fontWeight: 'bold'
              }
            },
            {
              id: 'elem-2',
              type: 'text',
              content: 'Learn the proven strategies that helped 1000+ businesses grow their revenue by 300%',
              position: { x: 0, y: 80 },
              size: { width: 100, height: 40 },
              styles: {
                fontSize: '1.2rem',
                color: '#6b7280',
                textAlign: 'center'
              }
            }
          ]
        }
      ]
    }
  ]);

  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(funnels[0]);
  const [selectedPage, setSelectedPage] = useState<FunnelPage | null>(funnels[0]?.pages[0] || null);
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('design');

  const elementTypes = [
    { type: 'heading', label: 'Heading', icon: Type },
    { type: 'text', label: 'Text', icon: Type },
    { type: 'button', label: 'Button', icon: MousePointer },
    { type: 'image', label: 'Image', icon: Image },
    { type: 'form', label: 'Form', icon: Square },
    { type: 'video', label: 'Video', icon: Play },
    { type: 'spacer', label: 'Spacer', icon: Circle }
  ];

  const addElement = (type: string) => {
    if (!selectedPage) return;

    const newElement: PageElement = {
      id: `elem-${Date.now()}`,
      type: type as any,
      content: getDefaultContent(type),
      position: { x: 20, y: selectedPage.elements.length * 100 + 20 },
      size: { width: 80, height: 60 },
      styles: getDefaultStyles(type)
    };

    const updatedPage = {
      ...selectedPage,
      elements: [...selectedPage.elements, newElement]
    };

    updatePage(updatedPage);
    setSelectedElement(newElement);
    toast.success(`${type} element added`);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'heading': return 'New Heading';
      case 'text': return 'Add your text content here...';
      case 'button': return 'Click Here';
      case 'image': return 'https://via.placeholder.com/400x300';
      case 'form': return 'Contact Form';
      case 'video': return 'https://youtube.com/embed/example';
      case 'spacer': return '';
      default: return 'New Element';
    }
  };

  const getDefaultStyles = (type: string) => {
    switch (type) {
      case 'heading':
        return {
          fontSize: '2rem',
          color: '#1f2937',
          fontWeight: 'bold',
          textAlign: 'center' as const
        };
      case 'text':
        return {
          fontSize: '1rem',
          color: '#4b5563',
          textAlign: 'left' as const
        };
      case 'button':
        return {
          fontSize: '1rem',
          color: '#ffffff',
          backgroundColor: '#3b82f6',
          padding: '12px 24px',
          textAlign: 'center' as const
        };
      default:
        return {};
    }
  };

  const updatePage = (updatedPage: FunnelPage) => {
    if (!selectedFunnel) return;

    const updatedFunnel = {
      ...selectedFunnel,
      pages: selectedFunnel.pages.map(page => 
        page.id === updatedPage.id ? updatedPage : page
      )
    };

    setFunnels(funnels.map(funnel => 
      funnel.id === updatedFunnel.id ? updatedFunnel : funnel
    ));
    setSelectedFunnel(updatedFunnel);
    setSelectedPage(updatedPage);
  };

  const updateElementContent = (elementId: string, content: string) => {
    if (!selectedPage) return;

    const updatedPage = {
      ...selectedPage,
      elements: selectedPage.elements.map(element =>
        element.id === elementId ? { ...element, content } : element
      )
    };

    updatePage(updatedPage);
  };

  const updateElementStyle = (elementId: string, styleKey: string, styleValue: string) => {
    if (!selectedPage) return;

    const updatedPage = {
      ...selectedPage,
      elements: selectedPage.elements.map(element =>
        element.id === elementId 
          ? { ...element, styles: { ...element.styles, [styleKey]: styleValue } }
          : element
      )
    };

    updatePage(updatedPage);
  };

  const deleteElement = (elementId: string) => {
    if (!selectedPage) return;

    const updatedPage = {
      ...selectedPage,
      elements: selectedPage.elements.filter(element => element.id !== elementId)
    };

    updatePage(updatedPage);
    setSelectedElement(null);
    toast.success('Element deleted');
  };

  const publishPage = () => {
    if (!selectedPage) return;

    const updatedPage = { ...selectedPage, isPublished: true };
    updatePage(updatedPage);
    toast.success('Page published successfully');
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-6xl';
    }
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Funnels & Pages */}
      <div className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Funnels</h3>
        </div>
        <div className="p-2">
          {funnels.map((funnel) => (
            <div
              key={funnel.id}
              className={`p-3 rounded cursor-pointer mb-2 ${
                selectedFunnel?.id === funnel.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFunnel(funnel)}
            >
              <h4 className="font-medium text-sm">{funnel.name}</h4>
              <p className="text-xs text-gray-500">{funnel.pages.length} pages</p>
            </div>
          ))}
        </div>

        {selectedFunnel && (
          <>
            <div className="p-4 border-b border-t">
              <h3 className="font-semibold">Pages</h3>
            </div>
            <div className="p-2">
              {selectedFunnel.pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-3 rounded cursor-pointer mb-2 ${
                    selectedPage?.id === page.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{page.name}</h4>
                    <Badge variant={page.isPublished ? "default" : "secondary"}>
                      {page.isPublished ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{page.type} page</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="font-semibold">{selectedPage?.name || 'Select a page'}</h2>
            {selectedPage && (
              <Badge variant={selectedPage.isPublished ? "default" : "secondary"}>
                {selectedPage.isPublished ? 'Published' : 'Draft'}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Viewport Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded p-1">
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={publishPage}>
              <Save className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Design Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          {selectedPage ? (
            <div className={`mx-auto bg-white shadow-lg min-h-screen ${getViewportClass()}`}>
              <div className="relative">
                {selectedPage.elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer hover:ring-2 hover:ring-blue-300 ${
                      selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      left: `${element.position.x}px`,
                      top: `${element.position.y}px`,
                      width: `${element.size.width}%`,
                      minHeight: `${element.size.height}px`,
                      ...element.styles
                    }}
                    onClick={() => setSelectedElement(element)}
                  >
                    {element.type === 'heading' && (
                      <h1 style={element.styles}>{element.content}</h1>
                    )}
                    {element.type === 'text' && (
                      <p style={element.styles}>{element.content}</p>
                    )}
                    {element.type === 'button' && (
                      <button
                        className="px-4 py-2 rounded"
                        style={element.styles}
                      >
                        {element.content}
                      </button>
                    )}
                    {element.type === 'image' && (
                      <img src={element.content} alt="Page element" className="max-w-full h-auto" />
                    )}
                    {element.type === 'form' && (
                      <div className="border border-gray-300 p-4 rounded">
                        <h3 className="font-medium mb-2">{element.content}</h3>
                        <div className="space-y-2">
                          <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
                          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
                          <button className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
                        </div>
                      </div>
                    )}
                    {element.type === 'spacer' && (
                      <div style={{ height: '50px', backgroundColor: 'transparent' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a page to start designing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Elements & Properties */}
      <div className="w-80 bg-white border-l flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="flex-1 p-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Add Elements</h3>
              <div className="grid grid-cols-2 gap-2">
                {elementTypes.map((elementType) => {
                  const Icon = elementType.icon;
                  return (
                    <Button
                      key={elementType.type}
                      variant="outline"
                      className="h-auto flex-col p-3"
                      onClick={() => addElement(elementType.type)}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{elementType.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="flex-1 p-4">
            {selectedElement ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Element Properties</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteElement(selectedElement.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={selectedElement.content}
                      onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
                    />
                  </div>

                  {selectedElement.type !== 'spacer' && (
                    <>
                      <div>
                        <Label>Font Size</Label>
                        <Select
                          value={selectedElement.styles.fontSize || '1rem'}
                          onValueChange={(value) => updateElementStyle(selectedElement.id, 'fontSize', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.75rem">Small</SelectItem>
                            <SelectItem value="1rem">Normal</SelectItem>
                            <SelectItem value="1.25rem">Large</SelectItem>
                            <SelectItem value="1.5rem">X-Large</SelectItem>
                            <SelectItem value="2rem">XX-Large</SelectItem>
                            <SelectItem value="2.5rem">Huge</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Text Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.styles.color || '#000000'}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Text Alignment</Label>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant={selectedElement.styles.textAlign === 'left' ? 'default' : 'outline'}
                            onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'left')}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedElement.styles.textAlign === 'center' ? 'default' : 'outline'}
                            onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'center')}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedElement.styles.textAlign === 'right' ? 'default' : 'outline'}
                            onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'right')}
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedElement.type === 'button' && (
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={selectedElement.styles.backgroundColor || '#3b82f6'}
                        onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Select an element to edit properties</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
