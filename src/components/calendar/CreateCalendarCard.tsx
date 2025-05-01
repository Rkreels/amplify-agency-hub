
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalendarStore } from "@/store/useCalendarStore";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreateCalendarCard() {
  const { addCalendarType } = useCalendarStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCalendarData, setNewCalendarData] = useState({
    name: "",
    description: "",
    type: "personal",
    color: "#6E59A5"
  });
  const navigate = useNavigate();
  
  const handleCreate = () => {
    if (!newCalendarData.name) {
      toast.error("Please enter a calendar name");
      return;
    }
    
    addCalendarType({
      id: `cal-${Date.now()}`,
      name: newCalendarData.name,
      description: newCalendarData.description || "Calendar description",
      type: newCalendarData.type,
      color: newCalendarData.color,
      isActive: true,
      appointmentCount: 0,
    });
    
    toast.success("Calendar created successfully");
    setIsDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewCalendarData({
      name: "",
      description: "",
      type: "personal",
      color: "#6E59A5"
    });
  };
  
  const handleChange = (field: string, value: string) => {
    setNewCalendarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const predefinedCalendars = [
    { name: "Personal Calendar", type: "personal", color: "#6E59A5" },
    { name: "Team Calendar", type: "team", color: "#0EA5E9" },
    { name: "Service Calendar", type: "service", color: "#F97316" }
  ];

  const handleCreatePredefined = (template: typeof predefinedCalendars[0]) => {
    navigate("/calendars/appointment-types");
    toast.success(`Creating ${template.name}...`);
  };

  return (
    <>
      <Card className="flex flex-col items-center justify-center h-full border-dashed bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer min-h-[200px]" onClick={() => setIsDialogOpen(true)}>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium mb-2">Create New Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Add a new calendar for different appointment types or team members
          </p>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Calendar</DialogTitle>
            <DialogDescription>
              Set up a new calendar to manage your appointments
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Calendar Name</Label>
              <Input 
                id="name" 
                value={newCalendarData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Personal Calendar, Team Calendar"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={newCalendarData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="A brief description of this calendar"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Calendar Type</Label>
              <select 
                id="type" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newCalendarData.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="personal">Personal</option>
                <option value="team">Team</option>
                <option value="service">Service</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Calendar Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="color" 
                  type="color"
                  className="w-12 h-10 p-1 cursor-pointer"
                  value={newCalendarData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                />
                <Input 
                  type="text"
                  value={newCalendarData.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Quick Start Templates</h3>
            <div className="grid grid-cols-3 gap-3">
              {predefinedCalendars.map((cal, index) => (
                <div 
                  key={index} 
                  className="border rounded-md p-3 cursor-pointer hover:bg-muted transition-colors text-center"
                  onClick={() => handleCreatePredefined(cal)}
                >
                  <div 
                    className="h-4 w-4 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: cal.color }}
                  ></div>
                  <span className="text-xs font-medium">{cal.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Calendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
