
import React from 'react';
import { Element } from './types';
import { 
  Play, 
  Quote, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  Phone, 
  Mail, 
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Share2,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Users,
  Target,
  Award,
  Zap,
  Heart,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Download,
  Search,
  Menu,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ElementRendererProps {
  element: Element;
  isSelected: boolean;
  onElementClick: (element: Element) => void;
}

export function ElementRenderer({ element, isSelected, onElementClick }: ElementRendererProps) {
  const baseStyles: React.CSSProperties = {
    position: (element.styles.position as React.CSSProperties['position']) || 'relative',
    fontSize: element.styles.fontSize,
    fontWeight: (element.styles.fontWeight as React.CSSProperties['fontWeight']),
    fontFamily: element.styles.fontFamily,
    fontStyle: (element.styles.fontStyle as React.CSSProperties['fontStyle']),
    color: element.styles.color,
    backgroundColor: element.styles.backgroundColor,
    backgroundImage: element.styles.backgroundImage,
    padding: element.styles.padding,
    margin: element.styles.margin,
    textAlign: (element.styles.textAlign as React.CSSProperties['textAlign']),
    borderRadius: element.styles.borderRadius,
    borderWidth: element.styles.borderWidth,
    borderColor: element.styles.borderColor,
    borderStyle: (element.styles.borderStyle as React.CSSProperties['borderStyle']),
    boxShadow: element.styles.boxShadow,
    width: element.styles.width,
    height: element.styles.height,
    minWidth: element.styles.minWidth,
    minHeight: element.styles.minHeight,
    maxWidth: element.styles.maxWidth,
    maxHeight: element.styles.maxHeight,
    top: element.styles.top,
    left: element.styles.left,
    right: element.styles.right,
    bottom: element.styles.bottom,
    zIndex: element.styles.zIndex,
    opacity: element.styles.opacity,
    transform: element.styles.transform,
    transition: element.styles.transition,
    cursor: (element.styles.cursor as React.CSSProperties['cursor']),
    overflow: (element.styles.overflow as React.CSSProperties['overflow']),
    display: (element.styles.display as React.CSSProperties['display']),
    flexDirection: (element.styles.flexDirection as React.CSSProperties['flexDirection']),
    flexWrap: (element.styles.flexWrap as React.CSSProperties['flexWrap']),
    justifyContent: (element.styles.justifyContent as React.CSSProperties['justifyContent']),
    alignItems: (element.styles.alignItems as React.CSSProperties['alignItems']),
    alignContent: (element.styles.alignContent as React.CSSProperties['alignContent']),
    gap: element.styles.gap,
    gridTemplateColumns: element.styles.gridTemplateColumns,
    gridTemplateRows: element.styles.gridTemplateRows,
    gridGap: element.styles.gridGap,
    animation: element.styles.animation,
    animationDuration: element.styles.animationDuration,
    animationDelay: element.styles.animationDelay,
    animationIterationCount: (element.styles.animationIterationCount as React.CSSProperties['animationIterationCount']),
    animationDirection: (element.styles.animationDirection as React.CSSProperties['animationDirection']),
    animationFillMode: (element.styles.animationFillMode as React.CSSProperties['animationFillMode']),
    animationPlayState: (element.styles.animationPlayState as React.CSSProperties['animationPlayState']),
    animationTimingFunction: (element.styles.animationTimingFunction as React.CSSProperties['animationTimingFunction']),
    lineHeight: element.styles.lineHeight,
    letterSpacing: element.styles.letterSpacing,
    textTransform: (element.styles.textTransform as React.CSSProperties['textTransform']),
    textDecoration: element.styles.textDecoration,
    objectFit: (element.styles.objectFit as React.CSSProperties['objectFit']),
    border: element.styles.border,
    borderLeft: element.styles.borderLeft,
    borderRight: element.styles.borderRight,
    borderTop: element.styles.borderTop,
    borderBottom: element.styles.borderBottom,
  };

  const wrapperStyles: React.CSSProperties = {
    outline: isSelected ? '2px solid #007bff' : 'none',
    outlineOffset: '2px',
    cursor: 'pointer',
  };

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementClick(element);
  };

  switch (element.type) {
    case 'text':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }} dangerouslySetInnerHTML={{ __html: element.content || '' }} />
        </div>
      );

    case 'button':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <button 
            style={{ ...baseStyles, border: 'none' }} 
            onClick={(e) => e.preventDefault()}
          >
            {element.content}
          </button>
        </div>
      );

    case 'image':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <img 
            src={element.src} 
            alt={element.alt || ''} 
            style={{ ...baseStyles }}
          />
        </div>
      );

    case 'video':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          {element.src ? (
            <iframe
              src={element.src}
              style={{ ...baseStyles }}
              allowFullScreen
            />
          ) : (
            <div style={{ ...baseStyles, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <Play size={48} />
            </div>
          )}
        </div>
      );

    case 'container':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            {element.children?.map(child => 
              <ElementRenderer 
                key={child.id} 
                element={child} 
                isSelected={false} 
                onElementClick={onElementClick} 
              />
            )}
          </div>
        </div>
      );

    case 'form':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <form style={{ ...baseStyles }} onClick={(e) => e.preventDefault()}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name</label>
              <input 
                type="text" 
                placeholder="Your Name" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '16px'
                }} 
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                placeholder="your@email.com" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '16px'
                }} 
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Message</label>
              <textarea 
                placeholder="Your message..." 
                rows={4}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '16px',
                  resize: 'vertical'
                }} 
              />
            </div>
            <button 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '12px 24px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      );

    case 'input':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <input 
            {...element.attributes}
            style={{ ...baseStyles }}
          />
        </div>
      );

    case 'divider':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <hr style={{ ...baseStyles, height: baseStyles.height || '1px', backgroundColor: baseStyles.backgroundColor || '#e9ecef', border: 'none' }} />
        </div>
      );

    case 'spacer':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }} />
        </div>
      );

    case 'testimonial':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            <Quote size={24} style={{ marginBottom: '15px', color: '#007bff' }} />
            <p style={{ fontStyle: 'italic', marginBottom: '20px', fontSize: '16px', lineHeight: '1.6' }}>
              "{element.content || 'This is a great product! I highly recommend it to everyone.'}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb', 
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={20} style={{ color: '#6b7280' }} />
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '2px' }}>John Doe</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>CEO, Company Inc.</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'pricing':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            <div style={{ 
              position: 'absolute', 
              top: '-10px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              POPULAR
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '700' }}>Pro Plan</h3>
            <div style={{ fontSize: '48px', fontWeight: '700', margin: '20px 0', color: '#007bff' }}>
              $49<span style={{ fontSize: '16px', fontWeight: '400', color: '#6b7280' }}>/month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0', textAlign: 'left' }}>
              <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: '#10b981', marginRight: '8px' }} />
                Everything in Basic
              </li>
              <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: '#10b981', marginRight: '8px' }} />
                Advanced Analytics
              </li>
              <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: '#10b981', marginRight: '8px' }} />
                Priority Support
              </li>
              <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: '#10b981', marginRight: '8px' }} />
                Custom Integrations
              </li>
            </ul>
            <button style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Get Started
            </button>
          </div>
        </div>
      );

    case 'countdown':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            <div style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '400' }}>
              Limited Time Offer
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              {['23', '14', '45', '12'].map((time, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                    padding: '15px', 
                    borderRadius: '8px',
                    fontSize: '32px',
                    fontWeight: '700',
                    minWidth: '60px'
                  }}>
                    {time}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '5px', opacity: '0.8' }}>
                    {['DAYS', 'HRS', 'MIN', 'SEC'][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'social':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <Share2 size={20} style={{ color: '#6b7280' }} />
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Share:</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <button
                    key={index}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <Icon size={18} style={{ color: '#6b7280' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'map':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <MapPin size={48} style={{ color: '#6b7280' }} />
              <span style={{ fontSize: '16px', color: '#6b7280' }}>Interactive Map</span>
            </div>
          </div>
        </div>
      );

    case 'icon':
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles }}>
            <Star size={48} />
          </div>
        </div>
      );

    default:
      const elementTypeString = String(element.type || 'Unknown');
      return (
        <div key={element.id} style={wrapperStyles} onClick={handleElementClick}>
          <div style={{ ...baseStyles, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '2px dashed #d1d5db' }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
                {elementTypeString.charAt(0).toUpperCase() + elementTypeString.slice(1)} Element
              </div>
              <div style={{ fontSize: '12px' }}>
                Click to configure
              </div>
            </div>
          </div>
        </div>
      );
  }
}
