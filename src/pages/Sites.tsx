import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useSitesStore, Site } from '@/store/useSitesStore';
import { SiteForm } from '@/components/sites/SiteForm';
import { SiteDetails } from '@/components/sites/SiteDetails';
import { EnhancedPageBuilder } from '@/components/sites/page-builder/EnhancedPageBuilder';
import { SitesSidebar } from '@/components/sites/SitesSidebar';
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
        // Add duplication logic here
        toast.success(`Site "${site.name}" duplicated successfully`);
        break;
      case 'export':
        // Add export logic here
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
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
        {/* Enhanced Left Sidebar */}
        <SitesSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          onSiteSelect={setSelectedSite}
          onCreateSite={() => setShowSiteForm(true)}
          selectedSite={selectedSite}
          onSiteAction={handleSiteAction}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sites & Funnels</h1>
                <p className="text-gray-600 mt-1">Build, manage and optimize your websites, landing pages, and sales funnels</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => {
                  toast.info('Refreshing sites data...');
                  // Add refresh logic here
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
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
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

                  {/* Selected Site Details */}
                  {selectedSite ? (
                    <Card className="shadow-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Globe className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{selectedSite.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{selectedSite.url}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={selectedSite.status === 'published' ? 'default' : 'secondary'}>
                                {selectedSite.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {selectedSite.type}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleSiteAction('view', selectedSite)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Live Site
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSiteAction('edit', selectedSite)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSiteAction('pages', selectedSite)}>
                                <Monitor className="h-4 w-4 mr-2" />
                                Edit Pages
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSiteAction('analytics', selectedSite)}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSiteAction('settings', selectedSite)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleSiteAction('duplicate', selectedSite)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSiteAction('export', selectedSite)}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleSiteAction('delete', selectedSite)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Site
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{selectedSite.visitors.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Total Visitors</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{selectedSite.pages.length}</div>
                            <div className="text-sm text-gray-600">Pages</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">8.4%</div>
                            <div className="text-sm text-gray-600">Conversion Rate</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">2.3s</div>
                            <div className="text-sm text-gray-600">Load Time</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button onClick={() => handleSiteAction('pages', selectedSite)} className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Pages
                          </Button>
                          <Button variant="outline" onClick={() => handleSiteAction('view', selectedSite)} className="flex-1">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Live
                          </Button>
                          <Button variant="outline" onClick={() => handleSiteAction('analytics', selectedSite)} className="flex-1">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Globe className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Site to Get Started</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Choose a site from the sidebar to view detailed analytics, edit pages, or manage settings
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
                        <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Real-time visitor tracking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Conversion rate optimization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>A/B testing results</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Performance metrics</span>
                          </div>
                        </div>
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
                        <div className="space-y-2 text-sm text-left max-w-md mx-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Domain management</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>SSL certificates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>SEO optimization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Custom code injection</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
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
