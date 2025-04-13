
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  Edit, 
  Trash2, 
  FolderPlus,
  FileText,
  MoreHorizontal,
  Eye,
  Tag,
  Clock,
  Phone
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
import { Switch } from "@/components/ui/switch";

interface SmsTemplateSettingsProps {
  onChange: () => void;
}

export default function SmsTemplateSettings({ onChange }: SmsTemplateSettingsProps) {
  const smsTemplates = [
    {
      id: 1,
      name: "Appointment Reminder",
      category: "Appointments",
      lastModified: "3 days ago",
      status: "active",
      content: "Hi {{first_name}}, this is a reminder about your appointment tomorrow at {{time}}. Reply Y to confirm or N to reschedule.",
      author: "John Doe"
    },
    {
      id: 2,
      name: "Payment Confirmation",
      category: "Payments",
      lastModified: "1 week ago",
      status: "active",
      content: "Thank you for your payment of {{amount}}. Your receipt has been emailed to {{email}}.",
      author: "Jane Smith"
    },
    {
      id: 3,
      name: "New Lead Welcome",
      category: "Sales",
      lastModified: "2 days ago",
      status: "active",
      content: "Hi {{first_name}}, thanks for your interest! Click here to schedule a call: {{booking_link}}",
      author: "John Doe"
    },
    {
      id: 4,
      name: "Review Request",
      category: "Marketing",
      lastModified: "5 hours ago",
      status: "draft",
      content: "Hi {{first_name}}, we hope you enjoyed your service! Would you mind leaving us a review? {{review_link}}",
      author: "Jane Smith"
    },
    {
      id: 5,
      name: "Event Reminder",
      category: "Events",
      lastModified: "1 day ago",
      status: "active",
      content: "Don't forget! Our {{event_name}} is happening tomorrow at {{time}}. We look forward to seeing you!",
      author: "John Doe"
    }
  ];
  
  const folders = [
    { name: "Appointments", count: 3 },
    { name: "Payments", count: 2 },
    { name: "Sales", count: 4 },
    { name: "Marketing", count: 2 },
    { name: "Events", count: 1 }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>SMS Templates</CardTitle>
            <CardDescription>Manage and customize your SMS message templates</CardDescription>
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
                    <Badge variant="secondary">{smsTemplates.length}</Badge>
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
                      {smsTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <MessageSquare className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {template.content}
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
                      {smsTemplates.filter(t => t.status === "active").map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <MessageSquare className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {template.content}
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
                      {smsTemplates.filter(t => t.status === "draft").map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <MessageSquare className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {template.content}
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
                    <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No archived templates</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any archived SMS templates yet
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
          <CardTitle>SMS Settings</CardTitle>
          <CardDescription>Configure your SMS messaging settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">SMS Numbers</h3>
              <div className="space-y-4">
                <div className="rounded-md border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">+1 (555) 123-4567</div>
                      <div className="text-xs text-muted-foreground">
                        Primary Number • Added on Mar 15, 2025
                      </div>
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                
                <Button variant="outline" className="w-full" onClick={onChange}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Phone Number
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">SMS Personalization</h3>
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input 
                  id="business-name" 
                  defaultValue="Your Agency" 
                  onChange={onChange}
                />
                <p className="text-xs text-muted-foreground">
                  This name will appear as the sender for certain carriers
                </p>
              </div>

              <div className="space-y-2">
                <Label>Available Personalization Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "first_name", "last_name", "full_name", "phone", "email",
                    "booking_link", "payment_link", "amount", "date", "time"
                  ].map((tag) => (
                    <div key={tag} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
                      <Tag className="h-3 w-3 mr-1" />
                      <span>{"{{" + tag + "}}"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Delivery Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Schedule Sending</Label>
                    <p className="text-sm text-muted-foreground">
                      Send messages during business hours only
                    </p>
                  </div>
                  <Switch defaultChecked onChange={onChange} />
                </div>
                
                <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-start">Business Hours Start</Label>
                    <select 
                      id="business-start" 
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                      onChange={onChange}
                    >
                      <option>8:00 AM</option>
                      <option>9:00 AM</option>
                      <option>10:00 AM</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-end">Business Hours End</Label>
                    <select 
                      id="business-end" 
                      className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
                      onChange={onChange}
                    >
                      <option>5:00 PM</option>
                      <option>6:00 PM</option>
                      <option>7:00 PM</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Timezone</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for scheduling SMS messages
                    </p>
                  </div>
                  <select 
                    className="w-60 h-10 px-3 py-2 bg-background border border-input rounded-md"
                    onChange={onChange}
                  >
                    <option>Pacific Time (US & Canada)</option>
                    <option>Eastern Time (US & Canada)</option>
                    <option>Central Time (US & Canada)</option>
                    <option>Mountain Time (US & Canada)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Send Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit how many SMS messages are sent per minute
                    </p>
                  </div>
                  <select 
                    className="w-40 h-10 px-3 py-2 bg-background border border-input rounded-md"
                    onChange={onChange}
                  >
                    <option>No limit</option>
                    <option>10 per minute</option>
                    <option>30 per minute</option>
                    <option>60 per minute</option>
                  </select>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Compliance Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Automatic Opt-Out Processing</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process STOP, CANCEL, UNSUBSCRIBE replies
                    </p>
                  </div>
                  <Switch defaultChecked onChange={onChange} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Add Opt-Out Instructions</Label>
                    <p className="text-sm text-muted-foreground">
                      Add "Reply STOP to unsubscribe" to outgoing messages
                    </p>
                  </div>
                  <Switch defaultChecked onChange={onChange} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">SMS Consent Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Only send to contacts who have given SMS consent
                    </p>
                  </div>
                  <Switch defaultChecked onChange={onChange} />
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
