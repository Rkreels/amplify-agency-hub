
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CalendarSettingsHeader } from "@/components/calendar/CalendarSettingsHeader";
import { CreateCalendarForm } from "@/components/calendar/CreateCalendarForm";
import { toast } from "sonner";

export default function CreateCalendar() {
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Calendar created successfully");
      setSaving(false);
    }, 800);
  };
  
  return (
    <AppLayout>
      <CalendarSettingsHeader 
        title="Create Calendar"
        description="Set up a new calendar for appointments and events"
        saving={saving}
        onSave={handleSave}
      />
      
      <CreateCalendarForm />
    </AppLayout>
  );
}
