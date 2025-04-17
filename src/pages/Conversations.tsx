
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
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

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
  
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [showNewContactDialog, setShowNewContactDialog] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  const [filterOptions, setFilterOptions] = useState({
    unread: false,
    email: false,
    sms: false,
    facebook: false,
    phone: false,
  });
  
  const [newContactForm, setNewContactForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showTagsDialog, setShowTagsDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  
  const [availableTags, setAvailableTags] = useState([
    "Client", "Lead", "Marketing", "Support", "Consulting", 
    "E-commerce", "Design", "Development", "Paid", "Free Trial"
  ]);
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  
  const [campaigns, setCampaigns] = useState([
    "Summer Sale 2025", "Product Launch", "Customer Feedback", 
    "Monthly Newsletter", "Webinar Invitation"
  ]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  
  // New conversation dialog state
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [conversationType, setConversationType] = useState<"email" | "sms" | "facebook" | "other">("email");
  
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Init selected tags when a conversation is selected
  useEffect(() => {
    const contact = conversations.find(c => c.id === selectedConversation);
    if (contact && contact.tags) {
      setSelectedTags(contact.tags);
    } else {
      setSelectedTags([]);
    }
  }, [selectedConversation, conversations]);

  const filteredConversations = conversations.filter(conversation => {
    if (activeTab === "unread" && conversation.unread === 0) {
      return false;
    }
    
    if (searchQuery) {
      return conversation.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
             conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    if (filterOptions.email || filterOptions.sms || filterOptions.facebook || filterOptions.phone) {
      if (filterOptions.email && conversation.channel === "email") return true;
      if (filterOptions.sms && conversation.channel === "sms") return true;
      if (filterOptions.facebook && conversation.channel === "facebook") return true;
      if (filterOptions.phone && conversation.channel === "phone") return true;
      return false;
    }
    
    return true;
  });

  const selectedContact = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const timeString = `Today, ${hours}:${minutes} ${ampm}`;
    
    const content = attachments.length > 0 
      ? `${newMessage} ${attachments.map(a => `[Attachment: ${a}]`).join(" ")}`
      : newMessage;
    
    const newMessageObj: Message = {
      id: messages.length + 1,
      sender: "You",
      avatar: "",
      initials: "YO",
      content: content,
      time: timeString,
      isCustomer: false,
    };
    
    setMessages([...messages, newMessageObj]);
    
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, time: "Just now", unread: 0 }
          : conv
      )
    );
    
    setNewMessage("");
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowAttachmentOptions(false);
    
    toast({
      title: "Message sent",
      description: `Message sent to ${selectedContact?.contact}`,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNewContact = () => {
    setShowNewContactDialog(true);
  };

  const handleCreateNewContact = () => {
    if (!newContactForm.name || !newContactForm.email) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and email for the new contact.",
        variant: "destructive",
      });
      return;
    }
    
    const newContact: Conversation = {
      id: conversations.length + 1,
      contact: newContactForm.name,
      avatar: "",
      initials: newContactForm.name.split(' ').map(n => n[0]).join(''),
      lastMessage: "New contact created",
      time: "Just now",
      unread: 0,
      channel: "email",
      email: newContactForm.email,
      phone: newContactForm.phone,
      tags: ["New Contact"],
      activities: [
        { time: "Just now", description: "Contact created" }
      ]
    };
    
    setConversations([newContact, ...conversations]);
    setSelectedConversation(newContact.id);
    
    setNewContactForm({ name: "", email: "", phone: "" });
    setShowNewContactDialog(false);
    
    toast({
      title: "Contact created",
      description: `New contact ${newContactForm.name} has been created`,
    });
  };

  const handleConversationClick = (id: number) => {
    setSelectedConversation(id);
    setConversations(
      conversations.map(conv => 
        conv.id === id
          ? { ...conv, unread: 0 }
          : conv
      )
    );
  };

  const handleFilterClick = () => {
    setShowFilterPopover(!showFilterPopover);
  };

  const applyFilters = () => {
    setShowFilterPopover(false);
    toast({
      description: "Filters applied",
    });
  };

  const resetFilters = () => {
    setFilterOptions({
      unread: false,
      email: false,
      sms: false,
      facebook: false,
      phone: false,
    });
    setShowFilterPopover(false);
    toast({
      description: "Filters reset",
    });
  };

  const handleChannelClick = (type: "text" | "email" | "facebook" | "other") => {
    setConversationType(type);
    setShowNewConversationDialog(true);
  };

  const handleAddEmoji = (emoji: string) => {
    setNewMessage(prevMessage => prevMessage + emoji);
    setShowEmojiPicker(false);
  };

  const handleAddAttachment = (type: string) => {
    const attachmentTypes = {
      image: "image.jpg",
      document: "document.pdf",
      contact: "contact.vcf",
      location: "location.pin"
    };
    
    const attachmentName = attachmentTypes[type as keyof typeof attachmentTypes] || "file.txt";
    setAttachments([...attachments, attachmentName]);
    setShowAttachmentOptions(false);
    
    toast({
      description: `${attachmentName} attached to message`,
    });
  };

  const handleScheduleCall = () => {
    setShowScheduleDialog(true);
  };
  
  const confirmScheduleCall = () => {
    // Add a new activity to the contact
    if (selectedContact) {
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      setConversations(
        conversations.map(conv => 
          conv.id === selectedConversation
            ? { 
                ...conv, 
                activities: [
                  { 
                    time: `${dateString}`, 
                    description: "Call scheduled" 
                  },
                  ...(conv.activities || [])
                ]
              }
            : conv
        )
      );
    }
    
    setShowScheduleDialog(false);
    
    toast({
      title: "Call scheduled",
      description: `Call with ${selectedContact?.contact} has been scheduled`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // View profile handler
  const handleViewProfile = () => {
    setShowProfileDialog(true);
  };

  // Add tags handler
  const handleAddTags = () => {
    if (selectedContact && selectedContact.tags) {
      setSelectedTags([...selectedContact.tags]);
    } else {
      setSelectedTags([]);
    }
    setShowTagsDialog(true);
  };

  // Save tags
  const saveTags = () => {
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { ...conv, tags: selectedTags }
          : conv
      )
    );
    
    // Add activity for tag changes
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { 
              ...conv, 
              tags: selectedTags,
              activities: [
                { 
                  time: `${dateString}`, 
                  description: "Tags updated" 
                },
                ...(conv.activities || [])
              ]
            }
          : conv
      )
    );
    
    setShowTagsDialog(false);
    toast({
      description: "Tags updated successfully",
    });
  };

  // Add new tag
  const addNewTag = () => {
    if (!newTag.trim()) return;
    
    setAvailableTags([...availableTags, newTag]);
    setSelectedTags([...selectedTags, newTag]);
    setNewTag("");
    
    toast({
      description: `New tag "${newTag}" created`,
    });
  };

  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add to campaign handler
  const handleAddToCampaign = () => {
    setSelectedCampaign("");
    setShowCampaignDialog(true);
  };

  // Save campaign association
  const saveCampaign = () => {
    if (!selectedCampaign) {
      toast({
        title: "No campaign selected",
        description: "Please select a campaign to continue",
        variant: "destructive",
      });
      return;
    }
    
    // Add activity for campaign addition
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { 
              ...conv, 
              activities: [
                { 
                  time: `${dateString}`, 
                  description: `Added to campaign: ${selectedCampaign}` 
                },
                ...(conv.activities || [])
              ]
            }
          : conv
      )
    );
    
    setShowCampaignDialog(false);
    toast({
      title: "Added to campaign",
      description: `Contact added to ${selectedCampaign} campaign`,
    });
  };

  // Block contact handler
  const handleBlockContact = () => {
    setShowBlockConfirmation(true);
  };

  // Confirm block contact
  const confirmBlockContact = () => {
    // Add activity for blocking
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { 
              ...conv, 
              activities: [
                { 
                  time: `${dateString}`, 
                  description: "Contact blocked" 
                },
                ...(conv.activities || [])
              ]
            }
          : conv
      )
    );
    
    setShowBlockConfirmation(false);
    toast({
      title: "Contact blocked",
      description: `${selectedContact?.contact} has been blocked`,
    });
  };

  // Start new conversation handler
  const startNewConversation = () => {
    if (!selectedContact) return;
    
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation
          ? { 
              ...conv, 
              activities: [
                { 
                  time: `${dateString}`, 
                  description: `New ${conversationType} conversation started` 
                },
                ...(conv.activities || [])
              ]
            }
          : conv
      )
    );
    
    setShowNewConversationDialog(false);
    toast({
      title: `New ${conversationType} conversation`,
      description: `Started a new ${conversationType} conversation with ${selectedContact?.contact}`,
    });
  };

  const channelIcons = {
    email: <Mail className="h-4 w-4" />,
    sms: <MessageSquare className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
  };

  const emojis = ["😊", "👍", "🙏", "❤️", "😂", "🎉", "👋", "🔥", "✅", "⭐"];

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
              <Popover open={showFilterPopover} onOpenChange={setShowFilterPopover}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8" onClick={handleFilterClick}>
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Filter Conversations</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-unread" 
                          checked={filterOptions.unread}
                          onCheckedChange={(checked) => 
                            setFilterOptions({...filterOptions, unread: checked as boolean})
                          }
                        />
                        <label htmlFor="filter-unread" className="text-sm">Unread only</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-email" 
                          checked={filterOptions.email}
                          onCheckedChange={(checked) => 
                            setFilterOptions({...filterOptions, email: checked as boolean})
                          }
                        />
                        <label htmlFor="filter-email" className="text-sm">Email</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-sms" 
                          checked={filterOptions.sms}
                          onCheckedChange={(checked) => 
                            setFilterOptions({...filterOptions, sms: checked as boolean})
                          }
                        />
                        <label htmlFor="filter-sms" className="text-sm">SMS</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-facebook" 
                          checked={filterOptions.facebook}
                          onCheckedChange={(checked) => 
                            setFilterOptions({...filterOptions, facebook: checked as boolean})
                          }
                        />
                        <label htmlFor="filter-facebook" className="text-sm">Facebook</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="filter-phone" 
                          checked={filterOptions.phone}
                          onCheckedChange={(checked) => 
                            setFilterOptions({...filterOptions, phone: checked as boolean})
                          }
                        />
                        <label htmlFor="filter-phone" className="text-sm">Phone</label>
                      </div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button size="sm" variant="outline" onClick={resetFilters}>Reset</Button>
                      <Button size="sm" onClick={applyFilters}>Apply</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
                    onClick={handleScheduleCall}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleViewProfile}>
                        View profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleAddTags}>
                        Add tags
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleAddToCampaign}>
                        Add to campaign
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleBlockContact}>
                        Block contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    {attachments.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {attachments.map((attachment, index) => (
                          <div key={index} className="bg-muted rounded px-2 py-1 text-xs flex items-center">
                            <span>{attachment}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-4 w-4 p-0 ml-1"
                              onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                            >
                              <span>×</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Popover open={showAttachmentOptions} onOpenChange={setShowAttachmentOptions}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9"
                          >
                            <PaperclipIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48" align="start" alignOffset={20}>
                          <div className="space-y-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => handleAddAttachment('image')}
                            >
                              Image
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => handleAddAttachment('document')}
                            >
                              Document
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => handleAddAttachment('contact')}
                            >
                              Contact
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => handleAddAttachment('location')}
                            >
                              Location
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Input
                        placeholder="Type your message..."
                        className="flex-1"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-9 w-9"
                          >
                            <SmileIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48" align="end" alignOffset={20}>
                          <div className="grid grid-cols-5 gap-2">
                            {emojis.map((emoji, index) => (
                              <Button 
                                key={index} 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleAddEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button 
                        size="icon" 
                        className="h-9 w-9"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() && attachments.length === 0}
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

      {/* New Contact Dialog */}
      <Dialog open={showNewContactDialog} onOpenChange={setShowNewContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Contact</DialogTitle>
            <DialogDescription>
              Add a new contact to your conversations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newContactForm.name}
                onChange={(e) => setNewContactForm({...newContactForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newContactForm.email}
                onChange={(e) => setNewContactForm({...newContactForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                value={newContactForm.phone}
                onChange={(e) => setNewContactForm({...newContactForm, phone: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewContact}>
              Create Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Call Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Call</DialogTitle>
            <DialogDescription>
              Set up a call with {selectedContact?.contact}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time
              </label>
              <Input
                id="time"
                type="time"
                defaultValue="09:00"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">
                Duration
              </label>
              <select 
                id="duration" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="15">15 minutes</option>
                <option value="30" selected>30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Input
                id="notes"
                placeholder="Call agenda..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmScheduleCall}>
              Schedule Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Profile</DialogTitle>
            <DialogDescription>
              View details for {selectedContact?.contact}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedContact && (
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.contact} />
                    <AvatarFallback className="text-xl">{selectedContact.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Name</div>
                    <div className="text-lg">{selectedContact.contact}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div>{selectedContact.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Phone</div>
                    <div>{selectedContact.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Tags</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedContact.tags?.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Preferred Channel</div>
                    <div className="flex items-center gap-2 mt-1">
                      {channelIcons[selectedContact.channel]}
                      <span className="capitalize">{selectedContact.channel}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProfileDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tags Dialog */}
      <Dialog open={showTagsDialog} onOpenChange={setShowTagsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Add or remove tags for {selectedContact?.contact}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Selected Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-4 w-4 p-0"
                        onClick={() => toggleTag(tag)}
                      >
                        <span>×</span>
                      </Button>
                    </Badge>
                  ))}
                  {selectedTags.length === 0 && (
                    <div className="text-muted-foreground text-sm">No tags selected</div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Available Tags
                </label>
                <div className="flex flex-wrap gap-2 border rounded-md p-2 max-h-40 overflow-y-auto">
                  {availableTags
                    .filter(tag => !selectedTags.includes(tag))
                    .map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Create new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                />
                <Button onClick={addNewTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTags}>
              Save Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Campaign</DialogTitle>
            <DialogDescription>
              Add {selectedContact?.contact} to a marketing campaign
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Select Campaign
                </label>
                <select 
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map(campaign => (
                    <option key={campaign} value={campaign}>{campaign}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveCampaign} disabled={!selectedCampaign}>
              Add to Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Contact Confirmation */}
      <Dialog open={showBlockConfirmation} onOpenChange={setShowBlockConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block Contact</DialogTitle>
            <DialogDescription>
              Are you sure you want to block {selectedContact?.contact}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Blocking this contact will prevent them from sending you messages. They will not be notified that they have been blocked.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBlockContact}>
              Block Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Conversation Dialog */}
      <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New {conversationType.charAt(0).toUpperCase() + conversationType.slice(1)} Conversation</DialogTitle>
            <DialogDescription>
              Start a new conversation with {selectedContact?.contact}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Message
                </label>
                <Input
                  placeholder="Type your message..."
                  autoFocus
                />
              </div>
              {conversationType === 'email' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      placeholder="Email subject..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="cc" />
                    <label
                      htmlFor="cc"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Send a copy to myself
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewConversationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={startNewConversation}>
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
