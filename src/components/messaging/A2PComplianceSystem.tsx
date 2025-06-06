
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Phone, 
  MessageSquare,
  FileText,
  Settings,
  UserCheck,
  Building
} from 'lucide-react';

interface A2PCampaign {
  id: string;
  name: string;
  useCase: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  brandId: string;
  description: string;
  messageFlow: string;
  optInKeywords: string[];
  optOutKeywords: string[];
  helpKeywords: string[];
  createdAt: Date;
}

interface DOISettings {
  enabled: boolean;
  initialMessage: string;
  confirmationMessage: string;
  confirmationKeyword: string;
  timeoutMinutes: number;
  maxAttempts: number;
}

export function A2PComplianceSystem() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<A2PCampaign[]>([
    {
      id: '1',
      name: 'Appointment Reminders',
      useCase: 'customer_care',
      status: 'approved',
      brandId: 'brand-123',
      description: 'Automated appointment reminder system',
      messageFlow: 'Hi {first_name}, this is a reminder about your appointment tomorrow at {time}.',
      optInKeywords: ['START', 'YES', 'SUBSCRIBE'],
      optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'QUIT'],
      helpKeywords: ['HELP', 'INFO'],
      createdAt: new Date('2024-01-15')
    }
  ]);

  const [doiSettings, setDoiSettings] = useState<DOISettings>({
    enabled: true,
    initialMessage: 'Reply YES to confirm you want to receive messages from us.',
    confirmationMessage: 'Thanks for confirming! You\'re now subscribed to our updates.',
    confirmationKeyword: 'YES',
    timeoutMinutes: 60,
    maxAttempts: 3
  });

  const [newCampaign, setNewCampaign] = useState<Partial<A2PCampaign>>({
    useCase: 'customer_care'
  });

  const useCaseOptions = [
    { value: 'customer_care', label: 'Customer Care' },
    { value: '2fa', label: 'Two-Factor Authentication' },
    { value: 'account_notifications', label: 'Account Notifications' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'delivery_notifications', label: 'Delivery Notifications' },
    { value: 'fraud_alert', label: 'Fraud Alert' },
    { value: 'polling_voting', label: 'Polling & Voting' },
    { value: 'public_service', label: 'Public Service Announcement' }
  ];

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const campaign: A2PCampaign = {
      id: Date.now().toString(),
      name: newCampaign.name!,
      useCase: newCampaign.useCase!,
      status: 'draft',
      brandId: 'brand-123',
      description: newCampaign.description!,
      messageFlow: newCampaign.messageFlow || '',
      optInKeywords: ['START', 'YES', 'SUBSCRIBE'],
      optOutKeywords: ['STOP', 'UNSUBSCRIBE', 'QUIT'],
      helpKeywords: ['HELP', 'INFO'],
      createdAt: new Date()
    };

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({ useCase: 'customer_care' });
    toast.success('A2P campaign created successfully');
  };

  const handleSubmitForApproval = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: 'pending' } : c
    ));
    toast.success('Campaign submitted for carrier approval');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">A2P 10DLC Compliance</h2>
          <p className="text-gray-600">Manage messaging compliance and campaign registration</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">
            <MessageSquare className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="doi">
            <UserCheck className="h-4 w-4 mr-2" />
            Double Opt-In
          </TabsTrigger>
          <TabsTrigger value="trust-center">
            <Shield className="h-4 w-4 mr-2" />
            Trust Center
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <FileText className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New A2P Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Campaign Name</Label>
                  <Input
                    value={newCampaign.name || ''}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    placeholder="e.g., Appointment Reminders"
                  />
                </div>
                <div>
                  <Label>Use Case</Label>
                  <Select
                    value={newCampaign.useCase}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, useCase: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {useCaseOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newCampaign.description || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Describe the purpose and content of your messaging campaign"
                />
              </div>
              <div>
                <Label>Message Flow Example</Label>
                <Textarea
                  value={newCampaign.messageFlow || ''}
                  onChange={(e) => setNewCampaign({ ...newCampaign, messageFlow: e.target.value })}
                  placeholder="Provide an example of the messages you'll send"
                />
              </div>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.description}</p>
                      <p className="text-xs text-gray-500">
                        Use Case: {useCaseOptions.find(u => u.value === campaign.useCase)?.label}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      {campaign.status === 'draft' && (
                        <Button size="sm" onClick={() => handleSubmitForApproval(campaign.id)}>
                          Submit for Approval
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="doi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Double Opt-In Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Double Opt-In</Label>
                  <p className="text-sm text-gray-600">Require confirmation before subscribing contacts</p>
                </div>
                <Switch
                  checked={doiSettings.enabled}
                  onCheckedChange={(checked) => setDoiSettings({ ...doiSettings, enabled: checked })}
                />
              </div>
              
              {doiSettings.enabled && (
                <>
                  <div>
                    <Label>Initial Opt-In Message</Label>
                    <Textarea
                      value={doiSettings.initialMessage}
                      onChange={(e) => setDoiSettings({ ...doiSettings, initialMessage: e.target.value })}
                      placeholder="Message sent when someone first subscribes"
                    />
                  </div>
                  <div>
                    <Label>Confirmation Message</Label>
                    <Textarea
                      value={doiSettings.confirmationMessage}
                      onChange={(e) => setDoiSettings({ ...doiSettings, confirmationMessage: e.target.value })}
                      placeholder="Message sent after confirmation"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Confirmation Keyword</Label>
                      <Input
                        value={doiSettings.confirmationKeyword}
                        onChange={(e) => setDoiSettings({ ...doiSettings, confirmationKeyword: e.target.value })}
                        placeholder="YES"
                      />
                    </div>
                    <div>
                      <Label>Timeout (minutes)</Label>
                      <Input
                        type="number"
                        value={doiSettings.timeoutMinutes}
                        onChange={(e) => setDoiSettings({ ...doiSettings, timeoutMinutes: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label>Max Attempts</Label>
                      <Input
                        type="number"
                        value={doiSettings.maxAttempts}
                        onChange={(e) => setDoiSettings({ ...doiSettings, maxAttempts: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </>
              )}
              <Button onClick={() => toast.success('DOI settings saved')}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trust-center" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trust Center Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <Building className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">Brand Registration</h3>
                    <p className="text-sm text-gray-600 mb-4">Register your business brand for A2P messaging</p>
                    <Button variant="outline">Start Registration</Button>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium">Compliance Guide</h3>
                    <p className="text-sm text-gray-600 mb-4">Learn about A2P messaging best practices</p>
                    <Button variant="outline">View Guide</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active Campaigns</p>
                    <p className="text-lg font-bold">{campaigns.filter(c => c.status === 'approved').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Approval</p>
                    <p className="text-lg font-bold">{campaigns.filter(c => c.status === 'pending').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Compliance Score</p>
                    <p className="text-lg font-bold">98%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
