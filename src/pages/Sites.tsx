import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Globe,
  Users,
  TrendingUp,
  Zap,
  RefreshCw,
  Monitor,
  Eye,
  Edit,
  ExternalLink,
  BarChart3,
  Settings,
  Copy,
  Download,
  Trash2,
  Search,
  Target,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { useSitesStore, Site } from '@/store/useSitesStore';
import { SiteForm } from '@/components/sites/SiteForm';
import { SiteDetails } from '@/components/sites/SiteDetails';
import { EnhancedPageBuilder } from '@/components/sites/page-builder/EnhancedPageBuilder';
import { EnhancedFunnelBuilder } from '@/components/sites/EnhancedFunnelBuilder';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function Sites() {
  const { sites, selectedSite, setSelectedSite, deleteSite, publishSite, unpublishSite } = useSitesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'website' | 'landing' | 'funnel' | 'booking'>('all');
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showSiteDetails, setShowSiteDetails] = useState(false);
  const [showPageBuilder, setShowPageBuilder] = useState(false);
  const [showFunnelBuilder, setShowFunnelBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus;
    const matchesType = filterType === 'all' || site.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="h-4 w-4 text-blue-500" />;
      case 'landing': return <Target className="h-4 w-4 text-purple-500" />;
      case 'funnel': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'booking': return <Calendar className="h-4 w-4 text-orange-500" />;
      default: return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleSiteAction = (action: string, site: Site) => {
    switch (action) {
      case 'view':
        window.open(`https://${site.url}`, '_blank');
        toast.info(`Opening ${site.name}`);
        break;
      case 'edit':
        setSelectedSite(site);
        setShowSiteDetails(true);
        break;
      case 'pages':
        setSelectedSite(site);
        setShowPageBuilder(true);
        break;
      case 'funnels':
        setSelectedSite(site);
        setShowFunnelBuilder(true);
        break;
      case 'duplicate':
        toast.success(`Site "${site.name}" duplicated successfully`);
        break;
      case 'export':
        toast.success(`Site "${site.name}" exported successfully`);
        break;
      case 'analytics':
        toast.info(`Opening analytics for "${site.name}"`);
        break;
      case 'settings':
        setSelectedSite(site);
        setShowSiteDetails(true);
        break;
      case 'publish':
        publishSite(site.id);
        toast.success(`Site "${site.name}" published successfully`);
        break;
      case 'unpublish':
        unpublishSite(site.id);
        toast.success(`Site "${site.name}" unpublished successfully`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${site.name}"? This action cannot be undone.`)) {
          deleteSite(site.id);
          toast.success(`Site "${site.name}" deleted successfully`);
          if (selectedSite?.id === site.id) {
            setSelectedSite(null);
          }
        }
        break;
      default:
        toast.info(`Action "${action}" not implemented yet`);
        break;
    }
  };

  // Enhanced Page Builder View
  if (showPageBuilder && selectedSite) {
    return (
      <AppLayout>
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-100">
          <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowPageBuilder(false);
                  setSelectedSite(null);
                }}
                className="flex items-center gap-2"
              >
                ← Back to Sites
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{selectedSite.name}</h1>
                  <p className="text-sm text-gray-500">Page Builder</p>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {selectedSite.type}
              </Badge>
              <Badge variant={selectedSite.status === 'published' ? 'default' : 'secondary'}>
                {selectedSite.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                onClick={() => {
                  publishSite(selectedSite.id);
                  toast.success('Page published successfully!');
                }}
              >
                <Download className="h-4 w-4" />
                Publish
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <EnhancedPageBuilder siteId={selectedSite.id} />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Enhanced Funnel Builder View
  if (showFunnelBuilder && selectedSite) {
    return (
      <AppLayout>
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-100">
          <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowFunnelBuilder(false);
                  setSelectedSite(null);
                }}
                className="flex items-center gap-2"
              >
                ← Back to Sites
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{selectedSite.name}</h1>
                  <p className="text-sm text-gray-500">Funnel Builder</p>
                </div>
              </div>
              <Badge variant="outline" className="capitalize">
                {selectedSite.type}
              </Badge>
            </div>
          </div>
          <div className="flex-1">
            <EnhancedFunnelBuilder siteId={selectedSite.id} />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Main Sites Dashboard
  return (
    <AppLayout>
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sites & Funnels</h1>
              <p className="text-gray-600 mt-1">Build, manage and optimize your websites, landing pages, and sales funnels</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => {
                toast.info('Refreshing sites data...');
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowSiteForm(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Site
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sites and funnels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
                <SelectItem value="funnel">Funnel</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Sites</CardTitle>
                    <Globe className="h-5 w-5 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{sites.length}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {sites.filter(s => s.status === 'published').length} published, {sites.filter(s => s.status === 'draft').length} draft
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sites.reduce((sum, site) => sum + site.visitors, 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.5%</div>
                    <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Funnels</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {sites.filter(s => s.type === 'funnel' && s.status === 'published').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Running campaigns</p>
                  </CardContent>
                </Card>
              </div>

              {/* Sites Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSites.map((site) => (
                  <Card key={site.id} className="hover:shadow-lg transition-all cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(site.type)}
                          <div>
                            <h3 className="font-semibold text-gray-900">{site.name}</h3>
                            <p className="text-sm text-gray-500">{site.url}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSiteAction('view', site)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Live
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSiteAction('pages', site)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Pages
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleSiteAction('duplicate', site)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSiteAction('delete', site)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={`${getStatusColor(site.status)} text-xs border`}>
                          {site.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {site.type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{site.visitors.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Visitors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{site.pages.length}</div>
                          <div className="text-xs text-gray-500">Pages</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => handleSiteAction('pages', site)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSiteAction('view', site)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSiteAction('analytics', site)}>
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredSites.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sites Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters, or create a new site to get started
                  </p>
                  <Button onClick={() => setShowSiteForm(true)} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Site
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: 'Business Landing Page', type: 'landing', preview: '/api/placeholder/400/300' },
                  { name: 'E-commerce Store', type: 'website', preview: '/api/placeholder/400/300' },
                  { name: 'Lead Generation Funnel', type: 'funnel', preview: '/api/placeholder/400/300' },
                  { name: 'Booking Page', type: 'booking', preview: '/api/placeholder/400/300' },
                ].map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="mt-2">{template.type}</Badge>
                      <Button className="w-full mt-3" size="sm">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Site Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">Advanced analytics and reporting features are coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Global Site Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
                    <p className="text-muted-foreground mb-4">Advanced configuration options are coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */}
        <Dialog open={showSiteForm} onOpenChange={setShowSiteForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Site</DialogTitle>
              <DialogDescription>
                Choose a site type and configure your new site.
              </DialogDescription>
            </DialogHeader>
            <SiteForm onComplete={() => setShowSiteForm(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={showSiteDetails} onOpenChange={setShowSiteDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Site Details</DialogTitle>
              <DialogDescription>
                View and edit site information.
              </DialogDescription>
            </DialogHeader>
            {selectedSite && (
              <SiteDetails 
                onClose={() => {
                  setShowSiteDetails(false);
                  setSelectedSite(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
