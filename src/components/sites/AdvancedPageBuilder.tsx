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
import { Slider } from '@/components/ui/slider';
import { 
  Type, Image, Square, Circle, MousePointer, Palette, Save, Eye, 
  Smartphone, Tablet, Monitor, Undo, Redo, Copy, Trash2, Settings,
  Grid, Layout, Video, Calendar, ShoppingCart, MapPin, Star, Play,
  Download, Upload, AlignLeft, AlignCenter, AlignRight, Bold, Italic,
  Underline, List, Link, Code, Layers, Move, RotateCw, ZoomIn, ZoomOut,
  Maximize, Share, Mail, Plus, Globe, Zap, Target, Users, TrendingUp,
  FileText, Phone, MessageSquare, CreditCard, BarChart3, Megaphone,
  Clock, Award, Shield, CheckCircle, XCircle, AlertCircle, Info,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Menu, X, Home,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Search, Filter, SortAsc,
  SortDesc, RefreshCw, Edit, ExternalLink, LinkIcon, ImageIcon,
  PlusCircle, MinusCircle, MoreHorizontal, MoreVertical, Dots
} from 'lucide-react';
import { toast } from 'sonner';
import { useSitesStore } from '@/store/useSitesStore';

interface PageElement {
  id: string;
  type: 'heading' | 'text' | 'button' | 'image' | 'form' | 'video' | 'divider' | 'spacer' | 'testimonial' | 'pricing' | 'countdown' | 'map' | 'social' | 'newsletter' | 'gallery' | 'accordion' | 'tabs' | 'progress' | 'contact' | 'hero' | 'features' | 'cta' | 'team' | 'stats' | 'faq' | 'blog' | 'carousel' | 'timeline' | 'icon' | 'badge' | 'card' | 'list' | 'quote' | 'embed';
  content: string;
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
    border?: string;
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    minHeight?: string;
    boxShadow?: string;
    transform?: string;
    opacity?: string;
    zIndex?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    gridTemplateColumns?: string;
    gridGap?: string;
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    overflow?: string;
    textDecoration?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textTransform?: string;
    cursor?: string;
    transition?: string;
    hoverColor?: string;
    hoverBackgroundColor?: string;
    hoverTransform?: string;
    activeColor?: string;
    activeBackgroundColor?: string;
    focusColor?: string;
    focusBackgroundColor?: string;
    focusOutline?: string;
    animation?: string;
    animationDuration?: string;
    animationDelay?: string;
    animationIterationCount?: string;
    animationDirection?: string;
    animationFillMode?: string;
    animationPlayState?: string;
    animationTimingFunction?: string;
  };
  position: { x: number; y: number };
  size: { width: number; height: number };
  settings: {
    link?: string;
    linkTarget?: '_blank' | '_self';
    alt?: string;
    title?: string;
    placeholder?: string;
    required?: boolean;
    validation?: string;
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
    muted?: boolean;
    responsive?: boolean;
    lazy?: boolean;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
    };
    accessibility?: {
      ariaLabel?: string;
      ariaDescribedBy?: string;
      role?: string;
      tabIndex?: string;
    };
    interactions?: {
      onClick?: string;
      onHover?: string;
      onFocus?: string;
      onScroll?: string;
    };
    conditions?: {
      showIf?: string;
      hideIf?: string;
      device?: 'all' | 'desktop' | 'tablet' | 'mobile';
    };
  };
  animation?: {
    type: 'fadeIn' | 'slideIn' | 'zoomIn' | 'bounceIn' | 'rotateIn' | 'flipIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
    duration: number;
    delay: number;
    easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
    trigger?: 'onLoad' | 'onScroll' | 'onHover' | 'onClick';
    repeat?: boolean;
  };
  responsive?: {
    desktop?: Partial<PageElement['styles']>;
    tablet?: Partial<PageElement['styles']>;
    mobile?: Partial<PageElement['styles']>;
  };
}

