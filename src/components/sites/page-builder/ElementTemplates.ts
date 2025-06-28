
import { 
  Type, 
  Image, 
  MousePointer, 
  Square, 
  FileText, 
  Heading, 
  Video, 
  Minus, 
  Space, 
  Star, 
  CreditCard, 
  Timer, 
  Share2, 
  MapPin, 
  TextCursor 
} from 'lucide-react';
import { ElementTemplate } from './types';

export const elementTemplates: ElementTemplate[] = [
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    template: {
      id: '',
      type: 'text',
      content: 'This is a sample text. Click to edit.',
      styles: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333333',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'left',
        padding: '10px',
        margin: '10px 0'
      }
    }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Heading,
    template: {
      id: '',
      type: 'heading',
      content: 'Your Heading Here',
      props: { level: 'h2' },
      styles: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        margin: '20px 0',
        fontFamily: 'Arial, sans-serif'
      }
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: MousePointer,
    template: {
      id: '',
      type: 'button',
      content: 'Click Me',
      href: '#',
      target: '_self',
      styles: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        textAlign: 'center',
        display: 'inline-block',
        textDecoration: 'none',
        transition: 'all 0.3s ease'
      }
    }
  },
  {
    type: 'image',
    label: 'Image',
    icon: Image,
    template: {
      id: '',
      type: 'image',
      src: 'https://via.placeholder.com/400x300',
      alt: 'Placeholder image',
      styles: {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        borderRadius: '8px',
        margin: '10px 0'
      }
    }
  },
  {
    type: 'container',
    label: 'Container',
    icon: Square,
    template: {
      id: '',
      type: 'container',
      children: [],
      styles: {
        padding: '20px',
        margin: '10px 0',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        minHeight: '100px'
      }
    }
  },
  {
    type: 'form',
    label: 'Form',
    icon: FileText,
    template: {
      id: '',
      type: 'form',
      children: [],
      styles: {
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        margin: '10px 0'
      }
    }
  },
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    template: {
      id: '',
      type: 'video',
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      styles: {
        width: '100%',
        height: '315px',
        border: 'none',
        borderRadius: '8px',
        margin: '10px 0'
      }
    }
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    template: {
      id: '',
      type: 'divider',
      styles: {
        width: '100%',
        height: '1px',
        backgroundColor: '#e9ecef',
        border: 'none',
        margin: '20px 0'
      }
    }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: Space,
    template: {
      id: '',
      type: 'spacer',
      styles: {
        width: '100%',
        height: '40px',
        backgroundColor: 'transparent'
      }
    }
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: Star,
    template: {
      id: '',
      type: 'testimonial',
      content: '"This is an amazing service! Highly recommended."',
      styles: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderLeft: '4px solid #007bff',
        fontStyle: 'italic',
        margin: '20px 0'
      }
    }
  },
  {
    type: 'pricing',
    label: 'Pricing',
    icon: CreditCard,
    template: {
      id: '',
      type: 'pricing',
      content: '$99/month',
      styles: {
        padding: '30px',
        backgroundColor: 'white',
        border: '2px solid #007bff',
        borderRadius: '12px',
        textAlign: 'center',
        margin: '20px 0'
      }
    }
  },
  {
    type: 'countdown',
    label: 'Countdown',
    icon: Timer,
    template: {
      id: '',
      type: 'countdown',
      content: '24:00:00',
      styles: {
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#dc3545',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '20px 0'
      }
    }
  },
  {
    type: 'social',
    label: 'Social',
    icon: Share2,
    template: {
      id: '',
      type: 'social',
      styles: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        padding: '20px',
        margin: '20px 0'
      }
    }
  },
  {
    type: 'map',
    label: 'Map',
    icon: MapPin,
    template: {
      id: '',
      type: 'map',
      src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1!2d-74.0!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzAwLjAiTiA3NMKwMDAnMDAuMCJX!5e0!3m2!1sen!2sus!4v1234567890',
      styles: {
        width: '100%',
        height: '300px',
        border: 'none',
        borderRadius: '8px',
        margin: '20px 0'
      }
    }
  },
  {
    type: 'input',
    label: 'Input',
    icon: TextCursor,
    template: {
      id: '',
      type: 'input',
      attributes: {
        type: 'text',
        placeholder: 'Enter your text here...',
        name: 'input-field',
        required: false
      },
      styles: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '16px',
        margin: '10px 0'
      }
    }
  }
];
