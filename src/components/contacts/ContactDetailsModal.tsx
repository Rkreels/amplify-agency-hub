
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Tag, 
  MessageSquare,
  DollarSign,
  Activity,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  tags: string[];
  leadScore: number;
  source: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  createdAt: Date;
  lastContact: Date;
  totalValue: number;
  notes: string;
  customFields: Record<string, any>;
  activities: Activity[];
}

interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'sms';
  description: string;
  date: Date;
  outcome?: string;
}

interface ContactDetailsModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
}

export function ContactDetailsModal({ contact, isOpen, onClose, onSave }: ContactDetailsModalProps) {
  const [editedContact, setEditedContact] = useState<Contact | null>(contact);
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');

  React.useEffect(() => {
    setEditedContact(contact);
    setIsEditing(false);
  }, [contact]);

  if (!editedContact) return null;

  const handleSave = () => {
    onSave(editedContact);
    setIsEditing(false);
    toast.success('Contact updated successfully');
  };

  const addTag = () => {
    if (newTag.trim()) {
      setEditedContact({
        ...editedContact,
        tags: [...editedContact.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedContact({
      ...editedContact,
      tags: editedContact.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addActivity = (type: Activity['type'], description: string) => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type,
      description,
      date: new Date()
    };
    
    setEditedContact({
      ...editedContact,
      activities: [newActivity, ...editedContact.activities]
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5" />
              {editedContact.firstName} {editedContact.lastName}
              <Badge className={getStatusColor(editedContact.status)}>
                {editedContact.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="communications">Communications</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <ScrollArea className="h-[60vh]">
              <div className="grid grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={editedContact.firstName}
                          onChange={(e) => setEditedContact({...editedContact, firstName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={editedContact.lastName}
                          onChange={(e) => setEditedContact({...editedContact, lastName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Input
                          value={editedContact.email}
                          onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <Input
                          value={editedContact.phone}
                          onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Company</Label>
                      <Input
                        value={editedContact.company || ''}
                        onChange={(e) => setEditedContact({...editedContact, company: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label>Address</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Textarea
                          value={editedContact.address || ''}
                          onChange={(e) => setEditedContact({...editedContact, address: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Lead Score</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${editedContact.leadScore}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{editedContact.leadScore}/100</span>
                      </div>
                    </div>

                    <div>
                      <Label>Source</Label>
                      <Input
                        value={editedContact.source}
                        onChange={(e) => setEditedContact({...editedContact, source: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <Label>Total Value</Label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <Input
                          type="number"
                          value={editedContact.totalValue}
                          onChange={(e) => setEditedContact({...editedContact, totalValue: Number(e.target.value)})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editedContact.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            {isEditing && (
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeTag(tag)}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add tag..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button size="sm" onClick={addTag}>Add</Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Notes</Label>
                      <Textarea
                        value={editedContact.notes}
                        onChange={(e) => setEditedContact({...editedContact, notes: e.target.value})}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" onClick={() => addActivity('call', 'Phone call made')}>
                <Phone className="h-4 w-4 mr-1" />
                Log Call
              </Button>
              <Button size="sm" onClick={() => addActivity('email', 'Email sent')}>
                <Mail className="h-4 w-4 mr-1" />
                Log Email
              </Button>
              <Button size="sm" onClick={() => addActivity('meeting', 'Meeting held')}>
                <Calendar className="h-4 w-4 mr-1" />
                Log Meeting
              </Button>
            </div>

            <ScrollArea className="h-[50vh]">
              <div className="space-y-3">
                {editedContact.activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-medium capitalize">{activity.type}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {activity.date.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="opportunities">
            <div className="text-center py-8">
              <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Opportunities</h3>
              <p className="text-gray-500 mb-4">Create opportunities to track potential deals</p>
              <Button>Create Opportunity</Button>
            </div>
          </TabsContent>

          <TabsContent value="communications">
            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Communications</h3>
              <p className="text-gray-500 mb-4">Email and SMS history will appear here</p>
              <div className="flex gap-2 justify-center">
                <Button><Mail className="h-4 w-4 mr-1" />Send Email</Button>
                <Button variant="outline"><MessageSquare className="h-4 w-4 mr-1" />Send SMS</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
