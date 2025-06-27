
import { Type, Image, Square, Layout, MoreHorizontal } from 'lucide-react';
import { ElementTemplate } from './types';

export const elementTemplates: ElementTemplate[] = [
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
      }
    }
  },
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
      }
    }
  },
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
      }
    }
  },
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
      }
    }
  },
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
      }
    }
  }
];
