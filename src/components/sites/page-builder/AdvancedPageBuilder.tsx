
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  Plus, Edit, Trash2, Copy, Eye, EyeOff, Settings, 
  Layout, Layers, Undo, Redo, Grid3X3, Move,
  Monitor, Tablet, Smartphone, Save, Download, Upload,
  ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight,
  Palette, Type, Image as ImageIcon, MousePointer2
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { Element, Page, ElementTemplate } from './types';
import { elementTemplates } from './ElementTemplates';
import { ElementRenderer } from './ElementRenderer';
import { DesignPanel } from './DesignPanel';

interface AdvancedPageBuilderProps {
  siteId: string;
  templateId?: string;
}

export function AdvancedPageBuilder({ siteId, templateId }: AdvancedPageBuilderProps) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Core state
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
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  
  // UI state
  const [leftSidebarTab, setLeftSidebarTab] = useState('elements');
  const [rightSidebarTab, setRightSidebarTab] = useState('design');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(20);

  // History state
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draggedElement, setDraggedElement] = useState<ElementTemplate | null>(null);

  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedElement = currentPage?.elements.find(e => e.id === selectedElementId);
  const hoveredElement = currentPage?.elements.find(e => e.id === hoveredElementId);

  // Load template if provided
  useEffect(() => {
    if (templateId && templateId !== 'new') {
      // Load template logic would go here
      console.log('Loading template:', templateId);
    }
  }, [templateId]);

  // History management
  const saveToHistory = useCallback(() => {
    if (!currentPage) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...currentPage.elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [currentPage, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && currentPage) {
      const prevElements = history[historyIndex - 1];
      const updatedPage = { ...currentPage, elements: [...prevElements] };
      setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
      setHistoryIndex(historyIndex - 1);
      toast.success('Undone');
    }
  }, [historyIndex, history, currentPage, currentPageId]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && currentPage) {
      const nextElements = history[historyIndex + 1];
      const updatedPage = { ...currentPage, elements: [...nextElements] };
      setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
      setHistoryIndex(historyIndex + 1);
      toast.success('Redone');
    }
  }, [historyIndex, history, currentPage, currentPageId]);

  // Element management
  const addElement = useCallback((template: Partial<Element>, position?: { x: number; y: number }) => {
    if (!currentPage) return;

    const newElement: Element = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: template.type || 'text',
      position: position || template.position || { x: 100, y: 100 },
      size: template.size || { width: 200, height: 100 },
      content: template.content || '',
      styles: template.styles || {},
      src: template.src,
      alt: template.alt,
      href: template.href,
      target: template.target,
      children: template.children || [],
      attributes: template.attributes || {},
    };

    saveToHistory();
    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, newElement],
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    setSelectedElementId(newElement.id);
    toast.success('Element added');
  }, [currentPage, currentPageId, saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    if (!currentPage) return;

    const updateElementRecursive = (elements: Element[]): Element[] => {
      return elements.map(element => {
        if (element.id === elementId) {
          return { ...element, ...updates };
        }
        if (element.children && element.children.length > 0) {
          return { ...element, children: updateElementRecursive(element.children) };
        }
        return element;
      });
    };

    const updatedPage = {
      ...currentPage,
      elements: updateElementRecursive(currentPage.elements),
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
  }, [currentPage, currentPageId]);

  const deleteElement = useCallback((elementId: string) => {
    if (!currentPage) return;

    saveToHistory();
    const removeElementRecursive = (elements: Element[]): Element[] => {
      return elements.filter(element => {
        if (element.id === elementId) return false;
        if (element.children && element.children.length > 0) {
          element.children = removeElementRecursive(element.children);
        }
        return true;
      });
    };

    const updatedPage = {
      ...currentPage,
      elements: removeElementRecursive(currentPage.elements),
    };

    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    setSelectedElementId(null);
    toast.success('Element deleted');
  }, [currentPage, currentPageId, saveToHistory]);

  const duplicateElement = useCallback((element: Element) => {
    const duplicateElementRecursive = (el: Element): Element => ({
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: { x: el.position.x + 20, y: el.position.y + 20 },
      children: el.children?.map(duplicateElementRecursive),
    });

    const duplicatedElement = duplicateElementRecursive(element);
    addElement(duplicatedElement);
  }, [addElement]);

  // Event handlers
  const handleElementClick = useCallback((element: Element) => {
    setSelectedElementId(element.id);
  }, []);

  const handleElementHover = useCallback((element: Element | null) => {
    setHoveredElementId(element?.id || null);
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    addElement(draggedElement.template, { x: Math.max(0, x), y: Math.max(0, y) });
    setDraggedElement(null);
  }, [draggedElement, zoomLevel, addElement]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Page management
  const savePage = useCallback(() => {
    toast.success('Page saved successfully');
  }, []);

  const publishPage = useCallback(() => {
    if (!currentPage) return;
    
    const updatedPage = { ...currentPage, isPublished: true };
    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    toast.success('Page published successfully');
  }, [currentPage, currentPageId]);

  const exitBuilder = useCallback(() => {
    navigate('/sites');
  }, [navigate]);

  // Get canvas dimensions based on device view
  const getCanvasWidth = () => {
    switch (deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const getCanvasMaxWidth = () => {
    switch (deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '1200px';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        leftSidebarOpen ? 'w-80' : 'w-0'
      } overflow-hidden flex flex-col`}>
        
        {/* Left Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Elements & Tools</h3>
          <Button
            variant="ghost"
            size="sm" 
            onClick={() => setLeftSidebarOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Left Sidebar Tabs */}
        <Tabs value={leftSidebarTab} onValueChange={setLeftSidebarTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 m-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {/* Elements Tab */}
            <TabsContent value="elements" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Basic Elements</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {elementTemplates.slice(0, 8).map((template) => {
                        const Icon = template.icon;
                        return (
                          <Card 
                            key={template.type}
                            className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
                            draggable
                            onDragStart={() => {
                              setDraggedElement(template);
                            }}
                            onDragEnd={() => {
                              setDraggedElement(null);
                            }}
                          >
                            <CardContent className="p-3 text-center">
                              <Icon className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                              <span className="text-xs font-medium">{template.label}</span>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Form Elements</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {elementTemplates.slice(8, 12).map((template) => {
                        const Icon = template.icon;
                        return (
                          <Card 
                            key={template.type}
                            className="cursor-grab hover:shadow-md transition-shadow"
                            draggable
                            onDragStart={() => setDraggedElement(template)}
                            onDragEnd={() => setDraggedElement(null)}
                          >
                            <CardContent className="p-3 text-center">
                              <Icon className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                              <span className="text-xs font-medium">{template.label}</span>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Advanced Elements</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {elementTemplates.slice(12).map((template) => {
                        const Icon = template.icon;
                        return (
                          <Card 
                            key={template.type}
                            className="cursor-grab hover:shadow-md transition-shadow"
                            draggable
                            onDragStart={() => setDraggedElement(template)}
                            onDragEnd={() => setDraggedElement(null)}
                          >
                            <CardContent className="p-3 text-center">
                              <Icon className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                              <span className="text-xs font-medium">{template.label}</span>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="text-center py-8 text-gray-500">
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Template library coming soon</p>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and manage your assets</p>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Layers Tab */}
            <TabsContent value="layers" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-2">
                  <Label className="font-medium">Page Elements</Label>
                  {currentPage?.elements.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No elements yet</p>
                    </div>
                  ) : (
                    currentPage?.elements.map((element) => (
                      <div
                        key={element.id}
                        className={`p-2 rounded cursor-pointer hover:bg-gray-100 border ${
                          selectedElementId === element.id ? 'bg-blue-100 border-blue-300' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedElementId(element.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize font-medium">{element.type}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => duplicateElement(element)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteElement(element.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {element.content && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {element.content.substring(0, 30)}...
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!leftSidebarOpen && (
              <Button variant="ghost" size="sm" onClick={() => setLeftSidebarOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={exitBuilder}>
              <X className="h-4 w-4 mr-1" />
              Exit
            </Button>

            <Separator orientation="vertical" className="h-6" />

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

            <Button size="sm" variant="ghost" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* Device View Controls */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              <Button
                size="sm"
                variant={deviceView === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setDeviceView('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={deviceView === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setDeviceView('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={deviceView === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setDeviceView('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
              <Button size="sm" variant="ghost" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Controls */}
            <Button size="sm" variant="ghost" onClick={() => setShowGrid(!showGrid)}>
              <Grid3X3 className={`h-4 w-4 ${showGrid ? 'text-blue-600' : ''}`} />
            </Button>

            <Button size="sm" variant="ghost" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              {isPreviewMode ? <Edit className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>

            <Button size="sm" variant="outline" onClick={savePage}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            
            <Button size="sm" onClick={publishPage}>
              {currentPage?.isPublished ? 'Update' : 'Publish'}
            </Button>

            {!rightSidebarOpen && (
              <Button variant="ghost" size="sm" onClick={() => setRightSidebarOpen(true)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto relative">
          <div className="h-full flex items-center justify-center">
            <div
              ref={canvasRef}
              className={`bg-white shadow-lg transition-all duration-300 relative ${
                deviceView === 'mobile' ? 'min-h-[600px]' : 'min-h-[800px]'
              }`}
              style={{ 
                width: getCanvasWidth(),
                maxWidth: getCanvasMaxWidth(),
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                backgroundImage: showGrid ? `
                  linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                ` : 'none',
                backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : 'auto'
              }}
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
              onClick={() => setSelectedElementId(null)}
            >
              {/* Empty State */}
              {currentPage?.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
                  <div className="text-center">
                    <Layout className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-medium mb-2">Start building your page</h3>
                    <p className="text-sm">Drag elements from the left sidebar to get started</p>
                  </div>
                </div>
              )}

              {/* Render Elements */}
              {currentPage?.elements.map(element => (
                <ElementRenderer
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  isHovered={hoveredElementId === element.id}
                  isPreviewMode={isPreviewMode}
                  snapToGrid={snapToGrid}
                  gridSize={gridSize}
                  onElementClick={handleElementClick}
                  onUpdateElement={updateElement}
                  onDeleteElement={deleteElement}
                  onDuplicateElement={duplicateElement}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`bg-white border-l border-gray-200 transition-all duration-300 ${
        rightSidebarOpen ? 'w-80' : 'w-0'
      } overflow-hidden flex flex-col`}>
        
        {/* Right Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Properties</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRightSidebarOpen(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Sidebar Tabs */}
        <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {/* Design Tab */}
            <TabsContent value="design" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <DesignPanel
                  selectedElement={selectedElement || null}
                  onUpdateElement={updateElement}
                  onDuplicateElement={duplicateElement}
                  onDeleteElement={deleteElement}
                />
              </ScrollArea>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                {!selectedElement ? (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an element for advanced options</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Element ID</Label>
                      <Input value={selectedElement.id} disabled className="text-xs" />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">CSS Classes</Label>
                      <Input 
                        placeholder="custom-class another-class"
                        value={selectedElement.attributes?.className || ''}
                        onChange={(e) => updateElement(selectedElement.id, {
                          attributes: { ...selectedElement.attributes, className: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Custom CSS</Label>
                      <Textarea 
                        placeholder="color: red; font-size: 16px;"
                        value={selectedElement.attributes?.style || ''}
                        onChange={(e) => updateElement(selectedElement.id, {
                          attributes: { ...selectedElement.attributes, style: e.target.value }
                        })}
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Page Settings Tab */}
            <TabsContent value="page" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                {currentPage && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Page Title</Label>
                      <Input
                        value={currentPage.title}
                        onChange={(e) => {
                          const updatedPage = { ...currentPage, title: e.target.value };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Page Slug</Label>
                      <Input
                        value={currentPage.slug}
                        onChange={(e) => {
                          const updatedPage = { ...currentPage, slug: e.target.value };
                          setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-2 block">SEO Title</Label>
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
                      <Label className="text-sm font-medium mb-2 block">SEO Description</Label>
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
                      <Label className="text-sm font-medium mb-2 block">Keywords</Label>
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
