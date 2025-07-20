
import { 
  Type, 
  Heading1, 
  MousePointer, 
  Image, 
  Square, 
  FileText, 
  Video, 
  Minus,
  ArrowUp,
  Columns,
  Mail,
  MessageSquare,
  CheckSquare,
  Circle,
  Camera,
  BarChart3,
  Users,
  Clock,
  TrendingUp,
  Share2,
  Phone,
  Calendar,
  Mic,
  Navigation,
  Menu,
  MapPin
} from 'lucide-react';
import { ElementTemplate } from './types';

export const elementTemplates: ElementTemplate[] = [
  // Basic Elements
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    template: {
      type: 'text',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 40 },
      content: 'Your text here',
      styles: {
        fontSize: '16px',
        color: '#333333',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.5'
      }
    }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading1,
    template: {
      type: 'heading',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 60 },
      content: 'Your Heading',
      styles: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#222222',
        headingLevel: 'h2'
      }
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    template: {
      type: 'button',
      position: { x: 50, y: 50 },
      size: { width: 150, height: 50 },
      content: 'Click Me',
      href: '#',
      styles: {
        backgroundColor: '#3B82F6',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
      }
    }
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    template: {
      type: 'image',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 200 },
      src: 'https://via.placeholder.com/300x200',
      alt: 'Placeholder image',
      styles: {
        borderRadius: '8px',
        objectFit: 'cover'
      }
    }
  },

  // Layout Elements
  {
    type: 'container',
    label: 'Container',
    icon: Square,
    template: {
      type: 'container',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 300 },
      content: '',
      children: [],
      styles: {
        backgroundColor: '#F9FAFB',
        border: '2px dashed #D1D5DB',
        borderRadius: '8px',
        padding: '20px'
      }
    }
  },
  {
    type: 'columns',
    label: 'Columns',
    icon: Columns,
    template: {
      type: 'columns',
      position: { x: 50, y: 50 },
      size: { width: 600, height: 200 },
      content: '',
      styles: {
        display: 'flex',
        gap: '20px'
      }
    }
  },

  // Form Elements
  {
    type: 'input',
    label: 'Input',
    icon: FileText,
    template: {
      type: 'input',
      position: { x: 50, y: 50 },
      size: { width: 250, height: 40 },
      content: 'Enter text...',
      styles: {
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '16px'
      }
    }
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: MessageSquare,
    template: {
      type: 'textarea',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 120 },
      content: 'Enter your message...',
      styles: {
        border: '1px solid #D1D5DB',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '16px',
        resize: 'vertical'
      }
    }
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: CheckSquare,
    template: {
      type: 'checkbox',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 30 },
      content: 'Check this option',
      styles: {}
    }
  },

  // Media Elements
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    template: {
      type: 'video',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 225 },
      src: '',
      styles: {
        borderRadius: '8px'
      }
    }
  },
  {
    type: 'audio',
    label: 'Audio',
    icon: Mic,
    template: {
      type: 'audio',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 50 },
      src: '',
      styles: {}
    }
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: Camera,
    template: {
      type: 'gallery',
      position: { x: 50, y: 50 },
      size: { width: 500, height: 300 },
      content: '',
      styles: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px'
      }
    }
  },

  // Special Elements
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    template: {
      type: 'divider',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 2 },
      content: '',
      styles: {
        backgroundColor: '#E5E7EB',
        height: '2px'
      }
    }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: ArrowUp,
    template: {
      type: 'spacer',
      position: { x: 50, y: 50 },
      size: { width: 100, height: 50 },
      content: '',
      styles: {
        backgroundColor: 'transparent'
      }
    }
  },

  // Business Elements
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: MessageSquare,
    template: {
      type: 'testimonial',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 200 },
      content: '"This is an amazing testimonial from a satisfied customer."',
      styles: {
        backgroundColor: '#F9FAFB',
        padding: '20px',
        borderRadius: '12px',
        fontStyle: 'italic'
      }
    }
  },
  {
    type: 'pricing',
    label: 'Pricing',
    icon: TrendingUp,
    template: {
      type: 'pricing',
      position: { x: 50, y: 50 },
      size: { width: 300, height: 400 },
      content: 'Pricing Card',
      styles: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '24px'
      }
    }
  },
  {
    type: 'team',
    label: 'Team',
    icon: Users,
    template: {
      type: 'team',
      position: { x: 50, y: 50 },
      size: { width: 250, height: 300 },
      content: 'Team Member',
      styles: {
        textAlign: 'center',
        padding: '20px'
      }
    }
  },
  {
    type: 'countdown',
    label: 'Countdown',
    icon: Clock,
    template: {
      type: 'countdown',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 100 },
      content: '00:00:00',
      styles: {
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#EF4444'
      }
    }
  },

  // Navigation Elements
  {
    type: 'navbar',
    label: 'Navbar',
    icon: Navigation,
    template: {
      type: 'navbar',
      position: { x: 0, y: 0 },
      size: { width: 800, height: 80 },
      content: 'Navigation',
      styles: {
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px'
      }
    }
  },
  {
    type: 'menu',
    label: 'Menu',
    icon: Menu,
    template: {
      type: 'menu',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 300 },
      content: 'Menu',
      styles: {
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '8px'
      }
    }
  },

  // Integration Elements
  {
    type: 'map',
    label: 'Map',
    icon: MapPin,
    template: {
      type: 'map',
      position: { x: 50, y: 50 },
      size: { width: 400, height: 300 },
      content: 'Interactive Map',
      styles: {
        backgroundColor: '#E5E7EB',
        borderRadius: '8px'
      }
    }
  },
  {
    type: 'contact',
    label: 'Contact Form',
    icon: Mail,
    template: {
      type: 'contact',
      position: { x: 50, y: 50 },
      size: { width: 350, height: 400 },
      content: 'Contact Form',
      styles: {
        backgroundColor: '#F9FAFB',
        padding: '20px',
        borderRadius: '8px'
      }
    }
  },
  {
    type: 'social',
    label: 'Social Links',
    icon: Share2,
    template: {
      type: 'social',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      content: 'Social Links',
      styles: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }
    }
  }
];
