
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Eye, 
  Star, 
  Crown, 
  Filter,
  Monitor,
  Smartphone,
  Download,
  ExternalLink
} from 'lucide-react';
import { templates, categories, Template } from './templateData';
import { TemplatePreview } from './TemplatePreview';

interface TemplateLibraryProps {
  onUseTemplate: (templateId: string) => void;
}

export function TemplateLibrary({ onUseTemplate }: TemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };

  const handleUseTemplate = (templateId: string) => {
    onUseTemplate(templateId);
    setPreviewTemplate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Template Library</h3>
          <p className="text-muted-foreground">
            Choose from professionally designed templates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-50 text-blue-600">
            {filteredTemplates.length} Templates
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
            <div className="relative">
              <div 
                className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 bg-cover bg-center cursor-pointer"
                style={{ backgroundImage: `url(${template.image})` }}
                onClick={() => handlePreviewTemplate(template)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button variant="secondary" size="sm" className="shadow-lg">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
              
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                  <Badge variant="outline" className="mt-2">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  4.8
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleUseTemplate(template.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search term or category filter
          </p>
        </div>
      )}

      {/* Template Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-6xl h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">{previewTemplate?.name}</DialogTitle>
                <p className="text-muted-foreground mt-1">{previewTemplate?.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {previewTemplate?.isPremium && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
                
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <Button 
                    variant={deviceView === 'desktop' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setDeviceView('desktop')}
                    className="px-3 h-8"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={deviceView === 'mobile' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setDeviceView('mobile')}
                    className="px-3 h-8"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => previewTemplate && handleUseTemplate(previewTemplate.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {previewTemplate && (
              <TemplatePreview 
                template={previewTemplate} 
                deviceView={deviceView}
                onUseTemplate={handleUseTemplate}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
