import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedPageBuilder } from "@/components/sites/AdvancedPageBuilder";
import { EnhancedFunnelBuilder } from "@/components/sites/EnhancedFunnelBuilder";
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
  Tablet,
  Star,
  CheckCircle,
  Award,
  Shield,
  Clock,
  CreditCard,
  MapPin,
  FileText,
  Image,
  Video,
  Megaphone,
  PieChart,
  LineChart,
  DollarSign,
  MousePointer,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

export default function Sites() {
  const { sites, addSite, deleteSite, publishSite, unpublishSite, updateSite } = useSitesStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showPageBuilder, setShowPageBuilder] = useState(false);
  const [showFunnelBuilder, setShowFunnelBuilder] = useState(false);
  const [showDashboardCustomization, setShowDashboardCustomization] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [filterType, setFilterType] = useState<'all' | 'website' | 'landing' | 'funnel' | 'booking'>('all');

  // Sample analytics data
  const analyticsOverview = {
    totalPageViews: 245672,
    uniqueVisitors: 45234,
    totalConversions: 2847,
    conversionRate: 6.3,
    totalRevenue: 142850,
    avgSessionDuration: 185,
    bounceRate: 42.1,
    topPages: [
      { page: 'Landing Page #1', views: 12547, conversions: 487 },
      { page: 'Product Sales Page', views: 8934, conversions: 234 },
      { page: 'Lead Magnet Page', views: 7621, conversions: 891 },
    ],
    topSources: [
      { source: 'Google Ads', visitors: 15432, conversions: 892 },
      { source: 'Facebook Ads', visitors: 12847, conversions: 634 },
      { source: 'Organic Search', visitors: 9234, conversions: 287 },
    ],
    recentActivity: [
      { type: 'conversion', message: 'New lead captured on Landing Page #1', time: '2 minutes ago' },
      { type: 'publish', message: 'Product Page published successfully', time: '15 minutes ago' },
      { type: 'edit', message: 'Funnel Step #2 updated', time: '1 hour ago' },
    ]
  };

  const templates = [
    {
      id: 'business-landing',
      name: 'Business Landing Page',
      category: 'Business',
      description: 'Professional business landing page with lead capture',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      features: ['Responsive Design', 'Lead Forms', 'SEO Optimized', 'Analytics Ready'],
      conversions: 'High',
      difficulty: 'Beginner'
    },
    {
      id: 'saas-product',
      name: 'SaaS Product Page',
      category: 'SaaS',
      description: 'Complete SaaS product showcase with pricing tables',
      preview: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      features: ['Pricing Tables', 'Feature Comparison', 'Testimonials', 'Free Trial'],
      conversions: 'High',
      difficulty: 'Intermediate'
    },
    {
      id: 'agency-portfolio',
      name: 'Agency Portfolio',
      category: 'Agency',
      description: 'Creative agency portfolio with case studies',
      preview: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
      features: ['Portfolio Gallery', 'Case Studies', 'Contact Forms', 'Team Showcase'],
      conversions: 'Medium',
      difficulty: 'Advanced'
    },
    {
      id: 'ecommerce-store',
      name: 'E-commerce Store',
      category: 'E-commerce',
      description: 'Complete online store with product catalog',
      preview: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Integration', 'Inventory'],
      conversions: 'High',
      difficulty: 'Advanced'
    },
    {
      id: 'event-landing',
      name: 'Event Registration',
      category: 'Events',
      description: 'Event registration and information page',
      preview: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=400&h=300&fit=crop',
      features: ['Event Registration', 'Speaker Profiles', 'Schedule', 'Location Map'],
      conversions: 'Medium',
      difficulty: 'Intermediate'
    },
    {
      id: 'webinar-funnel',
      name: 'Webinar Funnel',
      category: 'Education',
      description: 'Complete webinar registration and follow-up sequence',
      preview: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      features: ['Registration Forms', 'Email Sequences', 'Replay Pages', 'Upsells'],
      conversions: 'High',
      difficulty: 'Advanced'
    }
  ];

  const handleCreateSite = (templateId?: string) => {
    const template = templates.find(t => t.id === templateId);
    const newSite = {
      name: template ? template.name : `New Site ${sites.length + 1}`,
      url: `site-${Date.now()}.yourdomain.com`,
      status: 'draft' as const,
      type: 'landing' as const,
      pages: [{
        id: `page-${Date.now()}`,
        title: "Home",
        slug: "/",
        isPublished: false
      }],
      description: template ? template.description : "New site description"
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
            <h1 className="text-xl font-semibold">Advanced Page Builder</h1>
          </div>
        </div>
        <div className="flex-1">
          <AdvancedPageBuilder siteId={selectedSite || ''} />
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
            <h1 className="text-xl font-semibold">Enhanced Funnel Builder</h1>
          </div>
        </div>
        <div className="flex-1">
          <EnhancedFunnelBuilder />
        </div>
      </div>
    );
  }

  if (showDashboardCustomization) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDashboardCustomization(false)}
            >
              ← Back to Sites
            </Button>
            <h1 className="text-xl font-semibold">Dashboard Customization</h1>
          </div>
        </div>
        <div className="flex-1">
          <DashboardCustomization />
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
            <Button onClick={() => setShowDashboardCustomization(true)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize Dashboard
            </Button>
            <Button onClick={() => handleCreateSite()} variant="outline">
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="funnels">Funnels</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Sites</p>
                      <p className="text-2xl font-bold">{sites.length}</p>
                      <p className="text-xs text-green-600">+12% this month</p>
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
                      <p className="text-xs text-green-600">+8% this week</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
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
                      <p className="text-xs text-purple-600">+25% this month</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Page Views</p>
                      <p className="text-2xl font-bold">{analyticsOverview.totalPageViews.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">+18% this week</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Conversions</p>
                      <p className="text-2xl font-bold text-orange-600">{analyticsOverview.totalConversions.toLocaleString()}</p>
                      <p className="text-xs text-orange-600">+15% this week</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-green-600">${analyticsOverview.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600">+22% this month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleCreateSite()}>
                <CardContent className="p-6 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-lg font-semibold mb-2">Create New Site</h3>
                  <p className="text-gray-600">Start with a template or build from scratch</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleCreateFunnel}>
                <CardContent className="p-6 text-center">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="text-lg font-semibold mb-2">Build Sales Funnel</h3>
                  <p className="text-gray-600">Create high-converting sales funnels</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
                  <p className="text-gray-600">Track performance and optimize</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search sites and funnels..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-40">
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
                  <SelectTrigger className="w-40">
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
                        {/* Performance Metrics */}
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
                            <div className="text-lg font-bold text-orange-600">
                              {(Math.random() * 20 + 5).toFixed(1)}%
                            </div>
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
                              <div className="font-medium">{(Math.random() * 20 + 5).toFixed(1)}%</div>
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

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Site Templates</h2>
              <div className="flex items-center gap-2">
                <Input placeholder="Search templates..." className="w-64" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img 
                      src={template.preview} 
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      <div className="flex items-center gap-1">
                        <Badge variant={template.conversions === 'High' ? 'default' : 'outline'} className="text-xs">
                          {template.conversions} CVR
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Difficulty:</span>
                          <Badge variant="outline" className="text-xs">
                            {template.difficulty}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleCreateSite(template.id)}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              {sites.filter(site => site.type === 'funnel').concat([
                // Add some sample funnels for demonstration
                {
                  id: 'sample-funnel-1',
                  name: 'Lead Generation Funnel',
                  url: 'lead-gen.yourdomain.com',
                  status: 'published' as const,
                  type: 'funnel' as const,
                  description: 'High-converting lead capture funnel',
                  visitors: 5247,
                  pages: [
                    { id: '1', title: 'Landing Page', slug: '/opt-in', isPublished: true },
                    { id: '2', title: 'Thank You Page', slug: '/thank-you', isPublished: true }
                  ],
                  lastUpdated: new Date(),
                  createdAt: new Date()
                },
                {
                  id: 'sample-funnel-2',
                  name: 'Product Launch Funnel',
                  url: 'product-launch.yourdomain.com',
                  status: 'draft' as const,
                  type: 'funnel' as const,
                  description: 'Complete product launch sequence',
                  visitors: 0,
                  pages: [
                    { id: '3', title: 'Landing Page', slug: '/landing', isPublished: false },
                    { id: '4', title: 'Sales Page', slug: '/sales', isPublished: false },
                    { id: '5', title: 'Checkout', slug: '/checkout', isPublished: false }
                  ],
                  lastUpdated: new Date(),
                  createdAt: new Date()
                }
              ]).map((funnel) => (
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
                          <div className="text-lg font-bold text-blue-600">{funnel.visitors.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Visits</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{Math.floor(funnel.visitors * 0.15)}</div>
                          <div className="text-xs text-gray-500">Leads</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-600">
                            {funnel.visitors > 0 ? (funnel.visitors * 0.15 / funnel.visitors * 100).toFixed(1) : '0'}%
                          </div>
                          <div className="text-xs text-gray-500">CVR</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{funnel.pages.length} steps</span>
                        <span className="text-gray-500">{new Date(funnel.lastUpdated).toLocaleDateString()}</span>
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
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analytics Overview</h2>
              <div className="flex items-center gap-2">
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Main Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">{analyticsOverview.totalPageViews.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Page Views</div>
                  <div className="text-xs text-green-600 mt-1">+18% from last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">{analyticsOverview.uniqueVisitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Unique Visitors</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold">{analyticsOverview.totalConversions.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Conversions</div>
                  <div className="text-xs text-green-600 mt-1">+25% from last month</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">${analyticsOverview.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+32% from last month</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsOverview.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{page.page}</div>
                          <div className="text-sm text-gray-500">{page.views.toLocaleString()} views</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">{page.conversions}</div>
                          <div className="text-sm text-gray-500">conversions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsOverview.topSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{source.source}</div>
                          <div className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-blue-600">{source.conversions}</div>
                          <div className="text-sm text-gray-500">conversions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsOverview.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'conversion' ? 'bg-green-100 text-green-600' :
                        activity.type === 'publish' ? 'bg-blue-100 text-blue-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {activity.type === 'conversion' ? <Target className="h-4 w-4" /> :
                         activity.type === 'publish' ? <Globe className="h-4 w-4" /> :
                         <Edit className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{activity.message}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
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
