
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignCard } from "@/components/marketing/CampaignCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  ListFilter,
  CalendarDays,
  List,
  Grid3X3,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Spring 2025 Newsletter",
    description: "Monthly newsletter featuring product updates and tips.",
    type: "email" as const,
    status: "active" as const,
    audience: 3248,
    stats: {
      delivered: 3102,
      opened: 1842,
      clicked: 843,
    },
    startDate: "Apr 5, 2025",
  },
  {
    id: 2,
    name: "Special Offer Announcement",
    description: "Limited time discount on premium plans.",
    type: "email" as const,
    status: "scheduled" as const,
    audience: 2506,
    startDate: "Apr 20, 2025",
  },
  {
    id: 3,
    name: "Lead Qualification Sequence",
    description: "Automated follow-up for new leads.",
    type: "automation" as const,
    status: "active" as const,
    audience: 842,
    stats: {
      delivered: 721,
    },
    startDate: "Mar 15, 2025",
  },
  {
    id: 4,
    name: "Event Reminder",
    description: "Reminder for upcoming webinar.",
    type: "sms" as const,
    status: "completed" as const,
    audience: 1204,
    stats: {
      delivered: 1189,
      clicked: 567,
    },
    startDate: "Mar 10, 2025",
  },
  {
    id: 5,
    name: "New Feature Announcement",
    description: "Introducing our latest platform features.",
    type: "email" as const,
    status: "draft" as const,
    audience: 4500,
  },
  {
    id: 6,
    name: "Re-engagement Campaign",
    description: "Campaign to bring back inactive users.",
    type: "automation" as const,
    status: "active" as const,
    audience: 1578,
    stats: {
      delivered: 1492,
      opened: 680,
      clicked: 245,
    },
    startDate: "Mar 25, 2025",
  },
];

export default function Marketing() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Marketing Campaigns
          </h1>
          <p className="text-muted-foreground">
            Create and manage your marketing automations and campaigns.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search campaigns..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <ListFilter className="h-4 w-4 mr-2" />
          Sort
        </Button>
        <Button variant="outline">
          <CalendarDays className="h-4 w-4 mr-2" />
          Date Range
        </Button>
        <div className="flex divide-x rounded-md border">
          <Button
            variant="outline"
            className="rounded-r-none border-0"
            size="icon"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="rounded-l-none border-0"
            size="icon"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns
              .filter((c) => c.status === "active")
              .map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="scheduled" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns
              .filter((c) => c.status === "scheduled")
              .map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="drafts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns
              .filter((c) => c.status === "draft")
              .map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns
              .filter((c) => c.status === "completed")
              .map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
