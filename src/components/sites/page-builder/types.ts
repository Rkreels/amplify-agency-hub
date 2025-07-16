
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
  type: 'text' | 'heading' | 'button' | 'image' | 'container' | 'form' | 'video' | 'divider' | 'spacer' | 'columns' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'gallery' | 'slider' | 'audio' | 'map' | 'testimonial' | 'pricing' | 'team' | 'countdown' | 'progress' | 'social' | 'contact' | 'calendar' | 'chat' | 'navbar' | 'menu' | 'breadcrumb' | 'link' | 'icon';
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
  src?: string;
  alt?: string;
  href?: string;
  target?: string;
  attributes?: Record<string, any>;
  props?: Record<string, any>;
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

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  isPremium: boolean;
  elements: Element[];
  preview: {
    desktop: string;
    mobile: string;
  };
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
}
