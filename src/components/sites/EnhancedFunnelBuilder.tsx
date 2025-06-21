
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Target, Zap, TrendingUp, Users, BarChart3, ArrowRight, ArrowDown,
  Play, Pause, Settings, Eye, Edit, Copy, Trash2, Plus, Save,
  Globe, Mail, Phone, CreditCard, Calendar, Clock, Award, Share,
  MessageSquare, FileText, Image, Video, Layout, Grid, Layers,
  MousePointer, Type, Square, Circle, Star, CheckCircle, XCircle,
  AlertCircle, Info, ChevronDown, ChevronUp, Monitor, Tablet, Smartphone
} from 'lucide-react';

interface FunnelStep {
  id: string;
  name: string;
  type: 'landing' | 'sales' | 'upsell' | 'downsell' | 'checkout' | 'thank-you' | 'webinar' | 'survey' | 'opt-in';
  url: string;
  template: string;
  elements: any[];
  settings: {
    seo: {
      title: string;
      description: string;
      keywords: string;
    };
    tracking: {
      googleAnalytics?: string;
      facebookPixel?: string;
      customCode?: string;
    };
    redirects: {
      success?: string;
      failure?: string;
      exit?: string;
    };
    timer?: {
      enabled: boolean;
      duration: number;
      action: 'redirect' | 'hide' | 'show';
    };
    restrictions?: {
      countries?: string[];
      devices?: string[];
      timeZones?: string[];
    };
  };
  analytics: {
    views: number;
    uniqueViews: number;
    conversions: number;
    conversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
    revenue: number;
  };
  isActive: boolean;
  isPublished: boolean;
  lastModified: Date;
}

interface Funnel {
  id: string;
  name: string;
  description: string;
  category: 'lead-generation' | 'product-launch' | 'webinar' | 'ecommerce' | 'coaching' | 'saas' | 'agency' | 'event';
  steps: FunnelStep[];
  settings: {
    domain: string;
    ssl: boolean;
    password?: string;
    maintenance: boolean;
    redirects: {
      www: boolean;
      https: boolean;
    };
    integrations: {
      email?: string;
      crm?: string;
      payment?: string;
      analytics?: string[];
    };
  };
  analytics: {
    totalViews: number;
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;
    avgOrderValue: number;
    customerLifetimeValue: number;
  };
  isActive: boolean;
  createdAt: Date;
  lastModified: Date;
}

