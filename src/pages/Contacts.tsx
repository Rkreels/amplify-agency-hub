
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Star,
  CalendarClock,
  Tag,
  UserPlus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Contacts() {
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 123-4567",
      tags: ["Client", "Marketing"],
      lastActivity: "2 hours ago",
      company: "Johnson Design Co.",
      status: "active",
      value: "$12,500",
      avatar: "",
      initials: "SJ",
      starred: true
    },
    {
      id: 2,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (555) 987-6543",
      tags: ["Lead", "Sales"],
      lastActivity: "1 day ago",
      company: "Brown Consulting LLC",
      status: "lead",
      value: "$8,000",
      avatar: "",
      initials: "MB",
      starred: false
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.davis@example.com",
      phone: "+1 (555) 345-6789",
      tags: ["Client", "Support"],
      lastActivity: "3 days ago",
      company: "Davis Enterprises",
      status: "active",
      value: "$15,750",
      avatar: "",
      initials: "ED",
      starred: true
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "+1 (555) 456-7890",
      tags: ["Lead", "Marketing"],
      lastActivity: "1 week ago",
      company: "Wilson Media Group",
      status: "lead",
      value: "$0",
      avatar: "",
      initials: "JW",
      starred: false
    },
    {
      id: 5,
      name: "Olivia Smith",
      email: "olivia.smith@example.com",
      phone: "+1 (555) 567-8901",
      tags: ["Client", "VIP"],
      lastActivity: "Today",
      company: "Smith & Associates",
      status: "active",
      value: "$32,000",
      avatar: "",
      initials: "OS",
      starred: true
    },
    {
      id: 6,
      name: "William Taylor",
      email: "william.taylor@example.com",
      phone: "+1 (555) 678-9012",
      tags: ["Lead", "Cold"],
      lastActivity: "2 weeks ago",
      company: "Taylor Tech Solutions",
      status: "inactive",
      value: "$0",
      avatar: "",
      initials: "WT",
      starred: false
    },
    {
      id: 7,
      name: "Sophia Anderson",
      email: "sophia.anderson@example.com",
      phone: "+1 (555) 789-0123",
      tags: ["Client", "Proposal"],
      lastActivity: "4 days ago",
      company: "Anderson Marketing",
      status: "active",
      value: "$9,200",
      avatar: "",
      initials: "SA",
      starred: false
    },
    {
      id: 8,
      name: "Daniel Thomas",
      email: "daniel.thomas@example.com",
      phone: "+1 (555) 890-1234",
      tags: ["Lead", "Hot"],
      lastActivity: "Yesterday",
      company: "Thomas Innovations",
      status: "lead",
      value: "$0",
      avatar: "",
      initials: "DT",
      starred: false
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">
            Manage your contacts, leads, and customers in one place.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Tag className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Contacts</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="starred">Starred</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="ml-1 h-4 w-4 rounded border-gray-300" />
                            <span>Name</span>
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tags</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Activity</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Value</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {contacts.map((contact) => (
                        <tr key={contact.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={contact.avatar} alt={contact.name} />
                                  <AvatarFallback>{contact.initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{contact.name}</span>
                                    {contact.starred && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                                  </div>
                                  <Badge 
                                    variant={contact.status === 'active' ? 'default' : contact.status === 'lead' ? 'secondary' : 'outline'} 
                                    className="w-fit text-xs"
                                  >
                                    {contact.status === 'active' ? 'Client' : contact.status === 'lead' ? 'Lead' : 'Inactive'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm">{contact.email}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm">{contact.phone}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm">{contact.company}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm text-muted-foreground">{contact.lastActivity}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <span className="text-sm font-medium">{contact.value}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <CalendarClock className="h-4 w-4 mr-2" />
                                    Schedule Meeting
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Tag className="h-4 w-4 mr-2" />
                                    Add Tags
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star className="h-4 w-4 mr-2" />
                                    {contact.starred ? 'Remove Star' : 'Add Star'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Delete Contact
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1-{contacts.length}</strong> of <strong>{contacts.length}</strong> contacts
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leads" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="ml-1 h-4 w-4 rounded border-gray-300" />
                            <span>Name</span>
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tags</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Activity</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {contacts
                        .filter(contact => contact.status === 'lead')
                        .map((contact) => (
                          <tr key={contact.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={contact.avatar} alt={contact.name} />
                                    <AvatarFallback>{contact.initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{contact.name}</span>
                                      {contact.starred && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <Badge variant="secondary" className="w-fit text-xs">Lead</Badge>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.email}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.phone}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.company}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm text-muted-foreground">{contact.lastActivity}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <UserPlus className="h-4 w-4 mr-2" />
                                      Convert to Client
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <CalendarClock className="h-4 w-4 mr-2" />
                                      Schedule Meeting
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Tag className="h-4 w-4 mr-2" />
                                      Add Tags
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Delete Contact
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="ml-1 h-4 w-4 rounded border-gray-300" />
                            <span>Name</span>
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tags</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Activity</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Value</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {contacts
                        .filter(contact => contact.status === 'active')
                        .map((contact) => (
                          <tr key={contact.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={contact.avatar} alt={contact.name} />
                                    <AvatarFallback>{contact.initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{contact.name}</span>
                                      {contact.starred && <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />}
                                    </div>
                                    <Badge className="w-fit text-xs">Client</Badge>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.email}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.phone}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.company}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm text-muted-foreground">{contact.lastActivity}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm font-medium">{contact.value}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <CalendarClock className="h-4 w-4 mr-2" />
                                      Schedule Meeting
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Tag className="h-4 w-4 mr-2" />
                                      Add Tags
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Star className="h-4 w-4 mr-2" />
                                      {contact.starred ? 'Remove Star' : 'Add Star'}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Delete Contact
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="starred" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" className="ml-1 h-4 w-4 rounded border-gray-300" />
                            <span>Name</span>
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Phone</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Tags</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Activity</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Value</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {contacts
                        .filter(contact => contact.starred)
                        .map((contact) => (
                          <tr key={contact.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={contact.avatar} alt={contact.name} />
                                    <AvatarFallback>{contact.initials}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{contact.name}</span>
                                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <Badge 
                                      variant={contact.status === 'active' ? 'default' : contact.status === 'lead' ? 'secondary' : 'outline'} 
                                      className="w-fit text-xs"
                                    >
                                      {contact.status === 'active' ? 'Client' : contact.status === 'lead' ? 'Lead' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.email}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.phone}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm">{contact.company}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm text-muted-foreground">{contact.lastActivity}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <span className="text-sm font-medium">{contact.value}</span>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <CalendarClock className="h-4 w-4 mr-2" />
                                      Schedule Meeting
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Tag className="h-4 w-4 mr-2" />
                                      Add Tags
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Star className="h-4 w-4 mr-2" />
                                      Remove Star
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Delete Contact
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
