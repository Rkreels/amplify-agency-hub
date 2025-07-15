
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Plus, Settings, Eye, Code, Download, Upload, Save, Undo, Redo, 
  Copy, Trash2, Move, AlignLeft, AlignCenter, AlignRight, Bold, 
  Italic, Underline, Palette, Type, Image, Square, Layout, 
  Smartphone, Tablet, Monitor, Globe, ChevronDown, ChevronRight,
  Layers, Grid, Box, Text, FormInput, Video, Minus, MoreHorizontal,
  MousePointer, RotateCcw, RotateCw, ZoomIn, ZoomOut
} from 'lucide-react';
import { Element, Position, Size, Template, Page } from './types';
import { ElementRenderer } from './ElementRenderer';
import { AdvancedRightPanel } from './AdvancedRightPanel';
import { DragDropCanvas } from './DragDropCanvas';
import { ElementToolbar } from './ElementToolbar';

interface ComprehensivePageBuilderProps {
  siteId: string;
}

export function ComprehensivePageBuilder({ siteId }: ComprehensivePageBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [pageSettings, setPageSettings] = useState({
    title: 'My Awesome Page',
    description: 'A page built with our comprehensive page builder',
    keywords: 'web design, page builder, react',
    customCSS: '',
    customJS: '',
    favicon: '',
    ogImage: ''
  });
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [rightPanelTab, setRightPanelTab] = useState<'elements' | 'design' | 'settings' | 'templates'>('elements');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(10);

  const canvasRef = useRef<HTMLDivElement>(null);

  // History management
  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [elements, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  // Element management
  const handleAddElement = useCallback((elementType: string, position?: Position) => {
    const newElement: Element = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: elementType as any,
      content: getDefaultContent(elementType),
      position: position || getDefaultPosition(),
      size: getDefaultSize(elementType),
      styles: getDefaultStyles(elementType),
      props: getDefaultProps(elementType),
      children: [],
      attributes: {},
      layerId: 'default'
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    saveToHistory();
    toast.success(`${elementType} element added`);
  }, [saveToHistory]);

  const handleSelectElement = useCallback((element: Element | null) => {
    setSelectedElement(element);
    if (element) {
      setRightPanelTab('design');
    }
  }, []);

  const handleUpdateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
    
    saveToHistory();
  }, [selectedElement, saveToHistory]);

  const handleDeleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    saveToHistory();
    toast.success('Element deleted');
  }, [selectedElement, saveToHistory]);

  const handleDuplicateElement = useCallback((element: Element) => {
    const duplicated: Element = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: { 
        x: element.position.x + 20, 
        y: element.position.y + 20 
      }
    };
    setElements(prev => [...prev, duplicated]);
    setSelectedElement(duplicated);
    saveToHistory();
    toast.success('Element duplicated');
  }, [saveToHistory]);

  // Drag and drop handlers
  const handleDragStart = useCallback((elementData: any) => {
    setDraggedElement(elementData);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((result: any) => {
    setIsDragging(false);
    setDraggedElement(null);
    
    if (!result.destination) return;

    const reorderedElements = Array.from(elements);
    const [movedElement] = reorderedElements.splice(result.source.index, 1);
    reorderedElements.splice(result.destination.index, 0, movedElement);

    setElements(reorderedElements);
    saveToHistory();
  }, [elements, saveToHistory]);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedElement.template) {
      handleAddElement(draggedElement.template.type, { x, y });
    }
  }, [draggedElement, handleAddElement]);

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

  const getDefaultPosition = (): Position => ({
    x: Math.floor(Math.random() * 200) + 50,
    y: Math.floor(Math.random() * 200) + 50
  });

  const getDefaultSize = (type: string): Size => {
    const sizes: Record<string, Size> = {
      text: { width: 200, height: 40 },
      heading: { width: 300, height: 60 },
      button: { width: 120, height: 40 },
      image: { width: 200, height: 150 },
      video: { width: 400, height: 225 },
      form: { width: 300, height: 400 },
      container: { width: 400, height: 200 },
      divider: { width: 100, height: 1 },
      spacer: { width: 100, height: 50 }
    };
    return sizes[type] || { width: 200, height: 100 };
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
      image: {
        objectFit: 'cover',
        borderRadius: '0px'
      },
      container: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '20px'
      },
      divider: {
        backgroundColor: '#dee2e6',
        height: '1px',
        border: 'none'
      },
      spacer: {
        height: '50px'
      }
    };
    return styles[type] || {};
  };

  const getDefaultProps = (type: string): Record<string, any> => {
    const props: Record<string, Record<string, any>> = {
      heading: { level: 'h2' },
      image: { src: '', alt: 'Image' },
      video: { src: '', autoplay: false, controls: true },
      button: { href: '', target: '_self' },
      form: { action: '', method: 'POST' }
    };
    return props[type] || {};
  };

  const handlePageSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = useCallback(() => {
    // Implement save functionality
    console.log('Saving page...', { elements, pageSettings });
    toast.success('Page saved successfully');
  }, [elements, pageSettings]);

  const handlePreview = useCallback(() => {
    setIsPreviewMode(!isPreviewMode);
  }, [isPreviewMode]);

  const handleExport = useCallback(() => {
    // Implement export functionality
    const exportData = {
      elements,
      pageSettings,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Page exported successfully');
  }, [elements, pageSettings]);

  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Device View Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <Button 
                variant={deviceView === 'desktop' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('desktop')}
                className="px-3"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant={deviceView === 'tablet' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('tablet')}
                className="px-3"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={deviceView === 'mobile' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('mobile')}
                className="px-3"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* History Controls */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="px-3"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="px-3"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                className="px-3"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[50px] text-center">{zoomLevel}%</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                className="px-3"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* View Options */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={showGrid ? 'bg-blue-50 border-blue-200' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={snapToGrid ? 'bg-blue-50 border-blue-200' : ''}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <DragDropCanvas
          ref={canvasRef}
          elements={elements}
          selectedElement={selectedElement}
          hoveredElement={hoveredElement}
          deviceView={deviceView}
          zoomLevel={zoomLevel}
          isPreviewMode={isPreviewMode}
          showGrid={showGrid}
          gridSize={gridSize}
          snapToGrid={snapToGrid}
          onElementSelect={handleSelectElement}
          onElementHover={setHoveredElement}
          onElementUpdate={handleUpdateElement}
          onElementDelete={handleDeleteElement}
          onElementDuplicate={handleDuplicateElement}
          onDrop={handleCanvasDrop}
          onDragOver={(e) => e.preventDefault()}
        />
      </div>

      {/* Element Toolbar */}
      {selectedElement && !isPreviewMode && (
        <ElementToolbar
          element={selectedElement}
          onUpdate={handleUpdateElement}
          onDelete={handleDeleteElement}
          onDuplicate={handleDuplicateElement}
        />
      )}

      {/* Advanced Right Panel */}
      <AdvancedRightPanel
        activeTab={rightPanelTab}
        onTabChange={setRightPanelTab}
        selectedElement={selectedElement}
        onAddElement={handleAddElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        pageSettings={pageSettings}
        onPageSettingsChange={handlePageSettingsChange}
        onDragStart={handleDragStart}
      />
    </div>
  );
}
