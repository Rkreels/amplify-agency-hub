
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bell, Mail, MessageSquare, CheckCheck, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function Automation() {
  const automationTypes = [
    {
      title: "SMS Automations",
      description: "Create automated SMS sequences triggered by specific events",
      icon: MessageSquare,
      path: "/automation/sms",
      count: 3
    },
    {
      title: "Email Automations",
      description: "Build email campaigns that send based on user actions",
      icon: Mail,
      path: "/automation",
      count: 5
    },
    {
      title: "Notification Automations",
      description: "Send push notifications based on triggers",
      icon: Bell,
      path: "/automation",
      count: 2
    },
    {
      title: "Task Automations",
      description: "Automatically create and assign tasks to team members",
      icon: CheckCheck,
      path: "/automation",
      count: 4
    },
    {
      title: "Calendar Automations",
      description: "Schedule events based on user actions and triggers",
      icon: Calendar,
      path: "/automation",
      count: 1
    }
  ];
  
  const recentTriggers = [
    {
      name: "Contact Submitted Form",
      count: 156,
      lastTriggered: "2 hours ago"
    },
    {
      name: "Appointment Created",
      count: 89,
      lastTriggered: "6 hours ago"
    },
    {
      name: "Tag Added",
      count: 64,
      lastTriggered: "1 day ago"
    },
    {
      name: "Opportunity Stage Changed",
      count: 42,
      lastTriggered: "2 days ago"
    }
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Automation</h1>
        <p className="text-muted-foreground">
          Create and manage automated workflows for your business
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Workflows</CardTitle>
            <CardDescription>Active automations across channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">15</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Messages Sent</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Engagement with automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24.8%</div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Automation Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {automationTypes.map((type) => (
          <Card key={type.title} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <type.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{type.title}</CardTitle>
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-muted-foreground">{type.count} automations</span>
              <Link to={type.path}>
                <Button variant="ghost" size="sm">
                  Manage
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Triggers</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentTriggers.map((trigger, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{trigger.name}</div>
                  <div className="text-sm text-muted-foreground">Last triggered {trigger.lastTriggered}</div>
                </div>
                <div className="text-right">
                  <div>{trigger.count} times</div>
                  <Button variant="link" size="sm" className="h-auto p-0">View details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
