
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Save } from 'lucide-react';
import { useEmailMarketingStore } from '@/store/useEmailMarketingStore';
import { toast } from 'sonner';

interface EmailTemplateBuilderProps {
  onClose: () => void;
}

export function EmailTemplateBuilder({ onClose }: EmailTemplateBuilderProps) {
  const { addTemplate } = useEmailMarketingStore();
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    textContent: '',
    category: 'newsletter' as const
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.subject) {
      toast.error('Please fill in template name and subject');
      return;
    }

    addTemplate(formData);
    toast.success('Email template created successfully');
    onClose();
  };

  const templateCategories = [
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'transactional', label: 'Transactional' },
    { value: 'welcome', label: 'Welcome' },
    { value: 'follow-up', label: 'Follow-up' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Email Template</h2>
          <p className="text-gray-600">Design reusable email templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Welcome Email"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templateCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Welcome to {{company_name}}!"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="htmlContent">HTML Content</Label>
            <Textarea
              id="htmlContent"
              value={formData.htmlContent}
              onChange={(e) => handleInputChange('htmlContent', e.target.value)}
              placeholder="<h1>Welcome!</h1><p>Thank you for joining us.</p>"
              rows={12}
            />
          </div>
          
          <div>
            <Label htmlFor="textContent">Plain Text Content</Label>
            <Textarea
              id="textContent"
              value={formData.textContent}
              onChange={(e) => handleInputChange('textContent', e.target.value)}
              placeholder="Welcome! Thank you for joining us."
              rows={6}
            />
          </div>
          
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
