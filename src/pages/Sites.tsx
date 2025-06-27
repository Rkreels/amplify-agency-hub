import React, { useState } from 'react';
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

  // Enhanced Page Builder View
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
            <Badge variant="outline">{selectedSite.type}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <EnhancedPageBuilder siteId={selectedSite.id} />
        </div>
      </div>
    );
  }

  // Enhanced Funnel Builder View
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
            <Badge variant="outline">{selectedSite.type}</Badge>
          </div>
        </div>
        <div className="flex-1">
          <EnhancedFunnelBuilder siteId={selectedSite.id} />
        </div>
      </div>
    );
  }

  // Main Sites Dashboard with Sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
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
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Sites & Funnels</h1>
              <p className="text-gray-600">Build and manage your websites, landing pages, and funnels</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info('Refreshing sites...')}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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

              {/* Selected Site Details */}
              {selectedSite && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {selectedSite.name}
                          <Badge variant="outline">{selectedSite.status}</Badge>
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{selectedSite.url}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleSiteAction('view', selectedSite)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Site
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedSite.visitors.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Visitors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedSite.pages.length}</div>
                        <div className="text-sm text-gray-600">Pages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">8.4%</div>
                        <div className="text-sm text-gray-600">Conversion</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">4.2s</div>
                        <div className="text-sm text-gray-600">Load Time</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => handleSiteAction('pages', selectedSite)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Pages
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSiteAction('view', selectedSite)}>
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Live
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedSite && (
                <div className="text-center py-12">
                  <Globe className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Site to Get Started</h3>
                  <p className="text-gray-600 mb-6">Choose a site from the sidebar to view details and start editing</p>
                  <Button onClick={() => setShowSiteForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
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
  );
}
