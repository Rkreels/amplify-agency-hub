
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

export default function Calendars() {
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
    toast.success("Opening calendar creation form");
  };

  const handleCalendarSettings = () => {
    toast.success("Opening calendar settings");
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendars</h1>
          <p className="text-muted-foreground">
            Manage your appointments and booking pages
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCalendarSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Calendar Settings
          </Button>
          <Button onClick={handleCreateCalendar}>
            <Plus className="h-4 w-4 mr-2" />
            Create Calendar
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList>
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
