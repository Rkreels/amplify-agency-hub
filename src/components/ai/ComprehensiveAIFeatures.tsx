
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Share2, 
  Star, 
  Phone,
  Zap,
  BarChart3,
  Settings,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Mic,
  Eye,
  Target,
  Users,
  Mail,
  FileText,
  Sparkles
} from 'lucide-react';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';

interface AIModel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'image' | 'analysis';
  status: 'active' | 'training' | 'inactive';
  accuracy: number;
  lastTrained: Date;
  usage: number;
}

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  type: 'conversation' | 'content' | 'analysis' | 'automation';
  isActive: boolean;
  successRate: number;
  executions: number;
}

export function ComprehensiveAIFeatures() {
  const { announceFeature } = useVoiceTraining();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isTrainingModel, setIsTrainingModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      id: '1',
      name: 'Conversation AI',
      type: 'text',
      status: 'active',
      accuracy: 94.2,
      lastTrained: new Date('2024-12-01'),
      usage: 15420
    },
    {
      id: '2',
      name: 'Voice Assistant',
      type: 'voice',
      status: 'active',
      accuracy: 89.7,
      lastTrained: new Date('2024-11-28'),
      usage: 8932
    },
    {
      id: '3',
      name: 'Content Generator',
      type: 'text',
      status: 'training',
      accuracy: 78.5,
      lastTrained: new Date('2024-12-10'),
      usage: 5234
    },
    {
      id: '4',
      name: 'Lead Scorer',
      type: 'analysis',
      status: 'active',
      accuracy: 91.8,
      lastTrained: new Date('2024-11-30'),
      usage: 12045
    }
  ]);

  const [aiWorkflows, setAiWorkflows] = useState<AIWorkflow[]>([
    {
      id: '1',
      name: 'Smart Email Responses',
      description: 'Automatically generate contextual email responses',
      type: 'conversation',
      isActive: true,
      successRate: 92.3,
      executions: 2847
    },
    {
      id: '2',
      name: 'Content Optimization',
      description: 'Optimize marketing content for better engagement',
      type: 'content',
      isActive: true,
      successRate: 87.9,
      executions: 1653
    },
    {
      id: '3',
      name: 'Customer Sentiment Analysis',
      description: 'Analyze customer sentiment from conversations',
      type: 'analysis',
      isActive: false,
      successRate: 94.1,
      executions: 5672
    },
    {
      id: '4',
      name: 'Automated Follow-ups',
      description: 'AI-powered follow-up sequences based on behavior',
      type: 'automation',
      isActive: true,
      successRate: 78.6,
      executions: 3891
    }
  ]);

  const [generatingContent, setGeneratingContent] = useState(false);
  const [contentPrompt, setContentPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');

  useEffect(() => {
    announceFeature(
      'AI Features Dashboard',
      'Access comprehensive AI-powered tools for your business. Manage AI models, create intelligent workflows, generate content, analyze data, and automate tasks with advanced artificial intelligence capabilities.'
    );
  }, [announceFeature]);

  const handleTrainModel = async (model: AIModel) => {
    setIsTrainingModel(true);
    setSelectedModel(model);
    
    // Simulate training process
    toast.success(`Starting training for ${model.name}...`);
    
    setTimeout(() => {
      setAiModels(prev => prev.map(m => 
        m.id === model.id 
          ? { ...m, status: 'training' as const, lastTrained: new Date() }
          : m
      ));
    }, 1000);

    setTimeout(() => {
      setAiModels(prev => prev.map(m => 
        m.id === model.id 
          ? { 
              ...m, 
              status: 'active' as const, 
              accuracy: Math.min(100, m.accuracy + Math.random() * 5),
              lastTrained: new Date() 
            }
          : m
      ));
      setIsTrainingModel(false);
      setSelectedModel(null);
      toast.success(`Training completed for ${model.name}!`);
    }, 5000);
  };

  const handleToggleWorkflow = (workflow: AIWorkflow) => {
    setAiWorkflows(prev => prev.map(w => 
      w.id === workflow.id ? { ...w, isActive: !w.isActive } : w
    ));
    toast.success(`Workflow ${workflow.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleGenerateContent = async () => {
    if (!contentPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setGeneratingContent(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = `Based on your prompt "${contentPrompt}", here's AI-generated content:

Subject: ${contentPrompt.includes('email') ? 'Personalized Email Campaign' : 'Generated Content'}

${contentPrompt.includes('email') 
  ? `Hi there! We noticed you've been interested in our services. Here's a special offer just for you - 20% off your first purchase! This limited-time deal won't last long, so act fast. Click here to claim your discount and transform your business today.`
  : `This is intelligently generated content based on your specific requirements. Our AI has analyzed your prompt and created relevant, engaging copy that aligns with your brand voice and marketing goals. The content is optimized for engagement and conversion.`
}

Best regards,
Your AI Assistant`;

      setGeneratedContent(sampleContent);
      setGeneratingContent(false);
      toast.success('Content generated successfully!');
    }, 3000);
  };

  const ModelCard = ({ model }: { model: AIModel }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return 'text-green-600';
        case 'training': return 'text-yellow-600';
        case 'inactive': return 'text-gray-500';
        default: return 'text-gray-500';
      }
    };

    const getModelIcon = (type: string) => {
      switch (type) {
        case 'text': return MessageSquare;
        case 'voice': return Mic;
        case 'image': return Eye;
        case 'analysis': return BarChart3;
        default: return Brain;
      }
    };

    const ModelIcon = getModelIcon(model.type);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ModelIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Badge 
                  variant={model.status === 'active' ? 'default' : model.status === 'training' ? 'secondary' : 'outline'}
                  className="mt-1"
                >
                  {model.status}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTrainModel(model)}
              disabled={model.status === 'training'}
            >
              {model.status === 'training' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Accuracy</span>
              <span className="font-medium">{model.accuracy.toFixed(1)}%</span>
            </div>
            <Progress value={model.accuracy} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold">{model.usage.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Usage Count</div>
            </div>
            <div>
              <div className="text-sm font-medium">{model.type.toUpperCase()}</div>
              <div className="text-xs text-muted-foreground">Model Type</div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Last trained: {model.lastTrained.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    );
  };

  const WorkflowCard = ({ workflow }: { workflow: AIWorkflow }) => {
    const getWorkflowIcon = (type: string) => {
      switch (type) {
        case 'conversation': return MessageSquare;
        case 'content': return FileText;
        case 'analysis': return BarChart3;
        case 'automation': return Zap;
        default: return Bot;
      }
    };

    const WorkflowIcon = getWorkflowIcon(workflow.type);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <WorkflowIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
              </div>
            </div>
            <Switch
              checked={workflow.isActive}
              onCheckedChange={() => handleToggleWorkflow(workflow)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">{workflow.successRate}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-xl font-bold">{workflow.executions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Executions</div>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className="w-full justify-center"
          >
            {workflow.type.toUpperCase()}
          </Badge>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-primary" />
            AI Features Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor all AI-powered features and capabilities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New AI Model
          </Button>
        </div>
      </div>

      {/* AI Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active AI Models</p>
                <p className="text-2xl font-bold">{aiModels.filter(m => m.status === 'active').length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Interactions Today</p>
                <p className="text-2xl font-bold">2,453</p>
                <p className="text-xs text-muted-foreground">+23% from yesterday</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Success Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {(aiWorkflows.reduce((acc, w) => acc + w.successRate, 0) / aiWorkflows.length).toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Saved Today</p>
                <p className="text-2xl font-bold">12.5h</p>
                <p className="text-xs text-muted-foreground">Automation impact</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="generator">Content Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Generated email response', time: '2 minutes ago', type: 'text' },
                    { action: 'Analyzed customer sentiment', time: '5 minutes ago', type: 'analysis' },
                    { action: 'Created marketing content', time: '8 minutes ago', type: 'content' },
                    { action: 'Processed voice message', time: '12 minutes ago', type: 'voice' },
                    { action: 'Updated lead score', time: '15 minutes ago', type: 'analysis' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm">{activity.action}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Model Accuracy</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Quality</span>
                      <span className="font-medium">89.7%</span>
                    </div>
                    <Progress value={89.7} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Automation Success</span>
                      <span className="font-medium">87.3%</span>
                    </div>
                    <Progress value={87.3} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>User Satisfaction</span>
                      <span className="font-medium">92.8%</span>
                    </div>
                    <Progress value={92.8} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiModels.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Generator</CardTitle>
              <CardDescription>
                Generate marketing content, emails, and copy using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-prompt">Content Prompt</Label>
                <Textarea
                  id="content-prompt"
                  placeholder="Describe what you want to generate (e.g., 'Create a welcome email for new subscribers')"
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleGenerateContent}
                disabled={generatingContent || !contentPrompt.trim()}
                className="w-full"
              >
                {generatingContent ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>

              {generatedContent && (
                <div className="space-y-2">
                  <Label>Generated Content</Label>
                  <Textarea
                    value={generatedContent}
                    readOnly
                    rows={8}
                    className="bg-muted"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                      Copy Content
                    </Button>
                    <Button variant="outline" onClick={() => setGeneratedContent('')}>
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Training Modal */}
      {isTrainingModel && selectedModel && (
        <Dialog open={isTrainingModel} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Training AI Model</DialogTitle>
              <DialogDescription>
                {selectedModel.name} is being trained with new data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div>
                  <p className="font-medium">Training in progress...</p>
                  <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                </div>
              </div>
              <Progress value={60} />
              <p className="text-xs text-muted-foreground">
                Processing training data and optimizing model parameters
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
