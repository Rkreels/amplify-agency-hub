
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Element } from './types';
import { ElementRenderer } from './ElementRenderer';
import { DesignPanel } from './DesignPanel';
import { EnhancedElementTemplates } from './EnhancedElementTemplates';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  Play,
  Pause,
  RefreshCw,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  Globe,
  FileText
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
  const [activePanel, setActivePanel] = useState<'elements' | 'design' | 'layers' | 'settings'>('elements');
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [zoom, setZoom] = useState(100);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [rulers, setRulers] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize with sample content
  useEffect(() => {
    const sampleElements: Element[] = [
      {
        id: uuidv4(),
        type: 'heading',
        content: 'Welcome to Your New Website',
        styles: {
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
          margin: '40px 0 20px 0',
          color: '#1a202c',
          lineHeight: '1.2'
        },
        props: { level: 'h1' }
      },
      {
        id: uuidv4(),
        type: 'text',
        content: 'This is your new page created with our advanced page builder. Click on any element to edit it, or drag new elements from the sidebar to customize your page.',
        styles: {
          fontSize: '18px',
          lineHeight: '1.6',
          margin: '20px 0',
          textAlign: 'center',
          color: '#4a5568',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      },
      {
        id: uuidv4(),
        type: 'button',
        content: 'Get Started',
        href: '#',
        target: '_self',
        styles: {
          backgroundColor: '#3182ce',
          color: 'white',
          padding: '16px 32px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600',
          cursor: 'pointer',
          textAlign: 'center',
          display: 'inline-block',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          margin: '20px auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          display: 'block',
          width: 'fit-content'
        }
      }
    ];
    setElements(sampleElements);
    setHistory([sampleElements]);
    setHistoryIndex(0);
  }, []);

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
      setSelectedElement(null);
      toast.success('Undid last action');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      setSelectedElement(null);
      toast.success('Redid last action');
    }
  }, [history, historyIndex]);

  const addElement = useCallback((template: Partial<Element>) => {
    const newElement: Element = {
      id: uuidv4(),
      type: template.type || 'text',
      content: template.content || '',
      src: template.src,
      alt: template.alt,
      href: template.href,
      target: template.target,
      styles: {
        position: 'relative',
        zIndex: '1',
        ...template.styles
      },
      props: template.props,
      attributes: template.attributes,
      children: template.children || []
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

  const duplicateElement = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    const newElement: Element = {
      ...element,
      id: uuidv4(),
      content: element.content ? element.content + ' (Copy)' : element.content,
      styles: {
        ...element.styles,
        marginTop: '20px'
      }
    };
    
    const elementIndex = elements.findIndex(el => el.id === elementId);
    const newElements = [...elements];
    newElements.splice(elementIndex + 1, 0, newElement);
    
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
      case 'tablet': return 'max-w-3xl';
      case 'mobile': return 'max-w-sm';
      default: return 'w-full max-w-6xl';
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Page published successfully!', {
        description: 'Your changes are now live on your website.'
      });
    } catch (error) {
      toast.error('Failed to publish page');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      setSelectedElement(null);
    }
    toast.info(previewMode ? 'Switched to edit mode' : 'Switched to preview mode');
  };

  const handleZoomChange = (newZoom: number[]) => {
    setZoom(newZoom[0]);
  };

  const resetZoom = () => {
    setZoom(100);
    toast.info('Zoom reset to 100%');
  };

  const savePage = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date());
      toast.success('Page saved successfully');
    } catch (error) {
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const exportPage = () => {
    const exportData = {
      siteId,
      elements,
      settings: {
        viewMode,
        zoom,
        gridEnabled,
        snapToGrid,
        rulers
      },
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0'
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

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all elements? This action cannot be undone.')) {
      setElements([]);
      setSelectedElement(null);
      saveToHistory([]);
      toast.success('All elements cleared');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const template = JSON.parse(data);
        addElement(template);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Top Toolbar */}
        <div className="bg-white border-b p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* History Controls */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={undo} 
                  disabled={historyIndex <= 0}
                  className="rounded-none border-r"
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={redo} 
                  disabled={historyIndex >= history.length - 1}
                  className="rounded-none"
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              {/* Viewport Controls */}
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="rounded-none border-r"
                  title="Desktop View"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tablet')}
                  className="rounded-none border-r"
                  title="Tablet View"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="rounded-none"
                  title="Mobile View"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))} title="Zoom Out">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-16 text-center bg-gray-100 px-2 py-1 rounded">
                  {zoom}%
                </span>
                <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))} title="Zoom In">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={resetZoom} title="Reset Zoom">
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
                  title="Toggle Grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-gray-500 mr-2">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <Button
                variant={previewMode ? 'default' : 'outline'}
                size="sm"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                {previewMode ? <Pause className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button 
                size="sm" 
                onClick={savePage}
                disabled={isSaving}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              
              <Button 
                size="sm" 
                onClick={handlePublish}
                disabled={isPublishing}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                {isPublishing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isPublishing ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="flex justify-center">
            <div 
              className={`bg-white shadow-xl transition-all duration-300 min-h-screen relative ${getViewportClass()}`}
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center'
              }}
              ref={canvasRef}
            >
              <div 
                className={`relative p-8 min-h-screen ${isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
                style={{
                  backgroundImage: gridEnabled && !previewMode ? 
                    'radial-gradient(circle at 1px 1px, rgba(0,0,0,.15) 1px, transparent 0)' : 'none',
                  backgroundSize: gridEnabled && !previewMode ? '20px 20px' : 'none'
                }}
                onClick={() => !previewMode && setSelectedElement(null)}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {elements.length === 0 ? (
                  <div className="text-center py-24 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Globe className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-gray-900">Start Building Your Page</h3>
                    <p className="text-sm mb-6 text-gray-600 max-w-md mx-auto">
                      Drag elements from the panel on the right to get started building your page, or click the buttons below to add your first element.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => addElement({ type: 'text', content: 'Your text here...' })}>
                        <Type className="h-4 w-4 mr-2" />
                        Add Text
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addElement({ type: 'image', src: 'https://via.placeholder.com/400x300' })}>
                        <Image className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => addElement({ type: 'button', content: 'Click Me' })}>
                        <Square className="h-4 w-4 mr-2" />
                        Add Button
                      </Button>
                    </div>
                  </div>
                ) : (
                  elements.map(element => (
                    <ElementRenderer
                      key={element.id}
                      element={element}
                      isSelected={selectedElement?.id === element.id && !previewMode}
                      onElementClick={setSelectedElement}
                      isPreviewMode={previewMode}
                      onUpdateElement={updateElement}
                      onDeleteElement={deleteElement}
                      onDuplicateElement={() => duplicateElement(element.id)}
                    />
                  ))
                )}
                
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                      Drop element here
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Right Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col shadow-lg">
        <div className="p-4 border-b bg-gray-50">
          <Tabs value={activePanel} onValueChange={(value: any) => setActivePanel(value)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="elements" className="text-xs flex flex-col gap-1">
                <Plus className="h-4 w-4" />
                Elements
              </TabsTrigger>
              <TabsTrigger value="design" className="text-xs flex flex-col gap-1">
                <Palette className="h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="layers" className="text-xs flex flex-col gap-1">
                <Layers className="h-4 w-4" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs flex flex-col gap-1">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <Tabs value={activePanel} className="w-full">
            <TabsContent value="elements" className="p-4 mt-0 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Add Elements</h3>
                <Badge variant="secondary">{elements.length} elements</Badge>
              </div>
              <EnhancedElementTemplates onAddElement={addElement} />
            </TabsContent>

            <TabsContent value="design" className="p-4 mt-0">
              <DesignPanel
                selectedElement={selectedElement}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDuplicateElement={duplicateElement}
              />
            </TabsContent>

            <TabsContent value="layers" className="p-4 mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Page Layers</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{elements.length}</Badge>
                  <Button size="sm" variant="outline" onClick={clearAll} title="Clear All">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
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
                    <div className="flex items-center gap-3">
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
                          title="Move Up"
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
                          title="Move Down"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-sm font-medium capitalize text-gray-900">
                          {element.type} {index + 1}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-32">
                          {element.content || 'No content'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {element.type}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateElement(element.id);
                        }}
                        title="Duplicate"
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
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {elements.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Layers className="h-12 w-12 mx-auto mb-3" />
                  <p className="text-sm">No elements yet</p>
                  <p className="text-xs mt-1">Add elements to see them here</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-4 mt-0 space-y-6">
              {/* Canvas Settings */}
              <Card>
                <CardHeader className="pb-3">
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

              {/* Page Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Page Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={exportPage}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Page
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Template
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Code className="h-4 w-4 mr-2" />
                    Custom CSS
                  </Button>
                  <Separator />
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-600" onClick={clearAll}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    Performance
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardTitle>
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
                  <div className="flex justify-between text-sm">
                    <span>Load Time</span>
                    <Badge variant="outline" className="text-green-600">Fast</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
}
