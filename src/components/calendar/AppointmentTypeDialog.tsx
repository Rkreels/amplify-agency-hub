
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalendarStore } from "@/store/useCalendarStore";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AppointmentTypeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [color, setColor] = useState("blue");
  const addAppointmentType = useCalendarStore((state) => state.addAppointmentType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 15) {
      toast.error("Duration must be at least 15 minutes");
      return;
    }

    const newType = {
      id: crypto.randomUUID(),
      name,
      duration: durationNum,
      color: `bg-${color}-500`,
    };

    addAppointmentType(newType);
    toast.success("Appointment type created successfully");

    setOpen(false);
    setName("");
    setDuration("30");
    setColor("blue");
  };

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
    { value: "yellow", label: "Yellow" },
    { value: "red", label: "Red" }
  ];

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
          <DialogDescription>
            Define a new type of appointment with specific duration and color coding.
          </DialogDescription>
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
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="color">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className={`mt-2 h-4 w-full rounded bg-${color}-500`} />
          </div>
          <Button type="submit" className="w-full">Create Appointment Type</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
