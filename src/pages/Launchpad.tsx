
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, BarChart2, MessageSquare, Calendar, Settings, Megaphone, Globe, Award } from "lucide-react";

export default function Launchpad() {
  const quickActions = [
    {
      title: "Add Contact",
      description: "Create a new contact in your CRM",
      icon: Users,
      link: "/contacts/new",
    },
    {
      title: "Create Campaign",
      description: "Set up a new marketing campaign",
      icon: Megaphone,
      link: "/marketing/new",
    },
    {
      title: "Schedule Meeting",
      description: "Book a meeting with a prospect",
      icon: Calendar,
      link: "/calendars",
    },
    {
      title: "View Reports",
      description: "Check your performance metrics",
      icon: BarChart2,
      link: "/reporting",
    },
  ];

  const setupItems = [
    {
      title: "Set Up Your Account",
      description: "Complete your profile and agency settings",
      progress: 65,
      icon: Settings,
      link: "/settings",
    },
    {
      title: "Connect Your Domain",
      description: "Set up your custom domain for client sites",
      progress: 30,
      icon: Globe,
      link: "/sites/domains",
    },
    {
      title: "Invite Your Team",
      description: "Add team members to collaborate",
      progress: 0,
      icon: Users,
      link: "/settings/team",
    },
    {
      title: "Set Up Reputation Management",
      description: "Manage and collect reviews",
      progress: 0,
      icon: Award,
      link: "/reputation",
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Launchpad</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your agency today.
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help you get things done quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-4 px-4 justify-start"
                  >
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions and events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">New message from client</p>
                      <p className="text-sm text-muted-foreground">
                        Sarah Johnson sent a message about the new campaign
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {index === 0
                          ? "10 minutes ago"
                          : index === 1
                          ? "2 hours ago"
                          : index === 2
                          ? "Yesterday at 4:30 PM"
                          : "2 days ago"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Setup</CardTitle>
              <CardDescription>
                Complete these steps to get the most out of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {setupItems.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted p-1.5 rounded-full">
                          <item.icon className="h-3.5 w-3.5 text-foreground" />
                        </div>
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      <span className="text-xs">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Stats</CardTitle>
              <CardDescription>
                Your platform usage this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Contacts</span>
                    <span className="text-sm font-medium">140/500</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">SMS Credits</span>
                    <span className="text-sm font-medium">256/1000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "25.6%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Email Credits</span>
                    <span className="text-sm font-medium">4,120/10,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: "41.2%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
