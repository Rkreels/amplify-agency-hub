import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
  Download,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Code,
  Layers,
  Move,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Share,
  Mail,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface PageElement {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'form' | 'video' | 'divider' | 'spacer' | 'testimonial' | 'pricing' | 'countdown' | 'map' | 'social' | 'newsletter' | 'gallery' | 'accordion' | 'tabs' | 'progress' | 'contact';
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
    boxShadow?: string;
    transform?: string;
    opacity?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings: Record<string, any>;
  animation?: {
    type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounceIn';
    duration: number;
    delay: number;
  };
}

interface PageSection {
  id: string;
  name: string;
  elements: PageElement[];
  background: {
    type: 'color' | 'gradient' | 'image' | 'video';
    value: string;
    overlay?: string;
  };
  padding: { top: number; bottom: number; left: number; right: number };
  maxWidth: string;
  isFullWidth: boolean;
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
  },
  {
    category: 'Interactive Elements',
    items: [
      { type: 'gallery', label: 'Gallery', icon: Grid, description: 'Image galleries' },
      { type: 'accordion', label: 'Accordion', icon: List, description: 'Collapsible content' },
      { type: 'tabs', label: 'Tabs', icon: Layers, description: 'Tabbed content' },
      { type: 'progress', label: 'Progress Bar', icon: RotateCw, description: 'Progress indicators' },
      { type: 'social', label: 'Social Media', icon: Share, description: 'Social media feeds' },
      { type: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Email signup forms' }
    ]
  }
];

