
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  ListFilter,
  CalendarDays,
  List,
  Grid3X3,
  Download,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: number;
  name: string;
  description: string;
  type: "email" | "sms" | "automation";
  status: "active" | "scheduled" | "draft" | "completed";
  audience: number;
  stats?: {
    delivered?: number;
    opened?: number;
    clicked?: number;
  };
  startDate?: string;
}

export default function Marketing() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "Spring 2025 Newsletter",
      description: "Monthly newsletter featuring product updates and tips.",
      type: "email",
      status: "active",
      audience: 3248,
      stats: {
        delivered: 3102,
        opened: 1842,
        clicked: 843,
      },
      startDate: "Apr 5, 2025",
    },
    {
      id: 2,
      name: "Special Offer Announcement",
      description: "Limited time discount on premium plans.",
      type: "email",
      status: "scheduled",
      audience: 2506,
      startDate: "Apr 20, 2025",
    },
    {
      id: 3,
      name: "Lead Qualification Sequence",
      description: "Automated follow-up for new leads.",
      type: "automation",
      status: "active",
      audience: 842,
      stats: {
        delivered: 721,
      },
      startDate: "Mar 15, 2025",
    },
    {
      id: 4,
      name: "Event Reminder",
      description: "Reminder for upcoming webinar.",
      type: "sms",
      status: "completed",
      audience: 1204,
      stats: {
        delivered: 1189,
        clicked: 567,
      },
      startDate: "Mar 10, 2025",
    },
    {
      id: 5,
      name: "New Feature Announcement",
      description: "Introducing our latest platform features.",
      type: "email",
      status: "draft",
      audience: 4500,
    },
    {
      id: 6,
      name: "Re-engagement Campaign",
      description: "Campaign to bring back inactive users.",
      type: "automation",
      status: "active",
      audience: 1578,
      stats: {
        delivered: 1492,
        opened: 680,
        clicked: 245,
      },
      startDate: "Mar 25, 2025",
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>(campaigns);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: "",
    description: "",
    type: "email",
    status: "draft",
    audience: 0
  });
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "audience">("newest");
  
  // Filter campaigns
  useEffect(() => {
    let filtered = [...campaigns];
    
    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(campaign => campaign.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        campaign => 
          campaign.name.toLowerCase().includes(lowerCaseQuery) ||
          campaign.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Sort campaigns
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
          const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "audience":
        filtered.sort((a, b) => b.audience - a.audience);
        break;
    }
    
    setFilteredCampaigns(filtered);
  }, [campaigns, searchQuery, activeTab, sortBy]);
  
  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.description) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const newId = Math.max(...campaigns.map(c => c.id)) + 1;
    
    const campaign: Campaign = {
      id: newId,
      name: newCampaign.name || "",
      description: newCampaign.description || "",
      type: newCampaign.type as "email" | "sms" | "automation",
      status: newCampaign.status as "active" | "scheduled" | "draft" | "completed",
      audience: newCampaign.audience || 0,
      startDate: newCampaign.status === "draft" ? undefined : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setCampaigns([...campaigns, campaign]);
    setIsCreatingCampaign(false);
    setNewCampaign({
      name: "",
      description: "",
      type: "email",
      status: "draft",
      audience: 0
    });
    
    toast.success("Campaign created successfully");
  };
  
  const handleCampaignAction = (action: string, campaignId: number) => {
    switch(action) {
      case "duplicate":
        const campaignToDuplicate = campaigns.find(c => c.id === campaignId);
        if (campaignToDuplicate) {
          const newId = Math.max(...campaigns.map(c => c.id)) + 1;
          const duplicatedCampaign: Campaign = {
            ...campaignToDuplicate,
            id: newId,
            name: `${campaignToDuplicate.name} (Copy)`,
            status: "draft",
            startDate: undefined,
          };
          setCampaigns([...campaigns, duplicatedCampaign]);
          toast.success("Campaign duplicated");
        }
        break;
      case "delete":
        setCampaigns(campaigns.filter(c => c.id !== campaignId));
        toast.success("Campaign deleted");
        break;
      case "activate":
        setCampaigns(campaigns.map(c => 
          c.id === campaignId 
            ? { ...c, status: "active", startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } 
            : c
        ));
        toast.success("Campaign activated");
        break;
      case "pause":
        setCampaigns(campaigns.map(c => 
          c.id === campaignId 
            ? { ...c, status: "draft" } 
            : c
        ));
        toast.success("Campaign paused");
        break;
      case "schedule":
        setCampaigns(campaigns.map(c => 
          c.id === campaignId 
            ? { ...c, status: "scheduled", startDate: "Apr 30, 2025" } 
            : c
        ));
        toast.success("Campaign scheduled");
        break;
      default:
        toast.info(`${action} campaign ${campaignId}`);
    }
  };
  
  const handleExport = (format: string) => {
    toast.success(`Campaigns exported as ${format}`);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Marketing Campaigns
          </h1>
          <p className="text-muted-foreground">
            Create and manage your marketing automations and campaigns.
          </p>
        </div>
        <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Add details for your new marketing campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(value) => 
                    setNewCampaign({...newCampaign, type: value as "email" | "sms" | "automation"})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newCampaign.status}
                  onValueChange={(value) => 
                    setNewCampaign({...newCampaign, status: value as "active" | "scheduled" | "draft" | "completed"})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select campaign status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="audience" className="text-right">
                  Audience Size
                </Label>
                <Input
                  id="audience"
                  type="number"
                  className="col-span-3"
                  value={newCampaign.audience || ""}
                  onChange={(e) => setNewCampaign({...newCampaign, audience: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingCampaign(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ListFilter className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSortBy("newest")}>
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("audience")}>
              Audience Size
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline">
          <CalendarDays className="h-4 w-4 mr-2" />
          Date Range
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("CSV")}>
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("PDF")}>
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("Excel")}>
              Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex divide-x rounded-md border">
          <Button
            variant="outline"
            className={`rounded-r-none border-0 ${viewMode === "grid" ? 'bg-muted' : ''}`}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className={`rounded-l-none border-0 ${viewMode === "list" ? 'bg-muted' : ''}`}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <div className="my-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'} found
          </p>
          <Button variant="ghost" size="sm" onClick={() => {
            setSearchQuery('');
            setActiveTab('all');
            setSortBy('newest');
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
        </div>
        <TabsContent value="all" className="mt-0">
          {filteredCampaigns.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredCampaigns.map((campaign) => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  view={viewMode} 
                  onAction={(action) => handleCampaignAction(action, campaign.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No campaigns found matching your criteria</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>
        {["active", "scheduled", "draft", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0">
            {filteredCampaigns.length > 0 ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    view={viewMode}
                    onAction={(action) => handleCampaignAction(action, campaign.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No {tab} campaigns found</p>
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchQuery('')}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
}
