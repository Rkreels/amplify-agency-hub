
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
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Monitor, Tablet, Smartphone, Undo, Redo, Save, Eye, Download,
  ZoomIn, ZoomOut, Grid, MousePointer, ChevronLeft, ChevronRight,
  Settings, Layers, Palette, Code, RotateCcw, RotateCw, Plus,
  Type, Image, Square, Layout, FormInput, Video, Minus, 
  Copy, Trash2, Move, Lock, Unlock, EyeOff, ArrowLeft,
  GripVertical, AlignLeft, AlignCenter, AlignRight, Bold,
  Italic, Underline, Link, Home, Menu, X, Maximize2,
  FileText, Database, ShoppingCart, Calendar, Phone,
  Mail, MapPin, Star, Heart, Play, Pause, Volume2
} from 'lucide-react';
import { Element, Position, Size } from './types';
import { useNavigate } from 'react-router-dom';

interface FunctionalPageBuilderProps {
  siteId: string;
  templateId?: string;
}

export function FunctionalPageBuilder({ siteId, templateId }: FunctionalPageBuilderProps) {
  const navigate = useNavigate();
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'elements' | 'design' | 'layers' | 'settings'>('elements');
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSettings, setCanvasSettings] = useState({
    backgroundColor: '#ffffff',
    padding: 20,
    maxWidth: 1200
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Load template if provided
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    } else {
      // Initialize with empty canvas
      setElements([]);
    }
  }, [templateId]);

  const loadTemplate = (templateId: string) => {
    const templates: Record<string, Element[]> = {
      'landing-page-1': [
        {
          id: 'header-1',
          type: 'heading',
          content: 'Transform Your Business Today',
          position: { x: 100, y: 80 },
          size: { width: 800, height: 100 },
          styles: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1f2937',
            textAlign: 'center',
            lineHeight: '1.2',
            fontFamily: 'Inter, sans-serif'
          },
          props: { level: 'h1' },
          children: [],
          attributes: {},
          layerId: 'default'
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: 'Join thousands of businesses that have already transformed their operations with our cutting-edge solutions.',
          position: { x: 100, y: 200 },
          size: { width: 800, height: 80 },
          styles: {
            fontSize: '20px',
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif'
          },
          props: {},
          children: [],
          attributes: {},
          layerId: 'default'
        },
        {
          id: 'cta-button-1',
          type: 'button',
          content: 'Get Started Free',
          position: { x: 400, y: 320 },
          size: { width: 200, height: 60 },
          styles: {
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'
          },
          props: { href: '#signup' },
          children: [],
          attributes: {},
          layerId: 'default'
        }
      ],
      'business-form-1': [
        {
          id: 'form-title',
          type: 'heading',
          content: 'Get In Touch',
          position: { x: 100, y: 60 },
          size: { width: 500, height: 80 },
          styles: {
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '20px',
            fontFamily: 'Inter, sans-serif'
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
          position: { x: 100, y: 160 },
          size: { width: 500, height: 400 },
          styles: {
            backgroundColor: '#f9fafb',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
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
    addToHistory(templateElements);
    toast.success('Template loaded successfully');
  };

  // History management
  const addToHistory = (newElements: Element[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
      toast.success('Undone');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      toast.success('Redone');
    }
  };

  // Element library with comprehensive set
  const elementLibrary = [
    // Basic Elements
    { id: 'text', name: 'Text', icon: Type, category: 'Basic', description: 'Add text content' },
    { id: 'heading', name: 'Heading', icon: Type, category: 'Basic', description: 'Add heading text' },
    { id: 'button', name: 'Button', icon: Square, category: 'Basic', description: 'Add clickable button' },
    { id: 'link', name: 'Link', icon: Link, category: 'Basic', description: 'Add hyperlink' },
    
    // Media Elements
    { id: 'image', name: 'Image', icon: Image, category: 'Media', description: 'Add image' },
    { id: 'video', name: 'Video', icon: Video, category: 'Media', description: 'Add video player' },
    { id: 'icon', name: 'Icon', icon: Star, category: 'Media', description: 'Add icon' },
    
    // Form Elements
    { id: 'form', name: 'Form', icon: FormInput, category: 'Forms', description: 'Add contact form' },
    { id: 'input', name: 'Input', icon: FormInput, category: 'Forms', description: 'Add input field' },
    { id: 'textarea', name: 'Textarea', icon: FileText, category: 'Forms', description: 'Add text area' },
    { id: 'select', name: 'Select', icon: Menu, category: 'Forms', description: 'Add dropdown' },
    { id: 'checkbox', name: 'Checkbox', icon: Square, category: 'Forms', description: 'Add checkbox' },
    
    // Layout Elements
    { id: 'container', name: 'Container', icon: Layout, category: 'Layout', description: 'Add container' },
    { id: 'section', name: 'Section', icon: Layout, category: 'Layout', description: 'Add section' },
    { id: 'divider', name: 'Divider', icon: Minus, category: 'Layout', description: 'Add divider line' },
    { id: 'spacer', name: 'Spacer', icon: Square, category: 'Layout', description: 'Add spacing' },
    { id: 'columns', name: 'Columns', icon: Layout, category: 'Layout', description: 'Add columns layout' },
    
    // Navigation
    { id: 'navbar', name: 'Navigation', icon: Menu, category: 'Navigation', description: 'Add navigation bar' },
    { id: 'menu', name: 'Menu', icon: Menu, category: 'Navigation', description: 'Add menu' },
    { id: 'breadcrumb', name: 'Breadcrumb', icon: Home, category: 'Navigation', description: 'Add breadcrumb' },
    
    // Business Elements
    { id: 'testimonial', name: 'Testimonial', icon: Heart, category: 'Business', description: 'Add testimonial' },
    { id: 'pricing', name: 'Pricing', icon: ShoppingCart, category: 'Business', description: 'Add pricing table' },
    { id: 'contact', name: 'Contact Info', icon: Phone, category: 'Business', description: 'Add contact details' },
    { id: 'map', name: 'Map', icon: MapPin, category: 'Business', description: 'Add map' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, category: 'Business', description: 'Add calendar widget' }
  ];

  const getDeviceCanvasStyle = () => {
    let width = '100%';
    let maxWidth = canvasSettings.maxWidth + 'px';
    
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
        maxWidth = canvasSettings.maxWidth + 'px';
        break;
    }

    return {
      width,
      maxWidth,
      minHeight: '800px',
      backgroundColor: canvasSettings.backgroundColor,
      transform: `scale(${zoomLevel / 100})`,
      transformOrigin: 'top center',
      transition: 'all 0.3s ease',
      position: 'relative' as const,
      margin: '0 auto',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      padding: `${canvasSettings.padding}px`
    };
  };

  const getElementDefaults = () => ({
    text: {
      content: 'Edit this text',
      size: { width: 200, height: 40 },
      styles: { 
        fontSize: '16px', 
        color: '#000000', 
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.5'
      },
      props: {}
    },
    heading: {
      content: 'Your Heading',
      size: { width: 300, height: 60 },
      styles: { 
        fontSize: '32px', 
        fontWeight: 'bold', 
        color: '#000000',
        fontFamily: 'Inter, sans-serif',
        lineHeight: '1.2'
      },
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
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif'
      },
      props: { href: '' }
    },
    image: {
      content: '',
      size: { width: 300, height: 200 },
      styles: { 
        borderRadius: '8px',
        objectFit: 'cover'
      },
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
      props: { action: '', method: 'POST' }
    },
    container: {
      content: '',
      size: { width: 400, height: 200 },
      styles: { 
        backgroundColor: 'transparent', 
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '20px'
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
    },
    navbar: {
      content: '',
      size: { width: 800, height: 80 },
      styles: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      },
      props: {}
    },
    testimonial: {
      content: '"This product changed my life completely. Highly recommended!"',
      size: { width: 350, height: 200 },
      styles: {
        backgroundColor: '#f9fafb',
        padding: '30px',
        borderRadius: '12px',
        fontStyle: 'italic',
        fontSize: '16px',
        lineHeight: '1.6'
      },
      props: { author: 'John Doe', title: 'CEO, Company' }
    }
  });

  const handleAddElement = useCallback((elementType: string, position?: Position) => {
    const defaults = getElementDefaults();
    const elementData = defaults[elementType as keyof typeof defaults];
    
    if (!elementData) return;
    
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

    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement);
    addToHistory(newElements);
    toast.success(`${elementType} added to canvas`);
  }, [elements]);

  const handleElementClick = useCallback((element: Element) => {
    setSelectedElement(element);
    setActiveTab('design');
  }, []);

  const handleElementUpdate = useCallback((id: string, updates: Partial<Element>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
    
    if (selectedElement?.id === id) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [elements, selectedElement]);

  const handleElementDelete = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    
    if (selectedElement?.id === id) {
      setSelectedElement(null);
    }
    toast.success('Element deleted');
  }, [elements, selectedElement]);

  const handleElementDuplicate = useCallback((element: Element) => {
    const duplicated = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };
    const newElements = [...elements, duplicated];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(duplicated);
    toast.success('Element duplicated');
  }, [elements]);

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    handleAddElement(draggedElement.id, { 
      x: Math.max(0, x - canvasSettings.padding), 
      y: Math.max(0, y - canvasSettings.padding) 
    });
    setDraggedElement(null);
    setIsDragging(false);
  };

  const renderElementContent = (element: Element) => {
    const baseStyles = { ...element.styles, width: '100%', height: '100%' };

    switch (element.type) {
      case 'text':
        return (
          <div
            style={baseStyles}
            className="p-2 flex items-center cursor-text"
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
            className="p-2 flex items-center cursor-text"
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
            className="flex items-center justify-center transition-all hover:opacity-90"
            onClick={isPreviewMode && element.props?.href ? () => {
              if (element.props.href.startsWith('http')) {
                window.open(element.props.href, '_blank');
              } else {
                window.location.href = element.props.href;
              }
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
                style={{ width: '100%', height: '100%', objectFit: element.styles?.objectFit || 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
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
          <form style={baseStyles} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input id="name" placeholder="Your name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="message" className="text-sm font-medium">Message</Label>
              <Textarea id="message" placeholder="Your message" className="mt-1" />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        );

      case 'container':
        return (
          <div style={baseStyles} className="flex items-center justify-center min-h-[100px]">
            <span className="text-gray-400 text-sm">
              {element.children?.length ? `${element.children.length} items` : 'Drop elements here'}
            </span>
          </div>
        );

      case 'navbar':
        return (
          <nav style={baseStyles}>
            <div className="flex items-center">
              <span className="font-bold text-lg">Logo</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </nav>
        );

      case 'testimonial':
        return (
          <div style={baseStyles} className="text-center">
            <p className="mb-4">{element.content}</p>
            <div className="text-sm text-gray-600">
              <div className="font-medium">{element.props?.author || 'Author Name'}</div>
              <div>{element.props?.title || 'Title, Company'}</div>
            </div>
          </div>
        );

      case 'divider':
        return <hr style={baseStyles} className="border-gray-300" />;

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

  const renderElement = (element: Element) => {
    const isSelected = selectedElement?.id === element.id;
    const isHovered = hoveredElement?.id === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2 z-50' : 
          isHovered ? 'ring-1 ring-blue-300 z-40' : 'z-10'
        }`}
        style={{
          left: snapToGrid ? Math.round(element.position.x / gridSize) * gridSize : element.position.x,
          top: snapToGrid ? Math.round(element.position.y / gridSize) * gridSize : element.position.y,
          width: element.size.width,
          height: element.size.height
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleElementClick(element);
        }}
        onMouseEnter={() => !isPreviewMode && setHoveredElement(element)}
        onMouseLeave={() => !isPreviewMode && setHoveredElement(null)}
      >
        {renderElementContent(element)}
        
        {(isSelected || isHovered) && !isPreviewMode && (
          <>
            {/* Element label */}
            <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-t flex items-center gap-2 z-50">
              <span className="capitalize">{element.type}</span>
              {isSelected && (
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 text-white hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementDuplicate(element);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
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

            {/* Resize handles */}
            {isSelected && (
              <>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize z-50" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize z-50" />
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize z-50" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize z-50" />
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const groupedElements = elementLibrary.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, typeof elementLibrary>);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <div className={`bg-white border-r shadow-lg transition-all duration-300 z-20 ${
        leftPanelOpen ? 'w-80' : 'w-0 overflow-hidden'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/sites')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sites
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLeftPanelOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="font-semibold text-lg">Page Builder</h2>
            <p className="text-sm text-gray-600">Drag elements to canvas</p>
          </div>

          {/* Element Categories */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {Object.entries(groupedElements).map(([category, categoryElements]) => (
                <div key={category}>
                  <h3 className="font-medium text-sm text-gray-700 mb-3 uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryElements.map((element) => (
                      <Card
                        key={element.id}
                        className="p-3 cursor-pointer hover:bg-gray-50 transition-all hover:shadow-md border-dashed"
                        draggable
                        onDragStart={() => {
                          setDraggedElement(element);
                          setIsDragging(true);
                        }}
                        onDragEnd={() => {
                          setIsDragging(false);
                          setDraggedElement(null);
                        }}
                        onClick={() => handleAddElement(element.id)}
                      >
                        <div className="flex flex-col items-center text-center space-y-2">
                          <element.icon className="h-6 w-6 text-gray-600" />
                          <span className="text-xs font-medium">{element.name}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        rightPanelOpen ? 'mr-80' : 'mr-0'
      } ${leftPanelOpen ? 'ml-0' : 'ml-0'}`}>
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-4">
            {/* Left panel toggle */}
            {!leftPanelOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLeftPanelOpen(true)}
                className="px-2 h-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}

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
            
            {/* History Controls */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="px-2 h-8"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="px-2 h-8"
              >
                <Redo className="h-4 w-4" />
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
        <div className="flex-1 overflow-auto bg-gray-100 relative">
          <div className="h-full flex items-start justify-center py-8">
            <div
              ref={canvasRef}
              style={getDeviceCanvasStyle()}
              className="relative overflow-hidden bg-white"
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
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                  }}
                />
              )}

              {/* Drop indicator */}
              {isDragging && (
                <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 flex items-center justify-center z-30">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium">
                    Drop element here
                  </div>
                </div>
              )}

              {/* Empty State */}
              {elements.length === 0 && !isDragging && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Layout className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Start building your page</h3>
                    <p className="text-sm">Drag elements from the left sidebar to get started</p>
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {activeTab === 'design' && (
                <div className="space-y-6">
                  {selectedElement ? (
                    <>
                      <div className="p-3 bg-gray-50 rounded">
                        <h3 className="font-medium capitalize flex items-center gap-2">
                          <Badge variant="outline">{selectedElement.type}</Badge>
                          Element Properties
                        </h3>
                      </div>

                      {/* Content Editor */}
                      {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Content</Label>
                          <Textarea
                            value={selectedElement.content}
                            onChange={(e) => handleElementUpdate(selectedElement.id, { content: e.target.value })}
                            placeholder="Enter content..."
                            className="min-h-[80px]"
                          />
                        </div>
                      )}

                      {/* Image Properties */}
                      {selectedElement.type === 'image' && (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Image URL</Label>
                            <Input
                              value={selectedElement.props?.src || ''}
                              onChange={(e) => handleElementUpdate(selectedElement.id, { 
                                props: { ...selectedElement.props, src: e.target.value }
                              })}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Alt Text</Label>
                            <Input
                              value={selectedElement.props?.alt || ''}
                              onChange={(e) => handleElementUpdate(selectedElement.id, { 
                                props: { ...selectedElement.props, alt: e.target.value }
                              })}
                              placeholder="Image description"
                            />
                          </div>
                        </div>
                      )}

                      {/* Button Properties */}
                      {selectedElement.type === 'button' && (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm font-medium">Link URL</Label>
                            <Input
                              value={selectedElement.props?.href || ''}
                              onChange={(e) => handleElementUpdate(selectedElement.id, { 
                                props: { ...selectedElement.props, href: e.target.value }
                              })}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      )}

                      {/* Dimensions */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Dimensions</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-500">Width</Label>
                            <Input
                              type="number"
                              value={selectedElement.size.width}
                              onChange={(e) => handleElementUpdate(selectedElement.id, {
                                size: { ...selectedElement.size, width: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Height</Label>
                            <Input
                              type="number"
                              value={selectedElement.size.height}
                              onChange={(e) => handleElementUpdate(selectedElement.id, {
                                size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Position</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs text-gray-500">X</Label>
                            <Input
                              type="number"
                              value={selectedElement.position.x}
                              onChange={(e) => handleElementUpdate(selectedElement.id, {
                                position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">Y</Label>
                            <Input
                              type="number"
                              value={selectedElement.position.y}
                              onChange={(e) => handleElementUpdate(selectedElement.id, {
                                position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 }
                              })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Styling */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Styling</Label>
                        
                        {/* Typography */}
                        {(selectedElement.type === 'text' || selectedElement.type === 'heading' || selectedElement.type === 'button') && (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-500">Font Size</Label>
                              <Input
                                value={selectedElement.styles?.fontSize || ''}
                                onChange={(e) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, fontSize: e.target.value }
                                })}
                                placeholder="16px"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-xs text-gray-500">Font Weight</Label>
                              <Select
                                value={selectedElement.styles?.fontWeight || 'normal'}
                                onValueChange={(value) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, fontWeight: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="bold">Bold</SelectItem>
                                  <SelectItem value="600">Semi Bold</SelectItem>
                                  <SelectItem value="300">Light</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs text-gray-500">Text Align</Label>
                              <Select
                                value={selectedElement.styles?.textAlign || 'left'}
                                onValueChange={(value) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, textAlign: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="left">Left</SelectItem>
                                  <SelectItem value="center">Center</SelectItem>
                                  <SelectItem value="right">Right</SelectItem>
                                  <SelectItem value="justify">Justify</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* Colors */}
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500">Text Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={selectedElement.styles?.color || '#000000'}
                                onChange={(e) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, color: e.target.value }
                                })}
                                className="w-12 h-8 p-1"
                              />
                              <Input
                                value={selectedElement.styles?.color || '#000000'}
                                onChange={(e) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, color: e.target.value }
                                })}
                                placeholder="#000000"
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs text-gray-500">Background Color</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={selectedElement.styles?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                                })}
                                className="w-12 h-8 p-1"
                              />
                              <Input
                                value={selectedElement.styles?.backgroundColor || '#ffffff'}
                                onChange={(e) => handleElementUpdate(selectedElement.id, {
                                  styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                                })}
                                placeholder="#ffffff"
                                className="flex-1"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Border & Spacing */}
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-gray-500">Border Radius</Label>
                            <Input
                              value={selectedElement.styles?.borderRadius || ''}
                              onChange={(e) => handleElementUpdate(selectedElement.id, {
                                styles: { ...selectedElement.styles, borderRadius: e.target.value }
                              })}
                              placeholder="8px"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-500">Padding</Label>
                            <Input
                              value={selectedElement.styles?.padding || ''}
                              onChange={(e) => handleElementUpdate(selectedElement.id, {
                                styles: { ...selectedElement.styles, padding: e.target.value }
                              })}
                              placeholder="20px"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleElementDuplicate(selectedElement)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Element
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleElementDelete(selectedElement.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Element
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">No Element Selected</h3>
                      <p className="text-sm">Click on an element in the canvas to edit its properties</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'layers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Layers</h3>
                    <Badge variant="outline">{elements.length} elements</Badge>
                  </div>
                  
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {elements.map((element, index) => (
                        <div
                          key={element.id}
                          className={`p-3 rounded border cursor-pointer flex items-center justify-between ${
                            selectedElement?.id === element.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedElement(element)}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <span className="text-sm capitalize">{element.type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedElement(element);
                                setActiveTab('design');
                              }}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleElementDelete(element.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Canvas Settings</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Background Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="color"
                            value={canvasSettings.backgroundColor}
                            onChange={(e) => setCanvasSettings(prev => ({
                              ...prev,
                              backgroundColor: e.target.value
                            }))}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={canvasSettings.backgroundColor}
                            onChange={(e) => setCanvasSettings(prev => ({
                              ...prev,
                              backgroundColor: e.target.value
                            }))}
                            placeholder="#ffffff"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Canvas Padding</Label>
                        <Input
                          type="number"
                          value={canvasSettings.padding}
                          onChange={(e) => setCanvasSettings(prev => ({
                            ...prev,
                            padding: parseInt(e.target.value) || 0
                          }))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Max Width (px)</Label>
                        <Input
                          type="number"
                          value={canvasSettings.maxWidth}
                          onChange={(e) => setCanvasSettings(prev => ({
                            ...prev,
                            maxWidth: parseInt(e.target.value) || 1200
                          }))}
                          className="mt-1"
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Show Grid</Label>
                        <Switch
                          checked={showGrid}
                          onCheckedChange={setShowGrid}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Snap to Grid</Label>
                        <Switch
                          checked={snapToGrid}
                          onCheckedChange={setSnapToGrid}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Grid Size: {gridSize}px</Label>
                        <Slider
                          value={[gridSize]}
                          onValueChange={(value) => setGridSize(value[0])}
                          max={50}
                          min={10}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Page Settings</h4>
                    <div>
                      <Label className="text-sm font-medium">Page Title</Label>
                      <Input placeholder="Page title" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Meta Description</Label>
                      <Textarea placeholder="Page description for SEO" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Custom CSS</Label>
                      <Textarea placeholder="Add custom CSS here" className="mt-1" />
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
