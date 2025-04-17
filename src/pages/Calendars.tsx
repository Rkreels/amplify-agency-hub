import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon,
  Plus,
  Users,
  User,
  ArrowRight,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
  Video,
  MapPin
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface UICalendarType {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
}

export default function Calendars() {
  const { toast } = useToast();
  const {
    appointmentTypes,
    calendarTypes: storeCalendarTypes,
    events,
    selectedDate,
    setSelectedDate,
    addCalendarType,
    deleteCalendarType,
  } = useCalendarStore();

  const uiCalendarTypes: UICalendarType[] = [
    {
      id: 1,
      name: "One-on-One",
      description: "Individual meetings with clients or prospects",
      icon: User,
    },
    {
      id: 2,
      name: "Round Robin",
      description: "Distribute meetings among team members",
      icon: Users,
    },
    {
      id: 3,
      name: "Group",
      description: "Schedule group sessions or webinars",
      icon: Users,
    },
  ];

  const appointments = [
    {
      id: 1,
      title: "Discovery Call with Michael Brown",
      time: "9:00 AM - 9:30 AM",
      contact: {
        name: "Michael Brown",
        avatar: "",
        initials: "MB",
      },
      type: "Video Call",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Strategy Session with Emma Davis",
      time: "11:00 AM - 12:00 PM",
      contact: {
        name: "Emma Davis",
        avatar: "",
        initials: "ED",
      },
      type: "In Person",
      status: "confirmed",
    },
    {
      id: 3,
      title: "Website Review with James Wilson",
      time: "2:30 PM - 3:30 PM",
      contact: {
        name: "James Wilson",
        avatar: "",
        initials: "JW",
      },
      type: "Video Call",
      status: "pending",
    },
  ];

  const getDaysInMonth = () => {
    const days = [];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({
        date: day.getDate(),
        month: 'prev',
        isToday: false,
        hasEvents: false,
      });
    }
    
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const todayDate = today.getDate();
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: i,
        month: 'current',
        isToday: isCurrentMonth && i === todayDate,
        hasEvents: [3, 8, 12, 15, 22, 26].includes(i),
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        month: 'next',
        isToday: false,
        hasEvents: false,
      });
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();

  const handleCreateCalendar = () => {
    toast({
      title: "Coming Soon",
      description: "Calendar creation will be available soon.",
    });
  };

  const handleConnectCalendar = () => {
    toast({
      title: "Connect Calendar",
      description: "Redirecting to calendar integration...",
    });
  };

  const handleManageCalendar = (calendarId: string) => {
    toast({
      title: "Managing Calendar",
      description: `Opening calendar settings for ID: ${calendarId}`,
    });
  };

  const handleViewAllAppointments = () => {
    toast({
      title: "View All Appointments",
      description: "Loading all appointments...",
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      toast({
        title: "Date Selected",
        description: `Selected date: ${format(date, 'PP')}`,
      });
    }
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
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Calendar Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="mb-6">
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
                      <CardTitle className="text-xl">{monthName} {year}</CardTitle>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Today</Button>
                    <Select defaultValue="month">
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
                        className={`min-h-[80px] p-1 border rounded-md ${
                          day.month === 'current'
                            ? day.isToday
                              ? 'bg-primary/10 border-primary'
                              : 'bg-card hover:bg-muted/50'
                            : 'bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        <div className="text-xs p-1">{day.date}</div>
                        {day.hasEvents && day.month === 'current' && (
                          <div className="mt-1">
                            <div className="bg-primary/20 text-primary rounded-sm p-1 text-xs mb-1 truncate">
                              9:00 Meeting
                            </div>
                            {day.date === 15 && (
                              <div className="bg-orange-500/20 text-orange-700 dark:text-orange-300 rounded-sm p-1 text-xs truncate">
                                2:30 Call
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
                      <h3 className="text-sm font-medium">Today, {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h3>
                      <Badge variant="outline">{appointments.length}</Badge>
                    </div>
                    
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-md p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{appointment.time}</span>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
                            {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
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
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={appointment.contact.avatar} alt={appointment.contact.name} />
                            <AvatarFallback>{appointment.contact.initials}</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{appointment.contact.name}</div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" onClick={handleViewAllAppointments}>
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
            {uiCalendarTypes.map((type) => (
              <Card key={type.id} className="relative group">
                <CardHeader>
                  <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-primary/10 w-10 h-10 flex items-center justify-center rounded-full mb-2">
                    <type.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{type.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6">
                    {type.description}
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span>Active Bookings</span>
                      <span className="font-medium">{String(type.id * 3)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium">{(20 + type.id * 5)}%</span>
                    </div>
                    <Separator />
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleManageCalendar(String(type.id))}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Manage Calendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-dashed flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Create New Calendar</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Set up a new booking calendar for your services
              </p>
              <Button onClick={handleCreateCalendar}>Get Started</Button>
            </Card>
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
                        <Button variant="outline" className="rounded-l-none">
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
                        <Button variant="outline" className="rounded-l-none">
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
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {['Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between border rounded-md p-3 bg-muted/50">
                        <span>{day}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Unavailable</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ArrowRight className="h-4 w-4" />
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
                      <div key={type.id} className="border rounded-md p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{type.duration} min</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
                      <Select defaultValue="15">
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
                      <Select defaultValue="10">
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
