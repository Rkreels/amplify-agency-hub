import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Element } from './types';
import { ElementRenderer } from './ElementRenderer';
import { DesignPanel } from './DesignPanel';
import { EnhancedElementTemplates } from './EnhancedElementTemplates';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Code, 
  Settings, 
  Layers,
  Plus,
  Undo,
  Redo,
  Save,
  Download,
  Upload,
  Palette,
  Type,
  Image,
  Square,
  MousePointer,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  Play,
  Pause,
  RefreshCw,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Maximize,
  Minimize
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface ComprehensivePageBuilderProps {
  siteId: string;
}

export function ComprehensivePageBuilder({ siteId }: ComprehensivePageBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);
  const [activePanel, setActivePanel] = useState<'elements' | 'design' | 'settings' | 'layers'>('elements');
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [rulers, setRulers] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<Element | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const saveToHistory = useCallback((newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
      toast.success('Undid last action');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      toast.success('Redid last action');
    }
  }, [history, historyIndex]);

  const addElement = useCallback((template: Partial<Element>) => {
    const newElement: Element = {
      id: uuidv4(),
      type: template.type || 'text',
      content: template.content || '',
      styles: {
        padding: '16px',
        margin: '8px',
        position: 'relative',
        zIndex: '1', // Fix: Convert number to string
        ...template.styles
      },
      ...template
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(newElement);
    toast.success('Element added successfully');
  }, [elements, saveToHistory]);

  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    const newElements = elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    );
    setElements(newElements);
    saveToHistory(newElements);
    
    if (selectedElement?.id === elementId) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  }, [elements, selectedElement, saveToHistory]);

  const deleteElement = useCallback((elementId: string) => {
    const newElements = elements.filter(el => el.id !== elementId);
    setElements(newElements);
    saveToHistory(newElements);
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    toast.success('Element deleted');
  }, [elements, selectedElement, saveToHistory]);

  const duplicateElement = useCallback((element: Element) => {
    const newElement: Element = {
      ...element,
      id: uuidv4(),
      styles: {
        ...element.styles,
        top: (parseFloat(element.styles?.top || '0') + 20) + 'px',
        left: (parseFloat(element.styles?.left || '0') + 20) + 'px'
      }
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(newElement);
    toast.success('Element duplicated');
  }, [elements, saveToHistory]);

  const moveElement = useCallback((elementId: string, direction: 'up' | 'down') => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && elementIndex > 0) {
      [newElements[elementIndex], newElements[elementIndex - 1]] = 
      [newElements[elementIndex - 1], newElements[elementIndex]];
    } else if (direction === 'down' && elementIndex < elements.length - 1) {
      [newElements[elementIndex], newElements[elementIndex + 1]] = 
      [newElements[elementIndex + 1], newElements[elementIndex]];
    }

    setElements(newElements);
    saveToHistory(newElements);
    toast.success(`Element moved ${direction}`);
  }, [elements, saveToHistory]);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'tablet': return 'max-w-2xl';
      case 'mobile': return 'max-w-sm';
      default: return 'w-full';
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Simulate publishing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Page published successfully!');
    } catch (error) {
      toast.error('Failed to publish page');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    toast.info(previewMode ? 'Switched to edit mode' : 'Switched to preview mode');
  };

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom[0]);
  };

  const resetZoom = () => {
    setZoom(100);
  };

  const savePage = () => {
    toast.success('Page saved successfully');
  };

  const exportPage = () => {
    const exportData = {
      elements,
      settings: {
        viewMode,
        zoom,
        gridEnabled
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${siteId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Page exported successfully');
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Top Toolbar */}
        <div className="bg-white border-b p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* History Controls */}
              <div className="flex border rounded-md">
                <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0}>
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Viewport Controls */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={resetZoom}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* View Options */}
              <div className="flex items-center gap-2">
                <Button
                  variant={gridEnabled ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setGridEnabled(!gridEnabled)}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={rulers ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setRulers(!rulers)}
                >
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode ? 'default' : 'outline'}
                size="sm"
                onClick={handlePreview}
              >
                {previewMode ? <Pause className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button size="sm" onClick={savePage}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <Button size="sm" onClick={exportPage} variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              
              <Button 
                size="sm" 
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isPublishing ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-1" />
                )}
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Canvas with Grid and Rulers */}
        <div className="flex-1 p-6 overflow-auto relative">
          {rulers && (
            <>
              {/* Horizontal Ruler */}
              <div className="absolute top-0 left-6 right-6 h-6 bg-gray-100 border-b flex items-end text-xs">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex-1 border-r border-gray-300 text-center">
                    {i * 100}
                  </div>
                ))}
              </div>
              
              {/* Vertical Ruler */}
              <div className="absolute top-6 left-0 bottom-0 w-6 bg-gray-100 border-r flex flex-col items-end text-xs">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex-1 border-b border-gray-300 flex items-center justify-center writing-mode-vertical">
                    {i * 100}
                  </div>
                ))}
              </div>
            </>
          )}
          
          <div 
            className={`mx-auto bg-white min-h-screen shadow-lg transition-all duration-300 relative ${getViewportClass()}`}
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              backgroundImage: gridEnabled ? 'radial-gradient(circle, #d1d5db 1px, transparent 1px)' : 'none',
              backgroundSize: gridEnabled ? '20px 20px' : 'none'
            }}
            ref={canvasRef}
          >
            <div className="p-4 relative">
              {elements.length === 0 ? (
                <div className="text-center py-24 text-gray-500">
                  <Square className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium mb-2">Start Building Your Page</h3>
                  <p className="text-sm mb-4">Drag elements from the panel to get started</p>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <Type className="h-4 w-4 mr-1" />
                      Add Text
                    </Button>
                    <Button variant="outline" size="sm">
                      <Image className="h-4 w-4 mr-1" />
                      Add Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="h-4 w-4 mr-1" />
                      Add Button
                    </Button>
                  </div>
                </div>
              ) : (
                elements.map(element => (
                  <ElementRenderer
                    key={element.id}
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    onElementClick={setSelectedElement}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Right Sidebar - Editor Panel */}
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-3 border-b">
          <Tabs value={activePanel} onValueChange={(value: any) => setActivePanel(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="elements" className="text-xs">
                <Plus className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="design" className="text-xs">
                <Palette className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs">
                <Layers className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs">
                <Settings className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <Tabs value={activePanel} className="w-full">
            <TabsContent value="elements" className="p-4 mt-0">
              <EnhancedElementTemplates onAddElement={addElement} />
            </TabsContent>

            <TabsContent value="design" className="p-4 mt-0">
              {selectedElement ? (
                <DesignPanel
                  selectedElement={selectedElement}
                  onUpdateElement={updateElement}
                  onDeleteElement={deleteElement}
                  onDuplicateElement={() => duplicateElement(selectedElement)}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MousePointer className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Select an element to edit its design</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="layers" className="p-4 mt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">Page Layers</h3>
                  <Badge variant="secondary">{elements.length}</Badge>
                </div>
                
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedElement?.id === element.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveElement(element.id, 'up');
                            }}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveElement(element.id, 'down');
                            }}
                            disabled={index === elements.length - 1}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium capitalize">
                            {element.type} {index + 1}
                          </div>
                          <div className="text-xs text-gray-500">
                            {element.content?.slice(0, 20) || 'No content'}...
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {element.type}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateElement(element);
                          }}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(element.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {elements.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Layers className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No elements yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 mt-0">
              <div className="space-y-6">
                {/* Canvas Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Canvas Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="grid-toggle" className="text-sm">Show Grid</Label>
                      <Switch
                        id="grid-toggle"
                        checked={gridEnabled}
                        onCheckedChange={setGridEnabled}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="snap-toggle" className="text-sm">Snap to Grid</Label>
                      <Switch
                        id="snap-toggle"
                        checked={snapToGrid}
                        onCheckedChange={setSnapToGrid}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rulers-toggle" className="text-sm">Show Rulers</Label>
                      <Switch
                        id="rulers-toggle"
                        checked={rulers}
                        onCheckedChange={setRulers}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Zoom Level</Label>
                      <Slider
                        value={[zoom]}
                        onValueChange={handleZoomChange}
                        max={200}
                        min={25}
                        step={25}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500 text-center">{zoom}%</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Page Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Page Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <Code className="h-4 w-4 mr-1" />
                      Custom CSS
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={exportPage}>
                      <Download className="h-4 w-4 mr-1" />
                      Export HTML
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-1" />
                      Import Template
                    </Button>
                    <Separator />
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset Page
                    </Button>
                  </CardContent>
                </Card>

                {/* Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Elements</span>
                      <Badge variant="secondary">{elements.length}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>History States</span>
                      <Badge variant="secondary">{history.length}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current State</span>
                      <Badge variant="secondary">{historyIndex + 1}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
}
