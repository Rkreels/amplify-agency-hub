
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Crown, 
  Download, 
  ExternalLink, 
  Star,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Template } from './templateData';

interface TemplatePreviewProps {
  template: Template;
  deviceView: 'desktop' | 'mobile';
  onUseTemplate: (templateId: string) => void;
}

export function TemplatePreview({ template, deviceView, onUseTemplate }: TemplatePreviewProps) {
  const getPreviewStyle = () => {
    return deviceView === 'desktop' 
      ? { width: '100%', height: '600px' }
      : { width: '375px', height: '600px', margin: '0 auto' };
  };

  const renderTemplatePreview = () => {
    // Render actual template content based on template elements
    if (template.id === 'landing-page') {
      return (
        <div className="bg-white min-h-full">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
            <div className="container mx-auto px-6 text-center">
              <h1 className="text-5xl font-bold mb-6">Transform Your Business Today</h1>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of successful businesses who have already transformed their operations with our proven system.
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Get Started Free
              </Button>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-4xl font-bold text-center mb-12">Why Choose Our Solution?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">Feature {i}</h3>
                    <p className="text-gray-600">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Testimonial Section */}
          <div className="py-20 bg-white">
            <div className="container mx-auto px-6">
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl font-medium mb-6">
                  "This solution completely transformed our business operations. Highly recommended!"
                </blockquote>
                <cite className="text-gray-600">- John Smith, CEO of TechCorp</cite>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (template.id === 'business-form') {
      return (
        <div className="bg-gray-50 min-h-full py-20">
          <div className="container mx-auto px-6 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-center mb-4">Get Your Free Consultation</h1>
              <p className="text-gray-600 text-center mb-8">
                Fill out the form below and our experts will contact you within 24 hours.
              </p>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your needs"
                  />
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                  Get My Free Consultation
                </Button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    
    // Default preview for other templates
    return (
      <div className="bg-white min-h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{template.name}</h1>
          <p className="text-gray-600 mb-8">{template.description}</p>
          <Button onClick={() => onUseTemplate(template.id)}>
            Use This Template
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Template Info */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <Badge variant="outline">{template.category}</Badge>
          {template.isPremium && (
            <Badge className="bg-yellow-500 hover:bg-yellow-600">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
            4.8 (127 reviews)
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Live Demo
          </Button>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-hidden bg-gray-100 p-4">
        <div className="h-full flex items-center justify-center">
          <div 
            style={getPreviewStyle()}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <ScrollArea className="h-full w-full">
              {renderTemplatePreview()}
            </ScrollArea>
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <Button 
            onClick={() => onUseTemplate(template.id)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Use This Template
          </Button>
        </div>
      </div>
    </div>
  );
}
