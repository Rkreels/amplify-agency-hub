
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useCalendarStore } from "@/store/useCalendarStore";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Plus, Search, CheckCircle, Settings, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AppointmentTypeItem } from "@/components/calendar/AppointmentTypeItem";
import { AppointmentTypeDialog } from "@/components/calendar/AppointmentTypeDialog";
import { AvailabilityTabContent } from "@/components/calendar/AvailabilityTabContent";

export default function AppointmentTypes() {
  const [activeTab, setActiveTab] = useState("types");
  const [searchQuery, setSearchQuery] = useState("");
  const appointmentTypes = useCalendarStore((state) => state.appointmentTypes);
  const addAppointmentType = useCalendarStore((state) => state.addAppointmentType);
  const [showNewTypeDialog, setShowNewTypeDialog] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [color, setColor] = useState("blue");
  
  const filteredTypes = searchQuery 
    ? appointmentTypes.filter(type => 
        type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appointmentTypes;
  
  const handleCreateType = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newType = {
      id: uuidv4(),
      name,
      description: description || `${name} appointment type`,
      duration: parseInt(duration),
      color: `bg-${color}-500`,
      isActive: true,
      locations: ["In-person", "Video call"],
      bufferTimeBefore: 5,
      bufferTimeAfter: 5,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      isDefault: false
    };
    
    addAppointmentType(newType);
    toast.success("Appointment type created successfully");
    
    // Reset form
    setName("");
    setDescription("");
    setDuration("30");
    setColor("blue");
    setShowNewTypeDialog(false);
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar Types</h1>
          <p className="text-muted-foreground">
            Manage your appointment types and availability
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="types" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="types">Appointment Types</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointment types..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <AppointmentTypeDialog />
          </div>
          
          <div className="space-y-3">
            {filteredTypes.length === 0 ? (
              <div className="border rounded-md p-8 flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-4">No appointment types found.</p>
                <Button onClick={() => setShowNewTypeDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Appointment Type
                </Button>
              </div>
            ) : (
              filteredTypes.map((type) => (
                <AppointmentTypeItem key={type.id} type={type} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="availability">
          <AvailabilityTabContent />
        </TabsContent>
      </Tabs>
      
      <Dialog open={showNewTypeDialog} onOpenChange={setShowNewTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Appointment Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateType} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Discovery Call"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this appointment type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)*</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                step="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
              <div className={`mt-2 h-4 w-full rounded bg-${color}-500`} />
            </div>
            <Button type="submit" className="w-full">Create Appointment Type</Button>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
