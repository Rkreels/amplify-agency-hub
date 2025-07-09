
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  tags: string[];
  status: 'lead' | 'customer' | 'prospect';
  lastActivity: Date;
  value: number;
  source: string;
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc',
    tags: ['VIP', 'Hot Lead'],
    status: 'lead',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    value: 5000,
    source: 'Website'
  },
  {
    id: '2',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Marketing Pro',
    tags: ['Follow-up', 'Interested'],
    status: 'prospect',
    lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    value: 2500,
    source: 'Facebook Ad'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    phone: '+1 (555) 345-6789',
    tags: ['Customer', 'Recurring'],
    status: 'customer',
    lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    value: 12000,
    source: 'Referral'
  }
];

export function ContactManagement() {
  const [contacts, setContacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || contact.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'customer': return 'bg-green-100 text-green-800';
    }
  };

  const handleContactAction = (action: string, contactId: string) => {
    switch (action) {
      case 'call':
        console.log(`Calling contact ${contactId}`);
        break;
      case 'email':
        console.log(`Emailing contact ${contactId}`);
        break;
      case 'sms':
        console.log(`Sending SMS to contact ${contactId}`);
        break;
      case 'schedule':
        console.log(`Scheduling appointment with contact ${contactId}`);
        break;
      case 'edit':
        console.log(`Editing contact ${contactId}`);
        break;
      case 'delete':
        setContacts(prev => prev.filter(c => c.id !== contactId));
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">Manage your leads, prospects, and customers</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({contacts.length})</TabsTrigger>
          <TabsTrigger value="lead">Leads ({contacts.filter(c => c.status === 'lead').length})</TabsTrigger>
          <TabsTrigger value="prospect">Prospects ({contacts.filter(c => c.status === 'prospect').length})</TabsTrigger>
          <TabsTrigger value="customer">Customers ({contacts.filter(c => c.status === 'customer').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredContacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      {contact.company && (
                        <p className="text-sm font-medium">{contact.company}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                      <p className="text-sm font-medium mt-1">${contact.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Last activity: {contact.lastActivity.toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactAction('call', contact.id)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactAction('email', contact.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactAction('sms', contact.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactAction('schedule', contact.id)}
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleContactAction('edit', contact.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleContactAction('delete', contact.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
