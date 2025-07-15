
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Monitor, Tablet, Smartphone, Undo, Redo, Save, Eye, Download,
  ZoomIn, ZoomOut, Grid, MousePointer, ChevronLeft, ChevronRight,
  Settings, Layers, Palette, Code, RotateCcw, RotateCw
} from 'lucide-react';
import { Element, Position, Size } from './types';
import { ElementRenderer } from './ElementRenderer';
import { AdvancedRightPanel } from './AdvancedRightPanel';

interface ResponsivePageBuilderProps {
  siteId: string;
}

export function ResponsivePageBuilder({ siteId }: ResponsivePageBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'elements' | 'design' | 'settings' | 'templates'>('elements');
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Responsive canvas dimensions
  const getCanvasStyle = () => {
    const baseStyles = {
      background: '#ffffff',
      minHeight: '100vh',
      margin: '0 auto',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      position: 'relative' as const,
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'top center',
      transition: 'all 0.3s ease'
    };

    switch (deviceView) {
      case 'mobile':
        return { ...baseStyles, width: '375px', maxWidth: '375px' };
      case 'tablet':
        return { ...baseStyles, width: '768px', maxWidth: '768px' };
      default:
        return { ...baseStyles, width: '100%', maxWidth: '1200px' };
    }
  };

  const handleAddElement = useCallback((elementType: string, position?: Position) => {
    const newElement: Element = {
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: elementType as any,
      content: getDefaultContent(elementType),
      position: position || { x: 50, y: 50 },
      size: getDefaultSize(elementType),
      styles: getDefaultStyles(elementType),
      props: {},
      children: [],
      attributes: {},
      layerId: 'default'
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    toast.success(`${elementType} element added`);
  }, []);

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

  const getDefaultSize = (type: string): Size => {
    const sizes: Record<string, Size> = {
      text: { width: 200, height: 40 },
      heading: { width: 300, height: 60 },
      button: { width: 120, height: 40 },
      image: { width: 200, height: 150 },
      video: { width: 400, height: 225 },
      form: { width: 300, height: 400 },
      container: { width: 400, height: 200 },
      divider: { width: '100%', height: 1 },
      spacer: { width: '100%', height: 50 }
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
        fontFamily: 'Arial, sans-serif'
      },
      button: {
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer'
      }
    };
    return styles[type] || {};
  };

  const handleUpdateElement = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedElement]);

  const handleDeleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    toast.success('Element deleted');
  }, [selectedElement]);

  const handleSave = () => {
    toast.success('Page saved successfully');
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'mr-0' : 'mr-80'}`}>
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm relative z-20">
          <div className="flex items-center space-x-4">
            {/* Device View Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button 
                variant={deviceView === 'desktop' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('desktop')}
                className="px-3 h-8"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant={deviceView === 'tablet' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('tablet')}
                className="px-3 h-8"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button 
                variant={deviceView === 'mobile' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setDeviceView('mobile')}
                className="px-3 h-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* History Controls */}
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" className="px-3 h-8">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-3 h-8">
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
                className="px-2 h-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[50px] text-center">{zoomLevel}%</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                className="px-2 h-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* View Options */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 h-8 ${showGrid ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`px-2 h-8 ${snapToGrid ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <MousePointer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreview} className="h-8">
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 h-8">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="px-2 h-8"
            >
              {sidebarCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4 relative">
          <div className="h-full flex items-start justify-center">
            <div
              ref={canvasRef}
              style={getCanvasStyle()}
              className="relative overflow-hidden"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElement(null);
                }
              }}
            >
              {/* Grid Background */}
              {showGrid && !isPreviewMode && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              )}

              {/* Device Frame */}
              {deviceView !== 'desktop' && (
                <div className="absolute -inset-4 border-8 border-gray-800 rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full"></div>
                  {deviceView === 'mobile' && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-gray-600 rounded-full"></div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {elements.length === 0 && !isPreviewMode && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-gray-400 rounded"></div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Start building your page</h3>
                    <p className="text-sm">Drag elements from the sidebar to get started</p>
                  </div>
                </div>
              )}

              {/* Elements */}
              {elements.map((element) => (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: element.position.x,
                    top: element.position.y,
                    width: element.size.width,
                    height: element.size.height,
                    zIndex: selectedElement?.id === element.id ? 1000 : 1
                  }}
                  onMouseEnter={() => !isPreviewMode && setHoveredElement(element)}
                  onMouseLeave={() => !isPreviewMode && setHoveredElement(null)}
                >
                  <ElementRenderer
                    element={element}
                    isSelected={selectedElement?.id === element.id}
                    isHovered={hoveredElement?.id === element.id}
                    isPreviewMode={isPreviewMode}
                    snapToGrid={snapToGrid}
                    gridSize={20}
                    onElementClick={setSelectedElement}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElement}
                    onDuplicateElement={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 bg-white border-l shadow-lg transition-transform duration-300 z-30 ${
        sidebarCollapsed ? 'translate-x-full' : 'translate-x-0'
      }`} style={{ width: '320px' }}>
        <AdvancedRightPanel
          activeTab={rightPanelTab}
          onTabChange={setRightPanelTab}
          selectedElement={selectedElement}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onDuplicateElement={() => {}}
          pageSettings={{
            title: 'My Page',
            description: 'Page description',
            keywords: 'keywords',
            customCSS: '',
            customJS: '',
            favicon: '',
            ogImage: ''
          }}
          onPageSettingsChange={() => {}}
          onDragStart={() => {}}
        />
      </div>

      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 lg:hidden z-20"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
}
