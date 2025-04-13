
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Phone,
  Mail,
  Facebook,
  Calendar,
  Search,
  Filter,
  UserPlus,
  Plus,
  MoreVertical,
  Send,
  PaperclipIcon,
  SmileIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function Conversations() {
  const conversations = [
    {
      id: 1,
      contact: "Sarah Johnson",
      avatar: "",
      initials: "SJ",
      lastMessage: "Thanks for the update on the campaign!",
      time: "10:30 AM",
      unread: 2,
      channel: "email",
    },
    {
      id: 2,
      contact: "Michael Brown",
      avatar: "",
      initials: "MB",
      lastMessage: "When can we schedule the next meeting?",
      time: "Yesterday",
      unread: 0,
      channel: "sms",
    },
    {
      id: 3,
      contact: "Emma Davis",
      avatar: "",
      initials: "ED",
      lastMessage: "I'd like to learn more about your services",
      time: "Yesterday",
      unread: 1,
      channel: "facebook",
    },
    {
      id: 4,
      contact: "James Wilson",
      avatar: "",
      initials: "JW",
      lastMessage: "Is the proposal ready for review?",
      time: "Monday",
      unread: 0,
      channel: "email",
    },
    {
      id: 5,
      contact: "Olivia Smith",
      avatar: "",
      initials: "OS",
      lastMessage: "I'll be available for a call tomorrow",
      time: "Monday",
      unread: 0,
      channel: "sms",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Emma Davis",
      avatar: "",
      initials: "ED",
      content: "Hi there! I'd like to learn more about your services. Do you offer website design for small businesses?",
      time: "Yesterday, 3:24 PM",
      isCustomer: true,
    },
    {
      id: 2,
      sender: "You",
      content: "Hello Emma! Yes, we specialize in website design for small businesses. We offer various packages depending on your needs. Would you like me to send you our service brochure?",
      time: "Yesterday, 3:45 PM",
      isCustomer: false,
    },
    {
      id: 3,
      sender: "Emma Davis",
      avatar: "",
      initials: "ED",
      content: "That would be great! I'm specifically looking for an e-commerce solution for my boutique clothing store.",
      time: "Yesterday, 4:02 PM",
      isCustomer: true,
    },
    {
      id: 4,
      sender: "You",
      content: "Perfect! We have excellent e-commerce solutions that would work well for a boutique clothing store. I've attached our e-commerce brochure with pricing and features. Would you be available for a quick call this week to discuss your specific requirements?",
      time: "Yesterday, 4:15 PM",
      isCustomer: false,
    },
    {
      id: 5,
      sender: "Emma Davis",
      avatar: "",
      initials: "ED",
      content: "I'll be available for a call tomorrow afternoon, around 2 PM. Would that work for you?",
      time: "Yesterday, 4:30 PM",
      isCustomer: true,
    },
  ];

  const channelIcons = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            Manage all your customer communications in one place
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          New Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversation List */}
        <Card className="lg:col-span-4 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="pl-8"
              />
            </div>
          </div>
          <Tabs defaultValue="all" className="flex-1">
            <div className="px-3 pt-3">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="assigned" className="flex-1">Assigned</TabsTrigger>
              </TabsList>
            </div>
            <div className="px-3 pt-3 flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filter
              </Button>
              <div className="flex ml-auto">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <TabsContent value="all" className="m-0">
                <div className="divide-y">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        conversation.id === 3 ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.contact} />
                          <AvatarFallback>{conversation.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">{conversation.contact}</div>
                            <div className="text-xs text-muted-foreground">{conversation.time}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground text-xs bg-muted px-1.5 py-0.5 rounded-full">
                              {channelIcons[conversation.channel as keyof typeof channelIcons]}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage}
                            </div>
                          </div>
                        </div>
                        {conversation.unread > 0 && (
                          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <div className="divide-y">
                  {conversations
                    .filter((conversation) => conversation.unread > 0)
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar} alt={conversation.contact} />
                            <AvatarFallback>{conversation.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium">{conversation.contact}</div>
                              <div className="text-xs text-muted-foreground">{conversation.time}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-muted-foreground text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                {channelIcons[conversation.channel as keyof typeof channelIcons]}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </div>
                            </div>
                          </div>
                          <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {conversation.unread}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="assigned" className="m-0">
                <div className="p-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium mb-1">No assigned conversations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conversations assigned to you will appear here
                  </p>
                  <Button variant="outline" size="sm">
                    View all conversations
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>

        {/* Conversation View */}
        <Card className="lg:col-span-8 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="Emma Davis" />
                <AvatarFallback>ED</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Emma Davis</div>
                <div className="text-xs text-muted-foreground">Last active 5 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isCustomer ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.isCustomer
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {message.isCustomer && (
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={message.avatar} alt={message.sender} />
                              <AvatarFallback className="text-xs">{message.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{message.sender}</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.isCustomer ? "text-muted-foreground" : "text-primary-foreground/80"
                          }`}
                        >
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <PaperclipIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-9 w-9">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-64 border-l hidden xl:block">
              <div className="p-4 border-b">
                <h3 className="font-medium mb-2">Contact Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Email</div>
                    <div className="text-sm">emma.davis@example.com</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Phone</div>
                    <div className="text-sm">+1 (555) 123-4567</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tags</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        Lead
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        E-commerce
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Recent Activity</h3>
                <div className="space-y-3 text-sm">
                  <div className="border-l-2 border-muted pl-3 py-1">
                    <div className="text-xs">Today, 11:30 AM</div>
                    <div>Email opened</div>
                  </div>
                  <div className="border-l-2 border-muted pl-3 py-1">
                    <div className="text-xs">Yesterday, 2:15 PM</div>
                    <div>Visited website</div>
                  </div>
                  <div className="border-l-2 border-muted pl-3 py-1">
                    <div className="text-xs">Apr 10, 2025</div>
                    <div>Form submitted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
