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
  Plus, Edit, Trash2, Copy, Eye, EyeOff, Settings, 
  Layout, Layers,
  Monitor, Tablet, Smartphone, Save, Download, Upload,
  ZoomIn, ZoomOut,
  Menu, Grid, Undo, Redo, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

import { Element, Page } from './page-builder/types';
import { elementTemplates, sectionTemplates } from './page-builder/ElementTemplates';
import { ElementRenderer } from './page-builder/ElementRenderer';
import { DesignPanel } from './page-builder/DesignPanel';

interface AdvancedPageBuilderProps {
  siteId: string;
  templateId?: string;
}

export function AdvancedPageBuilder({ siteId }: AdvancedPageBuilderProps) {
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'page-1',
      title: 'Home',
      slug: '/',
      elements: [],
      settings: {
        title: 'Home Page',
        description: 'Welcome to our website',
        keywords: '',
        backgroundColor: '#ffffff',
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
  const [activeTab, setActiveTab] = useState('design');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [leftActiveTab, setLeftActiveTab] = useState('elements');
  const [rightActiveTab, setRightActiveTab] = useState('design');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const gridSize = 20;
  const snapToGrid = true;

  const canvasRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedElement = currentPage?.elements.find(e => e.id === selectedElementId);

  // History for undo/redo
  const [history, setHistory] = useState<Page[][]>([pages]);
  const [historyIndex, setHistoryIndex] = useState(0);

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
        backgroundColor: '#ffffff',
      },
      isPublished: false,
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    toast.success('New page created');
  }, [pages.length]);

  const deletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) {
      toast.error('Cannot delete the last page');
      return;
    }
    setPages(prev => prev.filter(p => p.id !== pageId));
    if (currentPageId === pageId) {
      setCurrentPageId(pages[0].id);
    }
    toast.success('Page deleted');
  }, [pages, currentPageId]);

  const addElement = useCallback((element: Partial<Element>) => {
    if (!currentPage) return;

    const newElement: Element = {
      id: `element-${Date.now()}`,
      type: element.type || 'text',
      position: element.position || { x: 0, y: 0 },
      size: element.size || { width: 200, height: 100 },
      content: element.content || '',
      styles: element.styles || {},
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
  }, [currentPage, currentPageId]);

  const duplicateElement = useCallback((elementId: string) => {
    if (!currentPage) return;

    const findElement = (elements: Element[]): Element | null => {
      for (const element of elements) {
        if (element.id === elementId) return element;
        if (element.children && element.children.length > 0) {
          const found = findElement(element.children);
          if (found) return found;
        }
      }
      return null;
    };

    const element = findElement(currentPage.elements);
    if (!element) return;

    const duplicateElementRecursive = (el: Element): Element => ({
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      children: el.children?.map(duplicateElementRecursive),
    });

    const duplicatedElement = duplicateElementRecursive(element);
    addElement(duplicatedElement);
  }, [currentPage, addElement]);

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElementId(element.id);
  }, []);

  const savePage = useCallback(() => {
    toast.success('Page saved successfully');
  }, []);

  const publishPage = useCallback(() => {
    if (!currentPage) return;
    
    const updatedPage = { ...currentPage, isPublished: true };
    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    toast.success('Page published successfully');
  }, [currentPage, currentPageId]);

  const undo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setPages(history[newIndex]);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setPages(history[newIndex]);
    setHistoryIndex(newIndex);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedElement) {
      addElement(draggedElement);
      setIsDragging(false);
      setDraggedElement(null);
    }
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addTemplateSection = (template: any) => {
    if (!currentPage) return;
    // For simplicity, add template elements to current page elements
    const newElements = template.elements.map((el: Element) => ({
      ...el,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    const updatedPage = {
      ...currentPage,
      elements: [...currentPage.elements, ...newElements],
    };
    setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
    toast.success('Section added');
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Extended */}
      <div className={`${showLeftSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Page Builder</h3>
          </div>
          
          <Tabs value={leftActiveTab} onValueChange={setLeftActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-2">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="elements" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Basic Elements</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {elementTemplates.filter(t => t.category === 'basic').map((template) => {
                          const Icon = template.icon;
                          return (
                            <Card 
                              key={template.type}
                              className="cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing"
                              draggable
                              onDragStart={(e) => {
                                setDraggedElement(template.template as Element);
                                setIsDragging(true);
                                e.dataTransfer.effectAllowed = 'copy';
                              }}
                              onDragEnd={() => {
                                setIsDragging(false);
                                setDraggedElement(null);
                              }}
                            >
                              <CardContent className="p-3 text-center">
                                <Icon className="h-6 w-6 mx-auto mb-1 text-blue-600" />
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
                        {elementTemplates.filter(t => t.category === 'form').map((template) => {
                          const Icon = template.icon;
                          return (
                            <Card 
                              key={template.type}
                              className="cursor-grab hover:shadow-md transition-shadow"
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
                                <Icon className="h-6 w-6 mx-auto mb-1 text-green-600" />
                                <span className="text-xs font-medium">{template.label}</span>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Media Elements</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {elementTemplates.filter(t => t.category === 'media').map((template) => {
                          const Icon = template.icon;
                          return (
                            <Card 
                              key={template.type}
                              className="cursor-grab hover:shadow-md transition-shadow"
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
                                <Icon className="h-6 w-6 mx-auto mb-1 text-purple-600" />
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

              <TabsContent value="templates" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <Label className="font-medium">Section Templates</Label>
                    <div className="grid gap-3">
                      {sectionTemplates.map((template) => (
                        <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                              <Layout className="h-8 w-8 text-gray-400" />
                            </div>
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                            <Button 
                              size="sm" 
                              className="w-full mt-3"
                              onClick={() => addTemplateSection(template)}
                            >
                              Add Section
                            </Button>
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
                    <div>
                      <Label className="font-medium mb-2 block">Media Library</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Sample assets */}
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded cursor-pointer hover:shadow-md transition-shadow">
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">Image {i}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Media
                    </Button>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="layers" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="font-medium">Page Layers</Label>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Lock className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {currentPage?.elements.map((element, index) => (
                      <div
                        key={element.id}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 border transition-colors ${
                          selectedElementId === element.id ? 'bg-blue-50 border-blue-300 shadow-sm' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedElementId(element.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium capitalize">{element.type}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {element.content?.substring(0, 30) || `Layer ${index + 1}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <Select value={currentPageId} onValueChange={setCurrentPageId}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pages.map(page => (
                    <SelectItem key={page.id} value={page.id}>
                      <div className="flex items-center gap-2">
                        {page.title}
                        {page.isPublished && <Badge variant="secondary" className="text-xs">Live</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button size="sm" variant="outline" onClick={addPage}>
                <Plus className="h-4 w-4 mr-1" />
                New Page
              </Button>
              
              {pages.length > 1 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => currentPageId && deletePage(currentPageId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Device Preview */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                  title="Desktop View"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('tablet')}
                  title="Tablet View"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                  title="Mobile View"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Zoom Controls */}
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

              {/* Grid Toggle */}
              <Button
                size="sm"
                variant={showGrid ? 'default' : 'outline'}
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid"
              >
                <Grid className="h-4 w-4" />
              </Button>

              {/* Preview Toggle */}
              <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                {isPreviewMode ? <Edit className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button size="sm" variant="outline" onClick={savePage}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <Button size="sm" onClick={publishPage} className="bg-green-600 hover:bg-green-700">
                {currentPage?.isPublished ? 'Update' : 'Publish'}
              </Button>

              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowRightSidebar(!showRightSidebar)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto relative">
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e5e5 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)
                `,
                backgroundSize: `${gridSize}px ${gridSize}px`,
                transform: `scale(${zoomLevel / 100})`
              }}
            />
          )}
          
          <div className="h-full flex items-center justify-center">
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
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
              onClick={() => setSelectedElementId(null)}
            >
              {currentPage?.elements.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Start building your page</p>
                    <p className="text-sm">Drag elements from the sidebar to get started</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {currentPage?.elements.map(element => (
                    <ElementRenderer
                      key={element.id}
                      element={element}
                      isSelected={selectedElementId === element.id}
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Extended Design Panel */}
      <div className={`${showRightSidebar ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-l border-gray-200`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Design Panel</h3>
          </div>
          
          <Tabs value={rightActiveTab} onValueChange={setRightActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="page">Page</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="design" className="m-0 h-full">
                <ScrollArea className="h-full">
                  <DesignPanel
                    selectedElement={selectedElement || null}
                    onUpdateElement={updateElement}
                    onDuplicateElement={(element) => duplicateElement(element.id)}
                    onDeleteElement={deleteElement}
                  />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="advanced" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {selectedElement ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Element ID</Label>
                          <Input
                            value={selectedElement.id}
                            onChange={(e) => updateElement(selectedElement.id, { id: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium mb-2 block">CSS Classes</Label>
                          <Input
                            value={selectedElement.attributes?.className || ''}
                            onChange={(e) => updateElement(selectedElement.id, {
                              attributes: { ...selectedElement.attributes, className: e.target.value }
                            })}
                            placeholder="custom-class another-class"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">Custom CSS</Label>
                          <Textarea
                            value={selectedElement.attributes?.style || ''}
                            onChange={(e) => updateElement(selectedElement.id, {
                              attributes: { ...selectedElement.attributes, style: e.target.value }
                            })}
                            placeholder="color: red; font-size: 16px;"
                            rows={4}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={selectedElement.locked || false}
                            onCheckedChange={(checked) => updateElement(selectedElement.id, { locked: checked })}
                          />
                          <Label>Lock Element</Label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Select an element to view advanced options</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

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
                        <Label className="text-sm font-medium mb-2 block">Meta Keywords</Label>
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

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Background</Label>
                        <div className="space-y-2">
                          <Input
                            type="color"
                            value={currentPage.settings.backgroundColor || '#ffffff'}
                            onChange={(e) => {
                              const updatedPage = { 
                                ...currentPage, 
                                settings: { ...currentPage.settings, backgroundColor: e.target.value }
                              };
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
    </div>
  );
}
