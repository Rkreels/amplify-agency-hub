
export interface Element {
  id: string;
  type: 'text' | 'image' | 'button' | 'container' | 'form' | 'video' | 'divider' | 'spacer' | 'icon' | 'testimonial' | 'pricing' | 'countdown' | 'social' | 'map';
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  target?: '_blank' | '_self';
  children?: Element[];
  styles: {
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundGradient?: string;
    padding?: string;
    margin?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    boxShadow?: string;
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    zIndex?: string;
    opacity?: string;
    transform?: string;
    transition?: string;
    cursor?: string;
    overflow?: string;
    display?: string;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;
    gap?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
    gridGap?: string;
    animation?: string;
    animationDuration?: string;
    animationDelay?: string;
    animationIterationCount?: string;
    animationDirection?: string;
    animationFillMode?: string;
    animationPlayState?: string;
    animationTimingFunction?: string;
  };
  attributes?: { [key: string]: string };
  responsive?: {
    mobile?: Partial<Element['styles']>;
    tablet?: Partial<Element['styles']>;
    desktop?: Partial<Element['styles']>;
  };
  interactions?: {
    onClick?: string;
    onHover?: string;
    onFocus?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    alt?: string;
  };
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
    favicon?: string;
    customCSS?: string;
    customJS?: string;
    headerCode?: string;
    footerCode?: string;
  };
  isPublished: boolean;
}

export interface ElementTemplate {
  type: string;
  label: string;
  icon: any;
  template: Partial<Element>;
}
