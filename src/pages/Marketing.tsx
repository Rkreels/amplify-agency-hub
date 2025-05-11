
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart2, Mail, MessageSquare, Upload, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function Marketing() {
  const marketingModules = [
    {
      title: "Email Campaigns",
      description: "Create and send targeted email campaigns",
      icon: Mail,
      path: "/marketing",
      stats: { sent: 2450, opened: "32%" }
    },
    {
      title: "SMS Campaigns",
      description: "Send text message campaigns to your contacts",
      icon: MessageSquare,
      path: "/marketing/sms-campaigns",
      stats: { sent: 856, opened: "67%" }
    },
    {
      title: "Landing Pages",
      description: "Design high-converting landing pages",
      icon: Upload,
      path: "/marketing",
      stats: { pages: 12, conversions: "8.4%" }
    },
    {
      title: "Analytics",
      description: "Track performance of all marketing activities",
      icon: BarChart2,
      path: "/reporting",
      stats: { campaigns: 34, period: "30 days" }
    },
    {
      title: "Audience Manager",
      description: "Manage segments and targeting lists",
      icon: Users,
      path: "/marketing",
      stats: { segments: 16, contacts: 4350 }
    },
  ];
  
  const recentCampaigns = [
    {
      name: "Spring Sale Announcement",
      type: "Email",
      sentDate: "May 8, 2025",
      recipients: 1250,
      performance: "+12% conversion"
    },
    {
      name: "Weekend Flash Sale",
      type: "SMS",
      sentDate: "May 5, 2025",
      recipients: 850,
      performance: "+8% conversion"
    },
    {
      name: "Webinar Invitation",
      type: "Email",
      sentDate: "Apr 28, 2025",
      recipients: 1500,
      performance: "+15% registration"
    },
    {
      name: "New Product Launch",
      type: "Email",
      sentDate: "Apr 15, 2025",
      recipients: 2000,
      performance: "+25% clicks"
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
        <p className="text-muted-foreground">
          Create and manage marketing campaigns across multiple channels
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>Total active subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,350</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Campaigns Sent</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Open Rate</CardTitle>
            <CardDescription>All campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32.4%</div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Marketing Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {marketingModules.map((module) => (
          <Card key={module.title} className="transition-all hover:shadow-md">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </div>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                {module.title === "Email Campaigns" && (
                  <>
                    <div>Sent: {module.stats.sent}</div>
                    <div>Open rate: {module.stats.opened}</div>
                  </>
                )}
                {module.title === "SMS Campaigns" && (
                  <>
                    <div>Sent: {module.stats.sent}</div>
                    <div>Response rate: {module.stats.opened}</div>
                  </>
                )}
                {module.title === "Landing Pages" && (
                  <>
                    <div>Pages: {module.stats.pages}</div>
                    <div>Conversion: {module.stats.conversions}</div>
                  </>
                )}
                {module.title === "Analytics" && (
                  <>
                    <div>Campaigns: {module.stats.campaigns}</div>
                    <div>Period: {module.stats.period}</div>
                  </>
                )}
                {module.title === "Audience Manager" && (
                  <>
                    <div>Segments: {module.stats.segments}</div>
                    <div>Contacts: {module.stats.contacts}</div>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to={module.path} className="w-full">
                <Button variant="outline" className="w-full">
                  <span>Manage {module.title}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentCampaigns.map((campaign, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                <div>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {campaign.type} • {campaign.sentDate} • {campaign.recipients} recipients
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-green-600">{campaign.performance}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
