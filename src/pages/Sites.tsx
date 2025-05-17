
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Globe, Plus, ExternalLink, Code, Settings, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSitesStore } from "@/store/useSitesStore";
import { SiteForm } from "@/components/sites/SiteForm";
import { SiteDetails } from "@/components/sites/SiteDetails";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

export default function Sites() {
  const { sites, setSelectedSite } = useSitesStore();
  const [showNewSiteDialog, setShowNewSiteDialog] = useState(false);
  const [showSiteDetails, setShowSiteDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSites = searchQuery
    ? sites.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sites;
  
  const handleViewSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      setSelectedSite(site);
      setShowSiteDetails(true);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage your websites, landing pages, and funnels
          </p>
        </div>
        <Dialog open={showNewSiteDialog} onOpenChange={setShowNewSiteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Site
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Site</DialogTitle>
            </DialogHeader>
            <SiteForm onComplete={() => setShowNewSiteDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <Input 
          placeholder="Search sites..." 
          className="max-w-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge
                  variant={site.status === "published" ? "default" : "outline"}
                  className="mb-2"
                >
                  {site.status === "published" ? "Published" : "Draft"}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle>{site.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Globe className="h-3.5 w-3.5 mr-1" />
                {site.url}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-muted/50 rounded-md p-3">
                  <div className="text-2xl font-medium">{site.visitors}</div>
                  <div className="text-xs text-muted-foreground">Visitors</div>
                </div>
                <div className="bg-muted/50 rounded-md p-3">
                  <div className="text-2xl font-medium">{site.pages.length}</div>
                  <div className="text-xs text-muted-foreground">Pages</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Last updated {format(new Date(site.lastUpdated), 'MMM d')}</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => handleViewSite(site.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-dashed flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Create New Site</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Create a website, landing page, or funnel
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setShowNewSiteDialog(true)}>Get Started</Button>
            <Button variant="outline">
              <Code className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </Card>
      </div>
      
      <Dialog open={showSiteDetails} onOpenChange={setShowSiteDetails}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Site Details</DialogTitle>
          </DialogHeader>
          <SiteDetails onClose={() => setShowSiteDetails(false)} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
