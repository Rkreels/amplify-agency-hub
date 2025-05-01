
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarClock, Copy, Edit, Share2, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CalendarType } from "@/lib/calendar-data";

interface CalendarTypeCardProps {
  type: CalendarType;
  viewMode?: "grid" | "list";
}

export function CalendarTypeCard({ type, viewMode = "grid" }: CalendarTypeCardProps) {
  const { deleteCalendarType, updateCalendarType } = useCalendarStore();
  const [isActive, setIsActive] = useState(type.isActive);
  
  const handleToggleActive = () => {
    const newState = !isActive;
    setIsActive(newState);
    updateCalendarType(type.id, { isActive: newState });
    toast.success(`Calendar ${newState ? 'activated' : 'deactivated'}`);
  };
  
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this calendar?")) {
      deleteCalendarType(type.id);
      toast.success("Calendar deleted");
    }
  };
  
  const handleEdit = () => {
    toast.success("Edit calendar dialog would open here");
    // In a real app, this would open an edit modal
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/calendar/${type.id}`);
    toast.success("Calendar link copied to clipboard");
  };
  
  const handleShare = () => {
    toast.success("Share calendar dialog would open here");
    // In a real app, this would open a share modal
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between border rounded-md p-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
            <CalendarClock className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{type.name}</h3>
              <Badge variant={isActive ? "default" : "outline"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleToggleActive}>
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-full ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
            <CalendarClock className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardTitle className="mt-2">{type.name}</CardTitle>
        <CardDescription>{type.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <p><strong>Type:</strong> {type.type}</p>
          <p><strong>Appointments:</strong> {type.appointmentCount || 0}</p>
          {type.color && (
            <div className="flex items-center gap-2 mt-1">
              <strong>Color:</strong>
              <div 
                className="h-4 w-4 rounded-full" 
                style={{ backgroundColor: type.color }}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleToggleActive}>
          {isActive ? "Deactivate" : "Activate"}
        </Button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
