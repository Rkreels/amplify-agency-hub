
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Star,
  MessageSquare,
  PhoneCall,
  Edit,
  Trash2,
  Plus,
  Activity
} from 'lucide-react';
import { useContactsStore, type Contact } from '@/store/useContactsStore';
import { toast } from 'sonner';

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const { updateContact, deleteContact, customFields } = useContactsStore();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = contact.notes 
        ? `${contact.notes}\n\n${new Date().toLocaleDateString()}: ${newNote}`
        : `${new Date().toLocaleDateString()}: ${newNote}`;
      
      updateContact(contact.id, { notes: updatedNotes });
      setNewNote('');
      setIsAddingNote(false);
      toast.success('Note added successfully');
    }
  };

  const handleUpdateScore = () => {
    const newScore = Math.min(100, contact.leadScore + Math.floor(Math.random() * 20));
    updateContact(contact.id, { leadScore: newScore });
    toast.success('Lead score updated');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
      toast.success('Contact deleted successfully');
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="text-lg">
              {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">
              {contact.firstName} {contact.lastName}
            </h2>
            <p className="text-gray-600">{contact.position}</p>
            <p className="text-gray-600">{contact.company}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status and Tags */}
      <div className="flex flex-wrap gap-2">
        <Badge className={getStatusColor(contact.status)}>
          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
        </Badge>
        {contact.tags.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{contact.phone}</span>
            </div>
            {contact.company && (
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-gray-500" />
                <span>{contact.company}</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Created: {contact.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-gray-500" />
              <span>Source: {contact.source}</span>
            </div>
          </CardContent>
        </Card>

        {/* Lead Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Lead Score
              <Button variant="outline" size="sm" onClick={handleUpdateScore}>
                <Star className="h-4 w-4 mr-1" />
                Update
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{contact.leadScore}</div>
              <div className="text-sm text-gray-600 mb-4">out of 100</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${contact.leadScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Fields */}
      {customFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customFields.map((field) => (
                <div key={field.id}>
                  <label className="font-medium text-sm">{field.name}</label>
                  <p className="text-gray-600">
                    {contact.customFields[field.id] || 'Not set'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="w-full" onClick={() => toast.success('Email composer opened')}>
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button className="w-full" onClick={() => toast.success('SMS composer opened')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send SMS
            </Button>
            <Button className="w-full" onClick={() => toast.success('Call initiated')}>
              <PhoneCall className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Notes
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAddingNote(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Note
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAddingNote && (
            <div className="mb-4 space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAddingNote(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddNote}>
                  Save Note
                </Button>
              </div>
            </div>
          )}
          
          {contact.notes ? (
            <div className="whitespace-pre-wrap text-sm text-gray-700">
              {contact.notes}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No notes added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
