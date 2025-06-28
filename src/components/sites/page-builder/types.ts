
export interface Element {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'form' | 'heading' | 'video' | 'divider' | 'spacer' | 'icon' | 'testimonial' | 'pricing' | 'countdown' | 'social' | 'map' | 'input';
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  target?: '_blank' | '_self';
  styles?: {
    [key: string]: string;
  };
  props?: {
    [key: string]: any;
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    src?: string;
    alt?: string;
    href?: string;
    target?: '_blank' | '_self';
    placeholder?: string;
    required?: boolean;
    type?: string;
  };
  attributes?: {
    [key: string]: any;
    type?: string;
    placeholder?: string;
    name?: string;
    required?: boolean;
  };
  children?: Element[];
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

export interface ElementTemplate {
  type: string;
  label: string;
  icon: any;
  template: Element;
}

export interface PageBuilderState {
  elements: Element[];
  selectedElement: Element | null;
  history: Element[][];
  historyIndex: number;
  zoom: number;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  previewMode: boolean;
  gridEnabled: boolean;
  snapToGrid: boolean;
}
