
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useState, useEffect } from "react";
import { defaultEvents } from "@/lib/calendar-data";
import { UpcomingAppointmentsCard } from "@/components/calendar/UpcomingAppointmentsCard";
import { CalendarTabContent } from "@/components/calendar/CalendarTabContent";
import { CalendarsTabContent } from "@/components/calendar/CalendarsTabContent";
import { AvailabilityTabContent } from "@/components/calendar/AvailabilityTabContent";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Calendars() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const {
    appointmentTypes,
    calendarTypes,
    events,
    selectedDate,
    setSelectedDate,
    selectedTab,
    setSelectedTab,
    addEvent
  } = useCalendarStore();
  
  // Load default events if none exist
  useEffect(() => {
    if (events.length === 0) {
      defaultEvents.forEach(event => addEvent(event));
    }
  }, [events.length, addEvent]);

  const handleCreateCalendar = () => {
    navigate("/calendar/create");
  };

  const handleCalendarSettings = () => {
    navigate("/calendar/settings");
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendars</h1>
          <p className="text-muted-foreground">
            Manage your appointments and booking pages
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCalendarSettings} size={isMobile ? "sm" : "default"}>
            <Settings className="h-4 w-4 mr-2" />
            {isMobile ? "Settings" : "Calendar Settings"}
          </Button>
          <Button onClick={handleCreateCalendar} size={isMobile ? "sm" : "default"}>
            <Plus className="h-4 w-4 mr-2" />
            {isMobile ? "Create" : "Create Calendar"}
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="calendars">My Calendars</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarTabContent
                events={events}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            
            <div>
              <Card>
                <UpcomingAppointmentsCard 
                  events={events}
                  setSelectedDate={setSelectedDate}
                />
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="calendars" className="mt-4">
          <CalendarsTabContent />
        </TabsContent>
        
        <TabsContent value="availability" className="mt-4">
          <AvailabilityTabContent />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
