
export interface Element {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'form' | 'heading' | 'video' | 'divider' | 'spacer' | 'icon' | 'testimonial' | 'pricing' | 'countdown' | 'social' | 'map' | 'input';
  content?: string;
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
  children?: Element[];
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
