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
import { 
  Plus, Edit, Trash2, Copy, Eye, EyeOff, Settings, ArrowLeft,
  Layout, Layers, Type, Image, Square, FormInput, Video, Minus,
  Monitor, Tablet, Smartphone, Save, Download, Upload,
  ZoomIn, ZoomOut, Undo, Redo, Grid, MousePointer
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Element, Page } from './types';
import { elementTemplates } from './ElementTemplates';
import { ElementRenderer } from './ElementRenderer';
import { DesignPanel } from './DesignPanel';
import { EnhancedElementPlacement } from './EnhancedElementPlacement';

interface AdvancedPageBuilderProps {
  siteId: string;
  templateId?: string;
}

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
  const [activeTab, setActiveTab] = useState('elements');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedElement = currentPage?.elements.find(e => e.id === selectedElementId);

  const addPage = useCallback(() => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: `Page ${pages.length + 1}`,
      slug: `/page-${pages.length + 1}`,
      elements: [],
      settings: {
        title: `Page ${pages.length + 1}`,
        description: '',
        keywords: '',
      },
      isPublished: false,
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    toast.success('New page created');
  }, [pages.length]);

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
    toast.success('Element added');
  }, [currentPage, currentPageId]);

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
    toast.success('Element deleted');
  }, [currentPage, currentPageId]);

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
    toast.success('Element duplicated');
  }, [currentPage, currentPageId]);

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

  const savePage = useCallback(() => {
    toast.success('Page saved successfully');
  }, []);

  const publishPage = useCallback(() => {
    if (!currentPage) return;
    
    const updatedPage = { ...currentPage, isPublished: true };
    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    toast.success('Page published successfully');
  }, [currentPage, currentPageId]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Elements & Tools */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="elements" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Basic Elements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {elementTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <Card 
                          key={template.type}
                          className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
                          draggable
                          onDragStart={() => {
                            setDraggedElement(template.template as Element);
                            setIsDragging(true);
                          }}
                          onDragEnd={() => {
                            setIsDragging(false);
                            setDraggedElement(null);
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <Icon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                            <span className="text-xs font-medium">{template.label}</span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="design" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <DesignPanel
                  selectedElement={selectedElement || null}
                  onUpdateElement={updateElement}
                  onDuplicateElement={(element) => duplicateElement(element.id)}
                  onDeleteElement={deleteElement}
                />
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
              
              <Button size="sm" variant="outline" onClick={addPage}>
                <Plus className="h-4 w-4 mr-1" />
                New Page
              </Button>
              
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
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                {isPreviewMode ? <Edit className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button size="sm" variant="outline" onClick={savePage}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <Button size="sm" onClick={publishPage} className="bg-blue-600 hover:bg-blue-700">
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

      {/* Right Sidebar - Settings & Properties */}
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold">Properties & Settings</h3>
        </div>
        
        <ScrollArea className="h-full p-4">
          <Tabs defaultValue="page" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="page">Page</TabsTrigger>
              <TabsTrigger value="element">Element</TabsTrigger>
            </TabsList>
            
            <TabsContent value="page" className="space-y-4">
              {currentPage && (
                <div className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input
                      value={currentPage.title}
                      onChange={(e) => {
                        const updatedPage = { ...currentPage, title: e.target.value };
                        setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Page Slug</Label>
                    <Input
                      value={currentPage.slug}
                      onChange={(e) => {
                        const updatedPage = { ...currentPage, slug: e.target.value };
                        setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                      }}
                    />
                  </div>
                  <div>
                    <Label>SEO Title</Label>
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
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="element">
              {selectedElement ? (
                <DesignPanel
                  selectedElement={selectedElement}
                  onUpdateElement={updateElement}
                  onDuplicateElement={(element) => duplicateElement(element.id)}
                  onDeleteElement={deleteElement}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select an element to edit its properties</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
}
