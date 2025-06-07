
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  MessageSquare, 
  Zap, 
  Target, 
  BarChart3, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  TrendingUp,
  Bot,
  Lightbulb,
  Clock,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface AIModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  status: 'active' | 'training' | 'inactive';
}

interface AIInsight {
  id: string;
  type: 'lead_score' | 'churn_risk' | 'upsell_opportunity' | 'engagement_trend';
  title: string;
  description: string;
  confidence: number;
  actionRequired: boolean;
}

export function ComprehensiveAIFeatures() {
  const [activeModel, setActiveModel] = useState<string>('lead-scoring');
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const aiModels: AIModel[] = [
    {
      id: 'lead-scoring',
      name: 'Lead Scoring AI',
      description: 'Automatically scores leads based on behavior and demographics',
      accuracy: 94.2,
      status: 'active'
    },
    {
      id: 'churn-prediction',
      name: 'Churn Prediction',
      description: 'Identifies customers at risk of leaving',
      accuracy: 89.7,
      status: 'active'
    },
    {
      id: 'response-ai',
      name: 'Smart Response AI',
      description: 'Generates contextual responses to customer inquiries',
      accuracy: 91.5,
      status: 'training'
    },
    {
      id: 'appointment-ai',
      name: 'Appointment Optimization',
      description: 'Optimizes appointment scheduling and reduces no-shows',
      accuracy: 87.3,
      status: 'active'
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: 'insight-1',
      type: 'lead_score',
      title: 'High-value lead detected',
      description: 'John Smith has a 92% likelihood of converting based on recent engagement',
      confidence: 92,
      actionRequired: true
    },
    {
      id: 'insight-2',
      type: 'churn_risk',
      title: 'Customer churn alert',
      description: 'ABC Company shows signs of decreased engagement over the past 30 days',
      confidence: 78,
      actionRequired: true
    },
    {
      id: 'insight-3',
      type: 'upsell_opportunity',
      title: 'Upsell opportunity identified',
      description: 'TechCorp is using 95% of their current plan limits',
      confidence: 85,
      actionRequired: false
    }
  ];

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const responses = [
        'Based on your recent campaign data, I recommend increasing your email frequency by 15% for better engagement.',
        'Your lead conversion rate could improve by 23% if you follow up within 2 hours instead of 24 hours.',
        'I notice your Thursday appointments have a 40% higher show rate. Consider moving more appointments to Thursdays.',
        'Your social media engagement peaks at 2 PM and 7 PM. Schedule your posts accordingly for maximum reach.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      toast.success(`AI Assistant: ${randomResponse}`);
      setChatInput('');
      setIsProcessing(false);
    }, 2000);
  };

  const trainModel = (modelId: string) => {
    toast.success(`Started training ${aiModels.find(m => m.id === modelId)?.name}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Command Center</h1>
          <p className="text-gray-600">Leverage artificial intelligence to supercharge your business</p>
        </div>
        <Badge className="bg-green-100 text-green-700">
          AI Status: Active
        </Badge>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          <TabsTrigger value="automation">AI Automation</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="training">Model Training</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiModels.map((model) => (
              <Card key={model.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {model.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{model.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Accuracy</span>
                      <Badge variant="outline">{model.accuracy}%</Badge>
                    </div>
                    <Progress value={model.accuracy} />
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={model.status === 'active' ? 'default' : 
                                model.status === 'training' ? 'secondary' : 'destructive'}
                      >
                        {model.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => trainModel(model.id)}
                      >
                        Retrain
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {insight.type === 'lead_score' && <Target className="h-4 w-4 text-green-600" />}
                          {insight.type === 'churn_risk' && <AlertCircle className="h-4 w-4 text-red-600" />}
                          {insight.type === 'upsell_opportunity' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                          <h3 className="font-medium">{insight.title}</h3>
                          {insight.actionRequired && <Badge className="bg-orange-100 text-orange-700">Action Required</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <Progress value={insight.confidence} className="w-20 h-2" />
                          <span className="text-xs font-medium">{insight.confidence}%</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Business Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="bg-blue-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">Hello! I'm your AI assistant. I can help you with business insights, automation recommendations, and performance optimization. What would you like to know?</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your business..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                  />
                  <Button 
                    onClick={handleChatSubmit}
                    disabled={isProcessing || !chatInput.trim()}
                  >
                    {isProcessing ? <Clock className="h-4 w-4 animate-spin" /> : 'Send'}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Optimize my campaigns',
                    'Lead scoring insights',
                    'Best time to call leads',
                    'Churn risk analysis'
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setChatInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Smart Automations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">Auto Lead Scoring</h4>
                      <p className="text-sm text-gray-600">Automatically score incoming leads</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">Smart Follow-up</h4>
                      <p className="text-sm text-gray-600">AI-powered follow-up timing</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">Response Suggestions</h4>
                      <p className="text-sm text-gray-600">AI-generated response templates</p>
                    </div>
                    <Badge>Inactive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Chatbots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Website Chatbot</h4>
                    <p className="text-sm text-gray-600 mb-2">24/7 customer support</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversations today: 47</span>
                      <Button size="sm">Configure</Button>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <h4 className="font-medium">Facebook Messenger Bot</h4>
                    <p className="text-sm text-gray-600 mb-2">Social media automation</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Messages handled: 23</span>
                      <Button size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  AI Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94.2%</div>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Predictions Made
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2,847</div>
                  <p className="text-sm text-gray-600">This Month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Actions Triggered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">1,256</div>
                  <p className="text-sm text-gray-600">Automated Actions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Training Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Custom Model Training</h3>
                  <p className="text-sm text-gray-600 mb-4">Train AI models with your specific business data for better accuracy.</p>
                  <div className="flex gap-2">
                    <Button>Upload Training Data</Button>
                    <Button variant="outline">View Training History</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-medium mb-2">Active Training Session</h3>
                  <p className="text-sm mb-2">Lead Scoring Model - Batch #247</p>
                  <Progress value={67} />
                  <p className="text-xs text-gray-600 mt-1">Estimated completion: 2 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
