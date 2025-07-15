
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Monitor, Tablet, Smartphone, Undo, Redo, Save, Eye, Download,
  ZoomIn, ZoomOut, Grid, MousePointer, ChevronLeft, ChevronRight,
  Settings, Layers, Palette, Code, RotateCcw, RotateCw, Plus,
  Type, Image, Square, Layout, FormInput, Video, Minus, 
  Copy, Trash2, Move, Lock, Unlock, EyeOff
} from 'lucide-react';
import { Element, Position, Size } from './types';

interface FunctionalPageBuilderProps {
  siteId: string;
  templateId?: string;
}

export function FunctionalPageBuilder({ siteId, templateId }: FunctionalPageBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'elements' | 'design' | 'settings'>('elements');
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load template if provided
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);

  const loadTemplate = (templateId: string) => {
    // Real template data with actual elements
    const templates: Record<string, Element[]> = {
      'landing-page': [
        {
          id: 'header-1',
          type: 'heading',
          content: 'Welcome to Our Amazing Product',
          position: { x: 50, y: 50 },
          size: { width: 600, height: 80 },
          styles: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'center',
            lineHeight: '1.2'
          },
          props: { level: 'h1' },
          children: [],
          attributes: {},
          layerId: 'default'
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: 'Transform your business with our cutting-edge solution that delivers results.',
          position: { x: 50, y: 150 },
          size: { width: 600, height: 60 },
          styles: {
            fontSize: '20px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.6'
          },
          props: {},
          children: [],
          attributes: {},
          layerId: 'default'
        },
        {
          id: 'cta-button-1',
          type: 'button',
          content: 'Get Started Today',
          position: { x: 275, y: 230 },
          size: { width: 200, height: 50 },
          styles: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          },
          props: { href: '#signup' },
          children: [],
          attributes: {},
          layerId: 'default'
        }
      ],
      'business-form': [
        {
          id: 'form-title',
          type: 'heading',
          content: 'Contact Us',
          position: { x: 50, y: 50 },
          size: { width: 400, height: 60 },
          styles: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px'
          },
          props: { level: 'h2' },
          children: [],
          attributes: {},
          layerId: 'default'
        },
        {
          id: 'contact-form',
          type: 'form',
          content: '',
          position: { x: 50, y: 130 },
          size: { width: 400, height: 350 },
          styles: {
            backgroundColor: '#f9fafb',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          },
          props: {
            action: '/submit-contact',
            method: 'POST'
          },
          children: [],
          attributes: {},
          layerId: 'default'
        }
      ]
    };

    const templateElements = templates[templateId] || [];
    setElements(templateElements);
    toast.success('Template loaded successfully');
  };

  // Element library with real, functional elements
  const elementLibrary = [
    { id: 'text', name: 'Text', icon: Type, category: 'Basic' },
    { id: 'heading', name: 'Heading', icon: Type, category: 'Basic' },
    { id: 'button', name: 'Button', icon: Square, category: 'Basic' },
    { id: 'image', name: 'Image', icon: Image, category: 'Media' },
    { id: 'video', name: 'Video', icon: Video, category: 'Media' },
    { id: 'form', name: 'Form', icon: FormInput, category: 'Input' },
    { id: 'container', name: 'Container', icon: Layout, category: 'Layout' },
    { id: 'divider', name: 'Divider', icon: Minus, category: 'Layout' },
    { id: 'spacer', name: 'Spacer', icon: Square, category: 'Layout' }
  ];

  const getCanvasStyle = () => {
    let width = '100%';
    let maxWidth = 'none';
    
    switch (deviceView) {
      case 'mobile':
        width = '375px';
        maxWidth = '375px';
        break;
      case 'tablet':
        width = '768px';
        maxWidth = '768px';
        break;
      default:
        width = '100%';
        maxWidth = '1200px';
        break;
    }

    return {
      width,
      maxWidth,
      minHeight: '800px',
      backgroundColor: '#ffffff',
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'top center',
      transition: 'all 0.3s ease',
      position: 'relative' as const,
      margin: '0 auto',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)'
    };
  };

  const handleAddElement = useCallback((elementType: string, position?: Position) => {
    const defaultElements = {
      text: {
        content: 'Edit this text',
        size: { width: 200, height: 40 },
        styles: { fontSize: '16px', color: '#000000', fontFamily: 'Arial, sans-serif' },
        props: {}
      },
      heading: {
        content: 'Your Heading',
        size: { width: 300, height: 60 },
        styles: { fontSize: '32px', fontWeight: 'bold', color: '#000000' },
        props: { level: 'h2' }
      },
      button: {
        content: 'Click Me',
        size: { width: 150, height: 50 },
        styles: { 
          backgroundColor: '#3b82f6', 
          color: '#ffffff', 
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          border: 'none'
        },
        props: {}
      },
      image: {
        content: '',
        size: { width: 300, height: 200 },
        styles: { borderRadius: '8px' },
        props: { src: '', alt: 'Image' }
      },
      form: {
        content: '',
        size: { width: 400, height: 300 },
        styles: { 
          backgroundColor: '#f9fafb', 
          padding: '20px', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        },
        props: {}
      },
      container: {
        content: '',
        size: { width: 400, height: 200 },
        styles: { 
          backgroundColor: 'transparent', 
          border: '2px dashed #d1d5db',
          borderRadius: '8px'
        },
        props: {}
      },
      divider: {
        content: '',
        size: { width: 400, height: 2 },
        styles: { backgroundColor: '#e5e7eb' },
        props: {}
      },
      spacer: {
        content: '',
        size: { width: 400, height: 50 },
        styles: { backgroundColor: 'transparent' },
        props: {}
      }
    };

    const elementData = defaultElements[elementType as keyof typeof defaultElements];
    
    const newElement: Element = {
      id: `${elementType}-${Date.now()}`,
      type: elementType as any,
      content: elementData.content,
      position: position || { x: 50, y: 50 },
      size: elementData.size,
      styles: elementData.styles,
      props: elementData.props,
      children: [],
      attributes: {},
      layerId: 'default'
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    toast.success(`${elementType} added to canvas`);
  }, []);

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(element);
    setActiveTab('design');
  }, []);

  const handleElementUpdate = useCallback((id: string, updates: Partial<Element>) => {
    setElements(prev => prev.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedElement]);

  const handleElementDelete = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    toast.success('Element deleted');
  }, [selectedElement]);

  const handleDragStart = (element: any) => {
    setDraggedElement(element);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedElement(null);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    handleAddElement(draggedElement.id, { x: Math.max(0, x), y: Math.max(0, y) });
    handleDragEnd();
  };

  const renderElement = (element: Element) => {
    const isSelected = selectedElement?.id === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-blue-300'
        }`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: isSelected ? 1000 : 1
        }}
        onClick={() => handleElementClick(element)}
      >
        {renderElementContent(element)}
        
        {isSelected && !isPreviewMode && (
          <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-t flex items-center gap-2">
            <span className="capitalize">{element.type}</span>
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0 text-white hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                handleElementDelete(element.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderElementContent = (element: Element) => {
    const baseStyles = { ...element.styles, width: '100%', height: '100%' };

    switch (element.type) {
      case 'text':
        return (
          <div
            style={baseStyles}
            className="p-2 flex items-center"
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isPreviewMode) {
                handleElementUpdate(element.id, { content: e.currentTarget.textContent || '' });
              }
            }}
          >
            {element.content || 'Add text here...'}
          </div>
        );

      case 'heading':
        const HeadingTag = (element.props?.level || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={baseStyles}
            className="p-2 flex items-center"
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isPreviewMode) {
                handleElementUpdate(element.id, { content: e.currentTarget.textContent || '' });
              }
            }}
          >
            {element.content || 'Heading'}
          </HeadingTag>
        );

      case 'button':
        return (
          <button
            style={baseStyles}
            className="flex items-center justify-center"
            onClick={isPreviewMode && element.props?.href ? () => {
              window.open(element.props.href, '_blank');
            } : undefined}
          >
            {element.content || 'Button'}
          </button>
        );

      case 'image':
        return (
          <div style={{ ...baseStyles, overflow: 'hidden' }}>
            {element.props?.src ? (
              <img
                src={element.props.src}
                alt={element.props?.alt || 'Image'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Image className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Click to add image</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'form':
        return (
          <form style={baseStyles} className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message" />
              </div>
              <Button type="submit" className="w-full">Submit</Button>
            </div>
          </form>
        );

      case 'container':
        return (
          <div style={baseStyles} className="flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              {element.children?.length ? `${element.children.length} items` : 'Drop elements here'}
            </span>
          </div>
        );

      case 'divider':
        return <hr style={baseStyles} />;

      case 'spacer':
        return (
          <div style={baseStyles} className="flex items-center justify-center">
            {!isPreviewMode && <span className="text-gray-400 text-xs">Spacer</span>}
          </div>
        );

      default:
        return <div style={baseStyles}>Unknown element</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${rightPanelOpen ? 'mr-80' : 'mr-0'}`}>
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Device Controls */}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2 h-8 ${showGrid ? 'bg-blue-50 border-blue-200' : ''}`}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="px-2 h-8"
            >
              {rightPanelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div className="h-full flex items-start justify-center">
            <div
              ref={canvasRef}
              style={getCanvasStyle()}
              className="relative overflow-hidden"
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setSelectedElement(null);
                }
              }}
            >
              {/* Grid */}
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

              {/* Empty State */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Layout className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Start building your page</h3>
                    <p className="text-sm">Drag elements from the sidebar to get started</p>
                  </div>
                </div>
              )}

              {/* Elements */}
              {elements.map(renderElement)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-white border-l shadow-lg transition-transform duration-300 z-30 ${
        rightPanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="elements">Elements</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {activeTab === 'elements' && (
                <div className="space-y-4">
                  <h3 className="font-medium">Basic Elements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {elementLibrary.map((element) => (
                      <Card
                        key={element.id}
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        draggable
                        onDragStart={() => handleDragStart(element)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleAddElement(element.id)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <element.icon className="h-6 w-6 mb-2" />
                          <span className="text-sm">{element.name}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'design' && (
                <div className="space-y-4">
                  {selectedElement ? (
                    <>
                      <div className="p-3 bg-gray-50 rounded">
                        <h3 className="font-medium capitalize">{selectedElement.type} Settings</h3>
                      </div>

                      {/* Content */}
                      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={selectedElement.content}
                            onChange={(e) => handleElementUpdate(selectedElement.id, { content: e.target.value })}
                            placeholder="Enter content..."
                          />
                        </div>
                      )}

                      {/* Image URL */}
                      {selectedElement.type === 'image' && (
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={selectedElement.props?.src || ''}
                            onChange={(e) => handleElementUpdate(selectedElement.id, { 
                              props: { ...selectedElement.props, src: e.target.value }
                            })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}

                      {/* Styling */}
                      <div className="space-y-3">
                        <h4 className="font-medium">Styling</h4>
                        
                        <div className="space-y-2">
                          <Label>Font Size</Label>
                          <Input
                            value={selectedElement.styles?.fontSize || ''}
                            onChange={(e) => handleElementUpdate(selectedElement.id, {
                              styles: { ...selectedElement.styles, fontSize: e.target.value }
                            })}
                            placeholder="16px"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={selectedElement.styles?.color || '#000000'}
                            onChange={(e) => handleElementUpdate(selectedElement.id, {
                              styles: { ...selectedElement.styles, color: e.target.value }
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            value={selectedElement.styles?.backgroundColor || '#ffffff'}
                            onChange={(e) => handleElementUpdate(selectedElement.id, {
                              styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            const duplicated = {
                              ...selectedElement,
                              id: `${selectedElement.type}-${Date.now()}`,
                              position: {
                                x: selectedElement.position.x + 20,
                                y: selectedElement.position.y + 20
                              }
                            };
                            setElements(prev => [...prev, duplicated]);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleElementDelete(selectedElement.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an element to edit its properties</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="font-medium">Page Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input placeholder="Page title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Meta Description</Label>
                      <Textarea placeholder="Page description for SEO" />
                    </div>
                    <div className="space-y-2">
                      <Label>Custom CSS</Label>
                      <Textarea placeholder="Add custom CSS here" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
