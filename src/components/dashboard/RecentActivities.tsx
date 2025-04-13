
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, ArrowUpRight, Mail, Phone, PlusCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "email",
      description: "Email sent to Sarah Johnson",
      time: "10 mins ago",
      icon: Mail,
      user: {
        name: "Sarah Johnson",
        image: "",
        initials: "SJ",
      },
    },
    {
      id: 2,
      type: "call",
      description: "Call with Michael Brown about new project",
      time: "1 hour ago",
      icon: Phone,
      user: {
        name: "Michael Brown",
        image: "",
        initials: "MB",
      },
    },
    {
      id: 3,
      type: "lead",
      description: "New lead created: Kevin Wilson",
      time: "2 hours ago",
      icon: PlusCircle,
      user: {
        name: "Kevin Wilson",
        image: "",
        initials: "KW",
      },
    },
    {
      id: 4,
      type: "opportunity",
      description: "Opportunity moved to Negotiation stage",
      time: "3 hours ago",
      icon: ArrowUpRight,
      user: {
        name: "Emma Davis",
        image: "",
        initials: "ED",
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-0.5">
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Your team's activities in the last 24 hours.
          </CardDescription>
        </div>
        <Activity className="w-4 h-4 ml-auto text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 rounded-md p-2.5 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.user.image} alt={activity.user.name} />
              <AvatarFallback>{activity.user.initials}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">{activity.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <div className="flex items-center gap-2">
                <activity.icon className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
