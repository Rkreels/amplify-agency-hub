
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, QrCode, Settings, Bell, Share2, Shield, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Mobile() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mobile App</h1>
          <p className="text-muted-foreground">
            Manage and access your business on the go
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            App Settings
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download App
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Access</CardTitle>
              <CardDescription>Download and access your business on mobile devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center text-center p-6 border rounded-md">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">iOS Application</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Download the app from the App Store for iPhone and iPad devices
                  </p>
                  <Button className="w-full mb-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download for iOS
                  </Button>
                  <div className="flex justify-center mt-4">
                    <div className="border p-4 rounded-md">
                      <QrCode className="h-24 w-24" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan to download
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center text-center p-6 border rounded-md">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Smartphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Android Application</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Download the app from the Google Play Store for Android devices
                  </p>
                  <Button className="w-full mb-2">
                    <Download className="h-4 w-4 mr-2" />
                    Download for Android
                  </Button>
                  <div className="flex justify-center mt-4">
                    <div className="border p-4 rounded-md">
                      <QrCode className="h-24 w-24" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan to download
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Features</CardTitle>
              <CardDescription>Available functionality on mobile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: Bell, name: "Push Notifications", description: "Get real-time alerts for leads and activities" },
                  { icon: Smartphone, name: "Offline Mode", description: "Access key data without internet connection" },
                  { icon: Shield, name: "Secure Login", description: "Biometric authentication for enhanced security" },
                  { icon: Share2, name: "Share & Collaborate", description: "Share reports and updates with your team" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Overview</CardTitle>
              <CardDescription>Key features and functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Real-time Dashboard</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View key metrics and performance data on the go with our mobile-optimized dashboard.
                  </p>
                  <img 
                    src="https://placehold.co/300x180" 
                    alt="Dashboard preview" 
                    className="w-full rounded-md mb-2"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Contact Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access your CRM contacts, add notes, and manage activities from your mobile device.
                  </p>
                  <img 
                    src="https://placehold.co/300x180" 
                    alt="Contacts preview" 
                    className="w-full rounded-md mb-2"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Unified Inbox</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Respond to client messages across all channels from a single mobile inbox.
                  </p>
                  <img 
                    src="https://placehold.co/300x180" 
                    alt="Inbox preview" 
                    className="w-full rounded-md mb-2"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your mobile alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                Notification settings will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Settings</CardTitle>
              <CardDescription>Customize your mobile experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                Mobile app settings will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="help" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Resources and assistance for the mobile app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <HelpCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">FAQs</h3>
                      <p className="text-sm text-muted-foreground">Common questions about the mobile app</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View FAQs
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Tutorials</h3>
                      <p className="text-sm text-muted-foreground">Video guides for using the mobile app</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Tutorials
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
