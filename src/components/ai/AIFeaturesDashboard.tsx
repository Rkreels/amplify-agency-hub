
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Pause
} from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';
import { AIConversationResponses } from './AIConversationResponses';
import { AIContentGeneration } from './AIContentGeneration';
import { AILeadScoring } from './AILeadScoring';
import { AIVoiceAssistants } from './AIVoiceAssistants';
import { AIChatbots } from './AIChatbots';
import { AIAnalytics } from './AIAnalytics';
import { AIAppointmentScheduling } from './AIAppointmentScheduling';
import { AISocialMediaManagement } from './AISocialMediaManagement';
import { AIReputationManagement } from './AIReputationManagement';

export function AIFeaturesDashboard() {
  const {
    conversationResponses,
    aiWorkflowActions,
    leadScores,
    generatedContent,
    voiceAssistants,
    chatbots,
    analyticsInsights,
    aiAppointments,
    aiSocialPosts,
    reputationResponses,
    isGeneratingResponse,
    isGeneratingContent
  } = useAIStore();

  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const aiFeatures = [
    {
      id: 'conversation_responses',
      title: 'AI Conversation Responses',
      description: 'Automatically generate intelligent responses to customer messages',
      icon: MessageSquare,
      status: 'active',
      count: conversationResponses.length,
      metric: '89% accuracy'
    },
    {
      id: 'workflow_automation',
      title: 'AI Workflow Automation',
      description: 'Smart workflows that adapt based on AI insights',
      icon: Zap,
      status: 'active',
      count: aiWorkflowActions.length,
      metric: '45% faster'
    },
    {
      id: 'lead_scoring',
      title: 'AI Lead Scoring',
      description: 'Automatically score and prioritize leads using AI',
      icon: TrendingUp,
      status: 'active',
      count: leadScores.length,
      metric: '92% accuracy'
    },
    {
      id: 'content_generation',
      title: 'AI Content Generation',
      description: 'Generate emails, SMS, and marketing content',
      icon: Brain,
      status: 'active',
      count: generatedContent.length,
      metric: '78% engagement'
    },
    {
      id: 'voice_assistants',
      title: 'AI Voice Assistants',
      description: 'Handle phone calls with intelligent voice AI',
      icon: Phone,
      status: 'active',
      count: voiceAssistants.length,
      metric: '24/7 available'
    },
    {
      id: 'chatbots',
      title: 'AI Chatbots',
      description: 'Smart chatbots for websites and social media',
      icon: Bot,
      status: 'active',
      count: chatbots.length,
      metric: '85% resolution'
    },
    {
      id: 'analytics_insights',
      title: 'AI Analytics & Insights',
      description: 'Discover patterns and trends in your data',
      icon: BarChart3,
      status: 'active',
      count: analyticsInsights.length,
      metric: 'Real-time'
    },
    {
      id: 'appointment_scheduling',
      title: 'AI Appointment Scheduling',
      description: 'Intelligent scheduling based on preferences',
      icon: Calendar,
      status: 'active',
      count: aiAppointments.length,
      metric: '95% accuracy'
    },
    {
      id: 'social_media',
      title: 'AI Social Media Management',
      description: 'Generate and schedule social media content',
      icon: Share2,
      status: 'active',
      count: aiSocialPosts.length,
      metric: '+45% engagement'
    },
    {
      id: 'reputation_management',
      title: 'AI Reputation Management',
      description: 'Automatically respond to reviews and feedback',
      icon: Star,
      status: 'active',
      count: reputationResponses.length,
      metric: '4.8★ average'
    }
  ];

  const handleFeatureToggle = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
    toast.success(`AI feature ${activeFeature === featureId ? 'minimized' : 'expanded'}`);
  };

  const handleQuickAction = async (action: string, featureId: string) => {
    toast.success(`${action} initiated for ${featureId}`);
  };

  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'conversation_responses':
        return <AIConversationResponses />;
      case 'content_generation':
        return <AIContentGeneration />;
      case 'lead_scoring':
        return <AILeadScoring />;
      case 'voice_assistants':
        return <AIVoiceAssistants />;
      case 'chatbots':
        return <AIChatbots />;
      case 'analytics_insights':
        return <AIAnalytics />;
      case 'appointment_scheduling':
        return <AIAppointmentScheduling />;
      case 'social_media':
        return <AISocialMediaManagement />;
      case 'reputation_management':
        return <AIReputationManagement />;
      default:
        return null;
    }
  };

  if (selectedComponent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedComponent(null)}
          >
            ← Back to AI Dashboard
          </Button>
        </div>
        {renderSelectedComponent()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Features Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor all AI-powered features in your platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Train Models
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active AI Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <Badge variant="secondary" className="mt-1">
              All systems operational
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Interactions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,453</div>
            <p className="text-sm text-muted-foreground">+23% from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Automation Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-sm text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5h</div>
            <p className="text-sm text-muted-foreground">Per day average</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature) => {
          const Icon = feature.icon;
          const isExpanded = activeFeature === feature.id;
          
          return (
            <Card 
              key={feature.id} 
              className={`transition-all cursor-pointer hover:shadow-md ${
                isExpanded ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleFeatureToggle(feature.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={feature.status === 'active' ? 'default' : 'secondary'}
                  >
                    {feature.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    {feature.count} active items
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {feature.metric}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComponent(feature.id);
                        }}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAction('Test', feature.id);
                        }}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last updated: 2 minutes ago
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent AI Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
          <CardDescription>Latest AI-powered actions and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Generated email response', time: '2 minutes ago', success: true },
              { action: 'Updated lead score for John Doe', time: '5 minutes ago', success: true },
              { action: 'Scheduled appointment via voice AI', time: '8 minutes ago', success: true },
              { action: 'Generated social media post', time: '12 minutes ago', success: true },
              { action: 'Analyzed conversation sentiment', time: '15 minutes ago', success: true }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
