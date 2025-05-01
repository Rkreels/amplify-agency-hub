
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCalendarStore } from "@/store/useCalendarStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateCalendarCard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("User");
  const { addCalendarType } = useCalendarStore();

  const handleCreateCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    addCalendarType({
      id: crypto.randomUUID(),
      name,
      description,
      activeBookings: 0,
      conversionRate: 0,
      icon,
    });

    toast.success("Calendar created successfully");
    setOpen(false);
    setName("");
    setDescription("");
    setIcon("User");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-dashed flex flex-col items-center justify-center p-6 h-full cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-lg mb-2">Create New Calendar</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Set up a new booking calendar for your services
          </p>
          <Button>Get Started</Button>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Calendar</DialogTitle>
          <DialogDescription>
            Set up a new calendar for scheduling specific types of meetings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateCalendar} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Calendar Name*</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Client Consultations"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this calendar"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Calendar Type</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select calendar type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">One-on-One</SelectItem>
                <SelectItem value="Users">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Calendar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
