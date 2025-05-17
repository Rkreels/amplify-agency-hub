
import { useState } from "react";
import { useContactsStore, type Contact, type ContactStatus } from "@/store/useContactsStore";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Search, Check, X, Edit, Trash2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContactForm } from "@/components/contacts/ContactForm";
import { ContactDetails } from "@/components/contacts/ContactDetails";

export default function Contacts() {
  const { 
    contacts, 
    deleteContact, 
    selectedContact,
    setSelectedContact
  } = useContactsStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewContactDialog, setShowNewContactDialog] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  
  // Filter contacts based on search query
  const filteredContacts = searchQuery
    ? contacts.filter(contact => 
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : contacts;

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      deleteContact(id);
      toast.success("Contact deleted successfully");
    }
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactDetails(true);
  };

  const getStatusBadgeVariant = (status: ContactStatus) => {
    switch (status) {
      case 'lead':
        return 'secondary';
      case 'customer':
        return 'default';
      case 'prospect':
        return 'outline';
      case 'inactive':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your customers, leads, and prospects
          </p>
        </div>
        <Dialog open={showNewContactDialog} onOpenChange={setShowNewContactDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onComplete={() => setShowNewContactDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No contacts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="cursor-pointer" onClick={() => handleViewDetails(contact)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={contact.avatarUrl} />
                        <AvatarFallback>
                          {contact.firstName.charAt(0) + contact.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{contact.firstName} {contact.lastName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contact.status)}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{contact.company || '-'}</TableCell>
                  <TableCell className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(contact);
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedContact && (
        <Dialog open={showContactDetails} onOpenChange={setShowContactDetails}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
            </DialogHeader>
            <ContactDetails contact={selectedContact} onClose={() => setShowContactDetails(false)} />
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
}