export function EnhancedFunnelBuilder() {
  const [funnels, setFunnels] = useState<Funnel[]>([
    {
      id: 'funnel-1',
      name: 'Lead Generation Funnel',
      description: 'Capture leads with free ebook offer',
      category: 'lead-generation',
      isActive: true,
      createdAt: new Date('2024-01-15'),
      lastModified: new Date(),
      settings: {
        domain: 'lead-funnel.yourdomain.com',
        ssl: true,
        maintenance: false,
        redirects: { www: true, https: true },
        integrations: {
          email: 'mailchimp',
          crm: 'hubspot',
          analytics: ['google-analytics', 'facebook-pixel']
        }
      },
      analytics: {
        totalViews: 5247,
        totalConversions: 847,
        totalRevenue: 25410,
        conversionRate: 16.1,
        avgOrderValue: 30,
        customerLifetimeValue: 150
      },
      steps: [
        {
          id: 'step-1',
          name: 'Landing Page',
          type: 'landing',
          url: '/opt-in',
          template: 'lead-magnet-modern',
          elements: [],
          isActive: true,
          isPublished: true,
          lastModified: new Date(),
          settings: {
            seo: {
              title: 'Free Marketing Guide - Download Now',
              description: 'Get our comprehensive marketing guide',
              keywords: 'marketing, guide, free, download'
            },
            tracking: {
              googleAnalytics: 'GA_MEASUREMENT_ID',
              facebookPixel: 'FB_PIXEL_ID'
            },
            redirects: {
              success: '/thank-you',
              failure: '/error'
            }
          },
          analytics: {
            views: 2547,
            uniqueViews: 2103,
            conversions: 387,
            conversionRate: 15.2,
            avgTimeOnPage: 145,
            bounceRate: 42.3,
            revenue: 0
          }
        },
        {
          id: 'step-2',
          name: 'Thank You Page',
          type: 'thank-you',
          url: '/thank-you',
          template: 'thank-you-with-upsell',
          elements: [],
          isActive: true,
          isPublished: true,
          lastModified: new Date(),
          settings: {
            seo: {
              title: 'Thank You - Your Guide is Ready',
              description: 'Thank you for downloading our guide',
              keywords: 'thank you, download, confirmation'
            },
            tracking: {},
            redirects: {}
          },
          analytics: {
            views: 387,
            uniqueViews: 387,
            conversions: 58,
            conversionRate: 15.0,
            avgTimeOnPage: 89,
            bounceRate: 65.1,
            revenue: 1740
          }
        }
      ]
    }
  ]);

  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(funnels[0]);
  const [selectedStep, setSelectedStep] = useState<FunnelStep | null>(funnels[0]?.steps[0] || null);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const funnelTemplates = [
    {
      id: 'lead-generation-basic',
      name: 'Basic Lead Generation',
      category: 'lead-generation',
      description: 'Simple opt-in funnel with lead magnet',
      steps: ['landing', 'thank-you'],
      conversions: 'Medium',
      difficulty: 'Beginner'
    },
    {
      id: 'product-launch-complete',
      name: 'Complete Product Launch',
      category: 'product-launch',
      description: 'Full product launch sequence with webinar',
      steps: ['landing', 'webinar', 'sales', 'checkout', 'upsell', 'thank-you'],
      conversions: 'High',
      difficulty: 'Advanced'
    },
    {
      id: 'webinar-funnel',
      name: 'Webinar Registration',
      category: 'webinar',
      description: 'Webinar registration and attendance funnel',
      steps: ['landing', 'webinar', 'sales', 'checkout'],
      conversions: 'High',
      difficulty: 'Intermediate'
    },
    {
      id: 'ecommerce-sales',
      name: 'E-commerce Sales',
      category: 'ecommerce',
      description: 'Product sales with upsells and cross-sells',
      steps: ['landing', 'sales', 'checkout', 'upsell', 'thank-you'],
      conversions: 'High',
      difficulty: 'Intermediate'
    },
    {
      id: 'coaching-funnel',
      name: 'Coaching Application',
      category: 'coaching',
      description: 'High-ticket coaching application funnel',
      steps: ['landing', 'survey', 'sales', 'checkout'],
      conversions: 'Medium',
      difficulty: 'Advanced'
    },
    {
      id: 'saas-trial',
      name: 'SaaS Free Trial',
      category: 'saas',
      description: 'Free trial signup and conversion funnel',
      steps: ['landing', 'opt-in', 'sales', 'checkout'],
      conversions: 'Medium',
      difficulty: 'Intermediate'
    }
  ];

  const stepTemplates = {
    landing: [
      { id: 'lead-magnet-modern', name: 'Modern Lead Magnet', description: 'Clean, modern design with CTA' },
      { id: 'lead-magnet-video', name: 'Video Lead Magnet', description: 'Video background with opt-in form' },
      { id: 'lead-magnet-quiz', name: 'Quiz Lead Magnet', description: 'Interactive quiz for engagement' }
    ],
    sales: [
      { id: 'long-form-sales', name: 'Long Form Sales', description: 'Detailed product presentation' },
      { id: 'video-sales-letter', name: 'Video Sales Letter', description: 'Video-focused sales page' },
      { id: 'short-form-sales', name: 'Short Form Sales', description: 'Concise sales presentation' }
    ],
    checkout: [
      { id: 'single-step-checkout', name: 'Single Step', description: 'One-page checkout process' },
      { id: 'multi-step-checkout', name: 'Multi Step', description: 'Multi-step checkout flow' },
      { id: 'mobile-optimized-checkout', name: 'Mobile Optimized', description: 'Mobile-first checkout design' }
    ],
    'thank-you': [
      { id: 'thank-you-simple', name: 'Simple Thank You', description: 'Basic thank you message' },
      { id: 'thank-you-with-upsell', name: 'Thank You + Upsell', description: 'Thank you with additional offer' },
      { id: 'thank-you-social', name: 'Social Thank You', description: 'Encourages social sharing' }
    ]
  };

  const createFunnel = useCallback((templateId?: string) => {
    const template = funnelTemplates.find(t => t.id === templateId);
    const newFunnel: Funnel = {
      id: `funnel-${Date.now()}`,
      name: template ? template.name : `New Funnel ${funnels.length + 1}`,
      description: template ? template.description : 'New funnel description',
      category: template ? template.category as any : 'lead-generation',
      isActive: false,
      createdAt: new Date(),
      lastModified: new Date(),
      settings: {
        domain: `funnel-${Date.now()}.yourdomain.com`,
        ssl: true,
        maintenance: false,
        redirects: { www: true, https: true },
        integrations: {}
      },
      analytics: {
        totalViews: 0,
        totalConversions: 0,
        totalRevenue: 0,
        conversionRate: 0,
        avgOrderValue: 0,
        customerLifetimeValue: 0
      },
      steps: template ? template.steps.map((stepType, index) => ({
        id: `step-${Date.now()}-${index}`,
        name: `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Page`,
        type: stepType as any,
        url: `/${stepType}`,
        template: `${stepType}-default`,
        elements: [],
        isActive: true,
        isPublished: false,
        lastModified: new Date(),
        settings: {
          seo: { title: '', description: '', keywords: '' },
          tracking: {},
          redirects: {}
        },
        analytics: {
          views: 0,
          uniqueViews: 0,
          conversions: 0,
          conversionRate: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
          revenue: 0
        }
      })) : []
    };

    setFunnels(prev => [...prev, newFunnel]);
    setSelectedFunnel(newFunnel);
    toast.success('Funnel created successfully');
  }, [funnels.length]);

  const addStep = useCallback((stepType: FunnelStep['type']) => {
    if (!selectedFunnel) return;

    const newStep: FunnelStep = {
      id: `step-${Date.now()}`,
      name: `${stepType.charAt(0).toUpperCase() + stepType.slice(1)} Page`,
      type: stepType,
      url: `/${stepType}-${selectedFunnel.steps.length + 1}`,
      template: `${stepType}-default`,
      elements: [],
      isActive: true,
      isPublished: false,
      lastModified: new Date(),
      settings: {
        seo: { title: '', description: '', keywords: '' },
        tracking: {},
        redirects: {}
      },
      analytics: {
        views: 0,
        uniqueViews: 0,
        conversions: 0,
        conversionRate: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
        revenue: 0
      }
    };

    const updatedFunnel = {
      ...selectedFunnel,
      steps: [...selectedFunnel.steps, newStep],
      lastModified: new Date()
    };

    setFunnels(prev => prev.map(f => f.id === selectedFunnel.id ? updatedFunnel : f));
    setSelectedFunnel(updatedFunnel);
    setSelectedStep(newStep);
    toast.success('Step added successfully');
  }, [selectedFunnel]);

  const publishFunnel = useCallback(() => {
    if (!selectedFunnel) return;

    const updatedFunnel = {
      ...selectedFunnel,
      isActive: true,
      steps: selectedFunnel.steps.map(step => ({ ...step, isPublished: true })),
      lastModified: new Date()
    };

    setFunnels(prev => prev.map(f => f.id === selectedFunnel.id ? updatedFunnel : f));
    setSelectedFunnel(updatedFunnel);
    toast.success('Funnel published successfully');
  }, [selectedFunnel]);

  const getStepIcon = (type: FunnelStep['type']) => {
    switch (type) {
      case 'landing': return Target;
      case 'sales':return TrendingUp;
      case 'checkout': return CreditCard;
      case 'thank-you': return CheckCircle;
      case 'upsell': return ArrowUp;
      case 'downsell': return ArrowDown;
      case 'webinar': return Video;
      case 'survey': return FileText;
      case 'opt-in': return Mail;
      default: return Circle;
    }
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 15) return 'text-green-600';
    if (rate >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Left Sidebar - Funnels */}
      <div className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Funnels</h3>
            <Button 
              size="sm" 
              onClick={() => createFunnel()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-2">
          {funnels.map((funnel) => (
            <div
              key={funnel.id}
              className={`p-3 rounded cursor-pointer mb-2 ${
                selectedFunnel?.id === funnel.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedFunnel(funnel)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{funnel.name}</h4>
                <Badge variant={funnel.isActive ? "default" : "secondary"} className="text-xs">
                  {funnel.isActive ? 'Live' : 'Draft'}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mb-2">{funnel.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{funnel.steps.length} steps</span>
                <span className={`font-medium ${getConversionColor(funnel.analytics.conversionRate)}`}>
                  {funnel.analytics.conversionRate.toFixed(1)}% CVR
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Templates Section */}
        <div className="border-t">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-sm">Templates</h3>
          </div>
          <div className="p-2 space-y-2">
            {funnelTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 rounded cursor-pointer hover:bg-gray-50 border border-gray-200"
                onClick={() => createFunnel(template.id)}
              >
                <h4 className="font-medium text-sm">{template.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  <span className="text-gray-500">{template.steps.length} steps</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{selectedFunnel?.name || 'Select a funnel'}</h1>
              {selectedFunnel && (
                <p className="text-sm text-gray-600">{selectedFunnel.description}</p>
              )}
            </div>
            {selectedFunnel && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm" onClick={publishFunnel}>
                  <Save className="h-4 w-4 mr-1" />
                  Publish
                </Button>
              </div>
            )}
          </div>
          
          {selectedFunnel && (
            <div className="flex items-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {selectedFunnel.analytics.totalViews.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {selectedFunnel.analytics.totalConversions.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Conversions</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${getConversionColor(selectedFunnel.analytics.conversionRate)}`}>
                  {selectedFunnel.analytics.conversionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">CVR</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  ${selectedFunnel.analytics.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
            </div>
          )}
        </div>

        {selectedFunnel ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="overview" className="space-y-6">
                {/* Funnel Flow Visualization */}
                <Card>
                  <CardHeader>
                    <CardTitle>Funnel Flow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between overflow-x-auto pb-4">
                      {selectedFunnel.steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.type);
                        return (
                          <div key={step.id} className="flex items-center">
                            <div 
                              className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer min-w-[140px] ${
                                selectedStep?.id === step.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedStep(step)}
                            >
                              <StepIcon className="h-8 w-8 mb-2 text-blue-600" />
                              <div className="font-medium text-sm text-center">{step.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{step.type}</div>
                              <div className="mt-2 text-center">
                                <div className="text-sm font-medium">{step.analytics.views}</div>
                                <div className="text-xs text-gray-500">views</div>
                              </div>
                              <div className="text-center">
                                <div className={`text-sm font-medium ${getConversionColor(step.analytics.conversionRate)}`}>
                                  {step.analytics.conversionRate.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">CVR</div>
                              </div>
                              <Badge 
                                variant={step.isPublished ? "default" : "secondary"} 
                                className="text-xs mt-2"
                              >
                                {step.isPublished ? 'Live' : 'Draft'}
                              </Badge>
                            </div>
                            
                            {index < selectedFunnel.steps.length - 1 && (
                              <ArrowRight className="h-6 w-6 text-gray-400 mx-4" />
                            )}
                          </div>
                        );
                      })}
                      
                      <div className="flex flex-col items-center">
                        <Button
                          onClick={() => addStep('landing')}
                          variant="outline"
                          className="min-w-[140px] h-24 border-dashed"
                        >
                          <Plus className="h-8 w-8 text-gray-400" />
                        </Button>
                        <div className="mt-2 text-xs text-gray-500">Add Step</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversion Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Conversion Rate</span>
                        <span className={`font-medium ${getConversionColor(selectedFunnel.analytics.conversionRate)}`}>
                          {selectedFunnel.analytics.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Order Value</span>
                        <span className="font-medium">${selectedFunnel.analytics.avgOrderValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customer LTV</span>
                        <span className="font-medium">${selectedFunnel.analytics.customerLifetimeValue}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Traffic Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Views</span>
                        <span className="font-medium">{selectedFunnel.analytics.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Unique Visitors</span>
                        <span className="font-medium">{Math.floor(selectedFunnel.analytics.totalViews * 0.8).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Return Visitors</span>
                        <span className="font-medium">{Math.floor(selectedFunnel.analytics.totalViews * 0.2).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Revenue Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <span className="font-medium text-green-600">
                          ${selectedFunnel.analytics.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Recurring</span>
                        <span className="font-medium">${Math.floor(selectedFunnel.analytics.totalRevenue * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">One-time Sales</span>
                        <span className="font-medium">${Math.floor(selectedFunnel.analytics.totalRevenue * 0.7).toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="steps" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Funnel Steps</h2>
                  <Select onValueChange={(stepType) => addStep(stepType as any)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add new step" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landing">Landing Page</SelectItem>
                      <SelectItem value="sales">Sales Page</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                      <SelectItem value="upsell">Upsell</SelectItem>
                      <SelectItem value="downsell">Downsell</SelectItem>
                      <SelectItem value="thank-you">Thank You</SelectItem>
                      <SelectItem value="webinar">Webinar</SelectItem>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="opt-in">Opt-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {selectedFunnel.steps.map((step, index) => {
                    const StepIcon = getStepIcon(step.type);
                    return (
                      <Card key={step.id} className={selectedStep?.id === step.id ? 'ring-2 ring-blue-500' : ''}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                <StepIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{step.name}</h3>
                                <p className="text-sm text-gray-500">{step.url}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="font-medium">{step.analytics.views}</div>
                                <div className="text-xs text-gray-500">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{step.analytics.conversions}</div>
                                <div className="text-xs text-gray-500">Conversions</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-medium ${getConversionColor(step.analytics.conversionRate)}`}>
                                  {step.analytics.conversionRate.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">CVR</div>
                              </div>
                              
                              <Badge variant={step.isPublished ? "default" : "secondary"}>
                                {step.isPublished ? 'Published' : 'Draft'}
                              </Badge>

                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedStep(step)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {selectedStep?.id === step.id && (
                            <div className="mt-6 pt-6 border-t">
                              <Tabs defaultValue="design">
                                <TabsList>
                                  <TabsTrigger value="design">Design</TabsTrigger>
                                  <TabsTrigger value="settings">Settings</TabsTrigger>
                                  <TabsTrigger value="seo">SEO</TabsTrigger>
                                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                                </TabsList>

                                <TabsContent value="design" className="mt-4">
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                      <Label>Template</Label>
                                      <Select value={step.template}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {stepTemplates[step.type]?.map((template) => (
                                            <SelectItem key={template.id} value={template.id}>
                                              {template.name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Step Name</Label>
                                      <Input value={step.name} />
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <Button>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Open Page Builder
                                    </Button>
                                  </div>
                                </TabsContent>

                                <TabsContent value="settings" className="mt-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Page URL</Label>
                                      <Input value={step.url} />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <Label>Enable Timer</Label>
                                      <Switch />
                                    </div>
                                    
                                    <div>
                                      <Label>Success Redirect</Label>
                                      <Input placeholder="/next-step" />
                                    </div>
                                    
                                    <div>
                                      <Label>Failure Redirect</Label>
                                      <Input placeholder="/error" />
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="seo" className="mt-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label>SEO Title</Label>
                                      <Input value={step.settings.seo.title} />
                                    </div>
                                    <div>
                                      <Label>Meta Description</Label>
                                      <Textarea value={step.settings.seo.description} />
                                    </div>
                                    <div>
                                      <Label>Keywords</Label>
                                      <Input value={step.settings.seo.keywords} />
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="tracking" className="mt-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Google Analytics ID</Label>
                                      <Input value={step.settings.tracking.googleAnalytics} />
                                    </div>
                                    <div>
                                      <Label>Facebook Pixel ID</Label>
                                      <Input value={step.settings.tracking.facebookPixel} />
                                    </div>
                                    <div>
                                      <Label>Custom Tracking Code</Label>
                                      <Textarea 
                                        value={step.settings.tracking.customCode} 
                                        rows={6}
                                        className="font-mono text-sm"
                                      />
                                    </div>
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{selectedFunnel.analytics.totalViews.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Total Views</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{selectedFunnel.analytics.totalConversions.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Conversions</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${getConversionColor(selectedFunnel.analytics.conversionRate).replace('text-', 'text-')}`} />
                      <div className={`text-2xl font-bold ${getConversionColor(selectedFunnel.analytics.conversionRate)}`}>
                        {selectedFunnel.analytics.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">Conversion Rate</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">
                        ${selectedFunnel.analytics.totalRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Revenue</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Step-by-step analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Step Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedFunnel.steps.map((step, index) => {
                        const StepIcon = getStepIcon(step.type);
                        const dropOffRate = index > 0 
                          ? ((selectedFunnel.steps[index - 1].analytics.views - step.analytics.views) / selectedFunnel.steps[index - 1].analytics.views * 100)
                          : 0;
                        
                        return (
                          <div key={step.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                                <StepIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{step.name}</h4>
                                <p className="text-sm text-gray-500">{step.type}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-8">
                              <div className="text-center">
                                <div className="font-medium">{step.analytics.views.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{step.analytics.conversions.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Conversions</div>
                              </div>
                              <div className="text-center">
                                <div className={`font-medium ${getConversionColor(step.analytics.conversionRate)}`}>
                                  {step.analytics.conversionRate.toFixed(1)}%
                                </div>
                                <div className="text-xs text-gray-500">CVR</div>
                              </div>
                              {index > 0 && (
                                <div className="text-center">
                                  <div className="font-medium text-red-600">
                                    {dropOffRate.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-gray-500">Drop-off</div>
                                </div>
                              )}
                              <div className="text-center">
                                <div className="font-medium text-green-600">
                                  ${step.analytics.revenue.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">Revenue</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Funnel Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Funnel Name</Label>
                        <Input value={selectedFunnel.name} />
                      </div>
                      <div>
                        <Label>Domain</Label>
                        <Input value={selectedFunnel.settings.domain} />
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea value={selectedFunnel.description} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <Label>SSL Enabled</Label>
                        <Switch checked={selectedFunnel.settings.ssl} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Maintenance Mode</Label>
                        <Switch checked={selectedFunnel.settings.maintenance} />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-4">Integrations</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Email Service</Label>
                          <Select value={selectedFunnel.settings.integrations.email}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select email service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mailchimp">Mailchimp</SelectItem>
                              <SelectItem value="convertkit">ConvertKit</SelectItem>
                              <SelectItem value="activecampaign">ActiveCampaign</SelectItem>
                              <SelectItem value="hubspot">HubSpot</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>CRM</Label>
                          <Select value={selectedFunnel.settings.integrations.crm}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select CRM" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hubspot">HubSpot</SelectItem>
                              <SelectItem value="salesforce">Salesforce</SelectItem>
                              <SelectItem value="pipedrive">Pipedrive</SelectItem>
                              <SelectItem value="zoho">Zoho CRM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Payment Processor</Label>
                          <Select value={selectedFunnel.settings.integrations.payment}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment processor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="stripe">Stripe</SelectItem>
                              <SelectItem value="paypal">PayPal</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="authorize">Authorize.net</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No Funnel Selected</h2>
              <p className="text-gray-600 mb-6">Select a funnel from the sidebar or create a new one</p>
              <Button onClick={() => createFunnel()}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Funnel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
