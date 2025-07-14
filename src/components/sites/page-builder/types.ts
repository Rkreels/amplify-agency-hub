
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Element {
  id: string;
  type: 'text' | 'heading' | 'button' | 'image' | 'container' | 'form' | 'video' | 'divider' | 'spacer';
  position: Position;
  size: Size;
  styles: Record<string, any>;
  content: string;
  children?: string[];
  parent?: string;
  layerId?: string;
  locked?: boolean;
  hidden?: boolean;
  animation?: {
    type: string;
    duration: number;
    delay: number;
  };
  responsive?: {
    mobile: Partial<Element>;
    tablet: Partial<Element>;
  };
  // Additional properties for various element types
  src?: string; // for images
  alt?: string; // for images
  href?: string; // for links/buttons
  target?: string; // for links
  attributes?: Record<string, any>; // for custom attributes
  props?: Record<string, any>; // for component props
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
  zIndex: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  elements: Element[];
  thumbnail?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  elements: Element[];
  settings: {
    title: string;
    description: string;
    keywords: string;
  };
  isPublished: boolean;
}
