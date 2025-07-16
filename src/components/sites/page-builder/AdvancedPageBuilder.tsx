
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Plus, Edit, Trash2, Copy, Eye, EyeOff, Settings, ArrowLeft,
  Layout, Layers, Type, Image, Square, FormInput, Video, Minus,
  Monitor, Tablet, Smartphone, Save, Download, Upload,
  ZoomIn, ZoomOut, Undo, Redo, Grid, MousePointer, Play, Pause,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Palette, Move, RotateCcw, RotateCw, ChevronDown, ChevronUp,
  Link, Hash, Calendar, Mail, Phone, MapPin, Star, Heart,
  ShoppingCart, CreditCard, Globe, Search, Filter, Bell,
  Menu, X, Home, User, FileText, Folder, Tag, Database,
  Code, Terminal, Wifi, Bluetooth, Camera, Mic, Volume2,
  Lock, Unlock, Shield, Key, CloudUpload, CloudDownload,
  Zap, Target, Award, Bookmark, Flag, Clock, Timer
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Element, Page } from './types';
import { ElementRenderer } from './ElementRenderer';
import { EnhancedElementPlacement } from './EnhancedElementPlacement';

interface AdvancedPageBuilderProps {
  siteId: string;
  templateId?: string;
}

// Comprehensive element templates
const elementCategories = [
  {
    name: 'Basic',
    elements: [
      { type: 'text', label: 'Text', icon: Type },
      { type: 'heading', label: 'Heading', icon: Type },
      { type: 'button', label: 'Button', icon: Square },
      { type: 'image', label: 'Image', icon: Image },
      { type: 'video', label: 'Video', icon: Video },
      { type: 'divider', label: 'Divider', icon: Minus },
      { type: 'spacer', label: 'Spacer', icon: Layout }
    ]
  },
  {
    name: 'Forms',
    elements: [
      { type: 'form', label: 'Form', icon: FormInput },
      { type: 'input', label: 'Input Field', icon: FormInput },
      { type: 'textarea', label: 'Text Area', icon: FileText },
      { type: 'select', label: 'Dropdown', icon: ChevronDown },
      { type: 'checkbox', label: 'Checkbox', icon: Square },
      { type: 'radio', label: 'Radio Button', icon: Square }
    ]
  },
  {
    name: 'Layout',
    elements: [
      { type: 'container', label: 'Container', icon: Square },
      { type: 'column', label: 'Column', icon: Layout },
      { type: 'row', label: 'Row', icon: Layout },
      { type: 'grid', label: 'Grid', icon: Grid },
      { type: 'card', label: 'Card', icon: Square }
    ]
  },
  {
    name: 'Media',
    elements: [
      { type: 'gallery', label: 'Gallery', icon: Image },
      { type: 'slider', label: 'Slider', icon: Image },
      { type: 'audio', label: 'Audio', icon: Volume2 },
      { type: 'map', label: 'Map', icon: MapPin },
      { type: 'embed', label: 'Embed', icon: Code }
    ]
  },
  {
    name: 'Interactive',
    elements: [
      { type: 'accordion', label: 'Accordion', icon: ChevronDown },
      { type: 'tabs', label: 'Tabs', icon: Folder },
      { type: 'modal', label: 'Modal', icon: Square },
      { type: 'popup', label: 'Popup', icon: Square },
      { type: 'tooltip', label: 'Tooltip', icon: Square }
    ]
  },
  {
    name: 'E-commerce',
    elements: [
      { type: 'product', label: 'Product', icon: ShoppingCart },
      { type: 'cart', label: 'Cart', icon: ShoppingCart },
      { type: 'checkout', label: 'Checkout', icon: CreditCard },
      { type: 'pricing', label: 'Pricing Table', icon: CreditCard }
    ]
  },
  {
    name: 'Social',
    elements: [
      { type: 'social-icons', label: 'Social Icons', icon: Globe },
      { type: 'share', label: 'Share Button', icon: Globe },
      { type: 'testimonial', label: 'Testimonial', icon: Star },
      { type: 'review', label: 'Review', icon: Star }
    ]
  }
];

