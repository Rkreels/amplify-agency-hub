
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Settings } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AppointmentTypeDialog } from "@/components/calendar/AppointmentTypeDialog";
import { AppointmentTypeItem } from "@/components/calendar/AppointmentTypeItem";
import { useCalendarStore } from "@/store/useCalendarStore";

export function AvailabilityTabContent() {
  const { 
    appointmentTypes, 
    bufferBefore, 
    bufferAfter, 
    setBufferBefore, 
    setBufferAfter 
  } = useCalendarStore();

  return (
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
  );
}
