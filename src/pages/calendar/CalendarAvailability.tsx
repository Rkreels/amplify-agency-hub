
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { defaultAvailability, AvailabilitySlot } from "@/lib/calendar-data";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarAvailability() {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(defaultAvailability);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleToggleDay = (dayIndex: number) => {
    setAvailability(availability.map((slot, i) => 
      i === dayIndex ? { ...slot, isAvailable: !slot.isAvailable } : slot
    ));
  };
  
  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(availability.map((slot, i) => 
      i === dayIndex ? { ...slot, [field]: value } : slot
    ));
  };
  
  const handleSaveChanges = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Availability settings saved");
      setSaving(false);
    }, 800);
  };
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeOptions = [
    { value: "", label: "Closed" },
    { value: "08:00 AM", label: "8:00 AM" },
    { value: "08:30 AM", label: "8:30 AM" },
    { value: "09:00 AM", label: "9:00 AM" },
    { value: "09:30 AM", label: "9:30 AM" },
    { value: "10:00 AM", label: "10:00 AM" },
    // ... more time options
    { value: "05:00 PM", label: "5:00 PM" },
    { value: "05:30 PM", label: "5:30 PM" },
    { value: "06:00 PM", label: "6:00 PM" },
  ];
  
  const handleAddDateOverride = () => {
    if (date) {
      toast.success(`Added date override for ${date.toLocaleDateString()}`);
    }
  };
  
  return (
    <AppLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendars")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Calendars
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Availability Settings</h1>
          <p className="text-muted-foreground">
            Set your working hours and availability for appointments
          </p>
        </div>
        <Button onClick={handleSaveChanges} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Hours</TabsTrigger>
          <TabsTrigger value="dateOverrides">Date Overrides</TabsTrigger>
          <TabsTrigger value="unavailable">Unavailable Times</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Set your regular working hours for each day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availability.map((slot, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 sm:col-span-2">
                      <Label>{slot.day}</Label>
                    </div>
                    <div className="col-span-3 sm:col-span-2 flex items-center">
                      <Switch 
                        checked={slot.isAvailable} 
                        onCheckedChange={() => handleToggleDay(index)} 
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        {slot.isAvailable ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="col-span-6 sm:col-span-8">
                      {slot.isAvailable ? (
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          <Select 
                            value={slot.startTime} 
                            onValueChange={(value) => handleTimeChange(index, 'startTime', value)}
                            disabled={!slot.isAvailable}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.slice(0, -1).map((option) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-muted-foreground">to</span>
                          <Select 
                            value={slot.endTime} 
                            onValueChange={(value) => handleTimeChange(index, 'endTime', value)}
                            disabled={!slot.isAvailable}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="End time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.slice(1).map((option) => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">Unavailable</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dateOverrides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Date Overrides</CardTitle>
              <CardDescription>
                Set specific hours for dates that differ from your regular schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Select a date to override</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border pointer-events-auto"
                  />
                  <Button onClick={handleAddDateOverride} className="mt-4 w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Date Override
                  </Button>
                </div>
                
                <div>
                  <Label className="mb-2 block">Current Overrides</Label>
                  <div className="border rounded-md p-4 h-[300px] overflow-auto">
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No date overrides set yet
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="unavailable" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unavailable Times</CardTitle>
              <CardDescription>
                Block off periods when you're not available for appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Vacation</h3>
                    <Button variant="outline" size="sm">
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <div className="text-sm">July 15, 2025</div>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <div className="text-sm">July 22, 2025</div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Conference</h3>
                    <Button variant="outline" size="sm">
                      <Trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <div className="text-sm">August 10, 2025</div>
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <div className="text-sm">August 12, 2025</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Unavailable Time
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
