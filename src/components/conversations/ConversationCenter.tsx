
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Phone, 
  Video, 
  Mail, 
  MessageSquare, 
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Star,
  Archive,
  Trash2,
  Filter,
  Plus,
  PhoneCall,
  VideoIcon,
  Clock,
  CheckCheck,
  User
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'sent' | 'received';
  channel: 'sms' | 'email' | 'chat' | 'whatsapp' | 'facebook';
  read: boolean;
}

interface Conversation {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  channel: 'sms' | 'email' | 'chat' | 'whatsapp' | 'facebook';
  status: 'active' | 'archived' | 'spam';
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  assignedTo?: string;
}

export function ConversationCenter() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations: Conversation[] = [
    {
      id: '1',
      contactName: 'Sarah Johnson',
      contactEmail: 'sarah@example.com',
      contactPhone: '+1 (555) 123-4567',
      lastMessage: 'Thanks for the quick response! I\'ll get back to you soon.',
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 2,
      channel: 'sms',
      status: 'active',
      priority: 'high',
      tags: ['lead', 'interested'],
      assignedTo: 'John Doe'
    },
    {
      id: '2',
      contactName: 'Michael Chen',
      contactEmail: 'michael@example.com',
      contactPhone: '+1 (555) 234-5678',
      lastMessage: 'Can we schedule a call for tomorrow?',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      channel: 'email',
      status: 'active',
      priority: 'medium',
      tags: ['customer', 'support'],
      assignedTo: 'Jane Smith'
    },
    {
      id: '3',
      contactName: 'Emily Rodriguez',
      contactEmail: 'emily@example.com',
      contactPhone: '+1 (555) 345-6789',
      lastMessage: 'I\'m interested in your premium package.',
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 1,
      channel: 'whatsapp',
      status: 'active',
      priority: 'high',
      tags: ['lead', 'premium'],
      assignedTo: 'John Doe'
    },
    {
      id: '4',
      contactName: 'David Kim',
      contactEmail: 'david@example.com',
      contactPhone: '+1 (555) 456-7890',
      lastMessage: 'Thank you for the excellent service!',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
      channel: 'facebook',
      status: 'active',
      priority: 'low',
      tags: ['customer', 'satisfied'],
      assignedTo: 'Jane Smith'
    }
  ];

  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        senderId: 'sarah',
        senderName: 'Sarah Johnson',
        content: 'Hi! I\'m interested in your services. Can you tell me more about your pricing?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'received',
        channel: 'sms',
        read: true
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        content: 'Hi Sarah! I\'d be happy to help you with that. We have several packages available...',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: 'sent',
        channel: 'sms',
        read: true
      },
      {
        id: '3',
        senderId: 'sarah',
        senderName: 'Sarah Johnson',
        content: 'That sounds great! Can we schedule a call to discuss this further?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'received',
        channel: 'sms',
        read: true
      },
      {
        id: '4',
        senderId: 'sarah',
        senderName: 'Sarah Johnson',
        content: 'Thanks for the quick response! I\'ll get back to you soon.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        type: 'received',
        channel: 'sms',
        read: false
      }
    ]
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return MessageSquare;
      case 'email': return Mail;
      case 'whatsapp': return MessageSquare;
      case 'facebook': return MessageSquare;
      default: return MessageSquare;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'sms': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-green-100 text-green-800';
      case 'whatsapp': return 'bg-green-100 text-green-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // Add message logic here
      setNewMessage("");
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'unread':
        return matchesSearch && conv.unreadCount > 0;
      case 'high':
        return matchesSearch && conv.priority === 'high';
      case 'archived':
        return matchesSearch && conv.status === 'archived';
      default:
        return matchesSearch && conv.status === 'active';
    }
  });

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  return (
    <div className="flex h-[calc(100vh-200px)] bg-background">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 m-2">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
            <TabsTrigger value="high" className="text-xs">High</TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredConversations.map((conversation) => {
              const ChannelIcon = getChannelIcon(conversation.channel);
              
              return (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id 
                      ? 'bg-primary/10 border-primary/20 border' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.contactName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.contactName}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Badge className={`${getChannelColor(conversation.channel)} text-xs`}>
                            <ChannelIcon className="h-3 w-3 mr-1" />
                            {conversation.channel}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className={`${getPriorityColor(conversation.priority)} text-xs`}>
                            {conversation.priority}
                          </Badge>
                          {conversation.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.avatar} />
                    <AvatarFallback>
                      {selectedConv.contactName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConv.contactName}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{selectedConv.contactEmail}</span>
                      <span>•</span>
                      <span>{selectedConv.contactPhone}</span>
                      {selectedConv.assignedTo && (
                        <>
                          <span>•</span>
                          <span>Assigned to {selectedConv.assignedTo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.type === 'sent' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    } rounded-lg p-3`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-between mt-2 text-xs ${
                        message.type === 'sent' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.type === 'sent' && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
