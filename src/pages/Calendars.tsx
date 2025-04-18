
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  Clock,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendarStore } from "@/store/useCalendarStore";
import { AppointmentTypeDialog } from "@/components/calendar/AppointmentTypeDialog";
import { toast } from "sonner";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { useState, useEffect } from "react";
import { CreateCalendarCard } from "@/components/calendar/CreateCalendarCard";
import { CalendarTypeCard } from "@/components/calendar/CalendarTypeCard";
import { AppointmentTypeItem } from "@/components/calendar/AppointmentTypeItem";
import { AppointmentItem } from "@/components/calendar/AppointmentItem";
import { defaultEvents } from "@/lib/calendar-data";

export default function Calendars() {
  const {
    appointmentTypes,
    calendarTypes,
    events,
    selectedDate,
    setSelectedDate,
    selectedTab,
    setSelectedTab,
    selectedCalendarView,
    setSelectedCalendarView,
    bufferBefore,
    bufferAfter,
    setBufferBefore,
    setBufferAfter,
    addEvent
  } = useCalendarStore();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  
  // Load default events if none exist
  useEffect(() => {
    if (events.length === 0) {
      defaultEvents.forEach(event => addEvent(event));
    }
  }, [events.length, addEvent]);

  useEffect(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Getting the days in the month
    const dayObjects = days.map(day => {
      const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
      return {
        date: day,
        events: dayEvents,
        isToday: isSameDay(day, new Date()),
      };
    });
    
    // Calculate first day offset
    const firstDayOfMonth = getDay(start);
    const prevMonthDays = [];
    
    for (let i = firstDayOfMonth; i > 0; i--) {
      const prevDay = new Date(start);
      prevDay.setDate(prevDay.getDate() - i);
      prevMonthDays.push({
        date: prevDay,
        events: [],
        isPreviousMonth: true,
      });
    }
    
    // Calculate next month days to fill the grid
    const lastDayOfMonth = getDay(end);
    const nextMonthDays = [];
    
    for (let i = 1; i < 7 - lastDayOfMonth; i++) {
      const nextDay = new Date(end);
      nextDay.setDate(nextDay.getDate() + i);
      nextMonthDays.push({
        date: nextDay,
        events: [],
        isNextMonth: true,
      });
    }
    
    setCalendarDays([...prevMonthDays, ...dayObjects, ...nextMonthDays]);
  }, [currentMonth, events]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleViewAllAppointments = () => {
    toast.success("Loading all appointments");
  };

  const handleCreateCalendar = () => {
    toast.success("Opening calendar creation form");
  };

  const handleConnectCalendar = () => {
    toast.success("Redirecting to calendar integration");
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-xl">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
                    <Select 
                      defaultValue={selectedCalendarView}
                      onValueChange={setSelectedCalendarView}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="View" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                        <SelectItem value="agenda">Agenda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[80px] p-1 border rounded-md cursor-pointer ${
                          day.isPreviousMonth || day.isNextMonth
                            ? 'bg-muted/30 text-muted-foreground'
                            : day.isToday
                              ? 'bg-primary/10 border-primary'
                              : 'bg-card hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className="text-xs p-1">{format(day.date, 'd')}</div>
                        {day.events.length > 0 && !day.isPreviousMonth && !day.isNextMonth && (
                          <div className="mt-1">
                            {day.events.slice(0, 2).map((event: any, i: number) => (
                              <div 
                                key={i}
                                className={`${
                                  event.status === 'confirmed' 
                                    ? 'bg-primary/20 text-primary' 
                                    : event.status === 'cancelled'
                                      ? 'bg-destructive/20 text-destructive' 
                                      : 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                                } rounded-sm p-1 text-xs mb-1 truncate`}
                              >
                                {event.time.split(' - ')[0]} {event.title.split(' with')[0]}
                              </div>
                            ))}
                            {day.events.length > 2 && (
                              <div className="text-xs text-muted-foreground text-center">
                                +{day.events.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
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
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="calendars" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calendarTypes.map((type) => (
              <CalendarTypeCard key={type.id} type={type} />
            ))}
            
            <CreateCalendarCard />
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Calendar Embed Links</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Direct Link</h3>
                      <p className="text-sm text-muted-foreground">
                        Share this link directly with your clients
                      </p>
                      <div className="flex">
                        <div className="flex-1 bg-muted px-3 py-2 rounded-l-md border border-r-0 text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                          https://youragency.ghl.com/book
                        </div>
                        <Button 
                          variant="outline" 
                          className="rounded-l-none"
                          onClick={() => {
                            navigator.clipboard.writeText("https://youragency.ghl.com/book");
                            toast.success("Link copied to clipboard");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Embed Code</h3>
                      <p className="text-sm text-muted-foreground">
                        Embed the calendar on your website
                      </p>
                      <div className="flex">
                        <div className="flex-1 bg-muted px-3 py-2 rounded-l-md border border-r-0 text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                          &lt;iframe src="https://youragency.ghl.com/embed"&gt;&lt;/iframe&gt;
                        </div>
                        <Button 
                          variant="outline" 
                          className="rounded-l-none"
                          onClick={() => {
                            navigator.clipboard.writeText('<iframe src="https://youragency.ghl.com/embed"></iframe>');
                            toast.success("Code copied to clipboard");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Calendar Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect with Google Calendar, Outlook, or iCal
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleConnectCalendar}>
                      <Globe className="h-4 w-4 mr-2" />
                      Connect Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Default Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                      <div key={day} className="flex items-center justify-between border rounded-md p-3">
                        <span>{day}</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">9:00 AM - 5:00 PM</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => toast.success(`Edit ${day} hours`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {['Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between border rounded-md p-3 bg-muted/50">
                        <span>{day}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Unavailable</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => toast.success(`Edit ${day} hours`)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Appointment Types</h3>
                    <AppointmentTypeDialog />
                  </div>
                  
                  <div className="space-y-3">
                    {appointmentTypes.map((type) => (
                      <AppointmentTypeItem key={type.id} type={type} />
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="font-medium">Buffer Times</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add time before or after appointments to prepare or wrap up
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="text-sm font-medium">Before appointments</div>
                      <Select 
                        value={bufferBefore}
                        onValueChange={(value) => {
                          setBufferBefore(value);
                          toast.success(`Buffer time before appointments set to ${value} minutes`);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No buffer</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border rounded-md p-3 space-y-2">
                      <div className="text-sm font-medium">After appointments</div>
                      <Select 
                        value={bufferAfter}
                        onValueChange={(value) => {
                          setBufferAfter(value);
                          toast.success(`Buffer time after appointments set to ${value} minutes`);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No buffer</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
