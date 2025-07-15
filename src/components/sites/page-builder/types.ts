
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
  type: 'text' | 'heading' | 'button' | 'image' | 'container' | 'form' | 'video' | 'divider' | 'spacer' | 'columns' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'gallery' | 'slider' | 'audio' | 'map' | 'testimonial' | 'pricing' | 'team' | 'countdown' | 'progress' | 'social' | 'contact' | 'calendar' | 'chat';
  position: Position;
  size: Size;
  styles: Record<string, any>;
  content: string;
  children?: Element[];
  parent?: string;
  layerId?: string;
  locked?: boolean;
  hidden?: boolean;
  animation?: {
    type: string;
    duration: number;
    delay: number;
    easing?: string;
    loop?: boolean;
  };
  responsive?: {
    mobile: Partial<Element>;
    tablet: Partial<Element>;
  };
  interactions?: {
    hover?: Record<string, any>;
    click?: {
      action: 'scroll' | 'popup' | 'redirect' | 'toggle';
      target?: string;
      url?: string;
    };
  };
  // Additional properties for various element types
  src?: string; // for images, videos, audio
  alt?: string; // for images
  href?: string; // for links/buttons
  target?: string; // for links
  attributes?: Record<string, any>; // for custom attributes
  props?: Record<string, any>; // for component props
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  dataBinding?: {
    source: string;
    field: string;
    format?: string;
  };
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
  zIndex: number;
  opacity?: number;
  blendMode?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  elements: Element[];
  thumbnail?: string;
  preview?: string;
  tags?: string[];
  premium?: boolean;
  responsive?: boolean;
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
    customCSS?: string;
    customJS?: string;
    favicon?: string;
    ogImage?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    backgroundColor?: string;
    backgroundImage?: string;
    fontFamily?: string;
  };
  isPublished: boolean;
  responsive?: {
    mobile: {
      elements: Partial<Element>[];
      settings: Partial<Page['settings']>;
    };
    tablet: {
      elements: Partial<Element>[];
      settings: Partial<Page['settings']>;
    };
  };
  analytics?: {
    trackingId?: string;
    pixelId?: string;
    customEvents?: Array<{
      name: string;
      trigger: string;
      properties?: Record<string, any>;
    }>;
  };
  seo?: {
    structuredData?: Record<string, any>;
    openGraph?: {
      title?: string;
      description?: string;
      image?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      image?: string;
    };
  };
}

export interface ElementTemplate {
  type: string;
  label: string;
  icon: any;
  template: Partial<Element>;
  category?: string;
  description?: string;
  premium?: boolean;
}

export interface PageBuilderState {
  pages: Page[];
  currentPageId: string;
  selectedElement: Element | null;
  hoveredElement: Element | null;
  clipboardElement: Element | null;
  history: Element[][];
  historyIndex: number;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  zoomLevel: number;
  isPreviewMode: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'time' | 'url';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    customMessage?: string;
  };
  options?: Array<{
    value: string;
    label: string;
  }>;
  conditionalLogic?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
    action: 'show' | 'hide' | 'require';
  }[];
}

export interface ElementEvent {
  type: 'click' | 'hover' | 'focus' | 'scroll' | 'load';
  action: 'animation' | 'redirect' | 'popup' | 'form_submit' | 'scroll_to' | 'toggle_visibility' | 'custom_js';
  parameters?: Record<string, any>;
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: Date;
  tags?: string[];
  alt?: string;
  caption?: string;
}
