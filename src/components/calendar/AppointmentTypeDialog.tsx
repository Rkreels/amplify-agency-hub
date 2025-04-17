
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalendarStore } from "@/store/useCalendarStore";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AppointmentTypeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const { toast } = useToast();
  const addAppointmentType = useCalendarStore((state) => state.addAppointmentType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addAppointmentType({
      id: Math.random().toString(36).substr(2, 9),
      name,
      duration: parseInt(duration),
      color: `bg-${['blue', 'green', 'purple', 'pink', 'yellow'][Math.floor(Math.random() * 5)]}-500`,
    });

    toast({
      title: "Success",
      description: "Appointment type created successfully",
    });

    setOpen(false);
    setName("");
    setDuration("30");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Appointment Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Discovery Call"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="15"
              step="15"
            />
          </div>
          <Button type="submit" className="w-full">Create Appointment Type</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