export function AdvancedPageBuilder({ siteId, templateId }: AdvancedPageBuilderProps) {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'page-1',
      title: 'Home',
      slug: '/',
      elements: [],
      settings: {
        title: 'Home Page',
        description: 'Welcome to our website',
        keywords: 'home, welcome',
      },
      isPublished: false,
    }
  ]);

  const [currentPageId, setCurrentPageId] = useState(pages[0]?.id);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState('elements');
  const [activeRightTab, setActiveRightTab] = useState('design');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedElement = currentPage?.elements.find(e => e.id === selectedElementId);

  // History management
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(currentPage?.elements || [])));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentPage?.elements, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevElements = history[historyIndex - 1];
      if (currentPage) {
        const updatedPage = { ...currentPage, elements: prevElements };
        setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
        setHistoryIndex(historyIndex - 1);
        setSelectedElementId(null);
      }
    }
  }, [history, historyIndex, currentPage, currentPageId]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextElements = history[historyIndex + 1];
      if (currentPage) {
        const updatedPage = { ...currentPage, elements: nextElements };
        setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
        setHistoryIndex(historyIndex + 1);
        setSelectedElementId(null);
      }
    }
  }, [history, historyIndex, currentPage, currentPageId]);

  // Element management functions
  const addElement = useCallback((element: Partial<Element>) => {
    if (!currentPage) return;

    const newElement: Element = {
      id: `element-${Date.now()}`,
      type: element.type || 'text',
      position: element.position || { x: 50, y: 50 },
      size: element.size || { width: 200, height: 100 },
      content: element.content || getDefaultContent(element.type || 'text'),
      styles: element.styles || getDefaultStyles(element.type || 'text'),
      src: element.src,
      alt: element.alt,
      href: element.href,
      target: element.target,
      children: element.children || [],
      attributes: element.attributes || {},
    };

    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, newElement],
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    setSelectedElementId(newElement.id);
    saveToHistory();
    toast.success('Element added');
  }, [currentPage, currentPageId, saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      elements: currentPage.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      ),
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
  }, [currentPage, currentPageId]);

  const deleteElement = useCallback((elementId: string) => {
    if (!currentPage) return;

    const updatedPage = {
      ...currentPage,
      elements: currentPage.elements.filter(el => el.id !== elementId),
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    setSelectedElementId(null);
    saveToHistory();
    toast.success('Element deleted');
  }, [currentPage, currentPageId, saveToHistory]);

  const duplicateElement = useCallback((elementId: string) => {
    if (!currentPage) return;

    const element = currentPage.elements.find(el => el.id === elementId);
    if (!element) return;

    const duplicatedElement: Element = {
      ...element,
      id: `element-${Date.now()}`,
      position: { 
        x: element.position.x + 20, 
        y: element.position.y + 20 
      }
    };

    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, duplicatedElement],
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    setSelectedElementId(duplicatedElement.id);
    saveToHistory();
    toast.success('Element duplicated');
  }, [currentPage, currentPageId, saveToHistory]);

  // Utility functions
  const getDefaultContent = (type: string): string => {
    const defaults: Record<string, string> = {
      text: 'Your text here',
      heading: 'Your heading',
      button: 'Click me',
      image: '',
      video: '',
      form: '',
      container: '',
      divider: '',
      spacer: ''
    };
    return defaults[type] || '';
  };

  const getDefaultStyles = (type: string): Record<string, any> => {
    const styles: Record<string, Record<string, any>> = {
      text: {
        fontSize: '16px',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.5'
      },
      heading: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.2'
      },
      button: {
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500'
      },
      container: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '20px'
      }
    };
    return styles[type] || {};
  };

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElementId(element.id);
    setActiveRightTab('design');
  }, []);

  const handleElementPlace = useCallback((position: { x: number; y: number }) => {
    if (draggedElement) {
      addElement({
        ...draggedElement,
        position
      });
      setDraggedElement(null);
      setIsDragging(false);
    }
  }, [draggedElement, addElement]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Extended Left Sidebar - Elements & Tools */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/sites')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sites
            </Button>
          </div>
          <h3 className="font-semibold text-lg">Page Builder</h3>
        </div>
        
        <Tabs value={activeLeftTab} onValueChange={setActiveLeftTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="elements" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-6">
                  {elementCategories.map((category) => (
                    <div key={category.name}>
                      <Label className="text-sm font-medium mb-3 block">{category.name}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {category.elements.map((element) => {
                          const Icon = element.icon;
                          return (
                            <Card 
                              key={element.type}
                              className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing p-2"
                              draggable
                              onDragStart={() => {
                                setDraggedElement({
                                  type: element.type,
                                  content: getDefaultContent(element.type),
                                  styles: getDefaultStyles(element.type)
                                } as Element);
                                setIsDragging(true);
                              }}
                              onDragEnd={() => {
                                setIsDragging(false);
                                setDraggedElement(null);
                              }}
                            >
                              <CardContent className="p-2 text-center">
                                <Icon className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                                <span className="text-xs font-medium block">{element.label}</span>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="templates" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Page Templates</Label>
                  <div className="grid gap-3">
                    {['Landing Page', 'About Us', 'Contact', 'Blog Post', 'Product Page'].map((template) => (
                      <Card key={template} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <Layout className="h-8 w-8 text-gray-400" />
                          </div>
                          <span className="text-sm font-medium">{template}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="assets" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Media Library</Label>
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="layers" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  <Label className="font-medium">Page Layers</Label>
                  {currentPage?.elements.map((element) => (
                    <div
                      key={element.id}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedElementId === element.id ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                      }`}
                      onClick={() => setSelectedElementId(element.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{element.type}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => duplicateElement(element.id)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteElement(element.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={currentPageId} onValueChange={setCurrentPageId}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title} {page.isPublished && <Badge variant="secondary" className="ml-1">Published</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex <= 0}>
                  <Undo className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                {isPreviewMode ? <Edit className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button size="sm" variant="outline">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                {currentPage?.isPublished ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-6 overflow-auto relative">
          <div className="h-full flex items-start justify-center">
            <div
              ref={canvasRef}
              className={`bg-white shadow-lg transition-all duration-300 relative ${
                previewMode === 'mobile' ? 'w-[375px] min-h-[667px]' :
                previewMode === 'tablet' ? 'w-[768px] min-h-[1024px]' :
                'w-full max-w-[1200px] min-h-[800px]'
              }`}
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedElement && canvasRef.current) {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / (zoomLevel / 100);
                  const y = (e.clientY - rect.top) / (zoomLevel / 100);
                  handleElementPlace({ x, y });
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (canvasRef.current) {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / (zoomLevel / 100);
                  const y = (e.clientY - rect.top) / (zoomLevel / 100);
                  setMousePosition({ x, y });
                }
              }}
              onClick={() => setSelectedElementId(null)}
            >
              {/* Grid Background */}
              {showGrid && (
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Enhanced Element Placement */}
              <EnhancedElementPlacement
                elements={currentPage?.elements || []}
                draggedElement={draggedElement}
                mousePosition={mousePosition}
                onElementPlace={handleElementPlace}
              />

              {/* Canvas Content */}
              {currentPage?.elements.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Start building your page</p>
                    <p className="text-sm">Drag elements from the sidebar to get started</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  {currentPage?.elements.map(element => 
                    <div
                      key={element.id}
                      style={{
                        position: 'absolute',
                        left: element.position.x,
                        top: element.position.y,
                        width: element.size.width,
                        height: element.size.height,
                      }}
                    >
                      <ElementRenderer
                        element={element}
                        isSelected={selectedElementId === element.id}
                        onElementClick={handleElementClick}
                        onUpdateElement={updateElement}
                        onDeleteElement={deleteElement}
                        onDuplicateElement={() => duplicateElement(element.id)}
                        isPreviewMode={isPreviewMode}
                        snapToGrid={snapToGrid}
                        gridSize={20}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Extended Right Sidebar - Properties & Settings */}
      <div className="w-96 bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Properties & Settings</h3>
        </div>
        
        <Tabs value={activeRightTab} onValueChange={setActiveRightTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="design" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                {selectedElement ? (
                  <div className="space-y-6">
                    {/* Element Info */}
                    <div>
                      <Label className="text-sm font-medium">Element Type</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-medium capitalize">
                        {selectedElement.type}
                      </div>
                    </div>

                    {/* Content Settings */}
                    <div>
                      <Label className="text-sm font-medium">Content</Label>
                      <Textarea
                        value={selectedElement.content || ''}
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    {/* Position & Size */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">X Position</Label>
                        <Input
                          type="number"
                          value={selectedElement.position.x}
                          onChange={(e) => updateElement(selectedElement.id, {
                            position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y Position</Label>
                        <Input
                          type="number"
                          value={selectedElement.position.y}
                          onChange={(e) => updateElement(selectedElement.id, {
                            position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Width</Label>
                        <Input
                          type="number"
                          value={selectedElement.size.width}
                          onChange={(e) => updateElement(selectedElement.id, {
                            size: { ...selectedElement.size, width: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height</Label>
                        <Input
                          type="number"
                          value={selectedElement.size.height}
                          onChange={(e) => updateElement(selectedElement.id, {
                            size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 }
                          })}
                        />
                      </div>
                    </div>

                    {/* Typography */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'heading') && (
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Typography</Label>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={selectedElement.styles?.fontWeight === 'bold' ? 'bg-blue-50' : ''}
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { 
                                ...selectedElement.styles, 
                                fontWeight: selectedElement.styles?.fontWeight === 'bold' ? 'normal' : 'bold' 
                              }
                            })}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={selectedElement.styles?.fontStyle === 'italic' ? 'bg-blue-50' : ''}
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { 
                                ...selectedElement.styles, 
                                fontStyle: selectedElement.styles?.fontStyle === 'italic' ? 'normal' : 'italic' 
                              }
                            })}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={selectedElement.styles?.textDecoration === 'underline' ? 'bg-blue-50' : ''}
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { 
                                ...selectedElement.styles, 
                                textDecoration: selectedElement.styles?.textDecoration === 'underline' ? 'none' : 'underline' 
                              }
                            })}
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                        </div>

                        <div>
                          <Label className="text-xs">Font Size</Label>
                          <Slider
                            value={[parseInt(selectedElement.styles?.fontSize) || 16]}
                            onValueChange={(value) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, fontSize: `${value[0]}px` }
                            })}
                            max={72}
                            min={8}
                            step={1}
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Text Color</Label>
                          <Input
                            type="color"
                            value={selectedElement.styles?.color || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, color: e.target.value }
                            })}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, textAlign: 'left' }
                            })}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, textAlign: 'center' }
                            })}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, textAlign: 'right' }
                            })}
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Background & Borders */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Background & Borders</Label>
                      
                      <div>
                        <Label className="text-xs">Background Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.styles?.backgroundColor || '#ffffff'}
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                          })}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Border Radius</Label>
                        <Slider
                          value={[parseInt(selectedElement.styles?.borderRadius) || 0]}
                          onValueChange={(value) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, borderRadius: `${value[0]}px` }
                          })}
                          max={50}
                          min={0}
                          step={1}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Padding</Label>
                        <Slider
                          value={[parseInt(selectedElement.styles?.padding) || 0]}
                          onValueChange={(value) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, padding: `${value[0]}px` }
                          })}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => duplicateElement(selectedElement.id)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate Element
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => deleteElement(selectedElement.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Element
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select an element to edit its properties</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="advanced" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                {selectedElement ? (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Advanced Settings</Label>
                    </div>

                    {/* Custom CSS */}
                    <div>
                      <Label className="text-xs">Custom CSS Classes</Label>
                      <Input
                        value={selectedElement.attributes?.className || ''}
                        onChange={(e) => updateElement(selectedElement.id, {
                          attributes: { ...selectedElement.attributes, className: e.target.value }
                        })}
                        placeholder="custom-class another-class"
                      />
                    </div>

                    {/* Animation */}
                    <div>
                      <Label className="text-xs">Animation</Label>
                      <Select
                        value={selectedElement.attributes?.animation || 'none'}
                        onValueChange={(value) => updateElement(selectedElement.id, {
                          attributes: { ...selectedElement.attributes, animation: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="fade-in">Fade In</SelectItem>
                          <SelectItem value="slide-up">Slide Up</SelectItem>
                          <SelectItem value="slide-down">Slide Down</SelectItem>
                          <SelectItem value="zoom-in">Zoom In</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-3">
                      <Label className="text-xs">Visibility</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hide on Mobile</span>
                        <Switch
                          checked={selectedElement.attributes?.hideOnMobile || false}
                          onCheckedChange={(checked) => updateElement(selectedElement.id, {
                            attributes: { ...selectedElement.attributes, hideOnMobile: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hide on Tablet</span>
                        <Switch
                          checked={selectedElement.attributes?.hideOnTablet || false}
                          onCheckedChange={(checked) => updateElement(selectedElement.id, {
                            attributes: { ...selectedElement.attributes, hideOnTablet: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Hide on Desktop</span>
                        <Switch
                          checked={selectedElement.attributes?.hideOnDesktop || false}
                          onCheckedChange={(checked) => updateElement(selectedElement.id, {
                            attributes: { ...selectedElement.attributes, hideOnDesktop: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select an element for advanced settings</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="page" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                {currentPage && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Page Settings</Label>
                    </div>

                    <div>
                      <Label className="text-xs">Page Title</Label>
                      <Input
                        value={currentPage.title}
                        onChange={(e) => {
                          const updatedPage = { ...currentPage, title: e.target.value };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Page Slug</Label>
                      <Input
                        value={currentPage.slug}
                        onChange={(e) => {
                          const updatedPage = { ...currentPage, slug: e.target.value };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">SEO Title</Label>
                      <Input
                        value={currentPage.settings.title}
                        onChange={(e) => {
                          const updatedPage = { 
                            ...currentPage, 
                            settings: { ...currentPage.settings, title: e.target.value }
                          };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">SEO Description</Label>
                      <Textarea
                        value={currentPage.settings.description}
                        onChange={(e) => {
                          const updatedPage = { 
                            ...currentPage, 
                            settings: { ...currentPage.settings, description: e.target.value }
                          };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Keywords</Label>
                      <Input
                        value={currentPage.settings.keywords}
                        onChange={(e) => {
                          const updatedPage = { 
                            ...currentPage, 
                            settings: { ...currentPage.settings, keywords: e.target.value }
                          };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-xs">Page Status</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Published</span>
                        <Switch
                          checked={currentPage.isPublished}
                          onCheckedChange={(checked) => {
                            const updatedPage = { ...currentPage, isPublished: checked };
                            setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
