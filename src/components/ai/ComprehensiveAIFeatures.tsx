
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Brain, 
  MessageSquare, 
  Calendar, 
  Mail, 
  Phone, 
  Star, 
  Target, 
  Zap,
  Bot,
  Mic,
  Image,
  FileText,
  BarChart3,
  Settings,
  Play,
  Pause,
  Save
} from "lucide-react";

export function ComprehensiveAIFeatures() {
  const [activeTab, setActiveTab] = useState("chatbots");
  const [isTraining, setIsTraining] = useState(false);

  const aiFeatures = [
    {
      title: "AI Chatbots",
      description: "Intelligent conversational AI for customer support",
      icon: MessageSquare,
      status: "active",
      usage: "2,450 conversations this month"
    },
    {
      title: "AI Appointment Scheduling",
      description: "Automated booking and calendar management",
      icon: Calendar,
      status: "active",
      usage: "156 appointments scheduled"
    },
    {
      title: "AI Voice Assistants",
      description: "Voice-powered customer interactions",
      icon: Mic,
      status: "beta",
      usage: "89 voice calls handled"
    },
    {
      title: "AI Content Generation",
      description: "Automated content creation for marketing",
      icon: FileText,
      status: "active",
      usage: "45 pieces of content generated"
    },
    {
      title: "AI Lead Scoring",
      description: "Intelligent lead qualification and scoring",
      icon: Target,
      status: "active",
      usage: "1,248 leads scored"
    },
    {
      title: "AI Analytics",
      description: "Predictive analytics and insights",
      icon: BarChart3,
      status: "active",
      usage: "Daily insights generated"
    }
  ];

  const chatbotTemplates = [
    { name: "Customer Support", description: "Handle common customer inquiries", category: "Support" },
    { name: "Lead Qualification", description: "Qualify leads automatically", category: "Sales" },
    { name: "Appointment Booking", description: "Book appointments seamlessly", category: "Scheduling" },
    { name: "Product Recommendations", description: "Suggest products based on needs", category: "Sales" },
    { name: "FAQ Assistant", description: "Answer frequently asked questions", category: "Support" },
    { name: "Survey Collector", description: "Collect customer feedback", category: "Research" }
  ];

  const voiceAgents = [
    { name: "Sales Agent", status: "active", calls: 45, conversion: "12%" },
    { name: "Support Agent", status: "active", calls: 89, conversion: "78%" },
    { name: "Appointment Agent", status: "paused", calls: 23, conversion: "34%" },
    { name: "Follow-up Agent", status: "active", calls: 67, conversion: "23%" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Features
          </h1>
          <p className="text-muted-foreground">Leverage AI to automate and optimize your business processes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
          <Button>
            <Bot className="h-4 w-4 mr-2" />
            Create AI Agent
          </Button>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <feature.icon className="h-8 w-8 text-primary" />
                <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                  {feature.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{feature.usage}</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed AI Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
          <TabsTrigger value="voice">Voice AI</TabsTrigger>
          <TabsTrigger value="content">Content AI</TabsTrigger>
          <TabsTrigger value="scoring">Lead Scoring</TabsTrigger>
          <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="chatbots" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Templates</CardTitle>
                <p className="text-sm text-muted-foreground">Choose from pre-built chatbot templates</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {chatbotTemplates.map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <Badge variant="outline" className="mt-1">{template.category}</Badge>
                    </div>
                    <Button variant="outline" size="sm">Deploy</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chatbot Builder</CardTitle>
                <p className="text-sm text-muted-foreground">Create custom chatbot flows</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Chatbot Name</label>
                  <Input placeholder="Enter chatbot name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Welcome Message</label>
                  <Textarea placeholder="Hi! How can I help you today?" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enable AI Learning</span>
                  <Switch />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Play className="h-4 w-4 mr-2" />
                    Test Chatbot
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice AI Agents</CardTitle>
              <p className="text-sm text-muted-foreground">Manage your AI voice assistants</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {voiceAgents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {agent.calls} calls • {agent.conversion} conversion rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {agent.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Generator</CardTitle>
                <p className="text-sm text-muted-foreground">Generate marketing content with AI</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Content Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Email Subject Lines</option>
                    <option>Social Media Posts</option>
                    <option>Blog Post Ideas</option>
                    <option>Ad Copy</option>
                    <option>Product Descriptions</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Topic/Keywords</label>
                  <Input placeholder="Enter topic or keywords" />
                </div>
                <div>
                  <label className="text-sm font-medium">Tone</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Professional</option>
                    <option>Friendly</option>
                    <option>Casual</option>
                    <option>Urgent</option>
                    <option>Informative</option>
                  </select>
                </div>
                <Button className="w-full">
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <p className="text-sm text-muted-foreground">AI-generated content will appear here</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    "Unlock Your Business Potential: 5 Strategies That Actually Work"
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Email Subject Line • Professional tone</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    "Transform your business with proven strategies that deliver real results..."
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Social Media Post • Professional tone</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Regenerate</Button>
                  <Button className="flex-1">Use Content</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Lead Scoring</CardTitle>
              <p className="text-sm text-muted-foreground">Intelligent lead qualification and scoring</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Hot</div>
                  <div className="text-sm text-muted-foreground">Score: 85+</div>
                  <div className="text-lg font-semibold">156 Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">Warm</div>
                  <div className="text-sm text-muted-foreground">Score: 60-84</div>
                  <div className="text-lg font-semibold">324 Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">Cold</div>
                  <div className="text-sm text-muted-foreground">Score: 0-59</div>
                  <div className="text-lg font-semibold">768 Leads</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Scoring Criteria</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Engagement</span>
                    <span className="text-sm font-medium">+25 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Website Activity</span>
                    <span className="text-sm font-medium">+20 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Form Submissions</span>
                    <span className="text-sm font-medium">+30 points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Company Size</span>
                    <span className="text-sm font-medium">+15 points</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <p className="text-sm text-muted-foreground">Predictive analytics and recommendations</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Conversion Opportunity</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    45 warm leads are likely to convert within the next 7 days
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Best Performing Content</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Email campaigns with personalized subject lines perform 34% better
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Optimal Timing</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tuesday 2-4 PM shows highest engagement rates for your audience
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Predictions</CardTitle>
                <p className="text-sm text-muted-foreground">AI-powered forecasting</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Next Month Revenue</span>
                    <span className="text-lg font-bold text-green-600">$78,500</span>
                  </div>
                  <div className="text-xs text-muted-foreground">+17% from current month</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Expected Leads</span>
                    <span className="text-lg font-bold text-blue-600">1,650</span>
                  </div>
                  <div className="text-xs text-muted-foreground">+32% from current month</div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="text-lg font-bold text-purple-600">22.4%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">+4% improvement predicted</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Training</CardTitle>
              <p className="text-sm text-muted-foreground">Train AI models with your business data</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Customer Support Model</h4>
                  <p className="text-sm text-muted-foreground">Last trained: 2 days ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Active</Badge>
                  <Button variant="outline" size="sm" 
                          onClick={() => setIsTraining(!isTraining)}
                          disabled={isTraining}>
                    {isTraining ? 'Training...' : 'Retrain'}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Sales Assistant Model</h4>
                  <p className="text-sm text-muted-foreground">Last trained: 5 days ago</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Needs Update</Badge>
                  <Button variant="outline" size="sm">Retrain</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Training Data Sources</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Email Conversations</span>
                    <Badge variant="outline">2,450 items</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Chat Transcripts</span>
                    <Badge variant="outline">1,890 items</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">Support Tickets</span>
                    <Badge variant="outline">756 items</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">FAQ Database</span>
                    <Badge variant="outline">145 items</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
