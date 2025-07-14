
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Layers, 
  Type, 
  Image, 
  Square, 
  MousePointer, 
  Palette, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor,
  Settings,
  Save,
  Play,
  Undo,
  Redo,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { ElementRenderer } from './ElementRenderer';
import { EnhancedElementTemplates } from './EnhancedElementTemplates';
import { Element, Layer, Position, Size } from './types';
import { toast } from 'sonner';

export function DynamicPageBuilder() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [layers, setLayers] = useState<Layer[]>([
    { id: 'layer-1', name: 'Background', visible: true, locked: false, elements: [], zIndex: 1 },
    { id: 'layer-2', name: 'Content', visible: true, locked: false, elements: [], zIndex: 2 },
    { id: 'layer-3', name: 'Overlay', visible: true, locked: false, elements: [], zIndex: 3 }
  ]);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState('elements');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [pageSettings, setPageSettings] = useState({
    title: 'New Page',
    backgroundColor: '#ffffff',
    maxWidth: '1200px',
    padding: '20px',
    fontFamily: 'Inter'
  });

  const templates = [
    {
      id: 'hero-section',
      name: 'Hero Section',
      description: 'A hero section with title, subtitle and CTA',
      category: 'sections',
      elements: [
        {
          id: 'hero-bg',
          type: 'container' as const,
          position: { x: 0, y: 0 },
          size: { width: 100, height: 500 },
          styles: {
            backgroundColor: '#1f2937',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '80px 20px'
          },
          content: '',
          children: ['hero-title', 'hero-subtitle', 'hero-cta']
        },
        {
          id: 'hero-title',
          type: 'heading' as const,
          position: { x: 0, y: 0 },
          size: { width: 100, height: 80 },
          styles: {
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '20px'
          },
          content: 'Transform Your Business Today',
          parent: 'hero-bg'
        },
        {
          id: 'hero-subtitle',
          type: 'text' as const,
          position: { x: 0, y: 80 },
          size: { width: 100, height: 40 },
          styles: {
            fontSize: '1.2rem',
            color: '#e5e7eb',
            textAlign: 'center',
            marginBottom: '30px',
            maxWidth: '600px'
          },
          content: 'Discover the power of our innovative solutions and take your business to the next level',
          parent: 'hero-bg'
        },
        {
          id: 'hero-cta',
          type: 'button' as const,
          position: { x: 0, y: 120 },
          size: { width: 200, height: 50 },
          styles: {
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            fontSize: '1.1rem',
            fontWeight: '600',
            padding: '15px 30px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          },
          content: 'Get Started Now',
          parent: 'hero-bg'
        }
      ] as Element[]
    },
    {
      id: 'feature-grid',
      name: 'Feature Grid',
      description: 'A grid of features with icons',
      category: 'sections',
      elements: [] as Element[]
    }
  ];

  const addElement = useCallback((elementData: Partial<Element>) => {
    const newElement: Element = {
      id: `element-${Date.now()}`,
      type: elementData.type || 'text',
      position: elementData.position || { x: 50, y: 50 },
      size: elementData.size || { width: 200, height: 100 },
      styles: elementData.styles || {},
      content: elementData.content || '',
      layerId: 'layer-2',
      ...elementData
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    toast.success('Element added successfully');
  }, []);

  const updateElement = useCallback((elementId: string, updates: Partial<Element>) => {
    setElements(prev =>
      prev.map(element =>
        element.id === elementId ? { ...element, ...updates } : element
      )
    );
    
    if (selectedElement?.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedElement]);

  const deleteElement = useCallback((elementId: string) => {
    setElements(prev => prev.filter(element => element.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
    toast.success('Element deleted');
  }, [selectedElement]);

  const duplicateElement = useCallback((element: Element) => {
    const duplicated: Element = {
      ...element,
      id: `element-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };
    setElements(prev => [...prev, duplicated]);
    setSelectedElement(duplicated);
    toast.success('Element duplicated');
  }, []);

  const loadTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    setElements(template.elements);
    toast.success(`${template.name} template loaded`);
  }, []);

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-full';
    }
  };

  const handleElementClick = useCallback((element: Element) => {
    if (!isPreviewMode) {
      setSelectedElement(element);
    }
  }, [isPreviewMode]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-2">Page Builder</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
              <Eye className="h-4 w-4 mr-1" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 m-2">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="layers">Layers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="p-4">
            <EnhancedElementTemplates onAddElement={addElement} />
          </TabsContent>

          <TabsContent value="templates" className="p-4 space-y-4">
            <h4 className="font-medium">Page Templates</h4>
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h5 className="font-medium mb-2">{template.name}</h5>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <Button size="sm" onClick={() => loadTemplate(template.id)}>
                    Load Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="layers" className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Layers</h4>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {layers.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={(checked) =>
                      setLayers(prev =>
                        prev.map(l => l.id === layer.id ? { ...l, visible: checked } : l)
                      )
                    }
                  />
                  <span className="text-sm">{layer.name}</span>
                </div>
                <Badge variant="secondary">{layer.elements.length}</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input
                  id="pageTitle"
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={pageSettings.backgroundColor}
                  onChange={(e) => setPageSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="maxWidth">Max Width</Label>
                <Select 
                  value={pageSettings.maxWidth} 
                  onValueChange={(value) => setPageSettings(prev => ({ ...prev, maxWidth: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100%">Full Width</SelectItem>
                    <SelectItem value="1200px">1200px</SelectItem>
                    <SelectItem value="1024px">1024px</SelectItem>
                    <SelectItem value="768px">768px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select 
                  value={pageSettings.fontFamily} 
                  onValueChange={(value) => setPageSettings(prev => ({ ...prev, fontFamily: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Arial">Arial</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold">{pageSettings.title}</h2>
            <Badge variant="secondary">{elements.length} elements</Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded p-1">
              <Button
                size="sm"
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div 
            className={`mx-auto bg-white shadow-lg min-h-screen relative ${getViewportClass()}`}
            style={{
              backgroundColor: pageSettings.backgroundColor,
              maxWidth: pageSettings.maxWidth,
              fontFamily: pageSettings.fontFamily
            }}
          >
            {elements.map((element) => (
              <ElementRenderer
                key={element.id}
                element={element}
                isSelected={selectedElement?.id === element.id}
                onElementClick={handleElementClick}
                isPreviewMode={isPreviewMode}
                onUpdateElement={updateElement}
                onDeleteElement={deleteElement}
                onDuplicateElement={duplicateElement}
              />
            ))}
            
            {elements.length === 0 && !isPreviewMode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Square className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Start Building Your Page
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add elements from the sidebar or choose a template to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedElement && !isPreviewMode && (
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Element Properties</h3>
              <Button size="sm" variant="outline" onClick={() => setSelectedElement(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Element Type</Label>
                <Badge variant="outline">{selectedElement.type}</Badge>
              </div>

              <div>
                <Label htmlFor="elementContent">Content</Label>
                <Input
                  id="elementContent"
                  value={selectedElement.content}
                  onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Width (%)</Label>
                  <Slider
                    value={[selectedElement.size.width]}
                    onValueChange={([value]) => 
                      updateElement(selectedElement.id, { 
                        size: { ...selectedElement.size, width: value } 
                      })
                    }
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Height (px)</Label>
                  <Input
                    type="number"
                    value={selectedElement.size.height}
                    onChange={(e) => 
                      updateElement(selectedElement.id, { 
                        size: { ...selectedElement.size, height: parseInt(e.target.value) || 0 } 
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>X Position</Label>
                  <Input
                    type="number"
                    value={selectedElement.position.x}
                    onChange={(e) => 
                      updateElement(selectedElement.id, { 
                        position: { ...selectedElement.position, x: parseInt(e.target.value) || 0 } 
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Y Position</Label>
                  <Input
                    type="number"
                    value={selectedElement.position.y}
                    onChange={(e) => 
                      updateElement(selectedElement.id, { 
                        position: { ...selectedElement.position, y: parseInt(e.target.value) || 0 } 
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={selectedElement.styles?.backgroundColor || '#ffffff'}
                  onChange={(e) => 
                    updateElement(selectedElement.id, { 
                      styles: { ...selectedElement.styles, backgroundColor: e.target.value } 
                    })
                  }
                />
              </div>

              <div>
                <Label>Text Color</Label>
                <Input
                  type="color"
                  value={selectedElement.styles?.color || '#000000'}
                  onChange={(e) => 
                    updateElement(selectedElement.id, { 
                      styles: { ...selectedElement.styles, color: e.target.value } 
                    })
                  }
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => duplicateElement(selectedElement)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => deleteElement(selectedElement.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
