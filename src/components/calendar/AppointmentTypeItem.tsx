
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoreHorizontal, Edit, Trash2, Clock, MapPin, DollarSign } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppointmentType, useCalendarStore } from '@/store/useCalendarStore';

interface AppointmentTypeItemProps {
  appointmentType: AppointmentType;
}

export const AppointmentTypeItem: React.FC<AppointmentTypeItemProps> = ({
  appointmentType
}) => {
  const { updateAppointmentType, deleteAppointmentType } = useCalendarStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleActive = (isActive: boolean) => {
    updateAppointmentType(appointmentType.id, { isActive });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this appointment type?')) {
      deleteAppointmentType(appointmentType.id);
    }
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div 
              className="w-4 h-8 rounded"
              style={{ backgroundColor: appointmentType.color }}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">{appointmentType.name}</h3>
                <Badge variant={appointmentType.isActive ? 'default' : 'secondary'}>
                  {appointmentType.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              {appointmentType.description && (
                <p className="text-sm text-gray-600 mt-1">{appointmentType.description}</p>
              )}
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {appointmentType.duration} min
                </div>
                {appointmentType.location && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {appointmentType.location}
                  </div>
                )}
                {appointmentType.price !== undefined && appointmentType.price > 0 && (
                  <div className="flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    ${appointmentType.price}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={appointmentType.isActive}
              onCheckedChange={handleToggleActive}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {appointmentType.bufferTime && appointmentType.bufferTime > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Buffer time: {appointmentType.bufferTime} minutes
          </div>
        )}
      </CardContent>
    </Card>
  );
};
