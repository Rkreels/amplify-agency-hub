
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Settings, 
  Zap,
  Globe,
  Facebook,
  Instagram,
  Mail,
  MessageSquare,
  Calendar,
  CreditCard,
  ShoppingCart,
  BarChart3,
  Users,
  Phone,
  Video,
  Database,
  Webhook,
  Key,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit,
  RefreshCw,
  Share
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'marketing' | 'crm' | 'analytics' | 'payment' | 'social' | 'productivity';
  isConnected: boolean;
  status: 'active' | 'inactive' | 'error';
  icon: any;
  config: Record<string, any>;
  lastSync: Date | null;
  createdAt: Date;
}

const availableIntegrations: Omit<Integration, 'id' | 'isConnected' | 'status' | 'config' | 'lastSync' | 'createdAt'>[] = [
  {
    name: 'Facebook Lead Ads',
    description: 'Automatically import leads from Facebook Lead Ads campaigns',
    category: 'marketing',
    icon: Facebook
  },
  {
    name: 'Instagram Business',
    description: 'Manage Instagram messages and comments',
    category: 'social',
    icon: Instagram
  },
  {
    name: 'Google Analytics',
    description: 'Track website visitors and campaign performance',
    category: 'analytics',
    icon: BarChart3
  },
  {
    name: 'Stripe',
    description: 'Process payments and manage subscriptions',
    category: 'payment',
    icon: CreditCard
  },
  {
    name: 'Mailchimp',
    description: 'Sync contacts and email campaigns',
    category: 'marketing',
    icon: Mail
  },
  {
    name: 'Zoom',
    description: 'Schedule and manage video meetings',
    category: 'communication',
    icon: Video
  },
  {
    name: 'Shopify',
    description: 'Sync customers and orders from your store',
    category: 'crm',
    icon: ShoppingCart
  },
  {
    name: 'Google Calendar',
    description: 'Sync calendar events and appointments',
    category: 'productivity',
    icon: Calendar
  }
];

