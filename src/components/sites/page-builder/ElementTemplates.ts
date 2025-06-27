
import { 
  Type, 
  Image, 
  Square, 
  Layout, 
  MoreHorizontal, 
  FileText, 
  Play, 
  Quote, 
  DollarSign, 
  Clock, 
  Share2, 
  MapPin, 
  Star, 
  Grid, 
  Columns, 
  Rows,
  Menu,
  Calendar,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  ArrowRight,
  Download,
  Upload,
  Zap,
  Heart,
  MessageCircle,
  ThumbsUp,
  Bookmark,
  Search,
  ShoppingCart,
  CreditCard,
  Gift,
  Trophy,
  Target,
  TrendingUp,
  Users,
  Building,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { ElementTemplate } from './types';

export const elementTemplates: ElementTemplate[] = [
  // Basic Elements
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'Your text here',
      styles: {
        fontSize: '16px',
        fontWeight: '400',
        color: '#333333',
        textAlign: 'left' as const,
        padding: '10px',
        lineHeight: '1.5',
      }
    }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Type,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'Your Heading',
      styles: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center' as const,
        padding: '20px 10px',
        lineHeight: '1.2',
      }
    }
  },
  {
    type: 'paragraph',
    label: 'Paragraph',
    icon: FileText,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'This is a paragraph of text. You can customize the content, styling, and layout to match your design needs.',
      styles: {
        fontSize: '16px',
        fontWeight: '400',
        color: '#666666',
        textAlign: 'left' as const,
        padding: '15px',
        lineHeight: '1.6',
        maxWidth: '600px',
      }
    }
  },

  // Interactive Elements
  {
    type: 'button',
    label: 'Button',
    icon: Square,
    template: {
      id: `element-${Date.now()}`,
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
        transition: 'all 0.3s ease',
      }
    }
  },
  {
    type: 'cta-button',
    label: 'CTA Button',
    icon: ArrowRight,
    template: {
      id: `element-${Date.now()}`,
      type: 'button' as const,
      content: 'Get Started Now →',
      href: '#',
      styles: {
        backgroundColor: '#ff6b35',
        color: '#ffffff',
        padding: '16px 32px',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: '700',
        textAlign: 'center' as const,
        cursor: 'pointer',
        border: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
      }
    }
  },

  // Media Elements
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    template: {
      id: `element-${Date.now()}`,
      type: 'image' as const,
      src: 'https://via.placeholder.com/400x300',
      alt: 'Placeholder Image',
      styles: {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        borderRadius: '8px',
        objectFit: 'cover',
      }
    }
  },
  {
    type: 'video',
    label: 'Video',
    icon: Play,
    template: {
      id: `element-${Date.now()}`,
      type: 'video' as const,
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      styles: {
        width: '100%',
        maxWidth: '560px',
        height: '315px',
        borderRadius: '8px',
        border: 'none',
      }
    }
  },

  // Layout Elements
  {
    type: 'container',
    label: 'Container',
    icon: Layout,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        minHeight: '100px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '10px',
      }
    }
  },
  {
    type: 'section',
    label: 'Section',
    icon: Grid,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        padding: '60px 20px',
        backgroundColor: '#ffffff',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }
    }
  },
  {
    type: 'columns',
    label: 'Columns',
    icon: Columns,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        padding: '20px',
      }
    }
  },

  // Form Elements
  {
    type: 'form',
    label: 'Form',
    icon: FileText,
    template: {
      id: `element-${Date.now()}`,
      type: 'form' as const,
      styles: {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
      }
    }
  },
  {
    type: 'input',
    label: 'Input Field',
    icon: Type,
    template: {
      id: `element-${Date.now()}`,
      type: 'input' as const,
      attributes: {
        type: 'text',
        placeholder: 'Enter your text...',
        name: 'text-input',
      },
      styles: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '16px',
        backgroundColor: '#ffffff',
      }
    }
  },

  // Social Elements
  {
    type: 'social-share',
    label: 'Social Share',
    icon: Share2,
    template: {
      id: `element-${Date.now()}`,
      type: 'social' as const,
      styles: {
        display: 'flex',
        gap: '10px',
        padding: '20px',
        justifyContent: 'center',
        alignItems: 'center',
      }
    }
  },
  {
    type: 'social-proof',
    label: 'Social Proof',
    icon: Users,
    template: {
      id: `element-${Date.now()}`,
      type: 'testimonial' as const,
      content: 'Join 10,000+ satisfied customers who trust our service',
      styles: {
        padding: '20px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        textAlign: 'center' as const,
        fontSize: '18px',
        fontWeight: '600',
        color: '#0369a1',
      }
    }
  },

  // Business Elements
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: Quote,
    template: {
      id: `element-${Date.now()}`,
      type: 'testimonial' as const,
      content: 'This is an amazing product! It has transformed our business and exceeded all our expectations.',
      styles: {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderLeft: '4px solid #007bff',
        fontStyle: 'italic',
        fontSize: '16px',
        lineHeight: '1.6',
      }
    }
  },
  {
    type: 'pricing-card',
    label: 'Pricing Card',
    icon: DollarSign,
    template: {
      id: `element-${Date.now()}`,
      type: 'pricing' as const,
      styles: {
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '40px 30px',
        textAlign: 'center' as const,
        backgroundColor: '#ffffff',
        maxWidth: '320px',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  {
    type: 'feature-list',
    label: 'Feature List',
    icon: CheckCircle,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
      }
    }
  },

  // Navigation Elements
  {
    type: 'navbar',
    label: 'Navigation Bar',
    icon: Menu,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: '0',
        zIndex: '100',
      }
    }
  },
  {
    type: 'breadcrumb',
    label: 'Breadcrumb',
    icon: ArrowRight,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'Home > Products > Category > Item',
      styles: {
        fontSize: '14px',
        color: '#6b7280',
        padding: '10px 0',
      }
    }
  },

  // E-commerce Elements
  {
    type: 'product-card',
    label: 'Product Card',
    icon: ShoppingCart,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#ffffff',
        maxWidth: '280px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  {
    type: 'add-to-cart',
    label: 'Add to Cart',
    icon: ShoppingCart,
    template: {
      id: `element-${Date.now()}`,
      type: 'button' as const,
      content: 'Add to Cart',
      href: '#',
      styles: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        textAlign: 'center' as const,
        cursor: 'pointer',
        border: 'none',
        width: '100%',
      }
    }
  },

  // Utility Elements
  {
    type: 'divider',
    label: 'Divider',
    icon: MoreHorizontal,
    template: {
      id: `element-${Date.now()}`,
      type: 'divider' as const,
      styles: {
        height: '1px',
        backgroundColor: '#e9ecef',
        margin: '20px 0',
        width: '100%',
        border: 'none',
      }
    }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: MoreHorizontal,
    template: {
      id: `element-${Date.now()}`,
      type: 'spacer' as const,
      styles: {
        height: '40px',
        width: '100%',
      }
    }
  },

  // Advanced Elements
  {
    type: 'countdown',
    label: 'Countdown Timer',
    icon: Clock,
    template: {
      id: `element-${Date.now()}`,
      type: 'countdown' as const,
      styles: {
        padding: '30px',
        backgroundColor: '#1f2937',
        color: '#ffffff',
        borderRadius: '8px',
        textAlign: 'center' as const,
        fontSize: '24px',
        fontWeight: '700',
      }
    }
  },
  {
    type: 'map',
    label: 'Map',
    icon: MapPin,
    template: {
      id: `element-${Date.now()}`,
      type: 'map' as const,
      styles: {
        width: '100%',
        height: '300px',
        borderRadius: '8px',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
      }
    }
  },
  {
    type: 'icon',
    label: 'Icon',
    icon: Star,
    template: {
      id: `element-${Date.now()}`,
      type: 'icon' as const,
      styles: {
        fontSize: '48px',
        color: '#007bff',
        textAlign: 'center' as const,
        padding: '20px',
      }
    }
  },

  // Alert Elements
  {
    type: 'alert-success',
    label: 'Success Alert',
    icon: CheckCircle,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'Success! Your action was completed successfully.',
      styles: {
        padding: '12px 16px',
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderRadius: '6px',
        border: '1px solid #a7f3d0',
        fontSize: '14px',
      }
    }
  },
  {
    type: 'alert-warning',
    label: 'Warning Alert',
    icon: AlertCircle,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'Warning! Please review the information before proceeding.',
      styles: {
        padding: '12px 16px',
        backgroundColor: '#fef3c7',
        color: '#92400e',
        borderRadius: '6px',
        border: '1px solid #fcd34d',
        fontSize: '14px',
      }
    }
  },
  {
    type: 'alert-error',
    label: 'Error Alert',
    icon: X,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: 'Error! Something went wrong. Please try again.',
      styles: {
        padding: '12px 16px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderRadius: '6px',
        border: '1px solid #fca5a5',
        fontSize: '14px',
      }
    }
  },

  // Contact Elements
  {
    type: 'contact-info',
    label: 'Contact Info',
    icon: Phone,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        padding: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  {
    type: 'email-link',
    label: 'Email Link',
    icon: Mail,
    template: {
      id: `element-${Date.now()}`,
      type: 'button' as const,
      content: 'Contact Us',
      href: 'mailto:hello@example.com',
      styles: {
        backgroundColor: 'transparent',
        color: '#007bff',
        padding: '8px 16px',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '500',
        textDecoration: 'underline',
        border: 'none',
        cursor: 'pointer',
      }
    }
  },

  // Stats Elements
  {
    type: 'stat-counter',
    label: 'Stat Counter',
    icon: TrendingUp,
    template: {
      id: `element-${Date.now()}`,
      type: 'text' as const,
      content: '1,000+',
      styles: {
        fontSize: '48px',
        fontWeight: '700',
        color: '#007bff',
        textAlign: 'center' as const,
        padding: '20px',
        lineHeight: '1',
      }
    }
  },
  {
    type: 'progress-bar',
    label: 'Progress Bar',
    icon: TrendingUp,
    template: {
      id: `element-${Date.now()}`,
      type: 'container' as const,
      children: [],
      styles: {
        width: '100%',
        height: '20px',
        backgroundColor: '#e5e7eb',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
      }
    }
  },
];
