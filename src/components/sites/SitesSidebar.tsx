
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  Filter,
  MoreVertical
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSitesStore, Site } from '@/store/useSitesStore';

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
  selectedSite
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

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sites & Funnels</h2>
          <Button size="sm" onClick={onCreateSite}>
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="flex-1">
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
      </div>

      {/* Sites List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              className={`p-3 rounded-lg border mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedSite?.id === site.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => onSiteSelect(site)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(site.type)}
                  <span className="font-medium text-sm truncate">{site.name}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getStatusColor(site.status)} text-xs`}>
                  {site.status}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {site.type}
                </Badge>
              </div>
              
              <div className="text-xs text-gray-500 truncate mb-1">
                {site.url}
              </div>
              
              <div className="text-xs text-gray-400">
                {site.visitors.toLocaleString()} visitors
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