interface PageSection {
  id: string;
  name: string;
  elements: PageElement[];
  background: {
    type: 'color' | 'gradient' | 'image' | 'video' | 'pattern';
    value: string;
    gradient?: {
      type: 'linear' | 'radial';
      direction?: string;
      stops: { color: string; position: number }[];
    };
    image?: {
      url: string;
      position: string;
      size: string;
      repeat: string;
      attachment: string;
    };
    video?: {
      url: string;
      autoplay: boolean;
      loop: boolean;
      muted: boolean;
    };
    overlay?: {
      color: string;
      opacity: number;
    };
  };
  padding: { top: number; bottom: number; left: number; right: number };
  margin: { top: number; bottom: number };
  maxWidth: string;
  isFullWidth: boolean;
  isSticky: boolean;
  isParallax: boolean;
  animation?: {
    type: string;
    duration: number;
    delay: number;
  };
  responsive?: {
    desktop?: Partial<PageSection>;
    tablet?: Partial<PageSection>;
    mobile?: Partial<PageSection>;
  };
  seo?: {
    id?: string;
    className?: string;
    schema?: Record<string, any>;
  };
}

interface Page {
  id: string;
  title: string;
  slug: string;
  sections: PageSection[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    canonicalUrl?: string;
    robots?: string;
    schema?: Record<string, any>;
  };
  settings: {
    layout: 'default' | 'fullwidth' | 'centered';
    header: boolean;
    footer: boolean;
    sidebar: boolean;
    customCSS: string;
    customJS: string;
    customHead: string;
    favicon?: string;
    language: string;
    direction: 'ltr' | 'rtl';
    theme: 'light' | 'dark' | 'auto';
  };
  isPublished: boolean;
  publishedAt?: Date;
  lastModified: Date;
  version: number;
  status: 'draft' | 'published' | 'archived';
  analytics?: {
    views: number;
    uniqueViews: number;
    bounceRate: number;
    avgTimeOnPage: number;
    conversions: number;
    conversionRate: number;
  };
}

