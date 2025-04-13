
import { AppLayout } from "@/components/layout/AppLayout";
import { Globe, Plus, ExternalLink, Code, Settings, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Sites() {
  const sites = [
    {
      id: 1,
      name: "Main Marketing Site",
      url: "www.youragency.com",
      status: "published",
      lastUpdated: "2 days ago",
      visitors: 1245,
      pages: 12,
    },
    {
      id: 2,
      name: "Client Booking Page",
      url: "booking.youragency.com",
      status: "published",
      lastUpdated: "1 week ago",
      visitors: 856,
      pages: 3,
    },
    {
      id: 3,
      name: "Black Friday Landing Page",
      url: "promo.youragency.com/black-friday",
      status: "draft",
      lastUpdated: "3 hours ago",
      visitors: 0,
      pages: 1,
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">
            Manage your websites, landing pages, and funnels
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Site
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sites.map((site) => (
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
                  <div className="text-2xl font-medium">{site.pages}</div>
                  <div className="text-xs text-muted-foreground">Pages</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Last updated {site.lastUpdated}</span>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
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
            <Button>Get Started</Button>
            <Button variant="outline">
              <Code className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
