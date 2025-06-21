import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisualPageBuilder } from "@/components/sites/VisualPageBuilder";
import { FunnelPageBuilder } from "@/components/automation/workflow/FunnelPageBuilder";
import { useSitesStore } from "@/store/useSitesStore";
import { 
  Plus, 
  Globe, 
  Edit, 
  Eye, 
  Copy, 
  Trash2, 
  BarChart3,
  Settings,
  Layout,
  Palette,
  Code,
  Download,
  Upload,
  Search,
  Filter,
  Grid,
  List,
  ExternalLink,
  Play,
  Pause,
  Share,
  Zap,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { toast } from "sonner";

export default function Sites() {
  const { sites, addSite, deleteSite, publishSite, unpublishSite, updateSite } = useSitesStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showPageBuilder, setShowPageBuilder] = useState(false);
  const [showFunnelBuilder, setShowFunnelBuilder] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'website' | 'landing' | 'funnel' | 'booking'>('all');

  const handleCreateSite = () => {
    const newSite = {
      name: `New Site ${sites.length + 1}`,
      url: `site-${Date.now()}.yourdomain.com`,
      status: 'draft' as const,
      type: 'landing' as const,
      pages: [{
        id: `page-${Date.now()}`,
        title: "Home",
        slug: "/",
        isPublished: false
      }],
      description: "New landing page"
    };

    addSite(newSite);
    toast.success("New site created");
  };

  const handleEditSite = (siteId: string) => {
    setSelectedSite(siteId);
    setShowPageBuilder(true);
  };

  const handleCreateFunnel = () => {
    setShowFunnelBuilder(true);
  };

  const handleDeleteSite = (siteId: string) => {
    deleteSite(siteId);
    toast.success("Site deleted");
  };

  const handleTogglePublish = (siteId: string, isPublished: boolean) => {
    if (isPublished) {
      unpublishSite(siteId);
      toast.success("Site unpublished");
    } else {
      publishSite(siteId);
      toast.success("Site published");
    }
  };

  const handleDuplicateSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;

    const duplicatedSite = {
      ...site,
      name: `${site.name} (Copy)`,
      url: `${site.url.split('.')[0]}-copy.yourdomain.com`,
      status: 'draft' as const
    };

    addSite(duplicatedSite);
    toast.success("Site duplicated");
  };

  const handleExportSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;

    const exportData = JSON.stringify(site, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.name.replace(/\s+/g, '-')}.json`;
    a.click();
    toast.success("Site exported");
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus;
    const matchesType = filterType === 'all' || site.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (showPageBuilder) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPageBuilder(false)}
            >
              ← Back to Sites
            </Button>
            <h1 className="text-xl font-semibold">Visual Page Builder</h1>
          </div>
        </div>
        <div className="flex-1">
          <VisualPageBuilder />
        </div>
      </div>
    );
  }

  if (showFunnelBuilder) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFunnelBuilder(false)}
            >
              ← Back to Sites
            </Button>
            <h1 className="text-xl font-semibold">Funnel Builder</h1>
          </div>
        </div>
        <div className="flex-1">
          <FunnelPageBuilder />
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sites & Funnels</h1>
            <p className="text-gray-600">Create and manage your websites, landing pages, and sales funnels</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateSite} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Site
            </Button>
            <Button onClick={handleCreateFunnel}>
              <Zap className="h-4 w-4 mr-2" />
              Create Funnel
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="funnels">Funnels</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sites</p>
                      <p className="text-2xl font-bold">{sites.length}</p>
                    </div>
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Published</p>
                      <p className="text-2xl font-bold text-green-600">
                        {sites.filter(s => s.status === 'published').length}
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Funnels</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {sites.filter(s => s.type === 'funnel').length}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                      <p className="text-2xl font-bold">
                        {sites.reduce((sum, site) => sum + site.visitors, 0).toLocaleString()}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold text-orange-600">12.5%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search sites..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
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
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sites Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                  <Card key={site.id} className="hover:shadow-lg transition-all duration-200 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {site.name}
                            <Badge variant={site.status === 'published' ? 'default' : 'secondary'}>
                              {site.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-1">{site.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">{site.visitors.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Visitors</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">{site.pages.length}</div>
                            <div className="text-xs text-gray-500">Pages</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-orange-600">12.5%</div>
                            <div className="text-xs text-gray-500">CVR</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {site.type}
                            </Badge>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-600">{new Date(site.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 font-mono truncate">
                          {site.url}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditSite(site.id)}
                            className="flex-1"
                          >
                            <Layout className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://${site.url}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePublish(site.id, site.status === 'published')}
                          >
                            {site.status === 'published' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>

                        {/* More Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicateSite(site.id)}
                            className="flex-1"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleExportSite(site.id)}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteSite(site.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Create New Site Card */}
                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 group"
                  onClick={handleCreateSite}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                    <Plus className="h-12 w-12 text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Create New Site</h3>
                    <p className="text-sm text-gray-500">
                      Start with a template or build from scratch
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // List View
              <div className="space-y-2">
                {filteredSites.map((site) => (
                  <Card key={site.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{site.name}</h3>
                              <Badge variant={site.status === 'published' ? 'default' : 'secondary'}>
                                {site.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {site.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{site.description}</p>
                            <div className="text-xs text-gray-500 font-mono mt-1">{site.url}</div>
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="text-center">
                              <div className="font-medium">{site.visitors.toLocaleString()}</div>
                              <div className="text-gray-500">Visitors</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">{site.pages.length}</div>
                              <div className="text-gray-500">Pages</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">12.5%</div>
                              <div className="text-gray-500">CVR</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditSite(site.id)}
                          >
                            <Layout className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://${site.url}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePublish(site.id, site.status === 'published')}
                          >
                            {site.status === 'published' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="funnels" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Sales Funnels</h2>
              <Button onClick={handleCreateFunnel}>
                <Zap className="h-4 w-4 mr-2" />
                Create Funnel
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.filter(site => site.type === 'funnel').map((funnel) => (
                <Card key={funnel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {funnel.name}
                      </CardTitle>
                      <Badge variant={funnel.status === 'published' ? 'default' : 'secondary'}>
                        {funnel.status}
                      </Badge>
                    </div>
                    <CardDescription>{funnel.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">{funnel.visitors}</div>
                          <div className="text-xs text-gray-500">Visits</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{Math.floor(funnel.visitors * 0.15)}</div>
                          <div className="text-xs text-gray-500">Leads</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">15%</div>
                          <div className="text-xs text-gray-500">CVR</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setShowFunnelBuilder(true)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit Funnel
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://${funnel.url}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Templates</CardTitle>
                <CardDescription>Choose from professionally designed templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Lead Generation', category: 'Landing Page', preview: '/api/placeholder/300/200' },
                    { name: 'Product Launch', category: 'Sales Funnel', preview: '/api/placeholder/300/200' },
                    { name: 'Service Business', category: 'Website', preview: '/api/placeholder/300/200' },
                    { name: 'E-commerce', category: 'Online Store', preview: '/api/placeholder/300/200' },
                    { name: 'Portfolio', category: 'Personal', preview: '/api/placeholder/300/200' },
                    { name: 'Event Registration', category: 'Landing Page', preview: '/api/placeholder/300/200' }
                  ].map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.category}</p>
                        <Button size="sm" className="w-full mt-3">
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Analytics</CardTitle>
                <CardDescription>Track performance across all your sites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24.5K</div>
                      <div className="text-sm text-gray-600">Total Page Views</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-gray-600">Conversions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">12.5%</div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>

                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Analytics chart would go here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Domain Management</CardTitle>
                <CardDescription>Manage custom domains for your sites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Domain
                  </Button>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">yourdomain.com</h4>
                        <p className="text-sm text-gray-600">Connected to Main Site</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
                <CardDescription>Configure global settings for all sites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">SEO Settings</h4>
                    <p className="text-sm text-gray-600">Configure default SEO settings for new sites</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Analytics Integration</h4>
                    <p className="text-sm text-gray-600">Connect Google Analytics and other tracking tools</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Custom Code</h4>
                    <p className="text-sm text-gray-600">Add custom CSS/JS to all sites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
