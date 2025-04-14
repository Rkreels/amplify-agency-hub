
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, MessageSquare, Zap, MoreHorizontal, ExternalLink, Edit, Copy, Trash2, Play, Pause, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: number;
  name: string;
  description: string;
  type: "email" | "sms" | "automation";
  status: "active" | "scheduled" | "draft" | "completed";
  audience: number;
  stats?: {
    delivered?: number;
    opened?: number;
    clicked?: number;
  };
  startDate?: string;
}

interface CampaignCardProps {
  campaign: Campaign;
  view?: "grid" | "list";
  onAction?: (action: string) => void;
}

export function CampaignCard({ campaign, view = "grid", onAction }: CampaignCardProps) {
  const { name, description, type, status, audience, stats, startDate } = campaign;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "automation":
        return <Zap className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "scheduled":
        return "bg-blue-500";
      case "draft":
        return "bg-gray-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleActionClick = (action: string) => {
    if (onAction) {
      onAction(action);
    }
  };

  if (view === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-center p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}></div>
              <h3 className="font-semibold">{name}</h3>
              <Badge variant="outline" className="ml-auto">{type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{description}</p>
            <div className="flex items-center text-xs text-muted-foreground gap-4 mt-2">
              <div className="flex items-center gap-1">
                {getTypeIcon(type)}
                <span>Audience: {audience.toLocaleString()}</span>
              </div>
              {startDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{startDate}</span>
                </div>
              )}
            </div>
          </div>
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {status === "draft" && (
                  <DropdownMenuItem onClick={() => handleActionClick("activate")}>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </DropdownMenuItem>
                )}
                {status === "draft" && (
                  <DropdownMenuItem onClick={() => handleActionClick("schedule")}>
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </DropdownMenuItem>
                )}
                {status === "active" && (
                  <DropdownMenuItem onClick={() => handleActionClick("pause")}>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleActionClick("view")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("edit")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("duplicate")}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleActionClick("delete")} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}></div>
            <Badge variant="outline">{type}</Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {status === "draft" && (
                <DropdownMenuItem onClick={() => handleActionClick("activate")}>
                  <Play className="h-4 w-4 mr-2" />
                  Activate
                </DropdownMenuItem>
              )}
              {status === "draft" && (
                <DropdownMenuItem onClick={() => handleActionClick("schedule")}>
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </DropdownMenuItem>
              )}
              {status === "active" && (
                <DropdownMenuItem onClick={() => handleActionClick("pause")}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleActionClick("view")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("edit")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActionClick("duplicate")}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleActionClick("delete")} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-base leading-tight mt-2">{name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Audience</span>
          <span className="font-medium">{audience.toLocaleString()}</span>
        </div>
        {stats?.delivered && (
          <>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Delivered</span>
              <span className="font-medium">{stats.delivered.toLocaleString()}</span>
            </div>
            <Progress value={(stats.delivered / audience) * 100} className="h-1 mb-2" />
          </>
        )}
        {stats?.opened && (
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Opened</span>
            <span className="font-medium">
              {stats.opened.toLocaleString()} ({Math.round((stats.opened / (stats.delivered || audience)) * 100)}%)
            </span>
          </div>
        )}
        {stats?.clicked && (
          <div className="flex items-center justify-between text-sm">
            <span>Clicked</span>
            <span className="font-medium">
              {stats.clicked.toLocaleString()} ({Math.round((stats.clicked / (stats.delivered || audience)) * 100)}%)
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 border-t flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center">
          <Badge 
            variant="outline" 
            className={`
              px-2 py-0 h-5 
              ${status === 'active' ? 'text-green-600 border-green-400' : ''}
              ${status === 'scheduled' ? 'text-blue-600 border-blue-400' : ''}
              ${status === 'draft' ? 'text-gray-600 border-gray-400' : ''}
              ${status === 'completed' ? 'text-purple-600 border-purple-400' : ''}
            `}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        {startDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{startDate}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
