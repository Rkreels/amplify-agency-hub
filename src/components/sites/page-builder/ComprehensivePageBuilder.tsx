
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Plus, Settings, Eye, Code, Download, Upload, Save, Undo, Redo, 
  Copy, Trash2, Move, AlignLeft, AlignCenter, AlignRight, Bold, 
  Italic, Underline, Palette, Type, Image, Square, Layout, 
  Smartphone, Tablet, Monitor, Globe, ChevronDown, ChevronRight,
  Layers, Grid, Box, Text, FormInput, Video, Minus, MoreHorizontal
} from 'lucide-react';
import { Element, Position, Size, Template, Page } from './types';
import { ElementRenderer } from './ElementRenderer';
import { AdvancedRightPanel } from './AdvancedRightPanel';

interface ComprehensivePageBuilderProps {
  siteId: string;
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
  const [rightPanelTab, setRightPanelTab] = useState<'elements' | 'design' | 'settings' | 'templates'>('elements');

  const handleAddElement = (elementType: string) => {
    const newElement: Element = {
      id: Date.now().toString(),
      type: elementType as any,
      content: `New ${elementType}`,
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
    setElements([...elements, newElement]);
  };

  const handleSelectElement = (element: Element) => {
    setSelectedElement(element);
    setRightPanelTab('design');
  };

  const handleUpdateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    setSelectedElement(el => el?.id === id ? { ...el, ...updates } : el);
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(el => el?.id === id ? null : el);
  };

  const handleDuplicateElement = (element: Element) => {
    const duplicated: Element = {
      ...element,
      id: Date.now().toString(),
      position: { x: element.position.x + 20, y: element.position.y + 20 }
    };
    setElements([...elements, duplicated]);
  };

  const handlePageSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageSettings(prev => ({ ...prev, [name]: value }));
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
    <div className="flex h-full bg-gray-50">
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setDeviceView('desktop')}>
                <Monitor className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeviceView('tablet')}>
                <Tablet className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeviceView('mobile')}>
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div 
            className={`
              mx-auto bg-white shadow-lg min-h-[800px] relative
              ${deviceView === 'desktop' ? 'w-full max-w-6xl' : ''}
              ${deviceView === 'tablet' ? 'w-[768px]' : ''}
              ${deviceView === 'mobile' ? 'w-[375px]' : ''}
            `}
          >
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="elements">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="relative min-h-[800px] p-4"
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
                            <ElementRenderer 
                              element={element} 
                              isSelected={selectedElement?.id === element.id}
                              onElementClick={handleSelectElement}
                              onUpdateElement={handleUpdateElement}
                              onDeleteElement={handleDeleteElement}
                              onDuplicateElement={handleDuplicateElement}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Advanced Right Panel */}
      <AdvancedRightPanel
        activeTab={rightPanelTab}
        onTabChange={setRightPanelTab}
        selectedElement={selectedElement}
        onAddElement={handleAddElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        pageSettings={pageSettings}
        onPageSettingsChange={handlePageSettingsChange}
      />
    </div>
  );
}
