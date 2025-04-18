
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

interface AppointmentTypeItemProps {
  type: AppointmentType;
}

export function AppointmentTypeItem({ type }: AppointmentTypeItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteAppointmentType } = useCalendarStore();

  const handleDelete = () => {
    deleteAppointmentType(type.id);
    toast.success(`${type.name} appointment type deleted`);
    setShowDeleteDialog(false);
  };

  const handleEdit = () => {
    toast.success(`Editing ${type.name} appointment type`);
  };

  return (
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
    </div>
  );
}
