
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
  ZoomIn, ZoomOut
} from 'lucide-react';
import { toast } from 'sonner';

import { Element, Page } from './page-builder/types';
import { elementTemplates } from './page-builder/ElementTemplates';
import { ElementRenderer } from './page-builder/ElementRenderer';
import { DesignPanel } from './page-builder/DesignPanel';

interface AdvancedPageBuilderProps {
  siteId: string;
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
  const [activeTab, setActiveTab] = useState('design');
  const [showProperties, setShowProperties] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  
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
      content: element.content || '',
      src: element.src,
      alt: element.alt,
      href: element.href,
      target: element.target,
      children: element.children || [],
      styles: element.styles || {},
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
        if (element.children) {
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
        if (element.children) {
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
        if (element.children) {
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

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Elements & Properties */}
      <div className={`${showProperties ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Page Builder</h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4 m-2">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="elements" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Drag elements to canvas</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {elementTemplates.map((template) => {
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
                              <Icon className="h-6 w-6 mx-auto mb-1" />
                              <span className="text-xs">{template.label}</span>
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
                    onDuplicateElement={duplicateElement}
                    onDeleteElement={deleteElement}
                  />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
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
                      <div>
                        <Label>SEO Description</Label>
                        <Textarea
                          value={currentPage.settings.description}
                          onChange={(e) => {
                            const updatedPage = { 
                              ...currentPage, 
                              settings: { ...currentPage.settings, description: e.target.value }
                            };
                            setPages(prev => prev.map(p => p.id === currentPageId ? updatedPage : p));
                          }}
                        />
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="layers" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    <Label className="font-medium">Page Layers</Label>
                    {currentPage?.elements.map((element) => (
                      <div
                        key={element.id}
                        className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                          selectedElementId === element.id ? 'bg-blue-100 border border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedElementId(element.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm capitalize">{element.type}</span>
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
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              
              {pages.length > 1 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => currentPageId && deletePage(currentPageId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Page
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
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
              
              <Button size="sm" onClick={publishPage}>
                {currentPage?.isPublished ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto">
          <div className="h-full flex items-center justify-center">
            <div
              ref={canvasRef}
              className={`bg-white shadow-lg transition-all duration-300 ${
                previewMode === 'mobile' ? 'w-[375px] min-h-[600px]' :
                previewMode === 'tablet' ? 'w-[768px] min-h-[600px]' :
                'w-full max-w-[1200px] min-h-[600px]'
              }`}
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedElement) {
                  addElement(draggedElement);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
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
                <div className="p-4">
                  {currentPage?.elements.map(element => 
                    <ElementRenderer
                      key={element.id}
                      element={element}
                      isSelected={selectedElementId === element.id}
                      onElementClick={handleElementClick}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Additional Tools */}
      <div className={`${showLayers ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-l border-gray-200`}>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export HTML
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Import HTML
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
