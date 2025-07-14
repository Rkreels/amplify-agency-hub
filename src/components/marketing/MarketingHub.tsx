import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail,
  MessageSquare,
  Share2,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Eye,
  MousePointer
} from 'lucide-react';
import { useMarketingStore, type Campaign } from '@/store/useMarketingStore';
import { toast } from 'sonner';

interface NewCampaignData {
  name: string;
  type: 'email' | 'sms' | 'social' | 'ads';
  audience: string;
  subject?: string;
  content: string;
  scheduledDate?: string;
}

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

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaignData, setNewCampaignData] = useState<NewCampaignData>({
    name: '',
    type: 'email',
    audience: 'All Contacts',
    subject: '',
    content: '',
    scheduledDate: ''
  });

  const handleCreateCampaign = () => {
    if (!newCampaignData.name.trim() || !newCampaignData.content.trim()) {
      toast.error('Name and content are required');
      return;
    }

    const newCampaign = {
      ...newCampaignData,
      status: 'draft' as const,
      scheduledDate: newCampaignData.scheduledDate ? new Date(newCampaignData.scheduledDate) : undefined,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0
      }
    };

    addCampaign(newCampaign);
    setNewCampaignData({
      name: '',
      type: 'email',
      audience: 'All Contacts',
      subject: '',
      content: '',
      scheduledDate: ''
    });
    setShowCreateDialog(false);
    toast.success('Campaign created successfully');
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setNewCampaignData({
      name: campaign.name,
      type: campaign.type,
      audience: campaign.audience,
      subject: campaign.subject || '',
      content: campaign.content,
      scheduledDate: campaign.scheduledDate?.toISOString().split('T')[0] || ''
    });
    setShowEditDialog(true);
  };

  const handleUpdateCampaign = () => {
    if (!editingCampaign) return;

    updateCampaign(editingCampaign.id, {
      ...newCampaignData,
      scheduledDate: newCampaignData.scheduledDate ? new Date(newCampaignData.scheduledDate) : undefined
    });
    setShowEditDialog(false);
    setEditingCampaign(null);
    toast.success('Campaign updated successfully');
  };

  const handleDeleteCampaign = (campaignId: string) => {
    deleteCampaign(campaignId);
    toast.success('Campaign deleted successfully');
  };

  const handleDuplicateCampaign = (campaignId: string) => {
    duplicateCampaign(campaignId);
    toast.success('Campaign duplicated successfully');
  };

  const handleLaunchCampaign = (campaignId: string) => {
    updateCampaign(campaignId, { 
      status: 'active',
      scheduledDate: new Date()
    });
    toast.success('Campaign launched successfully');
  };

  const handlePauseCampaign = (campaignId: string) => {
    updateCampaign(campaignId, { status: 'paused' });
    toast.success('Campaign paused');
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      draft: 'secondary',
      scheduled: 'outline',
      active: 'default',
      paused: 'destructive',
      completed: 'default'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeIcon = (type: Campaign['type']) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      social: Share2,
      ads: Target
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const filteredCampaigns = getFilteredCampaigns();

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSent: campaigns.reduce((sum, c) => sum + c.stats.sent, 0),
    totalOpened: campaigns.reduce((sum, c) => sum + c.stats.opened, 0),
    avgOpenRate: campaigns.length > 0 
      ? Math.round((campaigns.reduce((sum, c) => sum + (c.stats.sent > 0 ? (c.stats.opened / c.stats.sent) * 100 : 0), 0) / campaigns.length))
      : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketing Hub</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your marketing campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new marketing campaign
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={newCampaignData.name}
                      onChange={(e) => setNewCampaignData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Campaign Type</Label>
                    <Select
                      value={newCampaignData.type}
                      onValueChange={(value) => setNewCampaignData(prev => ({ ...prev, type: value as any }))}
                    >
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select
                      value={newCampaignData.audience}
                      onValueChange={(value) => setNewCampaignData(prev => ({ ...prev, audience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Contacts">All Contacts</SelectItem>
                        <SelectItem value="New Subscribers">New Subscribers</SelectItem>
                        <SelectItem value="VIP Customers">VIP Customers</SelectItem>
                        <SelectItem value="Prospects">Prospects</SelectItem>
                        <SelectItem value="Inactive Users">Inactive Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={newCampaignData.scheduledDate}
                      onChange={(e) => setNewCampaignData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                </div>

                {newCampaignData.type === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      value={newCampaignData.subject}
                      onChange={(e) => setNewCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={newCampaignData.content}
                    onChange={(e) => setNewCampaignData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter campaign content"
                    rows={6}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Total Opened
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpened.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Avg Open Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.avgOpenRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="ads">Advertisements</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setTypeFilter('');
              setStatusFilter('');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns ({filteredCampaigns.length})</CardTitle>
          <CardDescription>
            Manage your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No campaigns found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create your first campaign
                </Button>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.type.toUpperCase()} • {campaign.audience}
                      </div>
                      {campaign.subject && (
                        <div className="text-sm text-muted-foreground">
                          Subject: {campaign.subject}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Created: {campaign.createdAt.toLocaleDateString()}
                        {campaign.scheduledDate && (
                          <> • Scheduled: {campaign.scheduledDate.toLocaleDateString()}</>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Campaign Stats */}
                    <div className="text-right text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium">{campaign.stats.sent}</div>
                          <div className="text-muted-foreground text-xs">Sent</div>
                        </div>
                        <div>
                          <div className="font-medium">{campaign.stats.opened}</div>
                          <div className="text-muted-foreground text-xs">Opened</div>
                        </div>
                        <div>
                          <div className="font-medium">{campaign.stats.clicked}</div>
                          <div className="text-muted-foreground text-xs">Clicked</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {campaign.stats.sent > 0 
                              ? Math.round((campaign.stats.opened / campaign.stats.sent) * 100)
                              : 0}%
                          </div>
                          <div className="text-muted-foreground text-xs">Open Rate</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handleLaunchCampaign(campaign.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Launch
                        </Button>
                      )}
                      {campaign.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePauseCampaign(campaign.id)}
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateCampaign(campaign.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update campaign information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={newCampaignData.name}
                  onChange={(e) => setNewCampaignData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Campaign Type</Label>
                <Select
                  value={newCampaignData.type}
                  onValueChange={(value) => setNewCampaignData(prev => ({ ...prev, type: value as any }))}
                >
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select
                  value={newCampaignData.audience}
                  onValueChange={(value) => setNewCampaignData(prev => ({ ...prev, audience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Contacts">All Contacts</SelectItem>
                    <SelectItem value="New Subscribers">New Subscribers</SelectItem>
                    <SelectItem value="VIP Customers">VIP Customers</SelectItem>
                    <SelectItem value="Prospects">Prospects</SelectItem>
                    <SelectItem value="Inactive Users">Inactive Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Schedule Date (Optional)</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={newCampaignData.scheduledDate}
                  onChange={(e) => setNewCampaignData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
            </div>

            {newCampaignData.type === 'email' && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={newCampaignData.subject}
                  onChange={(e) => setNewCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={newCampaignData.content}
                onChange={(e) => setNewCampaignData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter campaign content"
                rows={6}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCampaign}>
              Update Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
