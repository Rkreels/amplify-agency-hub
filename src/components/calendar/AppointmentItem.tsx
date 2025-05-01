
import { useState } from "react";
import { CalendarEvent } from "@/lib/calendar-data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { toast } from "sonner";
import { DatePicker } from "@/components/calendar/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface AppointmentItemProps {
  appointment: CalendarEvent;
}

export function AppointmentItem({ appointment }: AppointmentItemProps) {
  const { deleteEvent, updateEvent } = useCalendarStore();
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date>(
    appointment.date instanceof Date ? appointment.date : new Date(appointment.date)
  );
  const [rescheduleTime, setRescheduleTime] = useState(appointment.time.split(' - ')[0]);

  const handleCancel = () => {
    updateEvent(appointment.id, { status: 'cancelled' });
    toast.success("Appointment cancelled successfully");
  };

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    const [startTime] = appointment.time.split(' - ');
    let newTime = appointment.time;
    
    if (startTime !== rescheduleTime) {
      const endTimeStr = appointment.time.split(' - ')[1];
      // Calculate the end time based on duration from startTime
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTimeStr.split(':')[0]);
      const duration = endHour - startHour;
      
      const newStartHour = parseInt(rescheduleTime.split(':')[0]);
      const newEndHour = newStartHour + duration;
      
      const endTimePeriod = endTimeStr.split(' ')[1]; // AM/PM
      const newEndTime = `${newEndHour}:${endTimeStr.split(':')[1]}`;
      
      newTime = `${rescheduleTime} - ${newEndTime}`;
    }
    
    updateEvent(appointment.id, { 
      date: rescheduleDate,
      time: newTime,
      status: 'confirmed'
    });
    
    toast.success("Appointment rescheduled successfully");
    setShowRescheduleDialog(false);
  };

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", 
    "4:00 PM", "5:00 PM", "6:00 PM"
  ];
  
  const formattedDate = appointment.date instanceof Date 
    ? format(appointment.date, 'MMM d, yyyy')
    : format(new Date(appointment.date), 'MMM d, yyyy');

  return (
    <>
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
          <CalendarIcon className="h-3 w-3" />
          <span>{formattedDate}</span>
        </div>
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
              <Button size="sm" variant="outline" onClick={() => setShowRescheduleDialog(true)}>
                Reschedule
              </Button>
              <Button size="sm" variant="outline" className="text-destructive" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Reschedule your appointment with {appointment.contact.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReschedule} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <DatePicker date={rescheduleDate} onDateChange={(date) => date && setRescheduleDate(date)} />
            </div>
            <div className="space-y-2">
              <Label>Select Time</Label>
              <Select value={rescheduleTime} onValueChange={setRescheduleTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Confirm Reschedule
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
