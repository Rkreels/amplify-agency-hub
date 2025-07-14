
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
