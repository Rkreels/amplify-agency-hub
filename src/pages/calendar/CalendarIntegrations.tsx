
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Globe, Settings, Check, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function CalendarIntegrations() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState<string | null>(null);
  
  const handleConnect = (provider: string) => {
    setConnecting(provider);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Connected to ${provider} successfully`);
      setConnecting(null);
    }, 1500);
  };
  
  const calendarProviders = [
    { 
      id: "google",
      name: "Google Calendar", 
      icon: <Calendar className="w-8 h-8 text-primary" />,
      connected: true,
      status: "Connected · 2 calendars synced"
    },
    { 
      id: "outlook",
      name: "Microsoft Outlook", 
      icon: <Calendar className="w-8 h-8 text-primary" />,
      connected: false
    },
    { 
      id: "apple",
      name: "Apple Calendar", 
      icon: <Calendar className="w-8 h-8 text-primary" />,
      connected: false
    },
    { 
      id: "caldav",
      name: "CalDAV", 
      icon: <Globe className="w-8 h-8 text-primary" />,
      connected: false
    }
  ];
  
  return (
    <AppLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendars")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Calendars
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar Integrations</h1>
          <p className="text-muted-foreground">
            Connect your external calendars to sync events and availability
          </p>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Calendar Providers</CardTitle>
          <CardDescription>Connect to your preferred calendar services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calendarProviders.map((provider) => (
              <Card key={provider.id} className="border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {provider.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{provider.name}</h3>
                        {provider.connected ? (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Badge variant="outline" className="gap-1 text-green-500 border-green-500/20 bg-green-500/10">
                              <Check className="h-3 w-3" /> Connected
                            </Badge>
                            <span className="ml-2">{provider.status}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Not connected
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {provider.connected ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleConnect(provider.name)}
                        disabled={connecting === provider.name}
                      >
                        {connecting === provider.name ? "Connecting..." : "Connect"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Calendars</CardTitle>
          <CardDescription>Manage your synced calendars and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Work Calendar</h3>
                    <p className="text-sm text-muted-foreground">Google Calendar</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Personal Calendar</h3>
                    <p className="text-sm text-muted-foreground">Google Calendar</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
