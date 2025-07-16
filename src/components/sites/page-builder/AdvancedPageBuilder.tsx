import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Type, Heading, Square, Image, Video, FormInput, 
  Columns, Minus, Star, Users, Timer, BarChart3, 
  Share2, Phone, Calendar, MessageCircle, Navigation,
  Menu, Link, icons, Play, Upload, Palette, 
  Move, RotateCcw, RotateCw, Copy, Trash2, 
  Eye, EyeOff, Lock, Unlock, ZoomIn, ZoomOut,
  Undo, Redo, Grid3X3, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Bold, Italic, Underline,
  Save, Download, Settings, Layers, History
} from 'lucide-react';
import { Element, Template } from './types';
import { templates } from '../templates/templateData';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface AdvancedPageBuilderProps {
  siteId: string;
  templateId?: string;
}

// Enhanced Element Templates with full functionality
const elementTemplates = [
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    template: {
      type: 'heading',
      content: 'Your Heading Text',
      size: { width: 400, height: 60 },
      styles: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'left',
        lineHeight: '1.2',
        fontFamily: 'Inter'
      }
    }
  },
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    template: {
      type: 'text',
      content: 'Your text content goes here',
      size: { width: 400, height: 100 },
      styles: {
        fontSize: '16px',
        color: '#374151',
        lineHeight: '1.6',
        fontFamily: 'Inter'
      }
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: Square,
    template: {
      type: 'button',
      content: 'Click Me',
      size: { width: 200, height: 50 },
      styles: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        padding: '12px 24px',
        transition: 'all 0.2s'
      },
      href: '#',
      interactions: {
        hover: { backgroundColor: '#2563eb' }
      }
    }
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    template: {
      type: 'image',
      content: '',
      size: { width: 300, height: 200 },
      src: '/api/placeholder/300/200',
      alt: 'Placeholder image',
      styles: {
        borderRadius: '8px',
        objectFit: 'cover'
      }
    }
  },
  {
    type: 'container',
    label: 'Container',
    icon: Square,
    template: {
      type: 'container',
      content: '',
      size: { width: 400, height: 200 },
      styles: {
        backgroundColor: '#f9fafb',
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '20px'
      },
      children: []
    }
  },
  {
    type: 'form',
    label: 'Form',
    icon: FormInput,
    template: {
      type: 'form',
      content: '',
      size: { width: 400, height: 300 },
      styles: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '24px'
      },
      children: []
    }
  },
  {
    type: 'columns',
    label: '2 Columns',
    icon: Columns,
    template: {
      type: 'columns',
      content: '',
      size: { width: 600, height: 200 },
      styles: {
        display: 'flex',
        gap: '20px'
      },
      children: []
    }
  },
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    template: {
      type: 'video',
      content: '',
      size: { width: 400, height: 225 },
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      styles: {
        borderRadius: '8px'
      }
    }
  }
];

