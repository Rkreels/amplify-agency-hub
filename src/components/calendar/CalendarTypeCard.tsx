
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface CalendarTypeCardProps {
  type: CalendarType;
}

export function CalendarTypeCard({ type }: CalendarTypeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [name, setName] = useState(type.name);
  const [description, setDescription] = useState(type.description);
  const [icon, setIcon] = useState(type.icon);
  
  const { deleteCalendarType, updateCalendarType } = useCalendarStore();

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
    setName(type.name);
    setDescription(type.description);
    setIcon(type.icon);
    setShowEditDialog(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    updateCalendarType(type.id, {
      name,
      description,
      icon
    });
    
    toast.success(`${name} calendar updated`);
    setShowEditDialog(false);
  };

  return (
    <>
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
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Calendar</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Calendar Name*</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Client Consultations"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description*</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this calendar"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Calendar Type</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select calendar type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">One-on-One</SelectItem>
                  <SelectItem value="Users">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Update Calendar</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
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
    </>
  );
}
