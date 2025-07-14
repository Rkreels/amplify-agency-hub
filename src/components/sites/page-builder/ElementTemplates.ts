
import { Type, Image, Square, Button as ButtonIcon, Video, Minus, MoreHorizontal } from 'lucide-react';
import { Element } from './types';

export interface ElementTemplate {
  type: string;
  label: string;
  icon: any;
  template: Partial<Element>;
}

export const elementTemplates: ElementTemplate[] = [
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    template: {
      type: 'text',
      content: 'Your text here',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 40 },
      styles: {
        fontSize: '16px',
        color: '#000000',
        fontFamily: 'Arial, sans-serif'
      }
    }
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: Type,
    template: {
      type: 'heading',
      content: 'Your heading',
      position: { x: 0, y: 0 },
      size: { width: 300, height: 60 },
      styles: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#000000'
      }
    }
  },
  {
    type: 'button',
    label: 'Button',
    icon: ButtonIcon,
    template: {
      type: 'button',
      content: 'Click me',
      position: { x: 0, y: 0 },
      size: { width: 120, height: 40 },
      styles: {
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
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
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 200, height: 150 },
      src: 'https://via.placeholder.com/200x150',
      alt: 'Placeholder image',
      styles: {
        objectFit: 'cover'
      }
    }
  },
  {
    type: 'container',
    label: 'Container',
    icon: Square,
    template: {
      type: 'container',
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 400, height: 200 },
      children: [],
      styles: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '20px'
      }
    }
  },
  {
    type: 'video',
    label: 'Video',
    icon: Video,
    template: {
      type: 'video',
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 400, height: 225 },
      src: '',
      styles: {
        width: '100%',
        height: 'auto'
      }
    }
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: Minus,
    template: {
      type: 'divider',
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 1 },
      styles: {
        backgroundColor: '#dee2e6',
        height: '1px',
        border: 'none'
      }
    }
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: MoreHorizontal,
    template: {
      type: 'spacer',
      content: '',
      position: { x: 0, y: 0 },
      size: { width: 100, height: 50 },
      styles: {
        height: '50px'
      }
    }
  }
];
