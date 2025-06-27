
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, Edit, Trash2, Copy, Move, Eye, EyeOff, Settings, 
  Type, Image, Square, Circle, Layout, Layers, Palette, 
  MousePointer, Hand, ZoomIn, ZoomOut, RotateCcw, RotateCw,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Code, Link, List, ListOrdered,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown,
  Monitor, Tablet, Smartphone, Play, Pause, Save, Download, Upload,
  MoreHorizontal, Quote, Grid, Columns, Rows, PanelLeft, PanelRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Element {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'form' | 'video' | 'divider' | 'spacer' | 'icon' | 'testimonial' | 'pricing' | 'countdown' | 'social' | 'map';
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  target?: '_blank' | '_self';
  children?: Element[];
  styles: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundGradient?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    boxShadow?: string;
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    zIndex?: string;
    opacity?: string;
    transform?: string;
    transition?: string;
    cursor?: string;
    overflow?: string;
    display?: string;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexWrap?: string;
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    gap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridGap?: string;
    animation?: string;
    animationDuration?: string;
    animationDelay?: string;
    animationIterationCount?: string;
    animationDirection?: string;
    animationFillMode?: string;
    animationPlayState?: string;
    animationTimingFunction?: string;
  };
  attributes?: { [key: string]: string };
  responsive?: {
    mobile?: Partial<Element['styles']>;
    tablet?: Partial<Element['styles']>;
    desktop?: Partial<Element['styles']>;
  };
  interactions?: {
    onClick?: string;
    onHover?: string;
    onFocus?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    alt?: string;
  };
}

