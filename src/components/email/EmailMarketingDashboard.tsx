
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Mail, 
  Send, 
  Users, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  BarChart3,
  Split,
  Palette,
  Code,
  Calendar,
  Target,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useEmailMarketingStore } from '@/store/useEmailMarketingStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';

export function EmailMarketingDashboard() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  
  const { 
    campaigns, 
    sequences, 
    templates, 
    deliverability,
    addCampaign,
    sendCampaign 
  } = useEmailMarketingStore();
  
  const { announceFeature } = useVoiceTraining();

  const handleCreateCampaign = () => {
    setIsBuilderOpen(true);
    announceFeature('Email Campaign Builder', 'Opening advanced email campaign builder with drag-and-drop templates and A/B testing capabilities');
  };

  const handleSendCampaign = (campaignId: string) => {
    sendCampaign(campaignId);
    announceFeature('Campaign Sent', 'Email campaign has been queued and will be delivered according to your sending schedule');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Marketing</h2>
          <p className="text-muted-foreground">Create, manage, and track email campaigns with advanced analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={handleCreateCampaign}>
            <Mail className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Email Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Emails Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,567</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <p className="text-xs text-muted-foreground">+2.3% vs avg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MousePointer className="h-4 w-4 mr-2" />
              Click Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-muted-foreground">+0.5% vs avg</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,432</div>
            <p className="text-xs text-muted-foreground">+156 this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,845</div>
            <p className="text-xs text-muted-foreground">From email</p>
          </CardContent>
        </Card>
      </div>

      {/* Deliverability Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Deliverability Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reputation Score</span>
                <span className="text-sm">{deliverability.reputation}/100</span>
              </div>
              <Progress value={deliverability.reputation} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Deliverability Rate</span>
                <span className="text-sm">{deliverability.deliverabilityRate}%</span>
              </div>
              <Progress value={deliverability.deliverabilityRate} className="h-2" />
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">DKIM Setup</span>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">DMARC Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Management Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ab-testing">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{campaign.name}</h3>
                      <Badge variant={
                        campaign.status === 'sent' ? 'default' :
                        campaign.status === 'sending' ? 'secondary' :
                        campaign.status === 'scheduled' ? 'outline' : 'secondary'
                      }>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {campaign.subject}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Recipients:</span>
                        <div className="font-medium">{campaign.recipients.count.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Opens:</span>
                        <div className="font-medium">
                          {campaign.stats.opened} ({((campaign.stats.opened / campaign.stats.sent) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Clicks:</span>
                        <div className="font-medium">
                          {campaign.stats.clicked} ({((campaign.stats.clicked / campaign.stats.sent) * 100).toFixed(1)}%)
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sent:</span>
                        <div className="font-medium">{campaign.sentAt?.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {campaign.status === 'draft' && (
                      <Button onClick={() => handleSendCampaign(campaign.id)}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    )}
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sequences" className="space-y-4">
          {sequences.map((sequence) => (
            <Card key={sequence.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{sequence.name}</h3>
                      <Badge variant={sequence.isActive ? 'default' : 'secondary'}>
                        {sequence.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{sequence.description}</p>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Enrolled:</span>
                        <span className="font-medium ml-2">{sequence.stats.enrolled}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Completed:</span>
                        <span className="font-medium ml-2">{sequence.stats.completed}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Emails:</span>
                        <span className="font-medium ml-2">{sequence.emails.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Edit</Button>
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.subject}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button size="sm">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Performance charts will be displayed here
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Attribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Revenue tracking charts will be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Split className="h-5 w-5 mr-2" />
                A/B Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Split className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">A/B Test Your Campaigns</h3>
                <p className="text-gray-600 mb-4">Test subject lines, content, and send times to optimize performance</p>
                <Button>Create A/B Test</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Builder Modal */}
      {isBuilderOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Email Campaign Builder</h2>
              <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
                Close
              </Button>
            </div>
            
            <div className="flex-1 flex">
              <div className="w-64 border-r p-4">
                <h3 className="font-medium mb-3">Components</h3>
                <div className="space-y-2">
                  <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <Palette className="h-4 w-4 mb-1" />
                    <div className="text-sm">Header</div>
                  </div>
                  <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <Code className="h-4 w-4 mb-1" />
                    <div className="text-sm">Text Block</div>
                  </div>
                  <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <Target className="h-4 w-4 mb-1" />
                    <div className="text-sm">Button</div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <div className="bg-gray-50 h-full rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Drag components here to build your email</p>
                  </div>
                </div>
              </div>
              
              <div className="w-64 border-l p-4">
                <h3 className="font-medium mb-3">Properties</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Subject Line</label>
                    <Input placeholder="Enter subject..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preview Text</label>
                    <Input placeholder="Preview text..." />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline">Save Draft</Button>
              <Button>Send Test</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
