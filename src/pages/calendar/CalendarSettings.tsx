import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarSettingsHeader } from "@/components/calendar/CalendarSettingsHeader";
import { ColorPicker } from "@/components/calendar/ColorPicker";

export default function CalendarSettings() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [calendarColor, setCalendarColor] = useState("#4361ee");
  
  const handleSave = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Calendar settings saved successfully");
      setSaving(false);
    }, 800);
  };
  
  return (
    <AppLayout>
      <CalendarSettingsHeader
        title="Calendar Settings"
        description="Configure your calendar preferences and options"
        saving={saving}
        onSave={handleSave}
      />
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="booking">Booking Rules</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar Details</CardTitle>
              <CardDescription>Basic information about your calendar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Calendar Name</Label>
                  <Input id="name" defaultValue="My Calendar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Calendar Color</Label>
                  <ColorPicker color={calendarColor} onChange={setCalendarColor} />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue="My primary calendar for client meetings and appointments." />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Public Calendar</h3>
                  <p className="text-sm text-muted-foreground">Make this calendar visible to others</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Allow Scheduling</h3>
                  <p className="text-sm text-muted-foreground">Let people book appointments on this calendar</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Show Past Events</h3>
                  <p className="text-sm text-muted-foreground">Display events that have already occurred</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize how your calendar looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="default-view">Default View</Label>
                  <Select defaultValue="week">
                    <SelectTrigger id="default-view">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="week-starts">Week Starts On</Label>
                  <Select defaultValue="sunday">
                    <SelectTrigger id="week-starts">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Sunday</SelectItem>
                      <SelectItem value="monday">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Show Weekends</h3>
                  <p className="text-sm text-muted-foreground">Display Saturday and Sunday on calendar</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">24-hour Format</h3>
                  <p className="text-sm text-muted-foreground">Use 24-hour time format (e.g., 14:00 instead of 2:00 PM)</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-medium">Browser Notifications</h3>
                    <p className="text-sm text-muted-foreground">Display notifications in your browser</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h3 className="font-medium">Mobile App Notifications</h3>
                    <p className="text-sm text-muted-foreground">Send notifications to your mobile device</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <h3 className="font-medium">Notification Events</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-booking">New booking</Label>
                    <Switch id="new-booking" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="booking-canceled">Booking canceled</Label>
                    <Switch id="booking-canceled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="booking-rescheduled">Booking rescheduled</Label>
                    <Switch id="booking-rescheduled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder">Appointment reminder</Label>
                    <Switch id="reminder" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Rules</CardTitle>
              <CardDescription>Set constraints for when appointments can be booked</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-notice">Minimum Notice</Label>
                  <div className="flex items-center gap-2">
                    <Input id="min-notice" type="number" defaultValue="2" />
                    <Select defaultValue="hours">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-advance">Maximum Advance</Label>
                  <div className="flex items-center gap-2">
                    <Input id="max-advance" type="number" defaultValue="60" />
                    <Select defaultValue="days">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buffer-before">Buffer Before</Label>
                  <div className="flex items-center gap-2">
                    <Input id="buffer-before" type="number" defaultValue="15" />
                    <Select defaultValue="minutes">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="buffer-after">Buffer After</Label>
                  <div className="flex items-center gap-2">
                    <Input id="buffer-after" type="number" defaultValue="15" />
                    <Select defaultValue="minutes">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Label>Booking Time Slot Increments</Label>
                <Select defaultValue="15">
                  <SelectTrigger id="time-slot">
                    <SelectValue placeholder="Select time interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h3 className="font-medium">Prevent Double Bookings</h3>
                  <p className="text-sm text-muted-foreground">Block time slots that conflict with existing events</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Limit Daily Bookings</h3>
                  <p className="text-sm text-muted-foreground">Set a maximum number of appointments per day</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="confirmation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confirmation Settings</CardTitle>
              <CardDescription>Customize confirmation messages and booking process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation-page">Confirmation Page</Label>
                <Select defaultValue="custom">
                  <SelectTrigger id="confirmation-page">
                    <SelectValue placeholder="Select page type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Confirmation</SelectItem>
                    <SelectItem value="custom">Custom Thank You Page</SelectItem>
                    <SelectItem value="redirect">Redirect to External URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="redirect-url">Redirect URL (if applicable)</Label>
                <Input id="redirect-url" placeholder="https://example.com/thank-you" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmation-message">Confirmation Message</Label>
                <Textarea 
                  id="confirmation-message" 
                  rows={4}
                  defaultValue="Thank you for booking an appointment. We look forward to meeting with you!" 
                />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div>
                  <h3 className="font-medium">Require Confirmation</h3>
                  <p className="text-sm text-muted-foreground">Manually approve appointment requests</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Send Calendar Invites</h3>
                  <p className="text-sm text-muted-foreground">Include .ics file in confirmation emails</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Allow Cancellations</h3>
                  <p className="text-sm text-muted-foreground">Let clients cancel their appointments</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium">Allow Rescheduling</h3>
                  <p className="text-sm text-muted-foreground">Let clients reschedule their appointments</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
