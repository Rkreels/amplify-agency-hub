
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Star } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  type: 'landing' | 'website' | 'funnel' | 'booking';
  preview: string;
  description: string;
  features: string[];
  rating: number;
  isPremium: boolean;
  elements: any[];
}

interface TemplatePreviewProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export function TemplatePreview({ template, onUseTemplate, onPreview }: TemplatePreviewProps) {
  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden">
      {/* Preview Image */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-white p-4">
          {/* Mock template preview */}
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-2"></div>
              <div className="h-2 bg-gray-300 rounded w-20 mx-auto mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => onPreview(template)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" onClick={() => onUseTemplate(template)}>
            <Edit className="h-4 w-4 mr-1" />
            Use Template
          </Button>
        </div>

        {/* Premium badge */}
        {template.isPremium && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs text-gray-600">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
          <Badge variant="secondary" className="text-xs capitalize">
            {template.type}
          </Badge>
        </div>

        {/* Features */}
        <div className="mt-3 flex flex-wrap gap-1">
          {template.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-gray-500">+{template.features.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
