import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useContactsStore } from '@/store/useContactsStore';
import { ContactForm } from './ContactForm';
import { ContactDetailsModal } from './ContactDetailsModal';
import { Plus, Search, Filter, Download, Upload, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export function ContactManagement() {
  const {
    getFilteredContacts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    deleteContact,
    selectedContact,
    setSelectedContact
  } = useContactsStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const contacts = getFilteredContacts();

  const handleContactClick = (contact: any) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
  };

  const handleEditContact = (contact: any) => {
    setSelectedContact(contact);
    setShowEditForm(true);
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId);
    toast.success('Contact deleted successfully');
  };

  const handleExportContacts = () => {
    const csvContent = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Status', 'Source'],
      ...contacts.map(contact => [
        contact.firstName || contact.name.split(' ')[0] || '',
        contact.lastName || contact.name.split(' ')[1] || '',
        contact.email,
        contact.phone || '',
        contact.company || '',
        contact.status,
        contact.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Contacts exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts and customer relationships
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportContacts}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Contact</DialogTitle>
                <DialogDescription>
                  Add a new contact to your database
                </DialogDescription>
              </DialogHeader>
              <ContactForm onComplete={() => setShowCreateForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="ads">Advertisements</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              setSourceFilter('');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'lead' || c.status === 'qualified').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.status === 'customer').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.length > 0 ? Math.round((contacts.filter(c => c.status === 'customer').length / contacts.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>All Contacts ({contacts.length})</CardTitle>
          <CardDescription>
            Manage your contact database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contacts found</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowCreateForm(true)}
                >
                  Create your first contact
                </Button>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleContactClick(contact)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>
                        {contact.firstName?.charAt(0) || contact.name.charAt(0)}{contact.lastName?.charAt(0) || contact.name.charAt(1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email}
                      </div>
                      {contact.company && (
                        <div className="text-sm text-muted-foreground">
                          {contact.company}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant={
                        contact.status === 'customer' ? 'default' :
                        contact.status === 'lead' || contact.status === 'qualified' ? 'secondary' :
                        contact.status === 'prospect' || contact.status === 'contacted' ? 'outline' : 'destructive'
                      }>
                        {contact.status}
                      </Badge>
                      {contact.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {contact.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${contact.email}`);
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      {contact.phone && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${contact.phone}`);
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditContact(contact);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update contact information
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <ContactForm
              contact={{
                ...selectedContact,
                lastContact: selectedContact.lastContactedAt || new Date(),
                totalValue: selectedContact.leadScore * 100,
                activities: []
              }}
              onComplete={() => {
                setShowEditForm(false);
                setSelectedContact(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Details Modal */}
      {selectedContact && (
        <ContactDetailsModal
          contact={{
            ...selectedContact,
            lastContact: selectedContact.lastContactedAt || new Date(),
            totalValue: selectedContact.leadScore * 100,
            activities: []
          }}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onSave={(updatedContact) => {
            // Handle contact save
            setShowDetailsModal(false);
          }}
        />
      )}
    </div>
  );
}
