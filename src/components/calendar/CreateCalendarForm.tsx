
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "./ColorPicker";
import { toast } from "sonner";

export interface CalendarFormData {
  name: string;
  description: string;
  color: string;
  timezone: string;
  isPublic: boolean;
  allowBooking: boolean;
}

const DEFAULT_FORM_DATA: CalendarFormData = {
  name: "",
  description: "",
  color: "#4361ee",
  timezone: "America/New_York",
  isPublic: true,
  allowBooking: true
};

export const CreateCalendarForm: React.FC = () => {
  const [formData, setFormData] = useState<CalendarFormData>(DEFAULT_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof CalendarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate creating calendar
    setTimeout(() => {
      toast.success("Calendar created successfully");
      setSubmitting(false);
      navigate("/calendars");
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendar Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Calendar Name *</Label>
              <Input 
                id="name" 
                placeholder="My Calendar" 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone *</Label>
              <Select 
                value={formData.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Calendar for client meetings and team events" 
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Calendar Color</Label>
              <ColorPicker 
                color={formData.color} 
                onChange={(color) => handleChange("color", color)} 
              />
            </div>
          </div>
          
          <div className="pt-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Public Calendar</h3>
                <p className="text-sm text-muted-foreground">Make this calendar visible to others</p>
              </div>
              <Switch 
                checked={formData.isPublic}
                onCheckedChange={(checked) => handleChange("isPublic", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Allow Scheduling</h3>
                <p className="text-sm text-muted-foreground">Let people book appointments on this calendar</p>
              </div>
              <Switch 
                checked={formData.allowBooking}
                onCheckedChange={(checked) => handleChange("allowBooking", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/calendars")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Calendar"}
        </Button>
      </div>
    </form>
  );
};
