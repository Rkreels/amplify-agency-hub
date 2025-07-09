import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Bot, Settings, Plus } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIChatbots() {
  const { chatbots, createChatbot } = useAIStore();
  
  const [newChatbot, setNewChatbot] = useState({
    name: '',
    type: 'website' as const,
    personality: 'friendly'
  });

  const handleCreateChatbot = () => {
    if (!newChatbot.name.trim()) {
      toast.error('Please enter chatbot name');
      return;
    }

    createChatbot({
      ...newChatbot,
      platform: newChatbot.type,
      knowledgeBase: [],
      isActive: true,
      conversationsHandled: 0,
      averageResponseTime: 2.5,
      handoffRate: 0.05,
      languages: ['en-US'],
      responses: {},
      analytics: {
        conversations: 0,
        resolution_rate: 85,
        satisfaction_score: 4.2
      }
    });

    setNewChatbot({
      name: '',
      type: 'website',
      personality: 'friendly'
    });

    toast.success('Chatbot created successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Chatbots
          </h2>
          <p className="text-muted-foreground">
            Smart chatbots for websites and social media platforms
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Chatbot Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Chatbot</CardTitle>
            <CardDescription>Set up an AI-powered chatbot for your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chatbot Name</Label>
              <Input
                placeholder="e.g., Website Assistant"
                value={newChatbot.name}
                onChange={(e) => setNewChatbot({...newChatbot, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select 
                  value={newChatbot.type} 
                  onValueChange={(value: any) => setNewChatbot({...newChatbot, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Personality</Label>
                <Select 
                  value={newChatbot.personality} 
                  onValueChange={(value) => setNewChatbot({...newChatbot, personality: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helpful_professional">Helpful & Professional</SelectItem>
                    <SelectItem value="friendly_casual">Friendly & Casual</SelectItem>
                    <SelectItem value="formal_direct">Formal & Direct</SelectItem>
                    <SelectItem value="warm_supportive">Warm & Supportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Knowledge Base</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add knowledge topic (e.g., pricing, support)"
                  value={newChatbot.knowledgeBase}
                  onChange={(e) => setNewChatbot({...newChatbot, knowledgeBase: e.target.value})}
                  onKeyPress={(e) => e.key === 'Enter' && addKnowledge()}
                />
                <Button onClick={addKnowledge} size="sm">Add</Button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {newChatbot.knowledgeBase.map((knowledge, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeKnowledge(index)}>
                    {knowledge} ×
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handleCreateChatbot} className="w-full">
              <Bot className="h-4 w-4 mr-2" />
              Create Chatbot
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chatbot Analytics</CardTitle>
            <CardDescription>Performance metrics across all chatbots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1,248</div>
                  <div className="text-sm text-purple-600">Total Conversations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-green-600">Resolution Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Website Chats</span>
                  <span className="font-medium">892</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Facebook Messages</span>
                  <span className="font-medium">234</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Instagram DMs</span>
                  <span className="font-medium">122</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Chatbots</CardTitle>
          <CardDescription>Manage your AI-powered chatbots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatbots.map((chatbot) => {
              const PlatformIcon = platformIcons[chatbot.type];
              return (
                <div key={chatbot.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <PlatformIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{chatbot.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {chatbot.type} • {chatbot.personality.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={chatbot.isActive} />
                      <Badge variant={chatbot.isActive ? 'default' : 'secondary'}>
                        {chatbot.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="font-medium">{chatbot.analytics.conversations}</div>
                      <div className="text-sm text-muted-foreground">Conversations</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{chatbot.analytics.resolution_rate}%</div>
                      <div className="text-sm text-muted-foreground">Resolution Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{chatbot.analytics.satisfaction_score}</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Knowledge Base:</h4>
                    <div className="flex gap-1 flex-wrap">
                      {chatbot.knowledgeBase.map((knowledge, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {knowledge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Test Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

