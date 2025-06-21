
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Mail, 
  Users, 
  Calendar as CalendarIcon, 
  Eye, 
  Send, 
  Save,
  Clock,
  Target,
  Settings
} from 'lucide-react';
import { useEmailMarketingStore, type EmailCampaign } from '@/store/useEmailMarketingStore';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface EmailCampaignBuilderProps {
  onClose: () => void;
  campaign?: EmailCampaign;
}

export function EmailCampaignBuilder({ onClose, campaign }: EmailCampaignBuilderProps) {
  const { addCampaign, updateCampaign, templates } = useEmailMarketingStore();
  const [activeTab, setActiveTab] = useState('setup');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    subject: campaign?.subject || '',
    fromName: campaign?.fromName || 'Your Company',
    fromEmail: campaign?.fromEmail || 'hello@yourcompany.com',
    replyTo: campaign?.replyTo || 'hello@yourcompany.com',
    htmlContent: campaign?.htmlContent || '',
    textContent: campaign?.textContent || '',
    templateId: campaign?.templateId || '',
    recipients: {
      type: campaign?.recipients.type || 'all' as const,
      tagIds: campaign?.recipients.tagIds || [],
      customEmails: campaign?.recipients.customEmails || [],
      count: campaign?.recipients.count || 0
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecipientsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      recipients: {
        ...prev.recipients,
        [field]: value
      }
    }));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        templateId,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent
      }));
      toast.success('Template applied successfully');
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.subject) {
      toast.error('Please fill in campaign name and subject');
      return;
    }

    const campaignData = {
      ...formData,
      status: 'draft' as const,
      stats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        bounced: 0,
        spam: 0
      },
      scheduledAt: scheduledDate
    };

    if (campaign) {
      updateCampaign(campaign.id, campaignData);
      toast.success('Campaign updated successfully');
    } else {
      addCampaign(campaignData);
      toast.success('Campaign created successfully');
    }
    
    onClose();
  };

  const handleSchedule = () => {
    if (!scheduledDate) {
      toast.error('Please select a date and time');
      return;
    }
    
    handleSave();
    toast.success('Campaign scheduled successfully');
  };

  const handleSendNow = () => {
    handleSave();
    toast.success('Campaign sent successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {campaign ? 'Edit Campaign' : 'Create Email Campaign'}
          </h2>
          <p className="text-gray-600">
            Design and configure your email campaign
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={formData.fromName}
                    onChange={(e) => handleInputChange('fromName', e.target.value)}
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={formData.fromEmail}
                    onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                    placeholder="hello@yourcompany.com"
                  />
                </div>
                <div>
                  <Label htmlFor="replyTo">Reply To</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={formData.replyTo}
                    onChange={(e) => handleInputChange('replyTo', e.target.value)}
                    placeholder="hello@yourcompany.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template">Use Template (Optional)</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} - {template.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="htmlContent">HTML Content</Label>
                <Textarea
                  id="htmlContent"
                  value={formData.htmlContent}
                  onChange={(e) => handleInputChange('htmlContent', e.target.value)}
                  placeholder="Enter your HTML email content"
                  rows={10}
                />
              </div>
              
              <div>
                <Label htmlFor="textContent">Plain Text Content</Label>
                <Textarea
                  id="textContent"
                  value={formData.textContent}
                  onChange={(e) => handleInputChange('textContent', e.target.value)}
                  placeholder="Enter plain text version"
                  rows={6}
                />
              </div>
              
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Recipient Type</Label>
                <Select 
                  value={formData.recipients.type} 
                  onValueChange={(value) => handleRecipientsChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="tags">By Tags</SelectItem>
                    <SelectItem value="custom">Custom List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.recipients.type === 'tags' && (
                <div>
                  <Label>Select Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Lead</Badge>
                    <Badge variant="outline">Customer</Badge>
                    <Badge variant="outline">VIP</Badge>
                    <Badge variant="outline">Newsletter</Badge>
                  </div>
                </div>
              )}
              
              {formData.recipients.type === 'custom' && (
                <div>
                  <Label htmlFor="customEmails">Email Addresses (one per line)</Label>
                  <Textarea
                    id="customEmails"
                    placeholder="email1@example.com&#10;email2@example.com"
                    rows={6}
                  />
                </div>
              )}
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Estimated Recipients: 1,247</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Send Options</Label>
                  <div className="space-y-3 mt-2">
                    <Button className="w-full justify-start" onClick={handleSendNow}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule for Later
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {scheduledDate && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-700">
                          Scheduled for: {format(scheduledDate, 'PPP')}
                        </p>
                        <Button size="sm" className="mt-2" onClick={handleSchedule}>
                          Confirm Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Campaign Preview</Label>
                  <div className="border rounded-lg p-4 mt-2">
                    <div className="text-sm text-gray-600 mb-2">
                      From: {formData.fromName} &lt;{formData.fromEmail}&gt;
                    </div>
                    <div className="font-medium mb-2">
                      Subject: {formData.subject || 'No subject'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Recipients: {formData.recipients.type === 'all' ? 'All contacts' : `Selected ${formData.recipients.type}`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
