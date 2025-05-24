
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateCalendarCard() {
  const navigate = useNavigate();

  const handleCreateCalendar = () => {
    navigate("/calendar/create");
  };

  return (
    <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>Create New Calendar</CardTitle>
        <CardDescription>
          Set up a new calendar for appointments and bookings
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button onClick={handleCreateCalendar} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Calendar
        </Button>
      </CardContent>
    </Card>
  );
}
