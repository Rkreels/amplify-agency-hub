
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Mail, 
  Plus, 
  Clock, 
  Users, 
  Eye, 
  Edit, 
  Copy, 
  Trash2,
  Play,
  Pause,
  BarChart3,
  Settings,
  Send,
  Calendar,
  Target,
  ArrowDown,
  ArrowRight
} from 'lucide-react';

interface EmailTemplate {
  id: string;
  subject: string;
  content: string;
  delay: {
    amount: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
  openRate?: number;
  clickRate?: number;
}

interface EmailSequence {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  emails: EmailTemplate[];
  stats: {
    subscribers: number;
    totalSent: number;
    avgOpenRate: number;
    avgClickRate: number;
    revenue: number;
  };
  createdAt: Date;
}

export function EmailSequenceBuilder() {
  const [sequences, setSequences] = useState<EmailSequence[]>([
    {
      id: 'seq-1',
      name: 'Welcome Series',
      description: 'Onboard new subscribers with a 5-email welcome sequence',
      isActive: true,
      emails: [
        {
          id: 'email-1',
          subject: 'Welcome to our community!',
          content: 'Thank you for joining us...',
          delay: { amount: 0, unit: 'minutes' },
          openRate: 45.2,
          clickRate: 8.7
        },
        {
          id: 'email-2',
          subject: 'Here\'s what you can expect',
          content: 'Over the next few days...',
          delay: { amount: 1, unit: 'days' },
          openRate: 38.9,
          clickRate: 6.2
        },
        {
          id: 'email-3',
          subject: 'Your first steps to success',
          content: 'Let\'s get you started...',
          delay: { amount: 3, unit: 'days' },
          openRate: 34.1,
          clickRate: 5.8
        }
      ],
      stats: {
        subscribers: 1247,
        totalSent: 3741,
        avgOpenRate: 39.4,
        avgClickRate: 6.9,
        revenue: 15420
      },
      createdAt: new Date('2024-01-15')
    }
  ]);

  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(sequences[0]);
  const [activeTab, setActiveTab] = useState('builder');
  const [newEmail, setNewEmail] = useState<Partial<EmailTemplate>>({
    delay: { amount: 1, unit: 'days' }
  });

  const addEmailToSequence = () => {
    if (!selectedSequence || !newEmail.subject || !newEmail.content) {
      toast.error('Please fill in all email fields');
      return;
    }

    const email: EmailTemplate = {
      id: `email-${Date.now()}`,
      subject: newEmail.subject,
      content: newEmail.content,
      delay: newEmail.delay || { amount: 1, unit: 'days' },
      conditions: newEmail.conditions
    };

    const updatedSequence = {
      ...selectedSequence,
      emails: [...selectedSequence.emails, email]
    };

    setSequences(sequences.map(seq => 
      seq.id === selectedSequence.id ? updatedSequence : seq
    ));
    setSelectedSequence(updatedSequence);
    setNewEmail({ delay: { amount: 1, unit: 'days' } });
    toast.success('Email added to sequence');
  };

  const removeEmailFromSequence = (emailId: string) => {
    if (!selectedSequence) return;

    const updatedSequence = {
      ...selectedSequence,
      emails: selectedSequence.emails.filter(email => email.id !== emailId)
    };

    setSequences(sequences.map(seq => 
      seq.id === selectedSequence.id ? updatedSequence : seq
    ));
    setSelectedSequence(updatedSequence);
    toast.success('Email removed from sequence');
  };

  const toggleSequenceStatus = (sequenceId: string) => {
    setSequences(sequences.map(seq => 
      seq.id === sequenceId ? { ...seq, isActive: !seq.isActive } : seq
    ));
    toast.success('Sequence status updated');
  };

  const createNewSequence = () => {
    const newSequence: EmailSequence = {
      id: `seq-${Date.now()}`,
      name: 'New Email Sequence',
      description: 'Add a description for your sequence',
      isActive: false,
      emails: [],
      stats: {
        subscribers: 0,
        totalSent: 0,
        avgOpenRate: 0,
        avgClickRate: 0,
        revenue: 0
      },
      createdAt: new Date()
    };

    setSequences([...sequences, newSequence]);
    setSelectedSequence(newSequence);
    toast.success('New sequence created');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Sequence Builder</h2>
          <p className="text-gray-600">Create and manage automated email campaigns</p>
        </div>
        <Button onClick={createNewSequence}>
          <Plus className="h-4 w-4 mr-2" />
          New Sequence
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sequences List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Email Sequences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sequences.map((sequence) => (
              <div
                key={sequence.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedSequence?.id === sequence.id 
                    ? 'bg-blue-50 border-2 border-blue-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedSequence(sequence)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{sequence.name}</h3>
                  <Badge variant={sequence.isActive ? "default" : "secondary"}>
                    {sequence.isActive ? 'Active' : 'Draft'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">{sequence.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{sequence.emails.length} emails</span>
                  <span>{sequence.stats.subscribers} subscribers</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedSequence ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="builder">
                  <Edit className="h-4 w-4 mr-2" />
                  Builder
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{selectedSequence.name}</CardTitle>
                      <p className="text-sm text-gray-600">{selectedSequence.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={selectedSequence.isActive}
                        onCheckedChange={() => toggleSequenceStatus(selectedSequence.id)}
                      />
                      <Label>Active</Label>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Visual Email Flow */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Trigger: Contact Added</p>
                          <p className="text-sm text-gray-600">When someone joins your list</p>
                        </div>
                      </div>

                      {selectedSequence.emails.map((email, index) => (
                        <div key={email.id} className="space-y-2">
                          <div className="flex justify-center">
                            <ArrowDown className="h-4 w-4 text-gray-400" />
                          </div>
                          
                          {email.delay.amount > 0 && (
                            <div className="flex items-center justify-center">
                              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 rounded-full">
                                <Clock className="h-4 w-4 text-orange-600" />
                                <span className="text-sm text-orange-600">
                                  Wait {email.delay.amount} {email.delay.unit}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-center">
                            <ArrowDown className="h-4 w-4 text-gray-400" />
                          </div>

                          <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium">Email {index + 1}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => removeEmailFromSequence(email.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <h3 className="font-medium mb-1">{email.subject}</h3>
                              <p className="text-sm text-gray-600 mb-3">
                                {email.content.substring(0, 100)}...
                              </p>
                              {(email.openRate || email.clickRate) && (
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3 text-blue-500" />
                                    <span>{email.openRate}% opens</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Target className="h-3 w-3 text-green-500" />
                                    <span>{email.clickRate}% clicks</span>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}

                      {/* Add New Email */}
                      <div className="flex justify-center">
                        <ArrowDown className="h-4 w-4 text-gray-400" />
                      </div>

                      <Card className="border-2 border-dashed border-gray-300">
                        <CardContent className="p-6">
                          <h3 className="font-medium mb-4">Add New Email</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Wait Duration</Label>
                                <div className="flex space-x-2">
                                  <Input
                                    type="number"
                                    value={newEmail.delay?.amount || ''}
                                    onChange={(e) => setNewEmail({
                                      ...newEmail,
                                      delay: {
                                        ...newEmail.delay!,
                                        amount: parseInt(e.target.value) || 0
                                      }
                                    })}
                                    className="w-20"
                                  />
                                  <Select
                                    value={newEmail.delay?.unit}
                                    onValueChange={(value) => setNewEmail({
                                      ...newEmail,
                                      delay: {
                                        ...newEmail.delay!,
                                        unit: value as any
                                      }
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="minutes">Minutes</SelectItem>
                                      <SelectItem value="hours">Hours</SelectItem>
                                      <SelectItem value="days">Days</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Subject Line</Label>
                              <Input
                                value={newEmail.subject || ''}
                                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                                placeholder="Enter email subject"
                              />
                            </div>
                            <div>
                              <Label>Email Content</Label>
                              <Textarea
                                value={newEmail.content || ''}
                                onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                                placeholder="Write your email content..."
                                rows={4}
                              />
                            </div>
                            <Button onClick={addEmailToSequence}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Email
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Subscribers</p>
                          <p className="text-lg font-bold">{selectedSequence.stats.subscribers}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Send className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Emails Sent</p>
                          <p className="text-lg font-bold">{selectedSequence.stats.totalSent}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600">Avg Open Rate</p>
                          <p className="text-lg font-bold">{selectedSequence.stats.avgOpenRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-sm text-gray-600">Avg Click Rate</p>
                          <p className="text-lg font-bold">{selectedSequence.stats.avgClickRate}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedSequence.emails.map((email, index) => (
                        <div key={email.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium">Email {index + 1}: {email.subject}</h3>
                            <p className="text-sm text-gray-600">
                              Sent after {email.delay.amount} {email.delay.unit}
                            </p>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{email.openRate || 'N/A'}%</p>
                              <p className="text-gray-500">Open Rate</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{email.clickRate || 'N/A'}%</p>
                              <p className="text-gray-500">Click Rate</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sequence Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Sequence Name</Label>
                      <Input value={selectedSequence.name} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={selectedSequence.description} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={selectedSequence.isActive} />
                      <Label>Active Sequence</Label>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No sequence selected</h3>
                <p className="text-gray-600 mb-4">Select an email sequence from the left to start editing</p>
                <Button onClick={createNewSequence}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Sequence
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
