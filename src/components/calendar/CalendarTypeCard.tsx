
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarType } from "@/lib/calendar-data";
import { useCalendarStore } from "@/store/useCalendarStore";
import { CalendarIcon, MoreHorizontal, Pencil, Trash2, User, Users } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface CalendarTypeCardProps {
  type: CalendarType;
}

export function CalendarTypeCard({ type }: CalendarTypeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteCalendarType } = useCalendarStore();

  const IconComponent = type.icon === "User" ? User : Users;

  const handleDelete = () => {
    deleteCalendarType(type.id);
    toast.success(`${type.name} calendar deleted`);
    setShowDeleteDialog(false);
  };

  const handleManageCalendar = () => {
    toast.success(`Managing ${type.name} calendar`);
  };

  const handleEdit = () => {
    toast.success(`Editing ${type.name} calendar`);
  };

  return (
    <Card className="relative group">
      <CardHeader>
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Calendar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="bg-primary/10 w-10 h-10 flex items-center justify-center rounded-full mb-2">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <CardTitle>{type.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">
          {type.description}
        </p>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span>Active Bookings</span>
            <span className="font-medium">{type.activeBookings}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Conversion Rate</span>
            <span className="font-medium">{type.conversionRate}%</span>
          </div>
          <Separator />
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleManageCalendar}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Manage Calendar
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Calendar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{type.name}" calendar? This action cannot be undone.
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
    </Card>
  );
}
