
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent } from "@/lib/calendar-data";
import { AppointmentItem } from "@/components/calendar/AppointmentItem";

interface UpcomingAppointmentsCardProps {
  events: CalendarEvent[];
  setSelectedDate: (date: Date) => void;
}

export function UpcomingAppointmentsCard({ events, setSelectedDate }: UpcomingAppointmentsCardProps) {
  const handleViewAllAppointments = () => {
    toast.success("Loading all appointments");
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Today, {format(new Date(), 'MMM d')}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
              View Day
            </Button>
          </div>
          
          <div className="space-y-3">
            {events
              .slice(0, 3)
              .map((appointment) => (
                <AppointmentItem key={appointment.id} appointment={appointment} />
              ))}
          </div>
          
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleViewAllAppointments}
            >
              View All Appointments
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
