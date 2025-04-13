
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarClock, ChevronRight, Mail, MessageCircle, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CampaignCardProps {
  campaign: {
    id: number;
    name: string;
    description: string;
    type: "email" | "sms" | "automation";
    status: "active" | "draft" | "scheduled" | "completed";
    audience: number;
    stats?: {
      delivered: number;
      opened?: number;
      clicked?: number;
    };
    startDate?: string;
  };
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{campaign.name}</CardTitle>
            <CardDescription className="mt-1">{campaign.description}</CardDescription>
          </div>
          <Badge
            className={cn(
              campaign.status === "active" && "bg-green-500",
              campaign.status === "draft" && "bg-gray-500",
              campaign.status === "scheduled" && "bg-blue-500",
              campaign.status === "completed" && "bg-purple-500"
            )}
          >
            {campaign.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{campaign.audience.toLocaleString()} recipients</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {campaign.type === "email" && <Mail className="h-4 w-4" />}
            {campaign.type === "sms" && <MessageCircle className="h-4 w-4" />}
            <span className="capitalize">{campaign.type}</span>
          </div>
          {campaign.startDate && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              <span>{campaign.startDate}</span>
            </div>
          )}
        </div>
        
        {campaign.stats && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivered</span>
              <span className="font-medium">{campaign.stats.delivered.toLocaleString()}</span>
            </div>
            <Progress value={campaign.stats.delivered / campaign.audience * 100} className="h-2" />
            
            {campaign.stats.opened !== undefined && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Opened</span>
                  <span className="font-medium">{campaign.stats.opened.toLocaleString()}</span>
                </div>
                <Progress value={campaign.stats.opened / campaign.stats.delivered * 100} className="h-2" />
              </>
            )}
            
            {campaign.stats.clicked !== undefined && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Clicked</span>
                  <span className="font-medium">{campaign.stats.clicked.toLocaleString()}</span>
                </div>
                <Progress value={campaign.stats.clicked / campaign.stats.delivered * 100} className="h-2" />
              </>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full mt-2" size="sm">
          <span>View Details</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
