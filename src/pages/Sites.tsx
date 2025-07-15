
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Globe, 
  Settings, 
  BarChart3, 
  Eye,
  Edit,
  Copy,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { TemplateLibrary } from '@/components/sites/templates/TemplateLibrary';
import { TemplatePreview } from '@/components/sites/templates/TemplatePreview';
import { SiteAnalytics } from '@/components/sites/analytics/SiteAnalytics';
import { GlobalSiteSettings } from '@/components/sites/settings/GlobalSiteSettings';
import { FunctionalPageBuilder } from '@/components/sites/page-builder/FunctionalPageBuilder';
import { useSearchParams } from 'react-router-dom';

interface Site {
  id: string;
  name: string;
  domain: string;
  status: 'published' | 'draft' | 'archived';
  lastModified: string;
  views: number;
  conversions: number;
  template?: string;
}

export default function Sites() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if we should show the page builder
  const showPageBuilder = searchParams.get('builder') === 'true';
  const siteId = searchParams.get('siteId') || 'new';
  const templateId = searchParams.get('templateId') || undefined;

  // Sample sites data
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Landing Page Pro',
      domain: 'landingpro.com',
      status: 'published',
      lastModified: '2024-01-15',
      views: 15420,
      conversions: 342
    },
    {
      id: '2',
      name: 'Business Form',
      domain: 'bizform.net',
      status: 'draft',
      lastModified: '2024-01-14',
      views: 0,
      conversions: 0
    },
    {
      id: '3',
      name: 'Product Showcase',
      domain: 'showcase.io',
      status: 'published',
      lastModified: '2024-01-13',
      views: 8920,
      conversions: 156
    }
  ]);

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSite = () => {
    setSearchParams({ builder: 'true', siteId: 'new' });
  };

  const handleUseTemplate = (templateId: string) => {
    setSearchParams({ builder: 'true', siteId: 'new', templateId });
  };

  const handleEditSite = (site: Site) => {
    setSearchParams({ builder: 'true', siteId: site.id, templateId: site.template || '' });
  };

  // Show page builder in full screen
  if (showPageBuilder) {
    return (
      <FunctionalPageBuilder 
        siteId={siteId} 
        templateId={templateId}
      />
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sites & Funnels</h2>
          <p className="text-muted-foreground">
            Create high-converting websites and funnels with our powerful page builder
          </p>
        </div>
        <Button onClick={handleCreateSite} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create New Site
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Sites Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <Badge variant={site.status === 'published' ? 'default' : 'secondary'}>
                      {site.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Globe className="mr-1 h-4 w-4" />
                    {site.domain}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{site.views.toLocaleString()}</div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="font-medium">{site.conversions}</div>
                      <div className="text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      Modified {site.lastModified}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${site.domain}`, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSite(site)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search term' : 'Get started by creating your first site'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateSite}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Site
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <TemplateLibrary onUseTemplate={handleUseTemplate} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <SiteAnalytics />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <GlobalSiteSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
