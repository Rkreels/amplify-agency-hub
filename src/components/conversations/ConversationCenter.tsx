
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Search, 
  Send, 
  Paperclip,
  Smile,
  MoreVertical,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  contactId: string;
  contactName: string;
  type: 'sms' | 'email' | 'call' | 'internal';
  content: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: string[];
}

interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  lastMessage: Message;
  unreadCount: number;
  tags: string[];
  assignedTo: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    contactId: '1',
    contactName: 'Sarah Johnson',
    contactPhone: '+1 (555) 123-4567',
    contactEmail: 'sarah@example.com',
    unreadCount: 2,
    tags: ['VIP', 'Hot Lead'],
    assignedTo: 'John Doe',
    lastMessage: {
      id: '1',
      contactId: '1',
      contactName: 'Sarah Johnson',
      type: 'sms',
      content: 'Hi, I\'m interested in your services. Can we schedule a call?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      direction: 'inbound',
      status: 'delivered'
    }
  },
  {
    id: '2',
    contactId: '2',
    contactName: 'Michael Brown',
    contactPhone: '+1 (555) 987-6543',
    contactEmail: 'michael@example.com',
    unreadCount: 0,
    tags: ['Follow-up'],
    assignedTo: 'Jane Smith',
    lastMessage: {
      id: '2',
      contactId: '2',
      contactName: 'Michael Brown',
      type: 'email',
      content: 'Thank you for the information. I\'ll review and get back to you.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      direction: 'outbound',
      status: 'read'
    }
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    contactId: '1',
    contactName: 'Sarah Johnson',
    type: 'sms',
    content: 'Hi, I saw your ad on Facebook about marketing services.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    direction: 'inbound',
    status: 'delivered'
  },
  {
    id: '2',
    contactId: '1',
    contactName: 'Sarah Johnson',
    type: 'sms',
    content: 'Hi Sarah! Thanks for reaching out. I\'d love to help you with your marketing needs. What specific areas are you looking to improve?',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    direction: 'outbound',
    status: 'read'
  },
  {
    id: '3',
    contactId: '1',
    contactName: 'Sarah Johnson',
    type: 'sms',
    content: 'We need help with lead generation and email marketing automation.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    direction: 'inbound',
    status: 'delivered'
  },
  {
    id: '4',
    contactId: '1',
    contactName: 'Sarah Johnson',
    type: 'sms',
    content: 'Hi, I\'m interested in your services. Can we schedule a call?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    direction: 'inbound',
    status: 'delivered'
  }
];

export function ConversationCenter() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationMessages = messages.filter(msg => 
    msg.contactId === selectedConversation?.contactId
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      contactId: selectedConversation.contactId,
      contactName: selectedConversation.contactName,
      type: 'sms',
      content: newMessage,
      timestamp: new Date(),
      direction: 'outbound',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3" />;
      case 'delivered': return <CheckCheck className="h-3 w-3" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed': return <Clock className="h-3 w-3 text-red-500" />;
    }
  };

  const getMessageTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'sms': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-purple-100 text-purple-800';
      case 'internal': return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border">
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                selectedConversation?.id === conversation.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {conversation.contactName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{conversation.contactName}</h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {conversation.lastMessage.content}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <Badge className={getMessageTypeColor(conversation.lastMessage.type)}>
                        {conversation.lastMessage.type.toUpperCase()}
                      </Badge>
                      {conversation.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedConversation.contactName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversation.contactName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.contactPhone} • {selectedConversation.contactEmail}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.direction === 'outbound'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.direction === 'outbound' && (
                        <div className="opacity-70">
                          {getMessageStatusIcon(message.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <Tabs defaultValue="sms">
                <TabsList className="mb-4">
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="internal">Internal Note</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sms">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[60px] resize-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="absolute bottom-2 left-2 flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="email">
                  <div className="space-y-4">
                    <Input placeholder="Subject" />
                    <Textarea
                      placeholder="Compose your email..."
                      className="min-h-[120px]"
                    />
                    <Button>Send Email</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="internal">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add internal note..."
                      className="min-h-[80px]"
                    />
                    <Button>Add Note</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
