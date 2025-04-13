
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Users, Calendar, DollarSign, Tag, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Pipeline() {
  const stages = [
    {
      id: "qualification",
      name: "Qualification",
      deals: [
        {
          id: 1,
          name: "Website Redesign",
          company: "ABC Corp",
          value: 12000,
          deadline: "Apr 30, 2025",
          tags: ["Design", "Development"],
          assignedTo: {
            name: "John Doe",
            avatar: "",
          },
        },
        {
          id: 2,
          name: "SEO Services",
          company: "XYZ Inc",
          value: 8500,
          deadline: "May 15, 2025",
          tags: ["Marketing", "SEO"],
          assignedTo: {
            name: "Jane Smith",
            avatar: "",
          },
        },
        {
          id: 3,
          name: "Marketing Strategy",
          company: "Acme Co",
          value: 9500,
          deadline: "May 10, 2025",
          tags: ["Marketing", "Strategy"],
          assignedTo: {
            name: "Bob Johnson",
            avatar: "",
          },
        },
      ],
    },
    {
      id: "meeting",
      name: "Meeting",
      deals: [
        {
          id: 4,
          name: "App Development",
          company: "Tech Solutions",
          value: 28000,
          deadline: "Jun 5, 2025",
          tags: ["Mobile", "Development"],
          assignedTo: {
            name: "Alice Williams",
            avatar: "",
          },
        },
        {
          id: 5,
          name: "Digital Marketing",
          company: "Global Enterprises",
          value: 15000,
          deadline: "May 25, 2025",
          tags: ["Marketing", "Digital"],
          assignedTo: {
            name: "John Doe",
            avatar: "",
          },
        },
      ],
    },
    {
      id: "proposal",
      name: "Proposal",
      deals: [
        {
          id: 6,
          name: "Brand Identity",
          company: "Startup Inc",
          value: 18000,
          deadline: "Jun 15, 2025",
          tags: ["Branding", "Design"],
          assignedTo: {
            name: "Jane Smith",
            avatar: "",
          },
        },
        {
          id: 7,
          name: "E-commerce Platform",
          company: "Retail Solutions",
          value: 32000,
          deadline: "Jul 1, 2025",
          tags: ["E-commerce", "Development"],
          assignedTo: {
            name: "Bob Johnson",
            avatar: "",
          },
        },
      ],
    },
    {
      id: "negotiation",
      name: "Negotiation",
      deals: [
        {
          id: 8,
          name: "Content Marketing",
          company: "Media Group",
          value: 14000,
          deadline: "Jun 20, 2025",
          tags: ["Content", "Marketing"],
          assignedTo: {
            name: "Alice Williams",
            avatar: "",
          },
        },
      ],
    },
    {
      id: "closed",
      name: "Closed Won",
      deals: [
        {
          id: 9,
          name: "Social Media Campaign",
          company: "Fashion Brand",
          value: 8000,
          deadline: "Jun 10, 2025",
          tags: ["Social", "Marketing"],
          assignedTo: {
            name: "John Doe",
            avatar: "",
          },
        },
        {
          id: 10,
          name: "CRM Integration",
          company: "Consultancy Firm",
          value: 22000,
          deadline: "May 28, 2025",
          tags: ["CRM", "Integration"],
          assignedTo: {
            name: "Jane Smith",
            avatar: "",
          },
        },
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage your deals through different stages.
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="main">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Pipeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">Main Pipeline</SelectItem>
              <SelectItem value="marketing">Marketing Pipeline</SelectItem>
              <SelectItem value="services">Services Pipeline</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {stages.map((stage) => (
            <div key={stage.id} className="kanban-column">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">{stage.name}</h3>
                <Badge variant="outline">{stage.deals.length}</Badge>
              </div>
              <div className="space-y-2">
                {stage.deals.map((deal) => (
                  <Card key={deal.id} className="kanban-card card-hover">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium text-sm">{deal.name}</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">
                      {deal.company}
                    </p>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${deal.value.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {deal.deadline}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {deal.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs font-normal px-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={deal.assignedTo.avatar}
                          alt={deal.assignedTo.name}
                        />
                        <AvatarFallback className="text-xs">
                          {deal.assignedTo.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground text-sm h-auto py-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
