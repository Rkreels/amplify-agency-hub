
import React, { useState, useCallback } from 'react';
import { Element } from './types';
import { ElementRenderer } from './ElementRenderer';
import { DesignPanel } from './DesignPanel';
import { ElementTemplates } from './ElementTemplates';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  RotateCcw
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface EnhancedPageBuilderProps {
  siteId: string;
}

export function EnhancedPageBuilder({ siteId }: EnhancedPageBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);
  const [activePanel, setActivePanel] = useState<'elements' | 'design' | 'settings' | 'layers'>('elements');
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
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
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedElement(newElement);
    toast.success('Element duplicated');
  }, [elements, saveToHistory]);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'tablet': return 'max-w-2xl';
      case 'mobile': return 'max-w-sm';
      default: return 'w-full';
    }
  };

  const savePage = () => {
    toast.success('Page saved successfully');
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="h-4 w-4" />
            </Button>
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
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={previewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" onClick={savePage}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className={`mx-auto bg-white min-h-screen shadow-lg transition-all duration-300 ${getViewportClass()}`}>
            <div className="p-4">
              {elements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Square className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Start Building Your Page</h3>
                  <p className="text-sm">Drag elements from the panel to get started</p>
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

      {/* Right Sidebar - Editor Panel */}
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
              <ElementTemplates onAddElement={addElement} />
            </TabsContent>

            <TabsContent value="design" className="p-4 mt-0">
              {selectedElement ? (
                <DesignPanel
                  element={selectedElement}
                  onUpdateElement={(updates) => updateElement(selectedElement.id, updates)}
                  onDeleteElement={() => deleteElement(selectedElement.id)}
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
                <h3 className="font-medium text-sm mb-3">Page Layers</h3>
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedElement?.id === element.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedElement(element)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {element.type} {index + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {element.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 mt-0">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Page Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <Code className="h-4 w-4 mr-1" />
                      Custom CSS
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-1" />
                      Export HTML
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="h-4 w-4 mr-1" />
                      Import Template
                    </Button>
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
