
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisualPageBuilder } from "@/components/sites/VisualPageBuilder";
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
  Code
} from "lucide-react";
import { toast } from "sonner";

export default function Sites() {
  const { sites, addSite, deleteSite, publishSite, unpublishSite } = useSitesStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showPageBuilder, setShowPageBuilder] = useState(false);

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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sites & Funnels</h1>
            <p className="text-gray-600">Create and manage your websites, landing pages, and sales funnels</p>
          </div>
          <Button onClick={handleCreateSite}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Site
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <p className="text-2xl font-bold">
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
                      <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                      <p className="text-2xl font-bold">
                        {sites.reduce((sum, site) => sum + site.visitors, 0).toLocaleString()}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">12.5%</p>
                    </div>
                    <Palette className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => (
                <Card key={site.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <Badge
                        variant={site.status === 'published' ? 'default' : 'secondary'}
                      >
                        {site.status}
                      </Badge>
                    </div>
                    <CardDescription>{site.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Visitors:</span>
                        <span className="font-medium">{site.visitors.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Pages:</span>
                        <span className="font-medium">{site.pages.length}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {site.type}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">URL:</span>
                        <span className="font-mono text-xs truncate max-w-[120px]">
                          {site.url}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditSite(site.id)}
                          className="flex-1"
                        >
                          <Layout className="h-4 w-4 mr-1" />
                          Builder
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://${site.url}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTogglePublish(site.id, site.status === 'published')}
                        >
                          {site.status === 'published' ? <Palette className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSite(site.id)}
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
                className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2"
                onClick={handleCreateSite}
              >
                <CardContent className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                  <Plus className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Create New Site</h3>
                  <p className="text-sm text-gray-500">
                    Start with a template or build from scratch
                  </p>
                </CardContent>
              </Card>
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
