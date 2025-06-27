
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Type, 
  Image, 
  Square, 
  Play, 
  FileText, 
  Mail, 
  Star, 
  DollarSign, 
  Clock, 
  Share2, 
  Map, 
  Grid, 
  Columns, 
  LayoutGrid,
  Zap,
  Target,
  Users,
  TrendingUp,
  ShoppingCart,
  Calendar,
  Phone,
  MessageSquare,
  Award,
  Heart,
  ThumbsUp,
  Quote,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Element } from './types';

interface EnhancedElementTemplatesProps {
  onAddElement: (template: Partial<Element>) => void;
}

const templateCategories = [
  {
    name: 'Basic Elements',
    icon: Square,
    templates: [
      {
        type: 'text',
        label: 'Text',
        icon: Type,
        template: {
          content: 'Your text here',
          styles: {
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#333333'
          }
        }
      },
      {
        type: 'button',
        label: 'Button',
        icon: Square,
        template: {
          content: 'Click Me',
          styles: {
            backgroundColor: '#007bff',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none'
          }
        }
      },
      {
        type: 'image',
        label: 'Image',
        icon: Image,
        template: {
          src: '/api/placeholder/400/300',
          alt: 'Placeholder image',
          styles: {
            width: '100%',
            height: 'auto',
            borderRadius: '8px'
          }
        }
      },
      {
        type: 'divider',
        label: 'Divider',
        icon: Square,
        template: {
          styles: {
            width: '100%',
            height: '1px',
            backgroundColor: '#e5e7eb',
            margin: '20px 0'
          }
        }
      }
    ]
  },
  {
    name: 'Layout Elements',
    icon: LayoutGrid,
    templates: [
      {
        type: 'container',
        label: 'Container',
        icon: Square,
        template: {
          styles: {
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          },
          children: []
        }
      },
      {
        type: 'container',
        label: '2 Columns',
        icon: Columns,
        template: {
          styles: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            padding: '20px'
          },
          children: []
        }
      },
      {
        type: 'container',
        label: '3 Columns',
        icon: Grid,
        template: {
          styles: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '20px',
            padding: '20px'
          },
          children: []
        }
      }
    ]
  },
  {
    name: 'Media Elements',
    icon: Play,
    templates: [
      {
        type: 'video',
        label: 'Video',
        icon: Play,
        template: {
          src: '',
          styles: {
            width: '100%',
            height: '300px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
          }
        }
      },
      {
        type: 'image',
        label: 'Gallery',
        icon: Image,
        template: {
          src: '/api/placeholder/600/400',
          alt: 'Gallery image',
          styles: {
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '12px'
          }
        }
      }
    ]
  },
  {
    name: 'Form Elements',
    icon: FileText,
    templates: [
      {
        type: 'form',
        label: 'Contact Form',
        icon: Mail,
        template: {
          styles: {
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }
        }
      },
      {
        type: 'input',
        label: 'Text Input',
        icon: Type,
        template: {
          attributes: {
            type: 'text',
            placeholder: 'Enter text...'
          },
          styles: {
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '16px'
          }
        }
      }
    ]
  },
  {
    name: 'Marketing Elements',
    icon: Target,
    templates: [
      {
        type: 'testimonial',
        label: 'Testimonial',
        icon: Quote,
        template: {
          content: 'This product has transformed our business. Highly recommended!',
          styles: {
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            textAlign: 'center'
          }
        }
      },
      {
        type: 'pricing',
        label: 'Pricing Card',
        icon: DollarSign,
        template: {
          styles: {
            backgroundColor: '#ffffff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            textAlign: 'center',
            border: '2px solid #e5e7eb',
            position: 'relative'
          }
        }
      },
      {
        type: 'countdown',
        label: 'Countdown Timer',
        icon: Clock,
        template: {
          styles: {
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '30px',
            borderRadius: '12px',
            textAlign: 'center'
          }
        }
      }
    ]
  },
  {
    name: 'Social Elements',
    icon: Share2,
    templates: [
      {
        type: 'social',
        label: 'Social Share',
        icon: Share2,
        template: {
          styles: {
            padding: '20px',
            textAlign: 'center'
          }
        }
      }
    ]
  },
  {
    name: 'Special Elements',
    icon: Zap,
    templates: [
      {
        type: 'map',
        label: 'Map',
        icon: Map,
        template: {
          styles: {
            width: '100%',
            height: '300px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }
      },
      {
        type: 'icon',
        label: 'Icon',
        icon: Star,
        template: {
          styles: {
            fontSize: '48px',
            color: '#007bff',
            textAlign: 'center',
            padding: '20px'
          }
        }
      }
    ]
  }
];

export function EnhancedElementTemplates({ onAddElement }: EnhancedElementTemplatesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Add Elements</h3>
        <Badge variant="secondary">Pro</Badge>
      </div>
      
      <ScrollArea className="h-96">
        {templateCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <category.icon className="h-4 w-4 text-gray-600" />
              <h4 className="text-sm font-medium text-gray-700">{category.name}</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {category.templates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => onAddElement(template.template)}
                >
                  <template.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-xs">{template.label}</span>
                </Button>
              ))}
            </div>
            
            {categoryIndex < templateCategories.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
