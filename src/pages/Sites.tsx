import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  EyeOff,
  Edit, 
  Copy, 
  Trash2,
  Globe,
  Users,
  Calendar,
  Settings,
  BarChart3,
  MousePointer,
  Smartphone,
  Monitor,
  ExternalLink,
  Download,
  Upload,
  RefreshCw,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useSitesStore, Site } from '@/store/useSitesStore';
import { SiteForm } from '@/components/sites/SiteForm';
import { SiteDetails } from '@/components/sites/SiteDetails';
import { AdvancedPageBuilder } from '@/components/sites/AdvancedPageBuilder';
import { EnhancedFunnelBuilder } from '@/components/sites/EnhancedFunnelBuilder';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const handleSiteAction = (action: string, site: Site) => {
    switch (action) {
      case 'view':
        window.open(`https://${site.url}`, '_blank');
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
        toast.info(`Opening settings for "${site.name}"`);
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
        if (window.confirm(`Are you sure you want to delete "${site.name}"?`)) {
          deleteSite(site.id);
          toast.success(`Site "${site.name}" deleted successfully`);
        }
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'landing': return <Target className="h-4 w-4" />;
      case 'funnel': return <TrendingUp className="h-4 w-4" />;
      case 'booking': return <Calendar className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  if (showPageBuilder && selectedSite) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowPageBuilder(false);
                setSelectedSite(null);
              }}
            >
              ← Back to Sites
            </Button>
            <h1 className="text-xl font-semibold">Page Builder - {selectedSite.name}</h1>
          </div>
        </div>
        <div className="flex-1">
          <AdvancedPageBuilder siteId={selectedSite.id} />
        </div>
      </div>
    );
  }

  if (showFunnelBuilder && selectedSite) {
    return (
      <div className="h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowFunnelBuilder(false);
                setSelectedSite(null);
              }}
            >
              ← Back to Sites
            </Button>
            <h1 className="text-xl font-semibold">Funnel Builder - {selectedSite.name}</h1>
          </div>
        </div>
        <div className="flex-1">
          <EnhancedFunnelBuilder siteId={selectedSite.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sites & Funnels</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Refreshing sites...')}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowSiteForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Site
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sites.length}</div>
                <p className="text-xs text-muted-foreground">
                  {sites.filter(s => s.status === 'published').length} published
                </p>
              </CardContent>
            </Card>
            <Card>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
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

          {/* Filters and Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
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

          {/* Sites Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(site.type)}
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleSiteAction('view', site)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Site
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSiteAction('edit', site)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSiteAction('pages', site)}>
                          <Monitor className="h-4 w-4 mr-2" />
                          Edit Pages
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSiteAction('funnels', site)}>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Edit Funnels
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSiteAction('analytics', site)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSiteAction('settings', site)}>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSiteAction('duplicate', site)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSiteAction('export', site)}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {site.status === 'published' ? (
                          <DropdownMenuItem onClick={() => handleSiteAction('unpublish', site)}>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleSiteAction('publish', site)}>
                            <Globe className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleSiteAction('delete', site)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                    <Badge variant="outline">
                      {site.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate">{site.url}</span>
                    </div>
                    {site.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {site.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {site.visitors.toLocaleString()} visitors
                      </span>
                      <span className="text-muted-foreground">
                        Updated {new Date(site.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleSiteAction('pages', site)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSiteAction('view', site)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first site'}
              </p>
              <Button onClick={() => setShowSiteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Site
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Template Cards */}
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
              <CardTitle>Site Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Global site settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
  );
}
