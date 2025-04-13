
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Search, Filter, Download, Tag, Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Marketplace() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">App Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and install apps to extend your platform
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          My Apps
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search apps and integrations..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Tag className="h-4 w-4 mr-2" />
          Categories
        </Button>
      </div>
      
      <Tabs defaultValue="popular" className="mb-6">
        <TabsList>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                name: "Zapier", 
                description: "Connect with 3,000+ apps and automate workflows", 
                category: "Integration", 
                price: "Free", 
                rating: 4.8 
              },
              { 
                name: "Google Analytics", 
                description: "Track website traffic and user behavior", 
                category: "Analytics", 
                price: "Free", 
                rating: 4.7 
              },
              { 
                name: "Mailchimp", 
                description: "Email marketing automation and campaigns", 
                category: "Marketing", 
                price: "Free / Premium", 
                rating: 4.6 
              },
              { 
                name: "Calendly", 
                description: "Scheduling automation and appointment booking", 
                category: "Productivity", 
                price: "Free / Premium", 
                rating: 4.9 
              },
              { 
                name: "Stripe", 
                description: "Online payment processing for businesses", 
                category: "Payments", 
                price: "Transaction fees", 
                rating: 4.8 
              },
              { 
                name: "HubSpot", 
                description: "CRM platform with marketing, sales, and service", 
                category: "CRM", 
                price: "Free / Premium", 
                rating: 4.5 
              },
            ].map((app, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{app.category}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm ml-1">{app.rating}</span>
                    </div>
                  </div>
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium">{app.price}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Install</Button>
                    <Button variant="outline" className="flex-1">
                      Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder content for new apps */}
            <Card className="flex justify-center items-center p-8 text-muted-foreground">
              New apps will be displayed here
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder content for marketing apps */}
            <Card className="flex justify-center items-center p-8 text-muted-foreground">
              Marketing apps will be displayed here
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="crm" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder content for CRM apps */}
            <Card className="flex justify-center items-center p-8 text-muted-foreground">
              CRM apps will be displayed here
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ecommerce" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder content for e-commerce apps */}
            <Card className="flex justify-center items-center p-8 text-muted-foreground">
              E-commerce apps will be displayed here
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Featured Apps</CardTitle>
          <CardDescription>Popular integrations for agencies and businesses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "Twilio", description: "SMS and voice messaging" },
              { name: "ActiveCampaign", description: "Marketing automation" },
              { name: "Shopify", description: "E-commerce integration" },
              { name: "Zoom", description: "Video conferencing" },
            ].map((app, index) => (
              <Card key={index} className="border-dashed">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-3">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">{app.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{app.description}</p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