const prebuiltSections = [
  {
    id: 'hero-modern',
    name: 'Modern Hero Section',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'button', 'image'],
    description: 'Clean, modern hero with image'
  },
  {
    id: 'hero-video',
    name: 'Video Hero Section',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'button', 'video'],
    description: 'Hero section with background video'
  },
  {
    id: 'features-grid',
    name: 'Features Grid',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'image'],
    description: '3-column features grid'
  },
  {
    id: 'testimonials-carousel',
    name: 'Testimonials Carousel',
    preview: '/api/placeholder/300/200',
    elements: ['testimonial'],
    description: 'Sliding testimonials'
  },
  {
    id: 'pricing-comparison',
    name: 'Pricing Comparison',
    preview: '/api/placeholder/300/200',
    elements: ['pricing'],
    description: 'Side-by-side pricing tables'
  },
  {
    id: 'contact-form',
    name: 'Contact Section',
    preview: '/api/placeholder/300/200',
    elements: ['heading', 'text', 'form', 'map'],
    description: 'Contact form with map'
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
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [pageSettings, setPageSettings] = useState({
    title: 'Untitled Page',
    description: '',
    favicon: '',
    customCSS: '',
    customJS: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      ogImage: ''
    }
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const addSection = useCallback(() => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      name: `Section ${sections.length + 1}`,
      elements: [],
      background: { type: 'color', value: '#ffffff' },
      padding: { top: 80, bottom: 80, left: 20, right: 20 },
      maxWidth: '1200px',
      isFullWidth: false
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
      settings: {},
      animation: {
        type: 'fadeIn',
        duration: 0.5,
        delay: 0
      }
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
      gallery: 'Image Gallery',
      accordion: 'Accordion Content',
      tabs: 'Tabbed Content',
      progress: 'Progress Bar',
      social: 'Social Media Feed',
      newsletter: 'Newsletter Signup',
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
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      },
      image: {
        borderRadius: '8px',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
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
      default: return 'max-w-full mx-auto';
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
        position: 'relative' as const,
        transform: element.styles.transform || 'none',
        opacity: element.styles.opacity || '1'
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
            <div className="space-y-4 p-6 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-lg">{element.content}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="p-3 border rounded" />
                <input type="text" placeholder="Last Name" className="p-3 border rounded" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full p-3 border rounded" />
              <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded" />
              <textarea placeholder="Message" rows={4} className="w-full p-3 border rounded resize-none" />
              <button className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition-colors">
                Submit
              </button>
            </div>
          </div>
        );
      case 'testimonial':
        return (
          <div {...commonProps}>
            <div className="p-6 bg-white rounded-lg shadow-lg border">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-gray-600 mb-4">{element.content}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-500">CEO, Company Inc.</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div {...commonProps}>
            <div className="p-6 border rounded-lg text-center bg-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">{element.content}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">$99<span className="text-lg text-gray-500">/mo</span></div>
              <ul className="text-sm space-y-2 mb-6">
                <li className="flex items-center justify-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Feature 1
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Feature 2
                </li>
                <li className="flex items-center justify-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Feature 3
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition-colors">
                Choose Plan
              </button>
            </div>
          </div>
        );
      case 'gallery':
        return (
          <div {...commonProps}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        );
      case 'divider':
        return <hr {...commonProps} className={`${commonProps.className} border-gray-300 my-8`} />;
      case 'spacer':
        return <div {...commonProps} style={{ ...commonProps.style, height: '50px' }} />;
      default:
        return <div {...commonProps}>{element.content}</div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Side - Preview */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              {!isPreviewMode && (
                <div className="flex items-center gap-1 bg-gray-100 rounded p-1 ml-2">
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

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">
                <Undo className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[50px] text-center">{zoom}%</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setZoom(100)}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
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
        <div className="flex-1 overflow-auto bg-gray-100 p-6 relative">
          {showGrid && !isPreviewMode && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }}
            />
          )}
          
          <div 
            className={`${getViewportClass()} relative`}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
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
                        : section.background.type === 'gradient'
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
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded z-10">
                        {section.name}
                      </div>
                    )}
                    
                    <div className="relative z-10" style={{ maxWidth: section.maxWidth, margin: '0 auto' }}>
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

      {/* Right Sidebar - Controls */}
      <div className="w-80 bg-white border-r flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Page Builder</h3>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
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
                          className="p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow text-center group"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify(item));
                            setDraggedElement(item);
                          }}
                          onClick={() => addElement(item.type)}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
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
                <Plus className="h-4 w-4 mr-2" />
                Add New Section
              </Button>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-3">Pre-built Sections</h4>
                <div className="space-y-2">
                  {prebuiltSections.map((section) => (
                    <div
                      key={section.id}
                      className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        toast.success(`Added ${section.name}`);
                      }}
                    >
                      <div className="font-medium text-sm">{section.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {section.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-3">Current Sections</h4>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div key={section.id} className="flex items-center gap-2 p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.name}</div>
                        <div className="text-xs text-gray-500">{section.elements.length} elements</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSections(prev => prev.filter(s => s.id !== section.id));
                          toast.success('Section deleted');
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="p-4 space-y-4">
              {selectedElement ? (
                <div>
                  <h4 className="font-medium mb-3">Element Design</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={selectedElement.content}
                        onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
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
                        <Label>Font Weight</Label>
                        <Select
                          value={selectedElement.styles.fontWeight || 'normal'}
                          onValueChange={(value) => updateElementStyle(selectedElement.id, 'fontWeight', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="lighter">Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
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
                    </div>

                    <div>
                      <Label>Text Alignment</Label>
                      <div className="flex gap-1 mt-1">
                        <Button
                          size="sm"
                          variant={selectedElement.styles.textAlign === 'left' ? 'default' : 'outline'}
                          onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'left')}
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedElement.styles.textAlign === 'center' ? 'default' : 'outline'}
                          onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'center')}
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedElement.styles.textAlign === 'right' ? 'default' : 'outline'}
                          onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'right')}
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Border Radius</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={selectedElement.styles.borderRadius?.replace('px', '') || '0'}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', `${e.target.value}px`)}
                        />
                      </div>

                      <div>
                        <Label>Opacity</Label>
                        <Input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedElement.styles.opacity || '1'}
                          onChange={(e) => updateElementStyle(selectedElement.id, 'opacity', e.target.value)}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateElement(selectedElement.id)}
                        className="flex-1"
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
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : selectedSection ? (
                <div>
                  <h4 className="font-medium mb-3">Section Design</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Section Name</Label>
                      <Input
                        value={sections.find(s => s.id === selectedSection)?.name || ''}
                        onChange={(e) => {
                          setSections(prev => prev.map(s => 
                            s.id === selectedSection ? { ...s, name: e.target.value } : s
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label>Background Type</Label>
                      <Select
                        value={sections.find(s => s.id === selectedSection)?.background.type || 'color'}
                        onValueChange={(value: any) => {
                          setSections(prev => prev.map(s => 
                            s.id === selectedSection 
                              ? { ...s, background: { ...s.background, type: value } }
                              : s
                          ));
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="color">Solid Color</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Background Value</Label>
                      <Input
                        type={sections.find(s => s.id === selectedSection)?.background.type === 'color' ? 'color' : 'text'}
                        value={sections.find(s => s.id === selectedSection)?.background.value || ''}
                        onChange={(e) => {
                          setSections(prev => prev.map(s => 
                            s.id === selectedSection 
                              ? { ...s, background: { ...s.background, value: e.target.value } }
                              : s
                          ));
                        }}
                      />
                    </div>

                    <div>
                      <Label>Padding</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Top"
                          type="number"
                          value={sections.find(s => s.id === selectedSection)?.padding.top || 0}
                          onChange={(e) => {
                            setSections(prev => prev.map(s => 
                              s.id === selectedSection 
                                ? { ...s, padding: { ...s.padding, top: parseInt(e.target.value) } }
                                : s
                            ));
                          }}
                        />
                        <Input
                          placeholder="Bottom"
                          type="number"
                          value={sections.find(s => s.id === selectedSection)?.padding.bottom || 0}
                          onChange={(e) => {
                            setSections(prev => prev.map(s => 
                              s.id === selectedSection 
                                ? { ...s, padding: { ...s.padding, bottom: parseInt(e.target.value) } }
                                : s
                            ));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select an element or section to edit its design</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-3">Page Settings</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input
                      value={pageSettings.title}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={pageSettings.description}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Show Grid</Label>
                    <Switch
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">SEO Settings</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Meta Title</Label>
                    <Input
                      value={pageSettings.seo.metaTitle}
                      onChange={(e) => setPageSettings(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaTitle: e.target.value } 
                      }))}
                    />
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={pageSettings.seo.metaDescription}
                      onChange={(e) => setPageSettings(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, metaDescription: e.target.value } 
                      }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Keywords</Label>
                    <Input
                      value={pageSettings.seo.keywords}
                      onChange={(e) => setPageSettings(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo, keywords: e.target.value } 
                      }))}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Custom Code</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Custom CSS</Label>
                    <Textarea
                      value={pageSettings.customCSS}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, customCSS: e.target.value }))}
                      rows={4}
                      placeholder="/* Your custom CSS here */"
                      className="font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label>Custom JavaScript</Label>
                    <Textarea
                      value={pageSettings.customJS}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, customJS: e.target.value }))}
                      rows={4}
                      placeholder="// Your custom JavaScript here"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
