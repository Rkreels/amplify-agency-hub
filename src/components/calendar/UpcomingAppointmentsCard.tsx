
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent } from "@/store/useCalendarStore";
import { AppointmentItem } from "@/components/calendar/AppointmentItem";

interface UpcomingAppointmentsCardProps {
  events: CalendarEvent[];
  setSelectedDate: (date: Date) => void;
}

export function UpcomingAppointmentsCard({ events, setSelectedDate }: UpcomingAppointmentsCardProps) {
  const handleViewAllAppointments = () => {
    toast.success("Loading all appointments");
  };

  // Convert CalendarEvent to match AppointmentItem expected format
  const convertToAppointmentFormat = (event: CalendarEvent) => ({
    ...event,
    date: new Date(event.startTime).toISOString().split('T')[0],
    contactEmail: event.contactName ? `${event.contactName.toLowerCase().replace(' ', '.')}@example.com` : 'contact@example.com'
  });

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
              .map((event) => (
                <AppointmentItem 
                  key={event.id} 
                  appointment={convertToAppointmentFormat(event)} 
                />
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