export function AdvancedPageBuilder({ siteId }: { siteId: string }) {
  const { sites, updateSite } = useSitesStore();
  const site = sites.find(s => s.id === siteId);
  
  const [pages, setPages] = useState<Page[]>(site?.pages?.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    sections: [],
    seo: {
      title: p.title,
      description: '',
      keywords: '',
    },
    settings: {
      layout: 'default',
      header: true,
      footer: true,
      sidebar: false,
      customCSS: '',
      customJS: '',
      customHead: '',
      language: 'en',
      direction: 'ltr',
      theme: 'light',
    },
    isPublished: p.isPublished,
    lastModified: new Date(),
    version: 1,
    status: p.isPublished ? 'published' : 'draft',
  })) || []);

  const [currentPage, setCurrentPage] = useState<Page | null>(pages[0] || null);
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('elements');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Enhanced element types with more categories
  const elementTypes = [
    {
      category: 'Basic Elements',
      items: [
        { type: 'heading', label: 'Heading', icon: Type, description: 'Add titles and headings' },
        { type: 'text', label: 'Text', icon: FileText, description: 'Add paragraphs and content' },
        { type: 'button', label: 'Button', icon: MousePointer, description: 'Call-to-action buttons' },
        { type: 'image', label: 'Image', icon: ImageIcon, description: 'Add photos and graphics' },
        { type: 'icon', label: 'Icon', icon: Star, description: 'Add icons and symbols' },
        { type: 'divider', label: 'Divider', icon: Square, description: 'Section dividers' },
        { type: 'spacer', label: 'Spacer', icon: Circle, description: 'Add white space' }
      ]
    },
    {
      category: 'Layout Elements',
      items: [
        { type: 'hero', label: 'Hero Section', icon: Layout, description: 'Hero banners' },
        { type: 'features', label: 'Features', icon: Grid, description: 'Feature grids' },
        { type: 'cta', label: 'Call to Action', icon: Megaphone, description: 'CTA sections' },
        { type: 'card', label: 'Card', icon: Square, description: 'Content cards' },
        { type: 'list', label: 'List', icon: List, description: 'Ordered/unordered lists' }
      ]
    },
    {
      category: 'Media Elements',
      items: [
        { type: 'video', label: 'Video', icon: Video, description: 'Embed videos' },
        { type: 'gallery', label: 'Gallery', icon: Grid, description: 'Image galleries' },
        { type: 'carousel', label: 'Carousel', icon: ArrowRight, description: 'Image carousels' },
        { type: 'embed', label: 'Embed', icon: Code, description: 'Embed code' }
      ]
    },
    {
      category: 'Interactive Elements',
      items: [
        { type: 'form', label: 'Form', icon: Square, description: 'Lead capture forms' },
        { type: 'accordion', label: 'Accordion', icon: ChevronDown, description: 'Collapsible content' },
        { type: 'tabs', label: 'Tabs', icon: Layers, description: 'Tabbed content' },
        { type: 'progress', label: 'Progress Bar', icon: RotateCw, description: 'Progress indicators' },
        { type: 'countdown', label: 'Countdown', icon: Clock, description: 'Countdown timers' }
      ]
    },
    {
      category: 'Business Elements',
      items: [
        { type: 'testimonial', label: 'Testimonial', icon: Star, description: 'Customer reviews' },
        { type: 'pricing', label: 'Pricing Table', icon: CreditCard, description: 'Pricing plans' },
        { type: 'team', label: 'Team', icon: Users, description: 'Team member cards' },
        { type: 'stats', label: 'Stats', icon: BarChart3, description: 'Statistics display' },
        { type: 'contact', label: 'Contact', icon: Phone, description: 'Contact information' }
      ]
    },
    {
      category: 'Social Elements',
      items: [
        { type: 'social', label: 'Social Media', icon: Share, description: 'Social media feeds' },
        { type: 'newsletter', label: 'Newsletter', icon: Mail, description: 'Email signup forms' },
        { type: 'blog', label: 'Blog', icon: FileText, description: 'Blog post previews' },
        { type: 'timeline', label: 'Timeline', icon: Clock, description: 'Event timelines' }
      ]
    },
    {
      category: 'Advanced Elements',
      items: [
        { type: 'map', label: 'Map', icon: MapPin, description: 'Google Maps embed' },
        { type: 'faq', label: 'FAQ', icon: Info, description: 'Frequently asked questions' },
        { type: 'quote', label: 'Quote', icon: Quote, description: 'Blockquotes' },
        { type: 'badge', label: 'Badge', icon: Award, description: 'Status badges' }
      ]
    }
  ];

  const prebuiltSections = [
    {
      id: 'hero-modern',
      name: 'Modern Hero Section',
      category: 'Hero',
      elements: ['heading', 'text', 'button', 'image'],
      description: 'Clean, modern hero with image'
    },
    {
      id: 'hero-video',
      name: 'Video Hero Section',
      category: 'Hero',
      elements: ['heading', 'text', 'button', 'video'],
      description: 'Hero section with background video'
    },
    {
      id: 'features-grid',
      name: 'Features Grid',
      category: 'Features',
      elements: ['heading', 'text', 'icon'],
      description: '3-column features grid'
    },
    {
      id: 'testimonials-carousel',
      name: 'Testimonials Carousel',
      category: 'Social Proof',
      elements: ['testimonial'],
      description: 'Sliding testimonials'
    },
    {
      id: 'pricing-comparison',
      name: 'Pricing Comparison',
      category: 'Pricing',
      elements: ['pricing'],
      description: 'Side-by-side pricing tables'
    },
    {
      id: 'contact-form',
      name: 'Contact Section',
      category: 'Contact',
      elements: ['heading', 'text', 'form', 'map'],
      description: 'Contact form with map'
    },
    {
      id: 'team-grid',
      name: 'Team Grid',
      category: 'About',
      elements: ['heading', 'team'],
      description: 'Team member showcase'
    },
    {
      id: 'stats-counter',
      name: 'Stats Counter',
      category: 'Stats',
      elements: ['stats'],
      description: 'Animated statistics'
    },
    {
      id: 'faq-accordion',
      name: 'FAQ Accordion',
      category: 'FAQ',
      elements: ['heading', 'accordion'],
      description: 'Expandable FAQ section'
    },
    {
      id: 'newsletter-signup',
      name: 'Newsletter Signup',
      category: 'Lead Generation',
      elements: ['heading', 'text', 'newsletter'],
      description: 'Email capture form'
    }
  ];

  const templates = [
    {
      id: 'business-landing',
      name: 'Business Landing Page',
      category: 'Business',
      description: 'Professional business landing page',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      sections: ['hero-modern', 'features-grid', 'testimonials-carousel', 'contact-form']
    },
    {
      id: 'saas-product',
      name: 'SaaS Product Page',
      category: 'SaaS',
      description: 'Software product showcase',
      preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      sections: ['hero-video', 'features-grid', 'pricing-comparison', 'faq-accordion']
    },
    {
      id: 'agency-portfolio',
      name: 'Agency Portfolio',
      category: 'Agency',
      description: 'Creative agency portfolio',
      preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
      sections: ['hero-modern', 'team-grid', 'testimonials-carousel', 'contact-form']
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',
      category: 'E-commerce',
      description: 'Complete online store',
      preview: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
      sections: ['hero-modern', 'features-grid', 'testimonials-carousel', 'newsletter-signup']
    },
    {
      id: 'event-landing',
      name: 'Event Landing Page',
      category: 'Events',
      description: 'Event registration page',
      preview: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop',
      sections: ['hero-modern', 'stats-counter', 'contact-form', 'faq-accordion']
    },
    {
      id: 'nonprofit-donation',
      name: 'Nonprofit Donation',
      category: 'Nonprofit',
      description: 'Nonprofit donation page',
      preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      sections: ['hero-modern', 'stats-counter', 'testimonials-carousel', 'contact-form']
    }
  ];

  const addPage = useCallback(() => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: `Page ${pages.length + 1}`,
      slug: `/page-${pages.length + 1}`,
      sections: [],
      seo: {
        title: `Page ${pages.length + 1}`,
        description: '',
        keywords: '',
      },
      settings: {
        layout: 'default',
        header: true,
        footer: true,
        sidebar: false,
        customCSS: '',
        customJS: '',
        customHead: '',
        language: 'en',
        direction: 'ltr',
        theme: 'light',
      },
      isPublished: false,
      lastModified: new Date(),
      version: 1,
      status: 'draft',
    };
    
    setPages(prev => [...prev, newPage]);
    setCurrentPage(newPage);
    toast.success('New page created');
  }, [pages.length]);

  const duplicatePage = useCallback((pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const duplicatedPage: Page = {
      ...page,
      id: `page-${Date.now()}`,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      version: 1,
      lastModified: new Date(),
      status: 'draft',
      isPublished: false,
    };

    setPages(prev => [...prev, duplicatedPage]);
    toast.success('Page duplicated');
  }, [pages]);

  const deletePage = useCallback((pageId: string) => {
    if (pages.length <= 1) {
      toast.error('Cannot delete the last page');
      return;
    }

    setPages(prev => prev.filter(p => p.id !== pageId));
    if (currentPage?.id === pageId) {
      setCurrentPage(pages.find(p => p.id !== pageId) || null);
    }
    toast.success('Page deleted');
  }, [pages, currentPage]);

  const addSection = useCallback(() => {
    if (!currentPage) return;

    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      name: `Section ${currentPage.sections.length + 1}`,
      elements: [],
      background: { type: 'color', value: '#ffffff' },
      padding: { top: 80, bottom: 80, left: 20, right: 20 },
      margin: { top: 0, bottom: 0 },
      maxWidth: '1200px',
      isFullWidth: false,
      isSticky: false,
      isParallax: false,
    };
    
    const updatedPage = {
      ...currentPage,
      sections: [...currentPage.sections, newSection],
      lastModified: new Date(),
      version: currentPage.version + 1,
    };
    
    setCurrentPage(updatedPage);
    setPages(prev => prev.map(p => p.id === currentPage.id ? updatedPage : p));
    setSelectedSection(newSection.id);
    toast.success('Section added');
  }, [currentPage]);

  const publishPage = useCallback(() => {
    if (!currentPage) return;

    const publishedPage = {
      ...currentPage,
      isPublished: true,
      status: 'published' as const,
      publishedAt: new Date(),
      lastModified: new Date(),
      version: currentPage.version + 1,
    };

    setCurrentPage(publishedPage);
    setPages(prev => prev.map(p => p.id === currentPage.id ? publishedPage : p));
    
    // Update the site in the store
    if (site) {
      const updatedSite = {
        ...site,
        pages: site.pages.map(p => 
          p.id === currentPage.id 
            ? { ...p, isPublished: true, title: publishedPage.title, slug: publishedPage.slug }
            : p
        )
      };
      updateSite(site.id, updatedSite);
    }

    toast.success('Page published successfully');
  }, [currentPage, site, updateSite]);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm mx-auto';
      case 'tablet': return 'max-w-2xl mx-auto';
      default: return 'max-w-full mx-auto';
    }
  };

  const renderPreview = () => {
    if (!currentPage) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <Layout className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Page Selected</h3>
            <p className="text-gray-500 mb-4">Create or select a page to start building</p>
            <Button onClick={addPage}>Create New Page</Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`${getViewportClass()} relative bg-white shadow-lg min-h-screen`}
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
      >
        {currentPage.sections.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 m-8 rounded-lg">
            <div className="text-center">
              <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Add Your First Section</h3>
              <p className="text-gray-500 mb-4">Start building your page by adding sections</p>
              <Button onClick={addSection}>Add Section</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {currentPage.sections.map((section) => (
              <div
                key={section.id}
                className={`relative min-h-[200px] ${
                  selectedSection === section.id ? 'ring-2 ring-blue-500' : ''
                } ${section.isSticky ? 'sticky top-0' : ''}`}
                style={{
                  background: section.background.type === 'color' 
                    ? section.background.value 
                    : section.background.type === 'gradient'
                    ? section.background.value
                    : `url(${section.background.value})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: `${section.padding.top}px ${section.padding.right}px ${section.padding.bottom}px ${section.padding.left}px`,
                  marginTop: `${section.margin.top}px`,
                  marginBottom: `${section.margin.bottom}px`,
                }}
                onClick={() => setSelectedSection(section.id)}
              >
                {!isPreviewMode && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded z-10">
                    {section.name}
                  </div>
                )}
                
                <div 
                  className="relative z-10" 
                  style={{ 
                    maxWidth: section.isFullWidth ? '100%' : section.maxWidth, 
                    margin: '0 auto' 
                  }}
                >
                  {section.elements.length === 0 ? (
                    <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <p className="text-gray-500 mb-2">Drop elements here</p>
                        <Badge variant="outline">Empty Section</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {section.elements.map((element) => (
                        <div
                          key={element.id}
                          className={`cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all ${
                            selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                          } ${!isPreviewMode ? 'min-h-[40px]' : ''}`}
                          style={{
                            ...element.styles,
                            position: 'relative',
                            transform: element.styles.transform || 'none',
                            opacity: element.styles.opacity || '1'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            !isPreviewMode && setSelectedElement(element);
                          }}
                        >
                          {renderElement(element)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderElement = (element: PageElement) => {
    // Enhanced element rendering with more types
    switch (element.type) {
      case 'heading':
        return <h1 style={element.styles}>{element.content}</h1>;
      case 'text':
        return <p style={element.styles}>{element.content}</p>;
      case 'button':
        return (
          <button 
            style={element.styles}
            onClick={() => element.settings.link && window.open(element.settings.link, element.settings.linkTarget)}
          >
            {element.content}
          </button>
        );
      case 'image':
        return (
          <img 
            src={element.content} 
            alt={element.settings.alt || 'Page element'} 
            style={element.styles}
            className="max-w-full h-auto"
            loading={element.settings.lazy ? 'lazy' : 'eager'}
          />
        );
      case 'hero':
        return (
          <div className="text-center py-20" style={element.styles}>
            <h1 className="text-5xl font-bold mb-6">{element.content}</h1>
            <p className="text-xl text-gray-600 mb-8">Subtitle text here</p>
            <Button size="lg">Get Started</Button>
          </div>
        );
      case 'features':
        return (
          <div className="grid md:grid-cols-3 gap-8" style={element.styles}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
                <p className="text-gray-600">Description of feature {i}</p>
              </div>
            ))}
          </div>
        );
      case 'cta':
        return (
          <div className="text-center bg-blue-600 text-white py-16 rounded-lg" style={element.styles}>
            <h2 className="text-3xl font-bold mb-4">{element.content}</h2>
            <p className="text-xl mb-8">Ready to get started?</p>
            <Button size="lg" variant="secondary">Take Action Now</Button>
          </div>
        );
      case 'testimonial':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg" style={element.styles}>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-lg italic mb-6">"{element.content}"</p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="font-semibold">John Doe</div>
                <div className="text-gray-500">CEO, Company Inc.</div>
              </div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="bg-white p-8 border rounded-lg text-center shadow-lg" style={element.styles}>
            <h3 className="text-2xl font-bold mb-4">{element.content}</h3>
            <div className="text-5xl font-bold text-blue-600 mb-6">$99<span className="text-lg text-gray-500">/mo</span></div>
            <ul className="space-y-3 mb-8">
              {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, i) => (
                <li key={i} className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="w-full" size="lg">Choose Plan</Button>
          </div>
        );
      case 'team':
        return (
          <div className="grid md:grid-cols-3 gap-8" style={element.styles}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Team Member {i}</h3>
                <p className="text-gray-600 mb-4">Position Title</p>
                <div className="flex justify-center space-x-2">
                  <Button size="sm" variant="outline">LinkedIn</Button>
                  <Button size="sm" variant="outline">Twitter</Button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'stats':
        return (
          <div className="grid md:grid-cols-4 gap-8 text-center" style={element.styles}>
            {[
              { number: '10K+', label: 'Customers' },
              { number: '99%', label: 'Satisfaction' },
              { number: '50+', label: 'Countries' },
              { number: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        );
      case 'form':
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg" style={element.styles}>
            <h3 className="text-2xl font-bold mb-6">{element.content}</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              <Input type="email" placeholder="Email Address" />
              <Input type="tel" placeholder="Phone Number" />
              <Textarea placeholder="Message" rows={4} />
              <Button className="w-full" size="lg">Submit</Button>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-4" style={element.styles}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg">
                <div className="p-4 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Frequently Asked Question {i}?</h4>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'gallery':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={element.styles}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        );
      case 'video':
        return (
          <div className="aspect-video" style={element.styles}>
            <iframe 
              src={element.content} 
              className="w-full h-full rounded-lg" 
              frameBorder="0" 
              allowFullScreen
            />
          </div>
        );
      case 'divider':
        return <hr className="border-gray-300 my-8" style={element.styles} />;
      case 'spacer':
        return <div style={{ ...element.styles, height: '50px', backgroundColor: 'transparent' }} />;
      default:
        return <div style={element.styles}>{element.content}</div>;
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
      <div className="w-80 bg-white border-l flex flex-col overflow-hidden">
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
