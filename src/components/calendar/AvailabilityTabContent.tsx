
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalendarStore } from '@/store/useCalendarStore';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const AvailabilityTabContent: React.FC = () => {
  const { availability, updateAvailability } = useCalendarStore();
  const [localAvailability, setLocalAvailability] = useState(availability);

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setLocalAvailability(prev => 
      prev.map((slot, index) => 
        slot.dayOfWeek === dayIndex 
          ? { ...slot, [field]: value }
          : slot
      )
    );
  };

  const handleActiveToggle = (dayIndex: number, isActive: boolean) => {
    setLocalAvailability(prev => 
      prev.map((slot, index) => 
        slot.dayOfWeek === dayIndex 
          ? { ...slot, isActive }
          : slot
      )
    );
  };

  const handleSave = () => {
    updateAvailability(localAvailability);
    toast.success('Availability updated successfully!');
  };

  const getSlotForDay = (dayIndex: number) => {
    return localAvailability.find(slot => slot.dayOfWeek === dayIndex) || {
      id: `temp-${dayIndex}`,
      dayOfWeek: dayIndex,
      startTime: '09:00',
      endTime: '17:00',
      isActive: false
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Set Your Availability</h3>
          <p className="text-sm text-gray-500">
            Configure when you're available for appointments
          </p>
        </div>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map((day, index) => {
          const slot = getSlotForDay(index);
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-20">
                      <Label className="font-medium">{day}</Label>
                    </div>
                    <Switch
                      checked={slot.isActive}
                      onCheckedChange={(checked) => handleActiveToggle(index, checked)}
                    />
                  </div>
                  
                  {slot.isActive && (
                    <div className="flex items-center space-x-2">
                      <Label className="text-sm">From:</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                        className="w-32"
                      />
                      <Label className="text-sm">To:</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            onClick={() => {
              const updatedSlots = DAYS_OF_WEEK.map((_, index) => ({
                id: `temp-${index}`,
                dayOfWeek: index,
                startTime: '09:00',
                endTime: '17:00',
                isActive: index >= 1 && index <= 5 // Monday to Friday
              }));
              setLocalAvailability(updatedSlots);
            }}
            className="w-full"
          >
            Set Standard Business Hours (9 AM - 5 PM, Mon-Fri)
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const updatedSlots = DAYS_OF_WEEK.map((_, index) => ({
                id: `temp-${index}`,
                dayOfWeek: index,
                startTime: '09:00',
                endTime: '17:00',
                isActive: false
              }));
              setLocalAvailability(updatedSlots);
            }}
            className="w-full"
          >
            Clear All Availability
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
