
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Globe, 
  Target, 
  TrendingUp, 
  Calendar,
  Eye,
  Edit,
  Settings,
  Copy,
  Trash2,
  Search,
  MoreVertical,
  ExternalLink,
  BarChart3,
  Download,
  Upload
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useSitesStore, Site } from '@/store/useSitesStore';
import { toast } from 'sonner';

interface SitesSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: any) => void;
  filterType: string;
  setFilterType: (type: any) => void;
  onSiteSelect: (site: Site) => void;
  onCreateSite: () => void;
  selectedSite: Site | null;
  onSiteAction: (action: string, site: Site) => void;
}

export function SitesSidebar({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onSiteSelect,
  onCreateSite,
  selectedSite,
  onSiteAction
}: SitesSidebarProps) {
  const { sites } = useSitesStore();

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

  const handleQuickAction = (action: string, site: Site, e: React.MouseEvent) => {
    e.stopPropagation();
    onSiteAction(action, site);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sites & Funnels</h2>
            <p className="text-sm text-gray-500">{filteredSites.length} of {sites.length} sites</p>
          </div>
          <Button size="sm" onClick={onCreateSite} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sites and funnels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-8">
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
            <SelectTrigger className="h-8">
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

      {/* Sites List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredSites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium">No sites found</p>
              <p className="text-xs text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Button size="sm" variant="outline" onClick={onCreateSite}>
                <Plus className="h-4 w-4 mr-1" />
                Create Site
              </Button>
            </div>
          ) : (
            filteredSites.map((site) => (
              <div
                key={site.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${
                  selectedSite?.id === site.id 
                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onSiteSelect(site)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getTypeIcon(site.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {site.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {site.url}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={(e) => handleQuickAction('view', site, e)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Live Site
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('edit', site, e)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('pages', site, e)}>
                        <Globe className="h-4 w-4 mr-2" />
                        Edit Pages
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleQuickAction('analytics', site, e)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('settings', site, e)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => handleQuickAction('duplicate', site, e)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleQuickAction('export', site, e)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => handleQuickAction('delete', site, e)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${getStatusColor(site.status)} text-xs border`}>
                    {site.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {site.type}
                  </Badge>
                  {site.status === 'published' && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                      Live
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{site.visitors.toLocaleString()} visitors</span>
                  <span>{site.pages.length} pages</span>
                </div>

                {/* Quick Actions Bar */}
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2 text-xs"
                    onClick={(e) => handleQuickAction('view', site, e)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2 text-xs"
                    onClick={(e) => handleQuickAction('pages', site, e)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 px-2 text-xs"
                    onClick={(e) => handleQuickAction('analytics', site, e)}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {sites.filter(s => s.status === 'published').length}
            </div>
            <div className="text-xs text-gray-500">Published</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {sites.filter(s => s.status === 'draft').length}
            </div>
            <div className="text-xs text-gray-500">Draft</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {sites.reduce((sum, site) => sum + site.visitors, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total Views</div>
          </div>
        </div>
      </div>
    </div>
  );
}
