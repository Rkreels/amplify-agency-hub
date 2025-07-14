
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Upload, 
  Mail, 
  Phone, 
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Star,
  Tag,
  MoreVertical
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  source: string;
  tags: string[];
  lastContact: string;
  nextFollowUp: string;
  assignedTo: string;
  dealValue: number;
  notes: string;
  avatar?: string;
}

const initialContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc',
    position: 'Marketing Director',
    status: 'lead',
    source: 'Website',
    tags: ['hot lead', 'interested'],
    lastContact: '2 days ago',
    nextFollowUp: 'Tomorrow',
    assignedTo: 'John Doe',
    dealValue: 15000,
    notes: 'Very interested in our premium package. Has budget approval.'
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 234-5678',
    company: 'Digital Marketing Pro',
    position: 'CEO',
    status: 'customer',
    source: 'Referral',
    tags: ['vip', 'recurring'],
    lastContact: '1 week ago',
    nextFollowUp: 'Next Monday',
    assignedTo: 'Jane Smith',
    dealValue: 25000,
    notes: 'Long-term client. Monthly retainer. Very satisfied with services.'
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily@example.com',
    phone: '+1 (555) 345-6789',
    company: 'Creative Agency',
    position: 'Creative Director',
    status: 'prospect',
    source: 'LinkedIn',
    tags: ['qualified', 'design'],
    lastContact: '3 days ago',
    nextFollowUp: 'This Friday',
    assignedTo: 'John Doe',
    dealValue: 12000,
    notes: 'Interested in branding package. Needs board approval.'
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Startup Ventures',
    position: 'Founder',
    status: 'lead',
    source: 'Google Ads',
    tags: ['startup', 'budget conscious'],
    lastContact: '5 days ago',
    nextFollowUp: 'Next week',
    assignedTo: 'Jane Smith',
    dealValue: 8000,
    notes: 'Early stage startup. Interested but price sensitive.'
  }
];

export function ContactManagement() {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showNewContact, setShowNewContact] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const contactStats = [
    {
      title: "Total Contacts",
      value: contacts.length.toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Leads",
      value: contacts.filter(c => c.status === 'lead').length.toString(),
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Customers",
      value: contacts.filter(c => c.status === 'customer').length.toString(),
      icon: Star,
      color: "text-purple-600"
    },
    {
      title: "Total Deal Value",
      value: `$${contacts.reduce((sum, c) => sum + c.dealValue, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground">Manage your contacts and customer relationships</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showNewContact} onOpenChange={setShowNewContact}>
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="First name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Last name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Company</label>
                    <Input placeholder="Company name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Position</label>
                    <Input placeholder="Job title" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="prospect">Prospect</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Source</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="google-ads">Google Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea placeholder="Add notes about this contact" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewContact(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewContact(false)}>
                    Add Contact
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-10 w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Table
          </Button>
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Cards
          </Button>
        </div>
      </div>

      {/* Contacts Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Deal Value</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.firstName[0]}{contact.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contact.company}</div>
                        <div className="text-sm text-muted-foreground">{contact.position}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{contact.source}</TableCell>
                    <TableCell>${contact.dealValue.toLocaleString()}</TableCell>
                    <TableCell>{contact.lastContact}</TableCell>
                    <TableCell>{contact.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>
                      {contact.firstName[0]}{contact.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-1">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{contact.position}</p>
                <p className="text-sm font-medium mb-3">{contact.company}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {contact.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>Deal Value: ${contact.dealValue.toLocaleString()}</span>
                  <span>Last: {contact.lastContact}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedContact(contact)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Details Dialog */}
      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {selectedContact.firstName} {selectedContact.lastName}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContact.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedContact.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Company Information</h4>
                      <div className="space-y-1">
                        <p>{selectedContact.company}</p>
                        <p className="text-sm text-muted-foreground">{selectedContact.position}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Status & Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge className={getStatusColor(selectedContact.status)}>
                            {selectedContact.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Source:</span>
                          <span>{selectedContact.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Deal Value:</span>
                          <span>${selectedContact.dealValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned to:</span>
                          <span>{selectedContact.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Last Contact</span>
                      <span className="text-sm text-muted-foreground">{selectedContact.lastContact}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Email sent regarding proposal follow-up</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Next Follow-up</span>
                      <span className="text-sm text-muted-foreground">{selectedContact.nextFollowUp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Scheduled call to discuss requirements</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="opportunities" className="space-y-4">
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No opportunities yet</h3>
                  <p className="text-muted-foreground mb-4">Create an opportunity to track potential deals</p>
                  <Button>Create Opportunity</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground mb-4">{selectedContact.notes}</p>
                  <Textarea placeholder="Add a note..." />
                  <Button className="mt-2">Add Note</Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-between pt-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedContact(null)}>
                  Close
                </Button>
                <Button>
                  Edit Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
