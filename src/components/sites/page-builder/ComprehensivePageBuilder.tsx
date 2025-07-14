import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { 
  Plus, Settings, Eye, Code, Download, Upload, Save, Undo, Redo, 
  Copy, Trash2, Move, AlignLeft, AlignCenter, AlignRight, Bold, 
  Italic, Underline, Palette, Type, Image, Square, Layout, 
  Smartphone, Tablet, Monitor, Globe
} from 'lucide-react';
import { Element, Position, Size, Template, Page } from './types';
import { ElementRenderer } from './ElementRenderer';
import { DesignPanel } from './DesignPanel';

interface ComprehensivePageBuilderProps {
  siteId: string;
}

interface AddElementPanelProps {
  onAddElement: (element: Element) => void;
}

function AddElementPanel({ onAddElement }: AddElementPanelProps) {
  const handleAdd = (type: string) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: type as any,
      content: `New ${type}`,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 50 },
      styles: {
        backgroundColor: 'white',
        color: 'black',
        padding: '10px',
        border: '1px solid gray'
      },
      props: {}
    };
    onAddElement(newElement);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Element</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={() => handleAdd('text')}>Text</Button>
        <Button onClick={() => handleAdd('heading')}>Heading</Button>
        <Button onClick={() => handleAdd('button')}>Button</Button>
        <Button onClick={() => handleAdd('image')}>Image</Button>
        <Button onClick={() => handleAdd('container')}>Container</Button>
      </CardContent>
    </Card>
  );
}

export function ComprehensivePageBuilder({ siteId }: ComprehensivePageBuilderProps) {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [pageSettings, setPageSettings] = useState({
    title: 'My Awesome Page',
    description: 'A page built with our comprehensive page builder',
    keywords: 'web design, page builder, react'
  });
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleAddElement = (element: Element) => {
    setElements([...elements, element]);
  };

  const handleSelectElement = (element: Element) => {
    setSelectedElement(element);
  };

  const handleUpdateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    setSelectedElement(el => el?.id === id ? { ...el, ...updates } : el);
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(el => el?.id === id ? null : el);
  };

  const handlePageSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageSettings(prev => ({ ...prev, [name]: value }));
  };

  const templates: Template[] = [
    {
      id: 'hero-1',
      name: 'Hero Section',
      description: 'A clean hero section with heading, text, and CTA',
      category: 'Hero',
      elements: [
        {
          id: 'hero-heading',
          type: 'heading',
          content: 'Welcome to Our Amazing Product',
          position: { x: 0, y: 0 },
          size: { width: 800, height: 80 },
          styles: {
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            margin: '0 0 24px 0',
            color: '#1a1a1a',
            lineHeight: '1.2'
          },
          props: {
            level: '1'
          }
        },
        {
          id: 'hero-text',
          type: 'text',
          content: 'Discover the future of web design with our intuitive page builder. Create stunning websites without any coding knowledge.',
          position: { x: 0, y: 100 },
          size: { width: 600, height: 60 },
          styles: {
            fontSize: '18px',
            lineHeight: '1.6',
            margin: '0 0 32px 0',
            textAlign: 'center',
            color: '#666666',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }
        },
        {
          id: 'hero-cta',
          type: 'button',
          content: 'Get Started Free',
          position: { x: 0, y: 200 },
          size: { width: 200, height: 50 },
          href: '#signup',
          target: '_self',
          styles: {
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-block',
            textDecoration: 'none',
            transition: 'all 0.2s',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 'auto'
          }
        }
      ]
    }
  ];

  const handleApplyTemplate = (template: Template) => {
    setElements([...elements, ...template.elements]);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const reorderedElements = Array.from(elements);
    const [movedElement] = reorderedElements.splice(result.source.index, 1);
    reorderedElements.splice(result.destination.index, 0, movedElement);

    setElements(reorderedElements);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {templates.map(template => (
              <Button key={template.id} onClick={() => handleApplyTemplate(template)}>
                {template.name}
              </Button>
            ))}
          </CardContent>
        </Card>
        <AddElementPanel onAddElement={handleAddElement} />
        <Card>
          <CardHeader>
            <CardTitle>Page Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={pageSettings.title}
              onChange={handlePageSettingsChange}
            />
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={pageSettings.description}
              onChange={handlePageSettingsChange}
            />
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              type="text"
              id="keywords"
              name="keywords"
              value={pageSettings.keywords}
              onChange={handlePageSettingsChange}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Page Builder
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => setDeviceView('desktop')}>
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeviceView('tablet')}>
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeviceView('mobile')}>
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative min-h-[600px]">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="elements">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="relative min-h-[600px]"
                  >
                    {elements.map((element, index) => (
                      <Draggable key={element.id} draggableId={element.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              position: 'absolute',
                              top: element.position.y,
                              left: element.position.x,
                              width: element.size.width,
                              height: element.size.height,
                              ...provided.draggableProps.style
                            }}
                            onClick={() => handleSelectElement(element)}
                          >
                            <ElementRenderer element={element} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        {selectedElement ? (
          <DesignPanel element={selectedElement} onUpdate={handleUpdateElement} onDelete={handleDeleteElement} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Select an Element</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Click on an element to modify its design.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
