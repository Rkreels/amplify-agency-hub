
import { AppLayout } from "@/components/layout/AppLayout";
import { ContactCard } from "@/components/crm/ContactCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const contacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    tags: ["Client", "Marketing"],
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 987-6543",
    tags: ["Lead", "Sales"],
    lastActivity: "1 day ago",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.davis@example.com",
    phone: "+1 (555) 345-6789",
    tags: ["Client", "Support"],
    lastActivity: "3 days ago",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@example.com",
    phone: "+1 (555) 456-7890",
    tags: ["Lead", "Marketing"],
    lastActivity: "1 week ago",
  },
  {
    id: 5,
    name: "Olivia Smith",
    email: "olivia.smith@example.com",
    phone: "+1 (555) 567-8901",
    tags: ["Client", "VIP"],
    lastActivity: "Today",
  },
  {
    id: 6,
    name: "William Taylor",
    email: "william.taylor@example.com",
    phone: "+1 (555) 678-9012",
    tags: ["Lead", "Cold"],
    lastActivity: "2 weeks ago",
  },
  {
    id: 7,
    name: "Sophia Anderson",
    email: "sophia.anderson@example.com",
    phone: "+1 (555) 789-0123",
    tags: ["Client", "Proposal"],
    lastActivity: "4 days ago",
  },
  {
    id: 8,
    name: "Daniel Thomas",
    email: "daniel.thomas@example.com",
    phone: "+1 (555) 890-1234",
    tags: ["Lead", "Hot"],
    lastActivity: "Yesterday",
  },
];

export default function CRM() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
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
          <TabsTrigger value="tagged">Tagged</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="leads" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts
              .filter((contact) => contact.tags?.includes("Lead"))
              .map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="clients" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts
              .filter((contact) => contact.tags?.includes("Client"))
              .map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="tagged" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contacts
              .filter((contact) => contact.tags && contact.tags.length > 1)
              .map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