export function AdvancedPageBuilder({ siteId, templateId }: AdvancedPageBuilderProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Core State
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [clipboardElement, setClipboardElement] = useState<Element | null>(null);
  
  // UI State
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [leftSidebarTab, setLeftSidebarTab] = useState('elements');
  const [rightSidebarTab, setRightSidebarTab] = useState('design');
  
  // Refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const resizeHandleRef = useRef<string | null>(null);

  // Load template on mount
  useEffect(() => {
    if (templateId && templateId !== 'new') {
      const template = templates.find(t => t.id === templateId);
      if (template && template.elements) {
        const processedElements = template.elements.map(el => ({
          ...el,
          id: `${el.id}-${Date.now()}-${Math.random()}`,
          position: el.position || { x: 100, y: 100 },
          size: el.size || { width: 300, height: 100 }
        }));
        setElements(processedElements);
        addToHistory(processedElements);
      }
    }
  }, [templateId]);

  // History Management
  const addToHistory = useCallback((newElements: Element[]) => {
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
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
    }
  }, [historyIndex, history]);

  // Element Management
  const addElement = useCallback((template: any) => {
    const newElement: Element = {
      id: `element-${Date.now()}-${Math.random()}`,
      ...template.template,
      position: { x: 100, y: 100 },
      layerId: 'default'
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    addToHistory(newElements);
  }, [elements, addToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  }, [elements, addToHistory]);

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    addToHistory(newElements);
  }, [elements, addToHistory]);

  const duplicateElement = useCallback((element: Element) => {
    const newElement: Element = {
      ...element,
      id: `element-${Date.now()}-${Math.random()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    addToHistory(newElements);
  }, [elements, addToHistory]);

  // Drag and Drop Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent, element: Element) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedElement(element);
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y
    };
  }, [isPreviewMode]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !selectedElement || !dragStartRef.current) return;
    
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    
    const snappedX = snapToGrid ? Math.round(newX / gridSize) * gridSize : newX;
    const snappedY = snapToGrid ? Math.round(newY / gridSize) * gridSize : newY;
    
    updateElement(selectedElement.id, {
      position: { x: Math.max(0, snappedX), y: Math.max(0, snappedY) }
    });
  }, [selectedElement, snapToGrid, gridSize, updateElement]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    dragStartRef.current = null;
    resizeHandleRef.current = null;
  }, []);

  // Resize Handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    resizeHandleRef.current = handle;
    isDraggingRef.current = true;
  }, []);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !selectedElement || !resizeHandleRef.current) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const element = selectedElement;
    let newSize = { ...element.size };
    let newPosition = { ...element.position };
    
    switch (resizeHandleRef.current) {
      case 'se':
        newSize.width = Math.max(50, mouseX - element.position.x);
        newSize.height = Math.max(30, mouseY - element.position.y);
        break;
      case 'sw':
        newSize.width = Math.max(50, element.position.x + element.size.width - mouseX);
        newSize.height = Math.max(30, mouseY - element.position.y);
        newPosition.x = Math.min(mouseX, element.position.x + element.size.width - 50);
        break;
      case 'ne':
        newSize.width = Math.max(50, mouseX - element.position.x);
        newSize.height = Math.max(30, element.position.y + element.size.height - mouseY);
        newPosition.y = Math.min(mouseY, element.position.y + element.size.height - 30);
        break;
      case 'nw':
        newSize.width = Math.max(50, element.position.x + element.size.width - mouseX);
        newSize.height = Math.max(30, element.position.y + element.size.height - mouseY);
        newPosition.x = Math.min(mouseX, element.position.x + element.size.width - 50);
        newPosition.y = Math.min(mouseY, element.position.y + element.size.height - 30);
        break;
    }
    
    if (snapToGrid) {
      newSize.width = Math.round(newSize.width / gridSize) * gridSize;
      newSize.height = Math.round(newSize.height / gridSize) * gridSize;
      newPosition.x = Math.round(newPosition.x / gridSize) * gridSize;
      newPosition.y = Math.round(newPosition.y / gridSize) * gridSize;
    }
    
    updateElement(element.id, { size: newSize, position: newPosition });
  }, [selectedElement, snapToGrid, gridSize, updateElement]);

  // Event Listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleResize);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleResize);
    };
  }, [handleMouseMove, handleMouseUp, handleResize]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'c':
            if (selectedElement) {
              e.preventDefault();
              setClipboardElement(selectedElement);
            }
            break;
          case 'v':
            if (clipboardElement) {
              e.preventDefault();
              duplicateElement(clipboardElement);
            }
            break;
          case 'd':
            if (selectedElement) {
              e.preventDefault();
              duplicateElement(selectedElement);
            }
            break;
        }
      }
      
      if (e.key === 'Delete' && selectedElement) {
        deleteElement(selectedElement.id);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, clipboardElement, undo, redo, duplicateElement, deleteElement]);

  const getCanvasWidth = () => {
    switch (deviceView) {
      case 'mobile': return 375;
      case 'tablet': return 768;
      default: return 1200;
    }
  };

  const renderElement = (element: Element) => {
    const isSelected = selectedElement?.id === element.id;
    const isHovered = hoveredElement?.id === element.id;
    
    let elementContent;
    
    switch (element.type) {
      case 'heading':
      case 'text':
        elementContent = (
          <div 
            style={element.styles}
            className="w-full h-full"
            contentEditable={isSelected}
            suppressContentEditableWarning={true}
            onBlur={(e) => updateElement(element.id, { content: e.currentTarget.textContent || '' })}
          >
            {element.content}
          </div>
        );
        break;
      case 'button':
        elementContent = (
          <button 
            style={element.styles}
            className="w-full h-full"
            onClick={(e) => {
              if (!isPreviewMode) e.preventDefault();
            }}
          >
            {element.content}
          </button>
        );
        break;
      case 'image':
        elementContent = (
          <img 
            src={element.src || '/api/placeholder/300/200'}
            alt={element.alt || 'Image'}
            style={element.styles}
            className="w-full h-full object-cover"
          />
        );
        break;
      case 'container':
        elementContent = (
          <div style={element.styles} className="w-full h-full relative">
            {element.children?.map(child => renderElement(child))}
          </div>
        );
        break;
      case 'form':
        elementContent = (
          <form style={element.styles} className="w-full h-full">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-2 border rounded"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-2 border rounded"
              />
              <button 
                type="submit" 
                className="w-full p-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        );
        break;
      case 'video':
        elementContent = (
          <iframe
            src={element.src}
            style={element.styles}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          />
        );
        break;
      default:
        elementContent = (
          <div 
            style={element.styles}
            className="w-full h-full flex items-center justify-center text-gray-500"
          >
            {element.type}
          </div>
        );
    }
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''} ${isHovered ? 'ring-1 ring-blue-300' : ''}`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: isSelected ? 1000 : 1
        }}
        onMouseDown={(e) => handleMouseDown(e, element)}
        onMouseEnter={() => !isDraggingRef.current && setHoveredElement(element)}
        onMouseLeave={() => setHoveredElement(null)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedElement(element);
        }}
      >
        {elementContent}
        
        {/* Resize Handles */}
        {isSelected && !isPreviewMode && (
          <>
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white cursor-nw-resize"
              style={{ top: -4, left: -4 }}
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
            />
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white cursor-ne-resize"
              style={{ top: -4, right: -4 }}
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
            />
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white cursor-sw-resize"
              style={{ bottom: -4, left: -4 }}
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
            />
            <div
              className="absolute w-2 h-2 bg-blue-500 border border-white cursor-se-resize"
              style={{ bottom: -4, right: -4 }}
              onMouseDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </div>
    );
  };

  const gridStyle = showGrid ? {
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`
  } : {};

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <Button
            onClick={() => navigate('/sites')}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            ← Back to Sites
          </Button>
          <h2 className="text-lg font-semibold">Page Builder</h2>
        </div>
        
        <Tabs value={leftSidebarTab} onValueChange={setLeftSidebarTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3 m-4">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="elements" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <h3 className="font-medium text-sm text-gray-700">Basic Elements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {elementTemplates.map((template) => (
                    <Button
                      key={template.type}
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center gap-2"
                      onClick={() => addElement(template)}
                    >
                      <template.icon className="h-5 w-5" />
                      <span className="text-xs">{template.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="templates" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      if (template.elements) {
                        const processedElements = template.elements.map(el => ({
                          ...el,
                          id: `${el.id}-${Date.now()}-${Math.random()}`,
                          position: el.position || { x: 100, y: 100 },
                          size: el.size || { width: 300, height: 100 }
                        }));
                        setElements(processedElements);
                        addToHistory(processedElements);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-gray-100 rounded mb-2"></div>
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                      {template.isPremium && (
                        <Badge variant="secondary" className="mt-2 text-xs">Premium</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="default" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="flex justify-center">
            <div
              ref={canvasRef}
              className="bg-white shadow-lg relative"
              style={{
                width: 1200,
                minHeight: 800,
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                ...gridStyle
              }}
              onClick={() => setSelectedElement(null)}
            >
              {elements.map(renderElement)}
              
              {/* Empty State */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Type className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Start Building</h3>
                    <p className="text-sm">Drag elements from the left panel or choose a template</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col">
        <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2 m-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {selectedElement ? (
                  <>
                    <div>
                      <h3 className="font-medium text-sm mb-3">Element: {selectedElement.type}</h3>
                      
                      {/* Position & Size */}
                      <div className="space-y-3">
                        <Label className="text-xs font-medium">Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">X</Label>
                            <Input
                              type="number"
                              value={selectedElement.position.x}
                              onChange={(e) => updateElement(selectedElement.id, {
                                position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Y</Label>
                            <Input
                              type="number"
                              value={selectedElement.position.y}
                              onChange={(e) => updateElement(selectedElement.id, {
                                position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
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
                    </div>

                    <Separator />

                    {/* Typography */}
                    {(selectedElement.type === 'text' || selectedElement.type === 'heading') && (
                      <div className="space-y-3">
                        <Label className="text-xs font-medium">Typography</Label>
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
                          <Label className="text-xs">Color</Label>
                          <Input
                            type="color"
                            value={selectedElement.styles?.color || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, color: e.target.value }
                            })}
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant={selectedElement.styles?.fontWeight === 'bold' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { 
                                ...selectedElement.styles, 
                                fontWeight: selectedElement.styles?.fontWeight === 'bold' ? 'normal' : 'bold'
                              }
                            })}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedElement.styles?.fontStyle === 'italic' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement(selectedElement.id, {
                              styles: { 
                                ...selectedElement.styles, 
                                fontStyle: selectedElement.styles?.fontStyle === 'italic' ? 'normal' : 'italic'
                              }
                            })}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Background & Border */}
                    <div className="space-y-3">
                      <Label className="text-xs font-medium">Background & Border</Label>
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

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => duplicateElement(selectedElement)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-700"
                        onClick={() => deleteElement(selectedElement.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Type className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Select an element to edit its properties</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="flex-1 m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="font-medium text-sm mb-3">Canvas Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Show Grid</Label>
                      <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Snap to Grid</Label>
                      <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                    </div>
                    <div>
                      <Label className="text-xs">Grid Size</Label>
                      <Slider
                        value={[gridSize]}
                        onValueChange={(value) => setGridSize(value[0])}
                        min={10}
                        max={50}
                        step={5}
                        className="mt-2"
                      />
                      <span className="text-xs text-gray-500">{gridSize}px</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
