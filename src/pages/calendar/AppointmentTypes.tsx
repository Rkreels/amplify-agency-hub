
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash, Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { defaultAppointmentTypes, AppointmentType } from "@/lib/calendar-data";
import { useCalendarStore } from "@/store/useCalendarStore";
import { AppointmentTypeItem } from "@/components/calendar/AppointmentTypeItem";

export default function AppointmentTypes() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [editingType, setEditingType] = useState<AppointmentType | null>(null);
  
  // Local form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("bg-blue-500");
  const [saving, setSaving] = useState(false);

  // Get appointment types from store or use defaults
  const { appointmentTypes = defaultAppointmentTypes, addAppointmentType, editAppointmentType, deleteAppointmentType } = useCalendarStore();
  
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this appointment type?")) {
      deleteAppointmentType(id);
      toast.success("Appointment type deleted");
    }
  };
  
  const handleEdit = (type: AppointmentType) => {
    setEditingType(type);
    setName(type.name);
    setDuration(String(type.duration));
    setDescription(type.description || "");
    setColor(type.color);
    setIsOpen(true);
  };
  
  const handleDuplicate = (type: AppointmentType) => {
    const newType = {
      ...type,
      id: crypto.randomUUID(),
      name: `${type.name} (Copy)`,
    };
    addAppointmentType(newType);
    toast.success("Appointment type duplicated");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const appointmentTypeData: AppointmentType = {
      id: editingType ? editingType.id : crypto.randomUUID(),
      name,
      duration: parseInt(duration),
      color,
      description,
    };
    
    // Simulate API call
    setTimeout(() => {
      if (editingType) {
        editAppointmentType(appointmentTypeData);
        toast.success("Appointment type updated successfully");
      } else {
        addAppointmentType(appointmentTypeData);
        toast.success("Appointment type created successfully");
      }
      
      setSaving(false);
      setIsOpen(false);
      resetForm();
    }, 800);
  };
  
  const resetForm = () => {
    setName("");
    setDuration("30");
    setDescription("");
    setColor("bg-blue-500");
    setEditingType(null);
  };
  
  const openNewTypeDialog = () => {
    resetForm();
    setIsOpen(true);
  };
  
  return (
    <AppLayout>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/calendars")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Calendars
        </Button>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointment Types</h1>
          <p className="text-muted-foreground">
            Create and manage different types of appointments you offer
          </p>
        </div>
        <Button onClick={openNewTypeDialog}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment Type
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Appointment Types</CardTitle>
          <CardDescription>
            Configure the types of appointments clients can book with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointmentTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                  <div>
                    <h3 className="font-medium">{type.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{type.duration} minutes</span>
                      {type.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(type)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Duplicate</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(type)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(type.id)}
                    disabled={type.isDefault}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full justify-center border-dashed" 
              onClick={openNewTypeDialog}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Type
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Add/Edit Appointment Type Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Appointment Type" : "Create Appointment Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType 
                ? "Update the details for this appointment type" 
                : "Configure a new type of appointment that clients can book"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Appointment Name*</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Initial Consultation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration*</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this appointment for?"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-pink-500", "bg-red-500"].map((c) => (
                    <div 
                      key={c} 
                      className={`w-8 h-8 rounded-full cursor-pointer ${c} ${color === c ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="text-sm font-medium">Set as Default</h3>
                  <p className="text-xs text-muted-foreground">Make this the default appointment type</p>
                </div>
                <Switch checked={editingType?.isDefault} disabled={editingType?.isDefault} />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingType ? "Save Changes" : "Create Type"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
