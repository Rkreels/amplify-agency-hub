import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useCalendarStore, type CalendarEvent } from '@/store/useCalendarStore';
import { toast } from 'sonner';

interface EventFormProps {
  event?: CalendarEvent;
  selectedDate?: Date;
  onComplete: () => void;
}

export function EventForm({ event, selectedDate, onComplete }: EventFormProps) {
  const { addEvent, updateEvent } = useCalendarStore();
  
  const defaultStart = selectedDate ? 
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 10, 0) :
    new Date();
  const defaultEnd = new Date(defaultStart.getTime() + 60 * 60 * 1000); // 1 hour later

  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    startTime: event?.startTime || defaultStart,
    endTime: event?.endTime || defaultEnd,
    type: event?.type || 'appointment' as CalendarEvent['type'],
    location: event?.location || '',
    attendees: event?.attendees || [],
    reminders: event?.reminders || [15],
    isRecurring: event?.isRecurring || false,
    recurringRule: event?.recurringRule || ''
  });

  const [newAttendee, setNewAttendee] = useState('');
  const [newReminder, setNewReminder] = useState(15);

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee('');
    }
  };

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee)
    }));
  };

  const addReminder = () => {
    if (newReminder && !formData.reminders.includes(newReminder)) {
      setFormData(prev => ({
        ...prev,
        reminders: [...prev.reminders, newReminder].sort((a, b) => a - b)
      }));
    }
  };

  const removeReminder = (reminder: number) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r !== reminder)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    const eventData = {
      ...formData,
      status: event?.status || 'scheduled' as const,
      createdBy: 'current-user',
      color: event?.color || '#3b82f6'
    };

    if (event) {
      updateEvent(event.id, eventData);
      toast.success('Event updated successfully');
    } else {
      addEvent(eventData);
      toast.success('Event created successfully');
    }

    onComplete();
  };

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter event title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Event description (optional)"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start">Start Date & Time</Label>
          <Input
            id="start"
            type="datetime-local"
            value={formatDateTimeLocal(formData.startTime)}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              startTime: new Date(e.target.value) 
            }))}
          />
        </div>
        <div>
          <Label htmlFor="end">End Date & Time</Label>
          <Input
            id="end"
            type="datetime-local"
            value={formatDateTimeLocal(formData.endTime)}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              endTime: new Date(e.target.value) 
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Event Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value: CalendarEvent['type']) => 
              setFormData(prev => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="task">Task</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Meeting location or URL"
          />
        </div>
      </div>

      <div>
        <Label>Attendees</Label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.attendees.map((attendee) => (
              <Badge key={attendee} variant="secondary" className="flex items-center gap-1">
                {attendee}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeAttendee(attendee)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add attendee email"
              type="email"
              value={newAttendee}
              onChange={(e) => setNewAttendee(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
            />
            <Button type="button" onClick={addAttendee} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label>Reminders (minutes before)</Label>
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.reminders.map((reminder) => (
              <Badge key={reminder} variant="outline" className="flex items-center gap-1">
                {reminder}m
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeReminder(reminder)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select value={newReminder.toString()} onValueChange={(value) => setNewReminder(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="1440">1 day</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" onClick={addReminder} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isRecurring}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
        />
        <Label>Recurring event</Label>
      </div>

      {formData.isRecurring && (
        <div>
          <Label htmlFor="recurringRule">Recurrence Pattern</Label>
          <Select 
            value={formData.recurringRule} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, recurringRule: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recurrence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit">
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
