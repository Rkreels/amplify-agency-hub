
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function AppMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const apps = [
    {
      id: "1",
      name: "Stripe Integration",
      description: "Accept payments seamlessly with Stripe",
      category: "Payments",
      rating: 4.8,
      downloads: "10k+",
      installed: true
    },
    {
      id: "2", 
      name: "Mailchimp Sync",
      description: "Sync contacts with Mailchimp for email marketing",
      category: "Marketing",
      rating: 4.6,
      downloads: "5k+",
      installed: false
    },
    {
      id: "3",
      name: "Zapier Connect",
      description: "Connect with 5000+ apps through Zapier",
      category: "Automation",
      rating: 4.9,
      downloads: "15k+",
      installed: false
    },
    {
      id: "4",
      name: "Google Analytics",
      description: "Track website performance and user behavior",
      category: "Analytics",
      rating: 4.7,
      downloads: "20k+",
      installed: true
    }
  ];

  const filteredApps = searchQuery
    ? apps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apps;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">App Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and install apps to extend your platform capabilities
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Browse Categories
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredApps.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{app.name}</CardTitle>
                  <CardDescription className="mt-2">{app.description}</CardDescription>
                </div>
                <Badge variant="outline">{app.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(app.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">{app.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{app.downloads}</span>
              </div>
              
              {app.installed ? (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" disabled>
                    Installed
                  </Button>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              ) : (
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
