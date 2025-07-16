
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Undo, 
  Redo, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ZoomIn, 
  ZoomOut,
  Grid,
  Layers,
  Settings,
  Type,
  Image,
  Video,
  Square,
  Menu,
  Mouse,
  Trash2,
  Copy,
  Move,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Download,
  Upload,
  Plus,
  X,
  ChevronRight,
  Navigation,
  Link,
  Calendar,
  MessageSquare,
  Star,
  DollarSign,
  Users,
  Clock,
  BarChart,
  Share2,
  Mail,
  MapPin,
  Play,
  Pause,
  Volume2,
  Camera,
  FileText,
  ShoppingCart,
  CreditCard,
  Zap,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { Element, Template } from './types';
import { DragDropCanvas } from './DragDropCanvas';
import { templates } from '../templates/templateData';
import { useSearchParams, useNavigate } from 'react-router-dom';

interface FunctionalPageBuilderProps {
  siteId: string;
  templateId?: string;
}

// Element Templates with comprehensive functionality
const elementTemplates = [
  // Text Elements
  { 
    type: 'heading', 
    label: 'Heading', 
    icon: Type, 
    category: 'Text',
    template: { 
      content: 'Heading Text', 
      size: { width: 300, height: 60 },
      styles: { 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Arial, sans-serif'
      }
    }
  },
  { 
    type: 'text', 
    label: 'Paragraph', 
    icon: FileText, 
    category: 'Text',
    template: { 
      content: 'Your paragraph text goes here. Click to edit and customize.', 
      size: { width: 400, height: 80 },
      styles: { 
        fontSize: '16px', 
        color: '#333333',
        lineHeight: '1.6',
        textAlign: 'left',
        fontFamily: 'Arial, sans-serif'
      }
    }
  },
  
  // Interactive Elements
  { 
    type: 'button', 
    label: 'Button', 
    icon: Mouse, 
    category: 'Interactive',
    template: { 
      content: 'Click Me', 
      size: { width: 150, height: 50 },
      styles: { 
        backgroundColor: '#007bff', 
        color: '#ffffff',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'center',
        padding: '12px 24px'
      },
      href: '#',
      props: { type: 'button', variant: 'primary' }
    }
  },
  { 
    type: 'link', 
    label: 'Link', 
    icon: Link, 
    category: 'Interactive',
    template: { 
      content: 'Click here', 
      size: { width: 100, height: 30 },
      styles: { 
        color: '#007bff',
        textDecoration: 'underline',
        fontSize: '16px'
      },
      href: '#',
      target: '_self'
    }
  },

  // Media Elements
  { 
    type: 'image', 
    label: 'Image', 
    icon: Image, 
    category: 'Media',
    template: { 
      content: '', 
      size: { width: 300, height: 200 },
      styles: { 
        borderRadius: '8px',
        objectFit: 'cover'
      },
      src: 'https://via.placeholder.com/300x200',
      alt: 'Placeholder image'
    }
  },
  { 
    type: 'video', 
    label: 'Video', 
    icon: Video, 
    category: 'Media',
    template: { 
      content: '', 
      size: { width: 400, height: 225 },
      styles: { 
        borderRadius: '8px'
      },
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      props: { controls: true, autoplay: false }
    }
  },

  // Layout Elements
  { 
    type: 'container', 
    label: 'Container', 
    icon: Square, 
    category: 'Layout',
    template: { 
      content: '', 
      size: { width: 600, height: 400 },
      styles: { 
        backgroundColor: '#f8f9fa',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        padding: '20px'
      },
      children: []
    }
  },
  { 
    type: 'columns', 
    label: 'Columns', 
    icon: Menu, 
    category: 'Layout',
    template: { 
      content: '', 
      size: { width: 600, height: 300 },
      styles: { 
        display: 'flex',
        gap: '20px'
      },
      props: { columns: 2 },
      children: []
    }
  },

  // Form Elements
  { 
    type: 'form', 
    label: 'Form', 
    icon: FileText, 
    category: 'Forms',
    template: { 
      content: '', 
      size: { width: 400, height: 300 },
      styles: { 
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      },
      props: { action: '', method: 'POST' },
      children: []
    }
  },
  { 
    type: 'input', 
    label: 'Input Field', 
    icon: Type, 
    category: 'Forms',
    template: { 
      content: '', 
      size: { width: 300, height: 40 },
      styles: { 
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '8px 12px',
        fontSize: '16px'
      },
      props: { type: 'text', placeholder: 'Enter text...' }
    }
  },

  // Navigation Elements
  { 
    type: 'navbar', 
    label: 'Navigation', 
    icon: Navigation, 
    category: 'Navigation',
    template: { 
      content: '', 
      size: { width: 800, height: 60 },
      styles: { 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #dee2e6',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      children: []
    }
  },

  // Business Elements
  { 
    type: 'testimonial', 
    label: 'Testimonial', 
    icon: MessageSquare, 
    category: 'Business',
    template: { 
      content: '"This is an amazing product! Highly recommend it to everyone."', 
      size: { width: 400, height: 200 },
      styles: { 
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '12px',
        fontStyle: 'italic',
        textAlign: 'center',
        border: '1px solid #e9ecef'
      },
      props: { author: 'John Doe', company: 'ABC Company' }
    }
  },
  { 
    type: 'pricing', 
    label: 'Pricing Card', 
    icon: DollarSign, 
    category: 'Business',
    template: { 
      content: '', 
      size: { width: 300, height: 400 },
      styles: { 
        backgroundColor: '#ffffff',
        border: '2px solid #e9ecef',
        borderRadius: '12px',
        padding: '30px',
        textAlign: 'center'
      },
      props: { 
        title: 'Basic Plan', 
        price: '$29', 
        period: '/month',
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      }
    }
  }
];

// Default template elements for quick start
const defaultTemplate: Element[] = [
  {
    id: 'header-1',
    type: 'heading',
    position: { x: 50, y: 50 },
    size: { width: 500, height: 80 },
    styles: { 
      fontSize: '48px', 
      fontWeight: 'bold', 
      color: '#1a1a1a',
      textAlign: 'center'
    },
    content: 'Welcome to Your Website',
    props: {}
  },
  {
    id: 'text-1',
    type: 'text',
    position: { x: 50, y: 150 },
    size: { width: 600, height: 100 },
    styles: { 
      fontSize: '18px', 
      color: '#666666',
      lineHeight: '1.6',
      textAlign: 'center'
    },
    content: 'Create beautiful websites with our drag-and-drop page builder. No coding required!',
    props: {}
  },
  {
    id: 'button-1',
    type: 'button',
    position: { x: 250, y: 280 },
    size: { width: 200, height: 60 },
    styles: { 
      backgroundColor: '#007bff', 
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    content: 'Get Started',
    href: '#',
    props: { type: 'button' }
  }
];

export function FunctionalPageBuilder({ siteId, templateId }: FunctionalPageBuilderProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Page Builder State
  const [elements, setElements] = useState<Element[]>(defaultTemplate);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [history, setHistory] = useState<Element[][]>([defaultTemplate]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [activeSidebarTab, setActiveSidebarTab] = useState('elements');

  // Load template if templateId is provided
  useEffect(() => {
    if (templateId && templateId !== 'new') {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setElements(template.elements);
        addToHistory(template.elements);
      }
    }
  }, [templateId]);

  // History management
  const addToHistory = useCallback((newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements([...history[newIndex]]);
      setSelectedElement(null);
    }
  }, [history, historyIndex]);

  // Element management
  const addElement = useCallback((elementType: string) => {
    const template = elementTemplates.find(t => t.type === elementType);
    if (!template) return;

    const newElement: Element = {
      id: `${elementType}-${Date.now()}`,
      type: elementType as any,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: template.template.size,
      styles: { ...template.template.styles },
      content: template.template.content || '',
      props: template.template.props || {},
      ...(template.template.src && { src: template.template.src }),
      ...(template.template.alt && { alt: template.template.alt }),
      ...(template.template.href && { href: template.template.href })
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement);
  }, [elements, addToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    
    if (selectedElement?.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  }, [elements, selectedElement]);

  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
  }, [elements, selectedElement, addToHistory]);

  const duplicateElement = useCallback((element: Element) => {
    const newElement: Element = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      position: { 
        x: element.position.x + 20, 
        y: element.position.y + 20 
      }
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(newElement);
  }, [elements, addToHistory]);

  // Canvas interactions
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const template = elementTemplates.find(t => t.type === elementType);
      if (template) {
        const newElement: Element = {
          id: `${elementType}-${Date.now()}`,
          type: elementType as any,
          position: { x: Math.max(0, x - template.template.size.width / 2), y: Math.max(0, y - template.template.size.height / 2) },
          size: template.template.size,
          styles: { ...template.template.styles },
          content: template.template.content || '',
          props: template.template.props || {},
          ...(template.template.src && { src: template.template.src }),
          ...(template.template.alt && { alt: template.template.alt }),
          ...(template.template.href && { href: template.template.href })
        };

        const newElements = [...elements, newElement];
        setElements(newElements);
        addToHistory(newElements);
        setSelectedElement(newElement);
      }
    }
  }, [elements, addToHistory]);

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Template loading
  const loadTemplate = useCallback((template: Template) => {
    setElements(template.elements);
    addToHistory(template.elements);
    setSelectedElement(null);
  }, [addToHistory]);

  const handleClose = () => {
    navigate('/sites');
  };

  const handleSave = () => {
    console.log('Saving page...', { elements, siteId });
    // Implement save functionality
  };

  const handlePublish = () => {
    console.log('Publishing page...', { elements, siteId });
    // Implement publish functionality
  };

  // Group elements by category
  const elementsByCategory = elementTemplates.reduce((acc, template) => {
    const category = template.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof elementTemplates>);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sites
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={undo}
              disabled={historyIndex === 0}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={deviceView === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceView('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceView('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={deviceView === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceView('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[4rem] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Button 
            variant={isPreviewMode ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Upload className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Elements Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab} className="flex flex-col h-full">
            <div className="px-4 py-3 border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="elements">Elements</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              {/* Elements Tab */}
              <TabsContent value="elements" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-6">
                    {Object.entries(elementsByCategory).map(([category, categoryElements]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-sm text-gray-600 mb-3">{category}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {categoryElements.map((template) => {
                            const Icon = template.icon;
                            return (
                              <Card
                                key={template.type}
                                className="cursor-pointer hover:bg-gray-50 transition-colors"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', template.type);
                                }}
                                onClick={() => addElement(template.type)}
                              >
                                <CardContent className="p-3 text-center">
                                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                  <p className="text-xs font-medium">{template.label}</p>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {templates.map((template) => (
                      <Card 
                        key={template.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => loadTemplate(template)}
                      >
                        <CardContent className="p-3">
                          <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                            <Globe className="w-8 h-8 text-gray-400" />
                          </div>
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

              {/* Layers Tab */}
              <TabsContent value="layers" className="h-full m-0">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-2">
                    {elements.map((element, index) => (
                      <div
                        key={element.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                          selectedElement?.id === element.id ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                        onClick={() => setSelectedElement(element)}
                      >
                        <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0"></div>
                        <span className="text-sm font-medium capitalize">{element.type}</span>
                        <div className="ml-auto flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateElement(element);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(element.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
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
            onElementSelect={setSelectedElement}
            onElementHover={setHoveredElement}
            onElementUpdate={updateElement}
            onElementDelete={deleteElement}
            onElementDuplicate={duplicateElement}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
          />
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200">
          <ScrollArea className="h-full">
            <div className="p-4">
              {selectedElement ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Element Properties</h3>
                    <div className="space-y-4">
                      {/* Element Type */}
                      <div>
                        <Label className="text-sm font-medium capitalize">
                          {selectedElement.type} Element
                        </Label>
                      </div>

                      {/* Content Editing */}
                      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Input
                            id="content"
                            value={selectedElement.content}
                            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      )}

                      {/* Position */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="x">X Position</Label>
                          <Input
                            id="x"
                            type="number"
                            value={selectedElement.position.x}
                            onChange={(e) => updateElement(selectedElement.id, {
                              position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                            })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="y">Y Position</Label>
                          <Input
                            id="y"
                            type="number"
                            value={selectedElement.position.y}
                            onChange={(e) => updateElement(selectedElement.id, {
                              position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                            })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Size */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="width">Width</Label>
                          <Input
                            id="width"
                            type="number"
                            value={selectedElement.size.width}
                            onChange={(e) => updateElement(selectedElement.id, {
                              size: { ...selectedElement.size, width: parseInt(e.target.value) || 0 }
                            })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            type="number"
                            value={selectedElement.size.height}
                            onChange={(e) => updateElement(selectedElement.id, {
                              size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 }
                            })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Typography */}
                      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                        <>
                          <div>
                            <Label htmlFor="fontSize">Font Size</Label>
                            <Input
                              id="fontSize"
                              value={selectedElement.styles?.fontSize || '16px'}
                              onChange={(e) => updateElement(selectedElement.id, {
                                styles: { ...selectedElement.styles, fontSize: e.target.value }
                              })}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="color">Text Color</Label>
                            <Input
                              id="color"
                              type="color"
                              value={selectedElement.styles?.color || '#000000'}
                              onChange={(e) => updateElement(selectedElement.id, {
                                styles: { ...selectedElement.styles, color: e.target.value }
                              })}
                              className="mt-1"
                            />
                          </div>

                          <div className="flex items-center gap-2">
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
                              <Bold className="w-4 h-4" />
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
                              <Italic className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={selectedElement.styles?.textDecoration === 'underline' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateElement(selectedElement.id, {
                                styles: { 
                                  ...selectedElement.styles, 
                                  textDecoration: selectedElement.styles?.textDecoration === 'underline' ? 'none' : 'underline' 
                                }
                              })}
                            >
                              <Underline className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant={selectedElement.styles?.textAlign === 'left' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateElement(selectedElement.id, {
                                styles: { ...selectedElement.styles, textAlign: 'left' }
                              })}
                            >
                              <AlignLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={selectedElement.styles?.textAlign === 'center' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateElement(selectedElement.id, {
                                styles: { ...selectedElement.styles, textAlign: 'center' }
                              })}
                            >
                              <AlignCenter className="w-4 h-4" />
                            </Button>
                            <Button
                              variant={selectedElement.styles?.textAlign === 'right' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateElement(selectedElement.id, {
                                styles: { ...selectedElement.styles, textAlign: 'right' }
                              })}
                            >
                              <AlignRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Background & Border */}
                      <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={selectedElement.styles?.backgroundColor || '#ffffff'}
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                          })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="borderRadius">Border Radius</Label>
                        <Input
                          id="borderRadius"
                          value={selectedElement.styles?.borderRadius || '0px'}
                          onChange={(e) => updateElement(selectedElement.id, {
                            styles: { ...selectedElement.styles, borderRadius: e.target.value }
                          })}
                          className="mt-1"
                        />
                      </div>

                      {/* Link for buttons and links */}
                      {(selectedElement.type === 'button' || selectedElement.type === 'link') && (
                        <div>
                          <Label htmlFor="href">Link URL</Label>
                          <Input
                            id="href"
                            value={selectedElement.href || ''}
                            onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                            placeholder="https://example.com"
                            className="mt-1"
                          />
                        </div>
                      )}

                      {/* Image source */}
                      {selectedElement.type === 'image' && (
                        <>
                          <div>
                            <Label htmlFor="src">Image URL</Label>
                            <Input
                              id="src"
                              value={selectedElement.src || ''}
                              onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                              placeholder="https://example.com/image.jpg"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="alt">Alt Text</Label>
                            <Input
                              id="alt"
                              value={selectedElement.alt || ''}
                              onChange={(e) => updateElement(selectedElement.id, { alt: e.target.value })}
                              placeholder="Describe the image"
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateElement(selectedElement)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteElement(selectedElement.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-600 mb-2">No Element Selected</h3>
                  <p className="text-sm text-gray-500">
                    Select an element from the canvas to edit its properties
                  </p>
                </div>
              )}

              {/* Canvas Settings */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-lg mb-4">Canvas Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showGrid">Show Grid</Label>
                    <Switch
                      id="showGrid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="snapToGrid">Snap to Grid</Label>
                    <Switch
                      id="snapToGrid"
                      checked={snapToGrid}
                      onCheckedChange={setSnapToGrid}
                    />
                  </div>

                  {showGrid && (
                    <div>
                      <Label htmlFor="gridSize">Grid Size: {gridSize}px</Label>
                      <Slider
                        id="gridSize"
                        min={10}
                        max={50}
                        step={5}
                        value={[gridSize]}
                        onValueChange={(value) => setGridSize(value[0])}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
