
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin
} from 'lucide-react';
import { useCalendarStore, type CalendarEvent } from '@/store/useCalendarStore';
import { EventForm } from './EventForm';
import { toast } from 'sonner';

export function CalendarView() {
  const { 
    events, 
    selectedDate, 
    setSelectedDate, 
    selectedEvent, 
    setSelectedEvent,
    addEvent,
    updateEvent,
    deleteEvent 
  } = useCalendarStore();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');

  // Get events for selected date
  const selectedDateEvents = events.filter(event => 
    isSameDay(new Date(event.startTime), selectedDate)
  );

  // Get events for current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= monthStart && eventDate <= monthEnd;
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditingEvent(event);
    setShowEventDialog(true);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setShowEventDialog(true);
  };

  const handleCloseDialog = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully');
      handleCloseDialog();
    }
  };

  const getEventsByDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startTime), date));
  };

  const renderCalendarDay = (date: Date) => {
    const dayEvents = getEventsByDate(date);
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());
    
    return (
      <div 
        className={`p-2 min-h-[100px] border-r border-b cursor-pointer hover:bg-muted/50 ${
          isSelected ? 'bg-primary/10' : ''
        } ${isToday ? 'bg-blue-50' : ''}`}
        onClick={() => handleDateSelect(date)}
      >
        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
          {format(date, 'd')}
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                event.type === 'meeting' ? 'bg-blue-200 text-blue-800' :
                event.type === 'call' ? 'bg-green-200 text-green-800' :
                event.type === 'appointment' ? 'bg-purple-200 text-purple-800' :
                'bg-gray-200 text-gray-800'
              }`}
            >
              {format(new Date(event.startTime), 'HH:mm')} {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-muted-foreground">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Add padding days to complete the grid
    const startDay = monthStart.getDay();
    const endDay = monthEnd.getDay();
    
    const paddingStart = Array.from({ length: startDay }, (_, i) => {
      const date = new Date(monthStart);
      date.setDate(date.getDate() - (startDay - i));
      return date;
    });
    
    const paddingEnd = Array.from({ length: 6 - endDay }, (_, i) => {
      const date = new Date(monthEnd);
      date.setDate(date.getDate() + (i + 1));
      return date;
    });
    
    const allDays = [...paddingStart, ...calendarDays, ...paddingEnd];
    
    return (
      <div className="grid grid-cols-7 border-l border-t">
        {/* Week header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 border-r border-b bg-muted/30 text-center font-medium text-sm">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {allDays.map((date, index) => (
          <div key={index}>
            {renderCalendarDay(date)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Button
              variant={calendarView === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('month')}
            >
              Month
            </Button>
            <Button
              variant={calendarView === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('week')}
            >
              Week
            </Button>
            <Button
              variant={calendarView === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCalendarView('day')}
            >
              Day
            </Button>
          </div>
          <Button onClick={handleNewEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {renderMonthView()}
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDateEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Events for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'meeting' ? 'bg-blue-500' :
                      event.type === 'call' ? 'bg-green-500' :
                      event.type === 'appointment' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                      </div>
                      {event.description && (
                        <div className="text-sm text-muted-foreground">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {event.type}
                    </Badge>
                    <Badge variant={
                      event.status === 'confirmed' ? 'default' :
                      event.status === 'scheduled' ? 'secondary' :
                      event.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {event.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            event={editingEvent}
            onComplete={handleCloseDialog}
          />
          {editingEvent && (
            <div className="flex justify-end pt-4">
              <Button 
                variant="destructive" 
                onClick={() => handleDeleteEvent(editingEvent.id)}
              >
                Delete Event
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
