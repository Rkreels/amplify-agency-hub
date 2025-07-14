import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  Building, 
  Edit, 
  MessageSquare, 
  Calendar,
  DollarSign,
  Activity,
  User,
  Clock,
  Star
} from 'lucide-react';
import { type Contact } from '@/store/useContactsStore';
import { ContactForm } from './ContactForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ContactDetailsProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactDetails({ contact, onClose }: ContactDetailsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'email':
        toast.success(`Opening email composer for ${contact.email}`);
        break;
      case 'call':
        toast.success(`Initiating call to ${contact.phone}`);
        break;
      case 'message':
        toast.success(`Opening message composer for ${contact.firstName}`);
        break;
      case 'appointment':
        toast.success(`Opening calendar to schedule appointment`);
        break;
    }
  };

  const mockInteractions = [
    {
      id: '1',
      type: 'email',
      title: 'Welcome Email Sent',
      description: 'Automated welcome sequence triggered',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '2',
      type: 'call',
      title: 'Sales Call',
      description: 'Initial discovery call completed',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'email',
      title: 'Follow-up Email',
      description: 'Follow-up email after call',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed'
    }
  ];

  const mockOpportunities = [
    {
      id: '1',
      title: 'Website Redesign Project',
      value: 15000,
      stage: 'Proposal',
      probability: 75,
      closeDate: '2024-02-15'
    },
    {
      id: '2',
      title: 'SEO Optimization',
      value: 5000,
      stage: 'Qualified',
      probability: 45,
      closeDate: '2024-03-01'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Contact Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback className="text-lg">
              {contact.firstName?.charAt(0) || contact.name.charAt(0)}{contact.lastName?.charAt(0) || contact.name.charAt(1)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-2xl font-bold">
              {contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={
                contact.status === 'customer' ? 'default' :
                contact.status === 'lead' || contact.status === 'qualified' ? 'secondary' :
                contact.status === 'prospect' || contact.status === 'contacted' ? 'outline' : 'destructive'
              }>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </Badge>
              {contact.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {contact.email}
              </div>
              {contact.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {contact.phone}
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {contact.company}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleQuickAction('call')}>
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          className="flex flex-col h-auto p-4 gap-2"
          onClick={() => handleQuickAction('message')}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-sm">Send Message</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col h-auto p-4 gap-2"
          onClick={() => handleQuickAction('appointment')}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-sm">Schedule</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col h-auto p-4 gap-2"
          onClick={() => toast.success('Creating opportunity...')}
        >
          <DollarSign className="h-5 w-5" />
          <span className="text-sm">Add Deal</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col h-auto p-4 gap-2"
          onClick={() => toast.success('Adding note...')}
        >
          <Edit className="h-5 w-5" />
          <span className="text-sm">Add Note</span>
        </Button>
      </div>

      {/* Contact Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="interactions">Activity</TabsTrigger>
          <TabsTrigger value="opportunities">Deals</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.company && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span>{contact.company}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline">{contact.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{contact.createdAt.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interactions:</span>
                  <span className="font-medium">{mockInteractions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Open Opportunities:</span>
                  <span className="font-medium">{mockOpportunities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-medium">
                    ${mockOpportunities.reduce((sum, opp) => sum + opp.value, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Contact:</span>
                  <span className="font-medium">
                    {mockInteractions[0]?.timestamp.toLocaleDateString() || 'Never'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {contact.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{contact.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Interaction history with this contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {interaction.type === 'email' ? (
                        <Mail className="h-4 w-4 text-primary" />
                      ) : interaction.type === 'call' ? (
                        <Phone className="h-4 w-4 text-primary" />
                      ) : (
                        <Activity className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{interaction.title}</div>
                      <div className="text-sm text-muted-foreground">{interaction.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs text-muted-foreground">
                          {interaction.timestamp.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {interaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Open Opportunities</CardTitle>
              <CardDescription>Active deals for this contact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOpportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium">{opp.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Close Date: {opp.closeDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${opp.value.toLocaleString()}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{opp.stage}</Badge>
                        <span className="text-sm text-muted-foreground">{opp.probability}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Notes</CardTitle>
              <CardDescription>Internal notes and observations</CardDescription>
            </CardHeader>
            <CardContent>
              {contact.notes ? (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p>{contact.notes}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {contact.updatedAt.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notes available for this contact</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => toast.success('Opening note editor...')}
                  >
                    Add Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <ContactForm 
            contact={contact} 
            onComplete={() => {
              setShowEditDialog(false);
              onClose();
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
