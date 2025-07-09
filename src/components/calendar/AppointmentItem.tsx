
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Phone, User, MapPin, MoreHorizontal } from 'lucide-react';
import { CalendarEvent, useCalendarStore } from '@/store/useCalendarStore';

interface AppointmentItemProps {
  appointment: CalendarEvent;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AppointmentItem: React.FC<AppointmentItemProps> = ({
  appointment,
  onEdit,
  onDelete
}) => {
  const { updateEvent } = useCalendarStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'meeting': return User;
      default: return Clock;
    }
  };

  const handleStatusChange = (newStatus: CalendarEvent['status']) => {
    updateEvent(appointment.id, { status: newStatus });
  };

  const TypeIcon = getTypeIcon(appointment.type);

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TypeIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{appointment.title}</h3>
              {appointment.description && (
                <p className="text-sm text-gray-600 mt-1">{appointment.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {appointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {appointment.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {appointment.contactName && (
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {appointment.contactName}
                  </div>
                )}
                {appointment.location && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {appointment.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
            <strong>Notes:</strong> {appointment.notes}
          </div>
        )}

        <div className="flex space-x-2 mt-3">
          {appointment.status === 'scheduled' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('confirmed')}
            >
              Confirm
            </Button>
          )}
          {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('completed')}
            >
              Mark Complete
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="outline" onClick={onDelete}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
