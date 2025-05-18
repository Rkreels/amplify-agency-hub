
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CalendarSettingsHeaderProps {
  title: string;
  description: string;
  saving?: boolean;
  onSave: () => void;
}

export const CalendarSettingsHeader: React.FC<CalendarSettingsHeaderProps> = ({
  title,
  description,
  saving = false,
  onSave
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendars")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Calendars
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">
            {description}
          </p>
        </div>
        <Button onClick={onSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
};
