
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus, 
  Search, 
  Filter,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Mail,
  MessageSquare,
  Share2,
  Target,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
  Eye,
  MousePointer,
  UserMinus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useMarketingStore, type Campaign } from '@/store/useMarketingStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';

const campaignTypeColors = {
  email: 'text-blue-600',
  sms: 'text-green-600',
  social: 'text-purple-600',
  ads: 'text-orange-600'
};

const campaignTypeIcons = {
  email: Mail,
  sms: MessageSquare,
  social: Share2,
  ads: Target
};

const performanceData = [
  { month: 'Jan', sent: 4500, opened: 1800, clicked: 360 },
  { month: 'Feb', sent: 5200, opened: 2100, clicked: 420 },
  { month: 'Mar', sent: 4800, opened: 1920, clicked: 384 },
  { month: 'Apr', sent: 6100, opened: 2440, clicked: 488 },
  { month: 'May', sent: 5500, opened: 2200, clicked: 440 },
  { month: 'Jun', sent: 6700, opened: 2680, clicked: 536 },
];

export function MarketingHub() {
  const {
    campaigns,
    selectedCampaign,
    searchQuery,
    typeFilter,
    statusFilter,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    setSelectedCampaign,
    setSearchQuery,
    setTypeFilter,
    setStatusFilter,
    getFilteredCampaigns
  } = useMarketingStore();

  const { announceFeature } = useVoiceTraining();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'email' as const,
    status: 'draft' as const,
    audience: '',
    subject: '',
    content: '',
    scheduledDate: undefined as Date | undefined,
    stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, unsubscribed: 0 }
  });

  useEffect(() => {
    announceFeature(
      'Marketing Hub',
      'Create and manage marketing campaigns across email, SMS, social media, and ads. Track performance metrics, schedule campaigns, and analyze results to optimize your marketing efforts.'
    );
  }, [announceFeature]);

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.audience) {
      toast.error('Please fill in required fields');
      return;
    }

    addCampaign(newCampaign);
    setNewCampaign({
      name: '',
      type: 'email',
      status: 'draft',
      audience: '',
      subject: '',
      content: '',
      scheduledDate: undefined,
      stats: { sent: 0, delivered: 0, opened: 0, clicked: 0, unsubscribed: 0 }
    });
    setIsCreating(false);
    toast.success('Campaign created successfully');
  };

  const handleToggleStatus = (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaign(campaign.id, { status: newStatus });
    toast.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`);
  };

  const handleDuplicate = (campaign: Campaign) => {
    duplicateCampaign(campaign.id);
    toast.success('Campaign duplicated successfully');
  };

  const handleDelete = (campaign: Campaign) => {
    if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      deleteCampaign(campaign.id);
      toast.success('Campaign deleted successfully');
    }
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const TypeIcon = campaignTypeIcons[campaign.type];
    const openRate = campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent * 100).toFixed(1) : '0';
    const clickRate = campaign.stats.opened > 0 ? (campaign.stats.clicked / campaign.stats.opened * 100).toFixed(1) : '0';
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TypeIcon className={`h-5 w-5 ${campaignTypeColors[campaign.type]}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {campaign.type.toUpperCase()}
                  </Badge>
                  <Badge 
                    variant={
                      campaign.status === 'active' ? 'default' : 
                      campaign.status === 'scheduled' ? 'secondary' : 
                      campaign.status === 'completed' ? 'outline' : 'destructive'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleStatus(campaign)}
              >
                {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Audience:</span> {campaign.audience}
          </div>
          
          {campaign.subject && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Subject:</span> {campaign.subject}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold">{campaign.stats.sent.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Sent</div>
            </div>
            <div>
              <div className="text-xl font-bold text-blue-600">{openRate}%</div>
              <div className="text-xs text-muted-foreground">Open Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-green-600">{campaign.stats.clicked}</div>
              <div className="text-xs text-muted-foreground">Clicks</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-600">{clickRate}%</div>
              <div className="text-xs text-muted-foreground">Click Rate</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              Updated {campaign.updatedAt.toLocaleDateString()}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingCampaign(campaign)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDuplicate(campaign)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(campaign)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marketing Hub</h1>
          <p className="text-muted-foreground">
            Create, manage, and analyze your marketing campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new marketing campaign
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="Welcome Email Series"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-type">Type</Label>
                    <Select value={newCampaign.type} onValueChange={(value: any) => setNewCampaign({...newCampaign, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="ads">Advertisements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="campaign-audience">Audience *</Label>
                    <Input
                      id="campaign-audience"
                      value={newCampaign.audience}
                      onChange={(e) => setNewCampaign({...newCampaign, audience: e.target.value})}
                      placeholder="All Subscribers"
                    />
                  </div>
                </div>
                {newCampaign.type === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="campaign-subject">Subject Line</Label>
                    <Input
                      id="campaign-subject"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                      placeholder="Welcome to our community!"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="campaign-content">Content</Label>
                  <Textarea
                    id="campaign-content"
                    value={newCampaign.content}
                    onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                    placeholder="Enter your campaign content..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCampaign}>
                    Create Campaign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="social">Social Media</SelectItem>
            <SelectItem value="ads">Advertisements</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Marketing Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((acc, c) => acc + c.stats.sent, 0).toLocaleString()}
                </p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {campaigns.length > 0 ? (
                    campaigns.reduce((acc, c) => acc + (c.stats.sent > 0 ? c.stats.opened / c.stats.sent : 0), 0) / campaigns.length * 100
                  ).toFixed(1) : '0'}%
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold text-orange-600">
                  {campaigns.reduce((acc, c) => acc + c.stats.clicked, 0).toLocaleString()}
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
              <Bar dataKey="opened" fill="#10b981" name="Opened" />
              <Bar dataKey="clicked" fill="#f59e0b" name="Clicked" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredCampaigns().map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {/* Edit Campaign Dialog */}
      {editingCampaign && (
        <Dialog open={!!editingCampaign} onOpenChange={() => setEditingCampaign(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Campaign Name</Label>
                <Input
                  id="edit-name"
                  value={editingCampaign.name}
                  onChange={(e) => setEditingCampaign({...editingCampaign, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingCampaign.status} 
                  onValueChange={(value: any) => setEditingCampaign({...editingCampaign, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingCampaign.content}
                  onChange={(e) => setEditingCampaign({...editingCampaign, content: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingCampaign(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  updateCampaign(editingCampaign.id, editingCampaign);
                  setEditingCampaign(null);
                  toast.success('Campaign updated successfully');
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