export function IntegrationHub() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Facebook Lead Ads',
      description: 'Automatically import leads from Facebook Lead Ads campaigns',
      category: 'marketing',
      isConnected: true,
      status: 'active',
      icon: Facebook,
      config: { accountId: '123456789', accessToken: 'fb_token_***' },
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Google Analytics',
      description: 'Track website visitors and campaign performance',
      category: 'analytics',
      isConnected: true,
      status: 'error',
      icon: BarChart3,
      config: { propertyId: 'GA-123456', measurementId: 'G-ABC123' },
      lastSync: null,
      createdAt: new Date('2024-01-15')
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [configData, setConfigData] = useState<Record<string, string>>({});

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const availableToAdd = availableIntegrations.filter(available => 
    !integrations.some(existing => existing.name === available.name)
  );

  const handleAddIntegration = (template: typeof availableIntegrations[0]) => {
    const newIntegration: Integration = {
      id: Date.now().toString(),
      ...template,
      isConnected: false,
      status: 'inactive',
      config: {},
      lastSync: null,
      createdAt: new Date()
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setShowAddDialog(false);
    toast.success(`${template.name} integration added`);
  };

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigData(integration.config || {});
    setShowConfigDialog(true);
  };

  const handleSaveConfig = () => {
    if (!selectedIntegration) return;

    setIntegrations(prev => prev.map(integration =>
      integration.id === selectedIntegration.id
        ? { ...integration, config: configData, isConnected: true, status: 'active' }
        : integration
    ));
    setShowConfigDialog(false);
    setSelectedIntegration(null);
    setConfigData({});
    toast.success('Integration configured successfully');
  };

  const handleToggleIntegration = (integrationId: string, enabled: boolean) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, status: enabled ? 'active' : 'inactive' }
        : integration
    ));
    toast.success(`Integration ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleDeleteIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
    toast.success('Integration removed');
  };

  const handleSyncIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, lastSync: new Date() }
        : integration
    ));
    toast.success('Integration synced successfully');
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: Integration['status']) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getCategoryIcon = (category: Integration['category']) => {
    const icons = {
      communication: Phone,
      marketing: Mail,
      crm: Users,
      analytics: BarChart3,
      payment: CreditCard,
      social: Share,
      productivity: Calendar
    };
    return icons[category] || Settings;
  };

  const stats = {
    total: integrations.length,
    active: integrations.filter(i => i.status === 'active').length,
    connected: integrations.filter(i => i.isConnected).length,
    errors: integrations.filter(i => i.status === 'error').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Connect with external platforms and services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Choose from available integrations to connect with your account
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {availableToAdd.map((integration, index) => {
                  const Icon = integration.icon;
                  const CategoryIcon = getCategoryIcon(integration.category);
                  return (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-6 w-6" />
                          <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {integration.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {integration.category}
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleAddIntegration(integration)}
                          >
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Total Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Connected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.connected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Integrations ({filteredIntegrations.length})</CardTitle>
          <CardDescription>
            Manage your connected services and platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIntegrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No integrations found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  Add your first integration
                </Button>
              </div>
            ) : (
              filteredIntegrations.map((integration) => {
                const Icon = integration.icon;
                const CategoryIcon = getCategoryIcon(integration.category);
                
                return (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{integration.name}</h3>
                          {getStatusIcon(integration.status)}
                          {getStatusBadge(integration.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <CategoryIcon className="h-3 w-3" />
                            <span>{integration.category}</span>
                          </div>
                          {integration.lastSync && (
                            <span>Last sync: {integration.lastSync.toLocaleString()}</span>
                          )}
                          <span>Added: {integration.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Integration Controls */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={integration.status === 'active'}
                          onCheckedChange={(enabled) => handleToggleIntegration(integration.id, enabled)}
                          disabled={!integration.isConnected}
                        />
                        <span className="text-xs text-muted-foreground">
                          {integration.status === 'active' ? 'On' : 'Off'}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfigureIntegration(integration)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        {integration.isConnected && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSyncIntegration(integration.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteIntegration(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Configure {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Set up your integration settings and authentication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedIntegration?.name === 'Facebook Lead Ads' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    value={configData.accessToken || ''}
                    onChange={(e) => setConfigData(prev => ({ ...prev, accessToken: e.target.value }))}
                    placeholder="Enter Facebook access token"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountId">Ad Account ID</Label>
                  <Input
                    id="accountId"
                    value={configData.accountId || ''}
                    onChange={(e) => setConfigData(prev => ({ ...prev, accountId: e.target.value }))}
                    placeholder="Enter Facebook Ad Account ID"
                  />
                </div>
              </>
            )}
            {selectedIntegration?.name === 'Google Analytics' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="propertyId">Property ID</Label>
                  <Input
                    id="propertyId"
                    value={configData.propertyId || ''}
                    onChange={(e) => setConfigData(prev => ({ ...prev, propertyId: e.target.value }))}
                    placeholder="Enter GA Property ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="measurementId">Measurement ID</Label>
                  <Input
                    id="measurementId"
                    value={configData.measurementId || ''}
                    onChange={(e) => setConfigData(prev => ({ ...prev, measurementId: e.target.value }))}
                    placeholder="Enter GA Measurement ID"
                  />
                </div>
              </>
            )}
            {/* Generic API configuration for other integrations */}
            {!['Facebook Lead Ads', 'Google Analytics'].includes(selectedIntegration?.name || '') && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={configData.apiKey || ''}
                    onChange={(e) => setConfigData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiUrl">API URL (Optional)</Label>
                  <Input
                    id="apiUrl"
                    value={configData.apiUrl || ''}
                    onChange={(e) => setConfigData(prev => ({ ...prev, apiUrl: e.target.value }))}
                    placeholder="Enter API URL"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
