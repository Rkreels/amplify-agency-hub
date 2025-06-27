import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Move, 
  Eye, 
  EyeOff, 
  Settings, 
  Type, 
  Image, 
  Square, 
  Circle, 
  Layout, 
  Layers, 
  Palette, 
  MousePointer, 
  Hand, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Link, 
  List, 
  ListOrdered,
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown,
  Monitor, 
  Tablet, 
  Smartphone, 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload,
  MoreHorizontal, 
  Grid, 
  Columns, 
  Rows, 
  PanelLeft, 
  PanelRight,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  CreditCard,
  Video,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface Step {
  id: string;
  type: 'page' | 'form' | 'checkout' | 'thankyou';
  title: string;
  description?: string;
  url: string;
  elements: any[];
  settings: any;
}

interface Funnel {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
  settings: any;
}

interface EnhancedFunnelBuilderProps {
  siteId: string;
}

export function EnhancedFunnelBuilder({ siteId }: EnhancedFunnelBuilderProps) {
  const [funnels, setFunnels] = useState<Funnel[]>([
    {
      id: 'funnel-1',
      name: 'Default Funnel',
      description: 'A basic funnel for lead generation',
      steps: [
        {
          id: 'step-1',
          type: 'page',
          title: 'Landing Page',
          description: 'First page to capture leads',
          url: '/landing',
          elements: [],
          settings: {},
        },
        {
          id: 'step-2',
          type: 'form',
          title: 'Opt-in Form',
          description: 'Collect user information',
          url: '/opt-in',
          elements: [],
          settings: {},
        },
        {
          id: 'step-3',
          type: 'thankyou',
          title: 'Thank You Page',
          description: 'Confirmation page',
          url: '/thank-you',
          elements: [],
          settings: {},
        },
      ],
      settings: {},
    }
  ]);

  const [currentFunnelId, setCurrentFunnelId] = useState(funnels[0]?.id);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState<any | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [showProperties, setShowProperties] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const currentFunnel = funnels.find(f => f.id === currentFunnelId);
  const selectedStep = currentFunnel?.steps.find(s => s.id === selectedStepId);

  // Functions
  const addFunnel = useCallback(() => {
    const newFunnel: Funnel = {
      id: `funnel-${Date.now()}`,
      name: `Funnel ${funnels.length + 1}`,
      description: '',
      steps: [],
      settings: {},
    };
    setFunnels(prev => [...prev, newFunnel]);
    setCurrentFunnelId(newFunnel.id);
    toast.success('New funnel created');
  }, [funnels.length]);

  const deleteFunnel = useCallback((funnelId: string) => {
    if (funnels.length <= 1) {
      toast.error('Cannot delete the last funnel');
      return;
    }
    setFunnels(prev => prev.filter(f => f.id !== funnelId));
    if (currentFunnelId === funnelId) {
      setCurrentFunnelId(funnels[0].id);
    }
    toast.success('Funnel deleted');
  }, [funnels, currentFunnelId]);

  const addStep = useCallback(() => {
    if (!currentFunnel) return;

    const newStep: Step = {
      id: `step-${Date.now()}`,
      type: 'page',
      title: `Step ${currentFunnel.steps.length + 1}`,
      description: '',
      url: `/step-${currentFunnel.steps.length + 1}`,
      elements: [],
      settings: {},
    };

    const updatedFunnel = {
      ...currentFunnel,
      steps: [...currentFunnel.steps, newStep],
    };

    setFunnels(prev => prev.map(f => f.id === currentFunnelId ? updatedFunnel : f));
    setSelectedStepId(newStep.id);
    toast.success('Step added');
  }, [currentFunnel, currentFunnelId]);

  const updateStep = useCallback((stepId: string, updates: Partial<Step>) => {
    if (!currentFunnel) return;

    const updatedFunnel = {
      ...currentFunnel,
      steps: currentFunnel.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    };

    setFunnels(prev => prev.map(f => f.id === currentFunnelId ? updatedFunnel : f));
  }, [currentFunnel, currentFunnelId]);

  const deleteStep = useCallback((stepId: string) => {
    if (!currentFunnel) return;

    const updatedFunnel = {
      ...currentFunnel,
      steps: currentFunnel.steps.filter(step => step.id !== stepId),
    };

    setFunnels(prev => prev.map(f => f.id === currentFunnelId ? updatedFunnel : f));
    setSelectedStepId(null);
    toast.success('Step deleted');
  }, [currentFunnel, currentFunnelId]);

  const duplicateStep = useCallback((stepId: string) => {
    if (!currentFunnel) return;

    const stepToDuplicate = currentFunnel.steps.find(step => step.id === stepId);
    if (!stepToDuplicate) return;

    const duplicatedStep: Step = {
      ...stepToDuplicate,
      id: `step-${Date.now()}`,
      title: `${stepToDuplicate.title} Copy`,
      url: `${stepToDuplicate.url}-copy`,
    };

    const updatedFunnel = {
      ...currentFunnel,
      steps: [...currentFunnel.steps, duplicatedStep],
    };

    setFunnels(prev => prev.map(f => f.id === currentFunnelId ? updatedFunnel : f));
    setSelectedStepId(duplicatedStep.id);
    toast.success('Step duplicated');
  }, [currentFunnel, currentFunnelId]);

  const saveFunnel = useCallback(() => {
    toast.success('Funnel saved successfully');
  }, []);

  const publishFunnel = useCallback(() => {
    toast.success('Funnel published successfully');
  }, []);

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Funnel Steps & Properties */}
      <div className={`${showProperties ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Funnel Builder</h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="steps" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Funnel Steps</Label>
                    {currentFunnel?.steps.map((step) => (
                      <Card 
                        key={step.id}
                        className={`cursor-pointer hover:shadow-md transition-shadow ${
                          selectedStepId === step.id ? 'bg-blue-50 text-blue-900 border-blue-300' : ''
                        }`}
                        onClick={() => setSelectedStepId(step.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{step.title}</h4>
                              <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => duplicateStep(step.id)}>
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => deleteStep(step.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button variant="outline" className="w-full" onClick={addStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="design" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  {selectedStep ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Step: {selectedStep.title}</Label>
                      </div>
                      
                      {/* Design Controls Here */}
                      <p className="text-gray-500">Design controls for the selected step will appear here.</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Select a step to edit its design
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="m-0 h-full">
                <ScrollArea className="h-full p-4">
                  {selectedStep ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Step Title</Label>
                        <Input
                          value={selectedStep.title}
                          onChange={(e) => updateStep(selectedStep.id, { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Step URL</Label>
                        <Input
                          value={selectedStep.url}
                          onChange={(e) => updateStep(selectedStep.id, { url: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={selectedStep.description || ''}
                          onChange={(e) => updateStep(selectedStep.id, { description: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      Select a step to edit its settings
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Funnel Navigation */}
              <Select value={currentFunnelId} onValueChange={setCurrentFunnelId}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {funnels.map(funnel => (
                    <SelectItem key={funnel.id} value={funnel.id}>
                      {funnel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button size="sm" variant="outline" onClick={addFunnel}>
                <Plus className="h-4 w-4 mr-1" />
                New Funnel
              </Button>
              
              {funnels.length > 1 && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => currentFunnelId && deleteFunnel(currentFunnelId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Funnel
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Preview Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  size="sm"
                  variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
                <Button size="sm" variant="outline" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Action Buttons */}
              <Button size="sm" variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                {isPreviewMode ? <Edit className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button size="sm" variant="outline" onClick={saveFunnel}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <Button size="sm" onClick={publishFunnel}>
                Publish
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-4 overflow-auto">
          <div className="h-full flex items-center justify-center">
            <div
              ref={canvasRef}
              className={`bg-white shadow-lg transition-all duration-300 ${
                previewMode === 'mobile' ? 'w-[375px] min-h-[600px]' :
                previewMode === 'tablet' ? 'w-[768px] min-h-[600px]' :
                'w-full max-w-[1200px] min-h-[600px]'
              }`}
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}
            >
              {selectedStep ? (
                <div className="p-4">
                  {/* Step Content Here */}
                  <h2 className="text-2xl font-semibold mb-4">{selectedStep.title}</h2>
                  <p className="text-gray-600">{selectedStep.description}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select a step to start building
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Additional Tools */}
      <div className={`${showLayers ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-l border-gray-200`}>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Funnel
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Import Funnel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
