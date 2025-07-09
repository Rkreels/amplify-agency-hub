
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCalendarStore, AppointmentType } from "@/store/useCalendarStore";
import { toast } from "sonner";

interface AppointmentTypeItemProps {
  appointmentType: AppointmentType;
}

export function AppointmentTypeItem({ appointmentType }: AppointmentTypeItemProps) {
  const { updateAppointmentType, deleteAppointmentType } = useCalendarStore();
  const [isActive, setIsActive] = useState(appointmentType.isActive);

  const handleToggleActive = (checked: boolean) => {
    setIsActive(checked);
    updateAppointmentType(appointmentType.id, { isActive: checked });
    toast.success(`${appointmentType.name} ${checked ? 'activated' : 'deactivated'}`);
  };

  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${appointmentType.name}"?`)) {
      deleteAppointmentType(appointmentType.id);
      toast.success("Appointment type deleted");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/book/${appointmentType.id}`);
    toast.success("Booking link copied to clipboard");
  };

  const handleViewBookingPage = () => {
    window.open(`/book/${appointmentType.id}`, '_blank');
  };

  return (
    <Card className={`transition-all ${!isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className={`w-4 h-4 rounded-full ${appointmentType.color || 'bg-blue-500'}`}
            />
            <div>
              <h3 className="font-medium">{appointmentType.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{appointmentType.duration} min</span>
                {appointmentType.location && (
                  <>
                    <span>•</span>
                    <span>{appointmentType.location}</span>
                  </>
                )}
                {appointmentType.price && appointmentType.price > 0 && (
                  <>
                    <span>•</span>
                    <span>${appointmentType.price}</span>
                  </>
                )}
              </div>
              {appointmentType.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {appointmentType.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleActive}
            />
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewBookingPage}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Booking Page
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
