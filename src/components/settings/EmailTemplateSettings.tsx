
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Edit, 
  Trash2, 
  FolderPlus,
  FileText,
  MoreHorizontal,
  Eye
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface EmailTemplateSettingsProps {
  onChange: () => void;
}

export default function EmailTemplateSettings({ onChange }: EmailTemplateSettingsProps) {
  const emailTemplates = [
    {
      id: 1,
      name: "Welcome Email",
      category: "Onboarding",
      lastModified: "2 days ago",
      status: "active",
      subject: "Welcome to Our Platform!",
      author: "John Doe"
    },
    {
      id: 2,
      name: "Appointment Confirmation",
      category: "Appointments",
      lastModified: "1 week ago",
      status: "active",
      subject: "Your Appointment is Confirmed",
      author: "Jane Smith"
    },
    {
      id: 3,
      name: "Payment Receipt",
      category: "Payments",
      lastModified: "3 days ago",
      status: "active",
      subject: "Receipt for Your Payment",
      author: "John Doe"
    },
    {
      id: 4,
      name: "Follow-up Email",
      category: "Sales",
      lastModified: "5 hours ago",
      status: "draft",
      subject: "Following Up on Our Conversation",
      author: "John Doe"
    },
    {
      id: 5,
      name: "Password Reset",
      category: "Account",
      lastModified: "2 weeks ago",
      status: "active",
      subject: "Reset Your Password",
      author: "System"
    }
  ];
  
  const folders = [
    { name: "Onboarding", count: 3 },
    { name: "Appointments", count: 4 },
    { name: "Payments", count: 2 },
    { name: "Sales", count: 5 },
    { name: "Account", count: 3 },
    { name: "Follow-ups", count: 2 }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>Manage and customize your email templates</CardDescription>
          </div>
          <Button onClick={onChange}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Folders</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onChange}>
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <div 
                    className="flex items-center justify-between rounded-md px-3 py-2 bg-muted cursor-pointer"
                    onClick={onChange}
                  >
                    <span>All Templates</span>
                    <Badge variant="secondary">{emailTemplates.length}</Badge>
                  </div>
                  {folders.map((folder, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted cursor-pointer"
                      onClick={onChange}
                    >
                      <span>{folder.name}</span>
                      <Badge variant="outline">{folder.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-9">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-9"
                    onChange={onChange}
                  />
                </div>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Subject: {template.subject}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{template.category}</TableCell>
                          <TableCell>{template.lastModified}</TableCell>
                          <TableCell>
                            <Badge variant={template.status === "active" ? "default" : "secondary"}>
                              {template.status === "active" ? "Active" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onChange}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onChange}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onChange}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={onChange}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="active" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailTemplates.filter(t => t.status === "active").map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Subject: {template.subject}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{template.category}</TableCell>
                          <TableCell>{template.lastModified}</TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onChange}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onChange}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onChange}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={onChange}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="draft" className="pt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Last Modified</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailTemplates.filter(t => t.status === "draft").map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Subject: {template.subject}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{template.category}</TableCell>
                          <TableCell>{template.lastModified}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Draft</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onChange}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onChange}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onChange}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive" 
                                  onClick={onChange}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="archived" className="pt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Mail className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No archived templates</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any archived email templates yet
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>Configure your email delivery settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Sender Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Sender Name</Label>
                  <Input 
                    id="sender-name" 
                    defaultValue="Your Agency" 
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Sender Email</Label>
                  <Input 
                    id="sender-email" 
                    defaultValue="contact@youragency.com" 
                    onChange={onChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply-to">Reply-To Email</Label>
                  <Input 
                    id="reply-to" 
                    defaultValue="support@youragency.com" 
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Email Branding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border rounded-md flex items-center justify-center">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm" onClick={onChange}>
                      Upload
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-color">Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      id="brand-color" 
                      defaultValue="#9b87f5" 
                      className="w-10 h-10 rounded p-1"
                      onChange={onChange}
                    />
                    <Input 
                      defaultValue="#9b87f5" 
                      className="w-32"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Footer Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <textarea 
                  id="footer-text" 
                  className="w-full min-h-24 p-3 rounded-md border border-input bg-background"
                  defaultValue="© 2025 Your Agency. All rights reserved.&#10;123 Main St, Eugene, OR 97401&#10;Unsubscribe | View in browser | Privacy Policy"
                  onChange={onChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">Include Social Media Links</Label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="include-social" 
                    className="h-4 w-4 rounded border-gray-300"
                    defaultChecked
                    onChange={onChange}
                  />
                  <Label htmlFor="include-social" className="font-normal">
                    Add social media icons to the footer
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={onChange}>Save Settings</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
