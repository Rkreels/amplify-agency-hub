import { useState } from "react";
import { useContactsStore, type Contact } from "@/store/useContactsStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  PhoneCall, Mail, Building, MapPin, Calendar, Clock, Plus, 
  Trash2, Edit, CheckCircle, Tag, X
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const { deleteContact, updateContact } = useContactsStore();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [newTag, setNewTag] = useState("");
  
  const handleDelete = () => {
    deleteContact(contact.id);
    toast.success("Contact deleted successfully");
    onClose();
  };
  
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    
    // Check if tag already exists
    if (contact.tags.includes(newTag.trim())) {
      toast.error("Tag already exists");
      return;
    }
    
    // Add the tag
    updateContact(contact.id, {
      tags: [...contact.tags, newTag.trim()]
    });
    
    setNewTag("");
    toast.success("Tag added successfully");
  };
  
  const handleRemoveTag = (tag: string) => {
    updateContact(contact.id, {
      tags: contact.tags.filter(t => t !== tag)
    });
    toast.success("Tag removed");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM d, yyyy");
  };
  
  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.avatarUrl} />
            <AvatarFallback className="text-lg">
              {contact.firstName.charAt(0) + contact.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{contact.firstName} {contact.lastName}</h2>
            {contact.company && <p className="text-muted-foreground">{contact.company}</p>}
            <Badge 
              variant={contact.status === 'customer' ? 'default' : 
                      contact.status === 'lead' ? 'secondary' :
                      contact.status === 'prospect' ? 'outline' : 'destructive'}
              className="mt-1"
            >
              {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.company}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {(contact.address?.street || contact.address?.city || contact.address?.state) && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      {contact.address?.street && <div>{contact.address.street}</div>}
                      {(contact.address?.city || contact.address?.state) && (
                        <div>
                          {contact.address.city}{contact.address.city && contact.address.state && ', '}
                          {contact.address.state} {contact.address.zipCode}
                        </div>
                      )}
                      {contact.address?.country && <div>{contact.address.country}</div>}
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {contact.tags.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  ) : (
                    contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button 
                          className="ml-1 hover:text-destructive" 
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
                <form onSubmit={handleAddTag} className="flex gap-2">
                  <Input 
                    placeholder="Add a tag..." 
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="h-8"
                  />
                  <Button type="submit" size="sm" className="h-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date Added</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(contact.dateAdded)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Contacted</span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(contact.lastContacted)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Source</span>
                    <span>{contact.source || "Not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge 
                      variant={contact.status === 'customer' ? 'default' : 
                              contact.status === 'lead' ? 'secondary' :
                              contact.status === 'prospect' ? 'outline' : 'destructive'}
                    >
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <div className="border rounded-md p-3 min-h-[100px] text-sm">
                  {contact.notes || <span className="text-muted-foreground">No notes available</span>}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="text-muted-foreground text-center">
              <p className="mb-2">No activity recorded yet</p>
              <p>Activities like emails, calls and meetings will appear here</p>
            </div>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Notes</h3>
              <Textarea 
                value={contact.notes} 
                onChange={(e) => updateContact(contact.id, { notes: e.target.value })}
                placeholder="Add notes about this contact..."
                className="min-h-[150px]"
              />
              <div className="flex justify-end mt-2">
                <Button size="sm" onClick={() => toast.success("Notes saved")}>
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <ContactForm 
            contact={contact} 
            onComplete={() => setShowEditDialog(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contact.firstName} {contact.lastName}? This action cannot be undone.
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