interface Page {
  id: string;
  title: string;
  slug: string;
  elements: Element[];
  settings: {
    title: string;
    description: string;
    keywords: string;
    favicon?: string;
    customCSS?: string;
    customJS?: string;
    headerCode?: string;
    footerCode?: string;
  };
  isPublished: boolean;
}

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
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [undoStack, setUndoStack] = useState<Page[]>([]);
  const [redoStack, setRedoStack] = useState<Page[]>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find(p => p.id === currentPageId);
  const selectedElement = currentPage?.elements.find(e => e.id === selectedElementId);

  // Element templates for drag-and-drop
  const elementTemplates = [
    {
      type: 'text',
      label: 'Text',
      icon: Type,
      template: {
        type: 'text' as const,
        content: 'Your text here',
        styles: {
          fontSize: '16px',
          fontWeight: '400',
          color: '#333333',
          textAlign: 'left' as const,
          padding: '10px',
        }
      }
    },
    {
      type: 'heading',
      label: 'Heading',
      icon: Type,
      template: {
        type: 'text' as const,
        content: 'Your Heading',
        styles: {
          fontSize: '32px',
          fontWeight: '700',
          color: '#333333',
          textAlign: 'center' as const,
          padding: '20px 10px',
        }
      }
    },
    {
      type: 'button',
      label: 'Button',
      icon: Square,
      template: {
        type: 'button' as const,
        content: 'Click Me',
        href: '#',
        styles: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center' as const,
          cursor: 'pointer',
          border: 'none',
        }
      }
    },
    {
      type: 'image',
      label: 'Image',
      icon: Image,
      template: {
        type: 'image' as const,
        src: 'https://via.placeholder.com/400x300',
        alt: 'Placeholder Image',
        styles: {
          width: '100%',
          maxWidth: '400px',
          height: 'auto',
          borderRadius: '8px',
        }
      }
    },
    {
      type: 'container',
      label: 'Container',
      icon: Layout,
      template: {
        type: 'container' as const,
        children: [],
        styles: {
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          minHeight: '100px',
          display: 'flex',
          flexDirection: 'column' as const,
        }
      }
    },
    {
      type: 'divider',
      label: 'Divider',
      icon: MoreHorizontal,
      template: {
        type: 'divider' as const,
        styles: {
          height: '1px',
          backgroundColor: '#e9ecef',
          margin: '20px 0',
          width: '100%',
        }
      }
    }
  ];

  // Functions
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

  // Render element based on type
  const renderElement = useCallback((element: Element, isSelected: boolean = false) => {
    const baseStyles: React.CSSProperties = {
      position: element.styles.position as any || 'relative',
      ...element.styles,
      transform: element.styles.transform,
      opacity: element.styles.opacity,
    };

    const wrapperStyles: React.CSSProperties = {
      outline: isSelected ? '2px solid #007bff' : 'none',
      outlineOffset: '2px',
      cursor: 'pointer',
    };

    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedElementId(element.id);
    };

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <div style={{ ...baseStyles }} dangerouslySetInnerHTML={{ __html: element.content || '' }} />
          </div>
        );

      case 'button':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <button style={{ ...baseStyles, border: 'none' }} onClick={(e) => e.preventDefault()}>
              {element.content}
            </button>
          </div>
        );

      case 'image':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <img 
              src={element.src} 
              alt={element.alt || ''} 
              style={{ ...baseStyles }}
            />
          </div>
        );

      case 'container':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <div style={{ ...baseStyles }}>
              {element.children?.map(child => renderElement(child, selectedElementId === child.id))}
            </div>
          </div>
        );

      case 'divider':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <hr style={{ ...baseStyles, height: baseStyles.height || '1px', backgroundColor: 'transparent' }} />
          </div>
        );

      case 'form':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <form style={{ ...baseStyles }} onClick={(e) => e.preventDefault()}>
              <input type="text" placeholder="Name" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input type="email" placeholder="Email" style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
                Submit
              </button>
            </form>
          </div>
        );

      case 'video':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <div style={{ ...baseStyles, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <Play size={48} />
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <div style={{ ...baseStyles, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <Quote size={24} style={{ marginBottom: '10px', color: '#007bff' }} />
              <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>
                {element.content || 'This is a great product! I highly recommend it to everyone.'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', marginRight: '10px' }}></div>
                <div>
                  <div style={{ fontWeight: 'bold' }}>John Doe</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>CEO, Company</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <div style={{ ...baseStyles, border: '1px solid #e9ecef', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Basic Plan</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '20px 0' }}>$29<span style={{ fontSize: '16px', fontWeight: 'normal' }}>/month</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                <li style={{ padding: '5px 0' }}>✓ Feature 1</li>
                <li style={{ padding: '5px 0' }}>✓ Feature 2</li>
                <li style={{ padding: '5px 0' }}>✓ Feature 3</li>
              </ul>
              <button style={{ width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px' }}>
                Choose Plan
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
            <div style={{ ...baseStyles, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              Unknown Element Type: {element.type}
            </div>
          </div>
        );
    }
  }, [selectedElementId]);

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
                      {elementTemplates.map((template) => (
                        <Card 
                          key={template.type}
                          className="cursor-grab hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={(e) => {
                            setDraggedElement(template.template);
                            setIsDragging(true);
                          }}
                          onDragEnd={() => {
                            setIsDragging(false);
                            setDraggedElement(null);
                          }}
                        >
                          <CardContent className="p-3 text-center">
                            <template.icon className="h-6 w-6 mx-auto mb-1" />
                            <span className="text-xs">{template.label}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="design" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  {selectedElement ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Element: {selectedElement.type}</Label>
                      </div>
                      
                      {selectedElement.type === 'text' && (
                        <div className="space-y-3">
                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={selectedElement.content || ''}
                              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                              placeholder="Enter text content"
                            />
                          </div>
                        </div>
                      )}

                      {selectedElement.type === 'button' && (
                        <div className="space-y-3">
                          <div>
                            <Label>Button Text</Label>
                            <Input
                              value={selectedElement.content || ''}
                              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                              placeholder="Button text"
                            />
                          </div>
                          <div>
                            <Label>Link URL</Label>
                            <Input
                              value={selectedElement.href || ''}
                              onChange={(e) => updateElement(selectedElement.id, { href: e.target.value })}
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      )}

                      {selectedElement.type === 'image' && (
                        <div className="space-y-3">
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={selectedElement.src || ''}
                              onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <div>
                            <Label>Alt Text</Label>
                            <Input
                              value={selectedElement.alt || ''}
                              onChange={(e) => updateElement(selectedElement.id, { alt: e.target.value })}
                              placeholder="Image description"
                            />
                          </div>
                        </div>
                      )}

                      {/* Style Controls */}
                      <Separator />
                      <div className="space-y-3">
                        <Label className="font-medium">Styling</Label>
                        
                        {/* Typography */}
                        {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Font Size</Label>
                              <Input
                                value={selectedElement.styles.fontSize || ''}
                                onChange={(e) => updateElement(selectedElement.id, { 
                                  styles: { ...selectedElement.styles, fontSize: e.target.value }
                                })}
                                placeholder="16px"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Font Weight</Label>
                              <Select
                                value={selectedElement.styles.fontWeight || '400'}
                                onValueChange={(value) => updateElement(selectedElement.id, { 
                                  styles: { ...selectedElement.styles, fontWeight: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="300">Light</SelectItem>
                                  <SelectItem value="400">Normal</SelectItem>
                                  <SelectItem value="500">Medium</SelectItem>
                                  <SelectItem value="600">Semi Bold</SelectItem>
                                  <SelectItem value="700">Bold</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs">Text Color</Label>
                              <Input
                                type="color"
                                value={selectedElement.styles.color || '#000000'}
                                onChange={(e) => updateElement(selectedElement.id, { 
                                  styles: { ...selectedElement.styles, color: e.target.value }
                                })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Background */}
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Background Color</Label>
                            <Input
                              type="color"
                              value={selectedElement.styles.backgroundColor || '#ffffff'}
                              onChange={(e) => updateElement(selectedElement.id, { 
                                styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                              })}
                            />
                          </div>
                        </div>

                        {/* Spacing */}
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Padding</Label>
                            <Input
                              value={selectedElement.styles.padding || ''}
                              onChange={(e) => updateElement(selectedElement.id, { 
                                styles: { ...selectedElement.styles, padding: e.target.value }
                              })}
                              placeholder="10px"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Margin</Label>
                            <Input
                              value={selectedElement.styles.margin || ''}
                              onChange={(e) => updateElement(selectedElement.id, { 
                                styles: { ...selectedElement.styles, margin: e.target.value }
                              })}
                              placeholder="10px"
                            />
                          </div>
                        </div>

                        {/* Border */}
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Border Radius</Label>
                            <Input
                              value={selectedElement.styles.borderRadius || ''}
                              onChange={(e) => updateElement(selectedElement.id, { 
                                styles: { ...selectedElement.styles, borderRadius: e.target.value }
                              })}
                              placeholder="4px"
                            />
                          </div>
                        </div>

                        {/* Layout for containers */}
                        {selectedElement.type === 'container' && (
                          <div className="space-y-2">
                            <div>
                              <Label className="text-xs">Flex Direction</Label>
                              <Select
                                value={selectedElement.styles.flexDirection || 'column'}
                                onValueChange={(value: 'row' | 'column' | 'row-reverse' | 'column-reverse') => updateElement(selectedElement.id, { 
                                  styles: { ...selectedElement.styles, flexDirection: value }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="column">Column</SelectItem>
                                  <SelectItem value="row">Row</SelectItem>
                                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <Separator />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateElement(selectedElement.id)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteElement(selectedElement.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Select an element to edit its properties
                    </div>
                  )}
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
                      <div>
                        <Label>Keywords</Label>
                        <Input
                          value={currentPage.settings.keywords}
                          onChange={(e) => {
                            const updatedPage = { 
                              ...currentPage, 
                              settings: { ...currentPage.settings, keywords: e.target.value }
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
                    {currentPage?.elements.map((element, index) => (
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
              {/* Page Navigation */}
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
              {/* Preview Mode Toggle */}
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

              {/* Zoom Controls */}
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

              {/* Action Buttons */}
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
                    renderElement(element, selectedElementId === element.id)
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
            <Button variant="outline" className="w-full justify-start">
              <Code className="h-4 w-4 mr-2" />
              Custom Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
