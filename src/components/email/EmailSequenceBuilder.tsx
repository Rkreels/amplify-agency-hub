
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock, Mail, Settings } from 'lucide-react';
import { useEmailMarketingStore } from '@/store/useEmailMarketingStore';
import { toast } from 'sonner';

interface EmailSequenceBuilderProps {
  onClose: () => void;
}

export function EmailSequenceBuilder({ onClose }: EmailSequenceBuilderProps) {
  const { addSequence } = useEmailMarketingStore();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: {
      type: 'tag_added' as const,
      config: {}
    },
    emails: [
      {
        id: '1',
        subject: '',
        htmlContent: '',
        textContent: '',
        delay: 0,
        delayType: 'hours' as const
      }
    ],
    isActive: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.map((email, i) => 
        i === index ? { ...email, [field]: value } : email
      )
    }));
  };

  const addEmail = () => {
    const newEmail = {
      id: Date.now().toString(),
      subject: '',
      htmlContent: '',
      textContent: '',
      delay: 24,
      delayType: 'hours' as const
    };
    
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, newEmail]
    }));
  };

  const removeEmail = (index: number) => {
    if (formData.emails.length > 1) {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in sequence name and description');
      return;
    }

    if (formData.emails.some(email => !email.subject)) {
      toast.error('Please add subjects to all emails');
      return;
    }

    const sequenceData = {
      ...formData,
      stats: {
        enrolled: 0,
        completed: 0,
        optedOut: 0
      }
    };

    addSequence(sequenceData);
    toast.success('Email sequence created successfully');
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Email Sequence</h2>
          <p className="text-gray-600">Build automated email sequences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Create Sequence
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sequence Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Sequence Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Welcome Series"
              />
            </div>
            <div>
              <Label htmlFor="trigger">Trigger</Label>
              <Select 
                value={formData.trigger.type}
                onValueChange={(value) => handleInputChange('trigger', { type: value, config: {} })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tag_added">Tag Added</SelectItem>
                  <SelectItem value="form_submit">Form Submitted</SelectItem>
                  <SelectItem value="date_based">Date Based</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this sequence does"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Email Sequence</CardTitle>
            <Button onClick={addEmail}>
              <Plus className="h-4 w-4 mr-2" />
              Add Email
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {formData.emails.map((email, index) => (
            <div key={email.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Email {index + 1}</h4>
                </div>
                {formData.emails.length > 1 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeEmail(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {index > 0 && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Wait</span>
                  <Input
                    type="number"
                    value={email.delay}
                    onChange={(e) => handleEmailChange(index, 'delay', parseInt(e.target.value))}
                    className="w-20"
                    min="0"
                  />
                  <Select
                    value={email.delayType}
                    onValueChange={(value) => handleEmailChange(index, 'delayType', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">then send</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <Label>Subject Line</Label>
                  <Input
                    value={email.subject}
                    onChange={(e) => handleEmailChange(index, 'subject', e.target.value)}
                    placeholder="Enter email subject"
                  />
                </div>
                
                <div>
                  <Label>Email Content</Label>
                  <Textarea
                    value={email.htmlContent}
                    onChange={(e) => handleEmailChange(index, 'htmlContent', e.target.value)}
                    placeholder="Enter email content"
                    rows={6}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
