
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Send, 
  Smile, 
  Paperclip, 
  Phone, 
  Video,
  MessageSquare,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  Globe,
  Filter,
  Archive,
  Tag,
  Clock,
  CheckCheck,
  Mic,
  Image,
  FileText,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';
import { useConversationStore, type Conversation, type Message } from '@/store/useConversationStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const channelIcons = {
  sms: MessageSquare,
  email: Mail,
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  webchat: Globe
};

const channelColors = {
  sms: 'text-green-600',
  email: 'text-blue-600',
  facebook: 'text-blue-700',
  instagram: 'text-pink-600',
  whatsapp: 'text-green-500',
  webchat: 'text-purple-600'
};

export function ConversationCenter() {
  const {
    conversations,
    selectedConversationId,
    searchQuery,
    channelFilter,
    statusFilter,
    isTyping,
    addMessage,
    markAsRead,
    setSelectedConversation,
    setSearchQuery,
    setChannelFilter,
    setStatusFilter,
    setTyping,
    getFilteredConversations,
    getSelectedConversation,
    addConversation,
    updateConversation,
    deleteConversation
  } = useConversationStore();

  const { announceFeature } = useVoiceTraining();
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const [newConversationData, setNewConversationData] = useState({
    contactName: '',
    channel: 'sms' as const,
    initialMessage: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedConversation = getSelectedConversation();

  useEffect(() => {
    announceFeature(
      'Conversation Center',
      'Manage all your conversations from multiple channels in one place. Send messages, make calls, and track customer interactions across SMS, email, social media, and more.'
    );
  }, [announceFeature]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversationId) return;

    const newMessage: Omit<Message, 'id'> = {
      content: messageText,
      timestamp: new Date(),
      sender: 'user',
      type: 'text',
      status: 'sent'
    };

    addMessage(selectedConversationId, newMessage);
    setMessageText('');
    
    // Simulate typing indicator
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      // Simulate auto-response for demo
      if (Math.random() > 0.7) {
        const autoReply: Omit<Message, 'id'> = {
          content: 'Thanks for your message! I\'ll get back to you shortly.',
          timestamp: new Date(),
          sender: 'contact',
          type: 'text',
          status: 'delivered'
        };
        addMessage(selectedConversationId, autoReply);
      }
    }, 2000);

    toast.success('Message sent');
  };

  const handleCreateConversation = () => {
    if (!newConversationData.contactName.trim()) {
      toast.error('Contact name is required');
      return;
    }

    const newConversation: Omit<Conversation, 'id'> = {
      contactId: Date.now().toString(),
      contactName: newConversationData.contactName,
      channel: newConversationData.channel,
      messages: newConversationData.initialMessage ? [{
        content: newConversationData.initialMessage,
        timestamp: new Date(),
        sender: 'user',
        type: 'text',
        status: 'sent'
      }] : [],
      unreadCount: 0,
      lastMessageAt: new Date(),
      status: 'active',
      tags: [],
      notes: ''
    };

    addConversation(newConversation);
    setNewConversationData({ contactName: '', channel: 'sms', initialMessage: '' });
    setShowNewConversationDialog(false);
    toast.success('New conversation created');
  };

  const handleDeleteConversation = (conversationId: string) => {
    deleteConversation(conversationId);
    if (selectedConversationId === conversationId) {
      setSelectedConversation(null);
    }
    toast.success('Conversation deleted');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation.id);
    if (conversation.unreadCount > 0) {
      markAsRead(conversation.id);
    }
  };

  const handleCall = () => {
    if (selectedConversation) {
      toast.success(`Calling ${selectedConversation.contactName}...`);
    }
  };

  const handleVideoCall = () => {
    if (selectedConversation) {
      toast.success(`Starting video call with ${selectedConversation.contactName}...`);
    }
  };

  const handleArchiveConversation = () => {
    if (selectedConversationId) {
      updateConversation(selectedConversationId, { status: 'closed' });
      toast.success('Conversation archived');
    }
  };

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
    const ChannelIcon = channelIcons[conversation.channel];
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    return (
      <div
        className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
          selectedConversationId === conversation.id ? 'bg-muted' : ''
        }`}
        onClick={() => handleSelectConversation(conversation)}
      >
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={conversation.contactAvatar} />
              <AvatarFallback>
                {conversation.contactName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <ChannelIcon className={`h-4 w-4 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 ${channelColors[conversation.channel]}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-medium truncate">{conversation.contactName}</h4>
              <div className="flex items-center gap-2">
                {conversation.unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    {conversation.unreadCount}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {lastMessage?.timestamp.toLocaleTimeString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conversation.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            {lastMessage && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {lastMessage.sender === 'user' ? 'You: ' : ''}
                {lastMessage.content}
              </p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={conversation.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {conversation.status}
              </Badge>
              {conversation.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MessageItem = ({ message }: { message: Message }) => {
    const isUser = message.sender === 'user';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          <p className="text-sm">{message.content}</p>
          <div className={`flex items-center justify-between mt-1 text-xs ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            <span>{message.timestamp.toLocaleTimeString()}</span>
            {isUser && (
              <CheckCheck className={`h-3 w-3 ml-2 ${
                message.status === 'read' ? 'text-blue-400' : ''
              }`} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-card">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversations</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getFilteredConversations().length}</Badge>
              <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Contact name"
                        value={newConversationData.contactName}
                        onChange={(e) => setNewConversationData(prev => ({ ...prev, contactName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Select
                        value={newConversationData.channel}
                        onValueChange={(value) => setNewConversationData(prev => ({ ...prev, channel: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="webchat">Web Chat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Initial message (optional)"
                        value={newConversationData.initialMessage}
                        onChange={(e) => setNewConversationData(prev => ({ ...prev, initialMessage: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleCreateConversation} className="w-full">
                      Create Conversation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="webchat">Web Chat</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {getFilteredConversations().map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.contactAvatar} />
                    <AvatarFallback>
                      {selectedConversation.contactName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedConversation.contactName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {React.createElement(channelIcons[selectedConversation.channel], {
                        className: `h-4 w-4 mr-1 ${channelColors[selectedConversation.channel]}`
                      })}
                      {selectedConversation.channel.toUpperCase()}
                      {isTyping && (
                        <span className="ml-2 flex items-center">
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                          <span className="ml-2">typing...</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCall}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleVideoCall}>
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleArchiveConversation}>
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    rows={2}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={isRecording ? 'bg-red-500 text-white' : ''}
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
              <p className="text-muted-foreground">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
