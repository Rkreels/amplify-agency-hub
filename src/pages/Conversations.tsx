
import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
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

interface Conversation {
  id: number;
  contact: string;
  avatar: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  channel: "email" | "sms" | "facebook" | "phone";
  email?: string;
  phone?: string;
  tags?: string[];
  activities?: Array<{
    time: string;
    description: string;
  }>;
}

interface Message {
  id: number;
  sender: string;
  avatar: string;
  initials: string;
  content: string;
  time: string;
  isCustomer: boolean;
}

export default function Conversations() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<number>(3);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
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
      avatar: "",
      initials: "YO",
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
      avatar: "",
      initials: "YO",
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
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      contact: "Sarah Johnson",
      avatar: "",
      initials: "SJ",
      lastMessage: "Thanks for the update on the campaign!",
      time: "10:30 AM",
      unread: 2,
      channel: "email",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 987-6543",
      tags: ["Client", "Marketing"],
      activities: [
        { time: "Today, 10:30 AM", description: "Email received" },
        { time: "Yesterday, 3:15 PM", description: "Campaign sent" },
        { time: "Apr 12, 2025", description: "Meeting scheduled" }
      ]
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
      email: "michael.brown@example.com",
      phone: "+1 (555) 456-7890",
      tags: ["Lead", "Consulting"],
      activities: [
        { time: "Yesterday, 1:45 PM", description: "SMS received" },
        { time: "Apr 11, 2025", description: "Website visit" }
      ]
    },
    {
      id: 3,
      contact: "Emma Davis",
      avatar: "",
      initials: "ED",
      lastMessage: "I'll be available for a call tomorrow",
      time: "Yesterday",
      unread: 1,
      channel: "facebook",
      email: "emma.davis@example.com",
      phone: "+1 (555) 123-4567",
      tags: ["Lead", "E-commerce"],
      activities: [
        { time: "Today, 11:30 AM", description: "Email opened" },
        { time: "Yesterday, 2:15 PM", description: "Visited website" },
        { time: "Apr 10, 2025", description: "Form submitted" }
      ]
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
      email: "james.wilson@example.com",
      phone: "+1 (555) 222-3333",
      tags: ["Client", "Design"],
      activities: [
        { time: "Monday, 9:20 AM", description: "Email received" },
        { time: "Apr 8, 2025", description: "Meeting completed" }
      ]
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
      email: "olivia.smith@example.com",
      phone: "+1 (555) 888-9999",
      tags: ["Lead", "Marketing"],
      activities: [
        { time: "Monday, 3:45 PM", description: "SMS received" },
        { time: "Apr 7, 2025", description: "Downloaded brochure" }
      ]
    },
  ]);

  // Scroll to bottom of messages when a new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter(conversation => {
    if (activeTab === "unread" && conversation.unread === 0) {
      return false;
    }
    
    if (searchQuery) {
      return conversation.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const selectedContact = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeString = `Today, ${hours}:${minutes} ${ampm}`;
    
    const newMessageObj: Message = {
      id: messages.length + 1,
      sender: "You",
      avatar: "",
      initials: "YO",
      content: newMessage,
      time: timeString,
      isCustomer: false,
    };
    
    setMessages([...messages, newMessageObj]);
    
    // Update the conversation last message
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, time: "Just now", unread: 0 }
          : conv
      )
    );
    
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedContact?.contact}`,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNewContact = () => {
    toast({
      title: "Create New Contact",
      description: "The new contact form would open here.",
    });
  };

  const handleConversationClick = (id: number) => {
    setSelectedConversation(id);
    // Mark as read when selecting
    setConversations(
      conversations.map(conv => 
        conv.id === id
          ? { ...conv, unread: 0 }
          : conv
      )
    );
  };

  const handleFilterClick = () => {
    toast({
      description: "Filter options would appear here",
    });
  };

  const handleChannelClick = (type: string) => {
    toast({
      description: `New ${type} conversation would start here`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

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
        <Button onClick={handleNewContact}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="flex-1">
            <div className="px-3 pt-3">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="assigned" className="flex-1">Assigned</TabsTrigger>
              </TabsList>
            </div>
            <div className="px-3 pt-3 flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={handleFilterClick}>
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filter
              </Button>
              <div className="flex ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleChannelClick('text')}
                >
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleChannelClick('email')}
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleChannelClick('facebook')}
                >
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => handleChannelClick('other')}
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1">
              <TabsContent value="all" className="m-0">
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                        conversation.id === selectedConversation ? "bg-muted/50" : ""
                      }`}
                      onClick={() => handleConversationClick(conversation.id)}
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
                              {channelIcons[conversation.channel]}
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
                  {filteredConversations.length === 0 && (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium mb-1">No conversations found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <div className="divide-y">
                  {filteredConversations
                    .filter((conversation) => conversation.unread > 0)
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                          conversation.id === selectedConversation ? "bg-muted/50" : ""
                        }`}
                        onClick={() => handleConversationClick(conversation.id)}
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
                                {channelIcons[conversation.channel]}
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
                  {filteredConversations.filter(c => c.unread > 0).length === 0 && (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium mb-1">No unread conversations</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        All caught up!
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="assigned" className="m-0">
                <div className="p-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium mb-1">No assigned conversations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Conversations assigned to you will appear here
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab("all")}
                  >
                    View all conversations
                  </Button>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>

        {/* Conversation View */}
        <Card className="lg:col-span-8 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.contact} />
                    <AvatarFallback>{selectedContact.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedContact.contact}</div>
                    <div className="text-xs text-muted-foreground">Last active 5 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => toast({ description: "Calling " + selectedContact.contact })}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => toast({ description: "Schedule a meeting with " + selectedContact.contact })}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => toast({ description: "More options" })}
                  >
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
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => toast({ description: "Attachment options" })}
                      >
                        <PaperclipIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={() => toast({ description: "Emoji picker" })}
                      >
                        <SmileIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
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
                        <div className="text-sm">{selectedContact.email}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Phone</div>
                        <div className="text-sm">{selectedContact.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Tags</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedContact.tags?.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">Recent Activity</h3>
                    <div className="space-y-3 text-sm">
                      {selectedContact.activities?.map((activity, index) => (
                        <div key={index} className="border-l-2 border-muted pl-3 py-1">
                          <div className="text-xs">{activity.time}</div>
                          <div>{activity.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-lg font-medium mb-2">No conversation selected</h2>
                <p className="text-muted-foreground mb-4">
                  Select a conversation from the list to view messages
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
