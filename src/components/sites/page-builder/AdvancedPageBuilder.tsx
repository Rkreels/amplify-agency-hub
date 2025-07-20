
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
  Layout, Layers, Undo, Redo, Grid3X3, Move, Lock, Unlock,
  Monitor, Tablet, Smartphone, Save, Download, Upload,
  ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight,
  Palette, Type, Image as ImageIcon, MousePointer2, AlignLeft, AlignCenter, AlignRight
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

  // Load template if provided
  useEffect(() => {
    if (templateId && templateId !== 'new') {
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
      locked: false
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

  const toggleElementLock = useCallback((elementId: string) => {
    if (!selectedElement) return;
    updateElement(elementId, { locked: !selectedElement.locked });
    toast.success(`Element ${selectedElement.locked ? 'unlocked' : 'locked'}`);
  }, [selectedElement, updateElement]);

  // Event handlers
  const handleElementClick = useCallback((element: Element) => {
    setSelectedElementId(element.id);
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
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Pre-built Templates</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Landing Page</h4>
                        <p className="text-sm text-gray-600">Complete landing page template</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Contact Form</h4>
                        <p className="text-sm text-gray-600">Professional contact form</p>
                      </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Pricing Table</h4>
                        <p className="text-sm text-gray-600">Responsive pricing table</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="m-0 h-full">
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Upload Assets</Label>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </Button>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Stock Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded cursor-pointer hover:bg-gray-200">
                          <img src={`https://via.placeholder.com/150x150?text=Image${i}`} alt={`Stock ${i}`} className="w-full h-full object-cover rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
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

            <Button variant="outline" size="sm" onClick={addPage}>
              <Plus className="h-4 w-4 mr-1" />
              Add Page
            </Button>

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
                {!selectedElement ? (
                  <div className="text-center py-8 text-gray-500">
                    <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select an element to edit its design</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Element Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => duplicateElement(selectedElement)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleElementLock(selectedElement.id)}
                      >
                        {selectedElement.locked ? <Unlock className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                        {selectedElement.locked ? 'Unlock' : 'Lock'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteElement(selectedElement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Position & Size */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Position & Size</Label>
                      <div className="grid grid-cols-2 gap-2">
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
                    </div>

                    {/* Content */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Content</Label>
                        <Textarea
                          value={selectedElement.content || ''}
                          onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
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
                              onChange={(e) => updateElement(selectedElement.id, {
                                styles: { ...selectedElement.styles, fontSize: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Font Weight</Label>
                            <Select
                              value={selectedElement.styles?.fontWeight || 'normal'}
                              onValueChange={(value) => updateElement(selectedElement.id, {
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
                            onChange={(e) => updateElement(selectedElement.id, {
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
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Border Width</Label>
                          <Input
                            value={selectedElement.styles?.borderWidth || '0px'}
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, borderWidth: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Border Radius</Label>
                          <Input
                            value={selectedElement.styles?.borderRadius || '0px'}
                            onChange={(e) => updateElement(selectedElement.id, {
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
                          onChange={(e) => updateElement(selectedElement.id, {
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
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, padding: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Margin</Label>
                          <Input
                            value={selectedElement.styles?.margin || '0px'}
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, margin: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Z-Index</Label>
                      <Input
                        type="number"
                        value={selectedElement.styles?.zIndex || 1}
                        onChange={(e) => updateElement(selectedElement.id, {
                          styles: { ...selectedElement.styles, zIndex: parseInt(e.target.value) || 1 }
                        })}
                      />
                    </div>

                    {selectedElement.type === 'button' && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Link URL</Label>
                          <Input
                            value={selectedElement.href || ''}
                            onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Link Target</Label>
                          <Select
                            value={selectedElement.target || '_self'}
                            onValueChange={(value) => updateElement(selectedElement.id, { target: value })}
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

                    {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Source URL</Label>
                          <Input
                            value={selectedElement.src || ''}
                            onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Alt Text</Label>
                          <Input
                            value={selectedElement.alt || ''}
                            onChange={(e) => updateElement(selectedElement.id, { alt: e.target.value })}
                            placeholder="Description of the image"
                          />
                        </div>
                      </div>
                    )}
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

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Page Actions</Label>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export Page
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Page
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Page
                        </Button>
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
