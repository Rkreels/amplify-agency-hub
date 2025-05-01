
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppointmentType } from "@/lib/calendar-data";
import { useCalendarStore } from "@/store/useCalendarStore";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AppointmentTypeItemProps {
  type: AppointmentType;
}

export function AppointmentTypeItem({ type }: AppointmentTypeItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [name, setName] = useState(type.name);
  const [duration, setDuration] = useState(type.duration.toString());
  const [color, setColor] = useState(type.color.replace("bg-", "").replace("-500", ""));
  
  const { deleteAppointmentType, updateAppointmentType } = useCalendarStore();

  const handleDelete = () => {
    deleteAppointmentType(type.id);
    toast.success(`${type.name} appointment type deleted`);
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    setName(type.name);
    setDuration(type.duration.toString());
    setColor(type.color.replace("bg-", "").replace("-500", ""));
    setShowEditDialog(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    updateAppointmentType(type.id, {
      name,
      duration: parseInt(duration),
      color: `bg-${color}-500`,
    });

    toast.success(`${name} appointment type updated`);
    setShowEditDialog(false);
  };

  return (
    <>
      <div className="border rounded-md p-3 flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
          <span className="font-medium">{type.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{type.duration} min</span>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleEdit}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Discovery Call"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <Input
                id="edit-duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                step="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="edit-color">
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
            <Button type="submit" className="w-full">Update Appointment Type</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{type.name}" appointment type? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
