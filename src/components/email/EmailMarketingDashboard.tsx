
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Mail, 
  Users, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import { useEmailMarketingStore } from '@/store/useEmailMarketingStore';
import { EmailCampaignBuilder } from './EmailCampaignBuilder';
import { EmailSequenceBuilder } from './EmailSequenceBuilder';
import { EmailTemplateBuilder } from './EmailTemplateBuilder';
import { EmailDeliverabilityReport } from './EmailDeliverabilityReport';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export function EmailMarketingDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [creationType, setCreationType] = useState<'campaign' | 'sequence' | 'template'>('campaign');
  
  const {
    campaigns,
    sequences,
    templates,
    deliverability,
    sendCampaign,
    pauseCampaign,
    duplicateCampaign,
    deleteCampaign
  } = useEmailMarketingStore();

  const handleCreateNew = (type: 'campaign' | 'sequence' | 'template') => {
    setCreationType(type);
    setIsCreating(true);
  };

  const handleAction = (action: string, id: string) => {
    switch (action) {
      case 'send':
        sendCampaign(id);
        toast.success('Campaign sent successfully');
        break;
      case 'pause':
        pauseCampaign(id);
        toast.success('Campaign paused');
        break;
      case 'duplicate':
        duplicateCampaign(id);
        toast.success('Campaign duplicated');
        break;
      case 'delete':
        deleteCampaign(id);
        toast.success('Campaign deleted');
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: 'Draft' },
      scheduled: { variant: 'outline' as const, label: 'Scheduled' },
      sending: { variant: 'default' as const, label: 'Sending' },
      sent: { variant: 'default' as const, label: 'Sent' },
      paused: { variant: 'destructive' as const, label: 'Paused' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSequences = sequences.filter(sequence =>
    sequence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sequence.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="h-8 w-8" />
            Email Marketing
          </h1>
          <p className="text-gray-600 mt-1">
            Create and manage email campaigns, sequences, and templates
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleCreateNew('template')}>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button variant="outline" onClick={() => handleCreateNew('sequence')}>
            <Plus className="h-4 w-4 mr-2" />
            New Sequence
          </Button>
          <Button onClick={() => handleCreateNew('campaign')}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-3xl font-bold">{campaigns.length}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sent</p>
                <p className="text-3xl font-bold">
                  {campaigns.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Open Rate</p>
                <p className="text-3xl font-bold">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((sum, c) => sum + (c.stats.opened / c.stats.sent * 100), 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deliverability</p>
                <p className="text-3xl font-bold">{deliverability.deliverabilityRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search campaigns, sequences, or templates..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="sequences">Sequences</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="deliverability">Deliverability</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-gray-600 mb-2">{campaign.subject}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Recipients: {campaign.recipients.count}</span>
                        <span>Sent: {campaign.stats.sent}</span>
                        <span>Opened: {campaign.stats.opened} ({Math.round(campaign.stats.opened / campaign.stats.sent * 100)}%)</span>
                        <span>Clicked: {campaign.stats.clicked}</span>
                        {campaign.sentAt && <span>Sent: {formatDate(campaign.sentAt)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction('duplicate', campaign.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm" onClick={() => handleAction('send', campaign.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      {campaign.status === 'sending' && (
                        <Button variant="outline" size="sm" onClick={() => handleAction('pause', campaign.id)}>
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleAction('delete', campaign.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sequences" className="space-y-4">
          <div className="grid gap-4">
            {filteredSequences.map((sequence) => (
              <Card key={sequence.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{sequence.name}</h3>
                        <Badge variant={sequence.isActive ? 'default' : 'secondary'}>
                          {sequence.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{sequence.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Emails: {sequence.emails.length}</span>
                        <span>Enrolled: {sequence.stats.enrolled}</span>
                        <span>Completed: {sequence.stats.completed}</span>
                        <span>Trigger: {sequence.trigger.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{template.subject}</p>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deliverability">
          <EmailDeliverabilityReport deliverability={deliverability} />
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {creationType === 'campaign' && <EmailCampaignBuilder onClose={() => setIsCreating(false)} />}
          {creationType === 'sequence' && <EmailSequenceBuilder onClose={() => setIsCreating(false)} />}
          {creationType === 'template' && <EmailTemplateBuilder onClose={() => setIsCreating(false)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
