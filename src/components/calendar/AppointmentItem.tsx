
import { CalendarEvent } from "@/lib/calendar-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { toast } from "sonner";

interface AppointmentItemProps {
  appointment: CalendarEvent;
}

export function AppointmentItem({ appointment }: AppointmentItemProps) {
  const { deleteEvent, updateEvent } = useCalendarStore();

  const handleCancel = () => {
    updateEvent(appointment.id, { status: 'cancelled' });
    toast.success("Appointment cancelled");
  };

  const handleReschedule = () => {
    toast.success("Opening reschedule dialog");
  };

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{appointment.time}</span>
        <Badge variant={appointment.status === 'confirmed' ? 'default' : 
               appointment.status === 'cancelled' ? 'destructive' : 'outline'}>
          {appointment.status === 'confirmed' ? 'Confirmed' : 
           appointment.status === 'cancelled' ? 'Cancelled' : 'Pending'}
        </Badge>
      </div>
      <div className="text-sm font-medium">{appointment.title}</div>
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        {appointment.type === 'Video Call' ? (
          <Video className="h-3 w-3" />
        ) : (
          <MapPin className="h-3 w-3" />
        )}
        <span>{appointment.type}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={appointment.contact.avatar} alt={appointment.contact.name} />
            <AvatarFallback>{appointment.contact.initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm">{appointment.contact.name}</div>
        </div>
        {appointment.status !== 'cancelled' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleReschedule}>Reschedule</Button>
            <Button size="sm" variant="outline" className="text-destructive" onClick={handleCancel}>Cancel</Button>
          </div>
        )}
      </div>
    </div>
  );
}
