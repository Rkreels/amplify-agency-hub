
import { useState } from "react";
import { toast } from "sonner";
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarTypeCard } from "@/components/calendar/CalendarTypeCard";
import { CreateCalendarCard } from "@/components/calendar/CreateCalendarCard";
import { CalendarEmbedSection } from "@/components/calendar/CalendarEmbedSection";
import { Button } from "@/components/ui/button";
import { Grid, Import, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CalendarsTabContent() {
  const { calendarTypes } = useCalendarStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  
  const handleImportCalendar = () => {
    toast.success("Calendar import feature initiated");
    // In a real app, this would open an import modal or redirect to an import page
  };
  
  const handleCalendarSettings = () => {
    navigate("/calendar/settings");
  };

  const handleCreateCalendar = () => {
    navigate("/calendar/create");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">My Calendars ({calendarTypes.length})</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <Grid className="h-4 w-4 mr-2" />
            View {viewMode === "grid" ? "List" : "Grid"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleImportCalendar}>
            <Import className="h-4 w-4 mr-2" />
            Import Calendar
          </Button>
          <Button variant="outline" size="sm" onClick={handleCalendarSettings}>
            <Settings className="h-4 w-4 mr-2" />
            Calendar Settings
          </Button>
        </div>
      </div>
      
      <div className={viewMode === "grid" ? 
        "grid grid-cols-1 md:grid-cols-3 gap-6" : 
        "flex flex-col gap-4"
      }>
        {calendarTypes.map((type) => (
          <CalendarTypeCard 
            key={type.id} 
            type={type} 
            viewMode={viewMode} 
          />
        ))}
        
        <CreateCalendarCard onCreateCalendar={handleCreateCalendar} />
      </div>
      
      <CalendarEmbedSection />
    </>
  );
}
