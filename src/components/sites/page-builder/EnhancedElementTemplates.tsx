
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { elementTemplates } from './ElementTemplates';
import { Element } from './types';

interface EnhancedElementTemplatesProps {
  onAddElement: (element: Partial<Element>) => void;
}

export function EnhancedElementTemplates({ onAddElement }: EnhancedElementTemplatesProps) {
  const categories = [
    {
      name: 'Basic Elements',
      elements: elementTemplates.filter(t => 
        ['text', 'heading', 'button', 'image', 'divider', 'spacer'].includes(t.type)
      )
    },
    {
      name: 'Layout',
      elements: elementTemplates.filter(t => 
        ['container', 'form'].includes(t.type)
      )
    },
    {
      name: 'Media',
      elements: elementTemplates.filter(t => 
        ['video', 'map'].includes(t.type)
      )
    },
    {
      name: 'Form Elements',
      elements: elementTemplates.filter(t => 
        ['input'].includes(t.type)
      )
    },
    {
      name: 'Marketing',
      elements: elementTemplates.filter(t => 
        ['testimonial', 'pricing', 'countdown', 'social'].includes(t.type)
      )
    }
  ];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name}>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
            <Badge variant="secondary" className="text-xs">
              {category.elements.length}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {category.elements.map((template) => {
              const Icon = template.icon;
              return (
                <Card 
                  key={template.type}
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-blue-200 group"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(template.template));
                  }}
                  onClick={() => onAddElement(template.template)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                      {template.label}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
