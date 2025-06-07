
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Type, 
  Image, 
  Square, 
  Circle, 
  MousePointer, 
  Palette, 
  Save, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  Undo,
  Redo,
  Copy,
  Trash2,
  Settings,
  Grid,
  Layout,
  Video,
  Calendar,
  ShoppingCart,
  MapPin,
  Star,
  Play,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface PageElement {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'form' | 'video' | 'divider' | 'spacer' | 'testimonial' | 'pricing' | 'countdown' | 'map';
  content: string;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right';
    borderRadius?: string;
    border?: string;
    width?: string;
    height?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings: Record<string, any>;
}

interface PageSection {
  id: string;
  name: string;
  elements: PageElement[];
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  padding: { top: number; bottom: number; left: number; right: number };
}

const elementTypes = [
  {
    category: 'Basic Elements',
    items: [
      { type: 'heading', label: 'Heading', icon: Type, description: 'Add titles and headings' },
      { type: 'text', label: 'Text', icon: Type, description: 'Add paragraphs and content' },
      { type: 'button', label: 'Button', icon: MousePointer, description: 'Call-to-action buttons' },
      { type: 'image', label: 'Image', icon: Image, description: 'Add photos and graphics' },
      { type: 'divider', label: 'Divider', icon: Square, description: 'Section dividers' },
      { type: 'spacer', label: 'Spacer', icon: Circle, description: 'Add white space' }
    ]
  },
  {
    category: 'Advanced Elements',
    items: [
      { type: 'form', label: 'Form', icon: Square, description: 'Lead capture forms' },
      { type: 'video', label: 'Video', icon: Video, description: 'Embed videos' },
      { type: 'testimonial', label: 'Testimonial', icon: Star, description: 'Customer reviews' },
      { type: 'pricing', label: 'Pricing Table', icon: ShoppingCart, description: 'Pricing plans' },
      { type: 'countdown', label: 'Countdown', icon: Calendar, description: 'Urgency timers' },
      { type: 'map', label: 'Map', icon: MapPin, description: 'Google Maps embed' }
    ]
  }
];

const prebuiltSections = [
  {
    id: 'hero-1',
    name: 'Hero Section - Centered',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'button']
  },
  {
    id: 'features-3col',
    name: 'Features - 3 Columns',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'image']
  },
  {
    id: 'testimonials',
    name: 'Testimonials Grid',
    preview: '/api/placeholder/300/200',
    elements: ['testimonial']
  },
  {
    id: 'cta-section',
    name: 'Call to Action',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'button']
  }
];

