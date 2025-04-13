
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  User, 
  Users, 
  CreditCard, 
  Globe, 
  BellRing, 
  ShieldCheck, 
  Smartphone, 
  Palette, 
  Mail, 
  MessageSquare 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
        <Button>
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {[
                  { icon: User, label: "Profile", value: "profile" },
                  { icon: Users, label: "Team", value: "team" },
                  { icon: CreditCard, label: "Billing", value: "billing" },
                  { icon: Globe, label: "Domains", value: "domains" },
                  { icon: BellRing, label: "Notifications", value: "notifications" },
                  { icon: ShieldCheck, label: "Security", value: "security" },
                  { icon: Smartphone, label: "Devices", value: "devices" },
                  { icon: Palette, label: "Appearance", value: "appearance" },
                  { icon: Mail, label: "Email Templates", value: "email" },
                  { icon: MessageSquare, label: "SMS Templates", value: "sms" },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                      index === 0 ? 'bg-muted' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="" alt="Your profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-medium">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      This will be displayed on your profile and in comments.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Upload New</Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" defaultValue="Marketing Director" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select id="timezone" className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md">
                      <option>Pacific Time (US & Canada)</option>
                      <option>Eastern Time (US & Canada)</option>
                      <option>Central Time (US & Canada)</option>
                      <option>Mountain Time (US & Canada)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select id="language" className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Preferences</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for important events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text message alerts for critical updates
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="font-medium">Connected Accounts</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Google", status: "connected", date: "Connected on Mar 15, 2025" },
                      { name: "Microsoft", status: "not-connected", date: null },
                      { name: "Slack", status: "connected", date: "Connected on Apr 2, 2025" },
                    ].map((account, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Globe className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{account.name}</div>
                            {account.date && <div className="text-xs text-muted-foreground">{account.date}</div>}
                          </div>
                        </div>
                        <div>
                          {account.status === "connected" ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                Connected
                              </Badge>
                              <Button variant="outline" size="sm">Disconnect</Button>
                            </div>
                          ) : (
                            <Button variant="outline" size="sm">Connect</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
