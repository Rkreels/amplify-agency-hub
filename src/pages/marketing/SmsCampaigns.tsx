
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SmsCampaignBuilder } from "@/components/marketing/SmsCampaignBuilder";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SmsCampaigns() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Example campaigns
  const campaigns = [
    {
      id: "1",
      name: "Weekend Flash Sale",
      audience: "Recent Customers",
      status: "sent",
      sentAt: "May 5, 2025",
      deliveryRate: 98,
      openRate: 62,
      recipients: 127
    },
    {
      id: "2",
      name: "Appointment Reminder",
      audience: "Upcoming Appointments",
      status: "scheduled",
      sentAt: "May 12, 2025 (Scheduled)",
      deliveryRate: null,
      openRate: null,
      recipients: 45
    },
    {
      id: "3",
      name: "New Product Launch",
      audience: "VIP Clients",
      status: "draft",
      sentAt: "Not sent",
      deliveryRate: null,
      openRate: null,
      recipients: 43
    },
    {
      id: "4",
      name: "Follow-up Campaign",
      audience: "New Leads",
      status: "sent",
      sentAt: "Apr 29, 2025",
      deliveryRate: 95,
      openRate: 48,
      recipients: 84
    },
    {
      id: "5",
      name: "Webinar Invitation",
      audience: "Webinar Attendees",
      status: "sent",
      sentAt: "Apr 20, 2025",
      deliveryRate: 97,
      openRate: 55,
      recipients: 56
    }
  ];
  
  const filteredCampaigns = searchQuery 
    ? campaigns.filter(campaign => 
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.audience.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : campaigns;
    
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage SMS marketing campaigns
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <SmsCampaignBuilder />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search campaigns..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Campaign</TableHead>
              <TableHead>Audience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent/Scheduled</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead className="text-right">Delivery Rate</TableHead>
              <TableHead className="text-right">Response Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No campaigns match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.audience}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>{campaign.sentAt}</TableCell>
                  <TableCell className="text-right">{campaign.recipients}</TableCell>
                  <TableCell className="text-right">
                    {campaign.deliveryRate ? `${campaign.deliveryRate}%` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.openRate ? `${campaign.openRate}%` : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