export function VisualPageBuilder() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('elements');
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addSection = useCallback(() => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      name: `Section ${sections.length + 1}`,
      elements: [],
      background: { type: 'color', value: '#ffffff' },
      padding: { top: 60, bottom: 60, left: 20, right: 20 }
    };
    
    setSections(prev => [...prev, newSection]);
    setSelectedSection(newSection.id);
  }, [sections.length]);

  const addElement = useCallback((elementType: string, sectionId?: string) => {
    if (!sectionId && sections.length === 0) {
      addSection();
      sectionId = `section-${Date.now()}`;
    }
    
    const targetSectionId = sectionId || sections[sections.length - 1]?.id;
    if (!targetSectionId) return;

    const newElement: PageElement = {
      id: `element-${Date.now()}`,
      type: elementType as any,
      content: getDefaultContent(elementType),
      position: { x: 20, y: 20 },
      size: { width: 100, height: 60 },
      styles: getDefaultStyles(elementType),
      settings: {}
    };

    setSections(prev => prev.map(section => 
      section.id === targetSectionId 
        ? { ...section, elements: [...section.elements, newElement] }
        : section
    ));
    
    setSelectedElement(newElement);
    toast.success(`${elementType} element added`);
  }, [sections, addSection]);

  const getDefaultContent = (type: string) => {
    const defaults: Record<string, string> = {
      heading: 'Your Headline Here',
      text: 'Add your content here. This is a great place to tell your story and let your users know a little more about your service.',
      button: 'Click Here',
      image: 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Image',
      form: 'Contact Form',
      video: 'https://youtube.com/embed/dQw4w9WgXcQ',
      testimonial: '"This service changed my life!" - Happy Customer',
      pricing: 'Premium Plan - $99/month',
      countdown: '30 Days Left!',
      map: 'Google Maps Location',
      divider: '',
      spacer: ''
    };
    return defaults[type] || 'New Element';
  };

  const getDefaultStyles = (type: string) => {
    const styleDefaults: Record<string, any> = {
      heading: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        margin: '0 0 1rem 0'
      },
      text: {
        fontSize: '1rem',
        color: '#4b5563',
        textAlign: 'left',
        margin: '0 0 1rem 0'
      },
      button: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        padding: '12px 24px',
        borderRadius: '6px',
        textAlign: 'center',
        border: 'none'
      }
    };
    return styleDefaults[type] || {};
  };

  const updateElementStyle = useCallback((elementId: string, styleKey: string, styleValue: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      elements: section.elements.map(element =>
        element.id === elementId
          ? { ...element, styles: { ...element.styles, [styleKey]: styleValue } }
          : element
      )
    })));
  }, []);

  const updateElementContent = useCallback((elementId: string, content: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      elements: section.elements.map(element =>
        element.id === elementId ? { ...element, content } : element
      )
    })));
  }, []);

  const deleteElement = useCallback((elementId: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      elements: section.elements.filter(element => element.id !== elementId)
    })));
    setSelectedElement(null);
    toast.success('Element deleted');
  }, []);

  const duplicateElement = useCallback((elementId: string) => {
    setSections(prev => prev.map(section => {
      const elementToDuplicate = section.elements.find(e => e.id === elementId);
      if (elementToDuplicate) {
        const duplicatedElement = {
          ...elementToDuplicate,
          id: `element-${Date.now()}`,
          position: { 
            x: elementToDuplicate.position.x + 20, 
            y: elementToDuplicate.position.y + 20 
          }
        };
        return {
          ...section,
          elements: [...section.elements, duplicatedElement]
        };
      }
      return section;
    }));
    toast.success('Element duplicated');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    try {
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      addElement(elementData.type, sectionId);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, [addElement]);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'max-w-6xl mx-auto';
    }
  };

  const renderElement = (element: PageElement) => {
    const commonProps = {
      key: element.id,
      className: `cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all ${
        selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
      } ${!isPreviewMode ? 'min-h-[40px]' : ''}`,
      style: {
        ...element.styles,
        position: 'relative' as const
      },
      onClick: () => !isPreviewMode && setSelectedElement(element)
    };

    switch (element.type) {
      case 'heading':
        return <h1 {...commonProps}>{element.content}</h1>;
      case 'text':
        return <p {...commonProps}>{element.content}</p>;
      case 'button':
        return (
          <button {...commonProps} type="button">
            {element.content}
          </button>
        );
      case 'image':
        return (
          <img 
            {...commonProps} 
            src={element.content} 
            alt="Page element" 
            className={`${commonProps.className} max-w-full h-auto`}
          />
        );
      case 'video':
        return (
          <div {...commonProps}>
            <iframe 
              src={element.content} 
              className="w-full h-64" 
              frameBorder="0" 
              allowFullScreen
            />
          </div>
        );
      case 'form':
        return (
          <div {...commonProps}>
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">{element.content}</h3>
              <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
              <button className="w-full bg-blue-600 text-white p-2 rounded">Submit</button>
            </div>
          </div>
        );
      case 'testimonial':
        return (
          <div {...commonProps}>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic">{element.content}</p>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div {...commonProps}>
            <div className="p-6 border rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">{element.content}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">$99</div>
              <ul className="text-sm space-y-1 mb-4">
                <li>✓ Feature 1</li>
                <li>✓ Feature 2</li>
                <li>✓ Feature 3</li>
              </ul>
              <button className="w-full bg-blue-600 text-white p-2 rounded">Choose Plan</button>
            </div>
          </div>
        );
      case 'divider':
        return <hr {...commonProps} className={`${commonProps.className} border-gray-300`} />;
      case 'spacer':
        return <div {...commonProps} style={{ ...commonProps.style, height: '50px' }} />;
      default:
        return <div {...commonProps}>{element.content}</div>;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      {!isPreviewMode && (
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Page Builder</h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="p-4 space-y-4">
              {elementTypes.map((category) => (
                <div key={category.category}>
                  <h4 className="font-medium text-sm text-gray-600 mb-3">{category.category}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.type}
                          className="p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow text-center"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify(item));
                            setDraggedElement(item);
                          }}
                          onClick={() => addElement(item.type)}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-1" />
                          <div className="text-xs font-medium">{item.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sections" className="p-4 space-y-4">
              <Button onClick={addSection} className="w-full">
                Add New Section
              </Button>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-3">Pre-built Sections</h4>
                <div className="space-y-2">
                  {prebuiltSections.map((section) => (
                    <div
                      key={section.id}
                      className="p-3 border rounded-lg cursor-pointer hover:shadow-md"
                      onClick={() => {
                        // Add prebuilt section logic here
                        toast.success(`Added ${section.name}`);
                      }}
                    >
                      <div className="font-medium text-sm">{section.name}</div>
                      <div className="text-xs text-gray-500">
                        {section.elements.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              {selectedElement ? (
                <div>
                  <h4 className="font-medium mb-3">Element Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={selectedElement.content}
                        onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label>Font Size</Label>
                      <Select
                        value={selectedElement.styles.fontSize || '1rem'}
                        onValueChange={(value) => updateElementStyle(selectedElement.id, 'fontSize', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.75rem">Small</SelectItem>
                          <SelectItem value="1rem">Normal</SelectItem>
                          <SelectItem value="1.25rem">Large</SelectItem>
                          <SelectItem value="1.5rem">X-Large</SelectItem>
                          <SelectItem value="2rem">XX-Large</SelectItem>
                          <SelectItem value="2.5rem">Huge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={selectedElement.styles.color || '#000000'}
                        onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                      />
                    </div>

                    {selectedElement.type === 'button' && (
                      <div>
                        <Label>Background Color</Label>
                        <Input
                          type="color"
                          value={selectedElement.styles.backgroundColor || '#3b82f6'}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                        />
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateElement(selectedElement.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteElement(selectedElement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select an element to edit its settings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            
            {!isPreviewMode && (
              <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className={getViewportClass()}>
            {sections.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <Layout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Start Building Your Page
                </h3>
                <p className="text-gray-500 mb-4">
                  Add sections and elements to create your perfect landing page
                </p>
                <Button onClick={addSection}>
                  Add Your First Section
                </Button>
              </div>
            ) : (
              <div className="space-y-0">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`bg-white min-h-[200px] relative ${
                      selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      background: section.background.type === 'color' 
                        ? section.background.value 
                        : `url(${section.background.value})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      padding: `${section.padding.top}px ${section.padding.right}px ${section.padding.bottom}px ${section.padding.left}px`
                    }}
                    onDrop={(e) => handleDrop(e, section.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    {!isPreviewMode && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
                        {section.name}
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      {section.elements.length === 0 ? (
                        <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-center">
                            <p className="text-gray-500 mb-2">Drop elements here</p>
                            <Badge variant="outline">Empty Section</Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {section.elements.map(renderElement)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
