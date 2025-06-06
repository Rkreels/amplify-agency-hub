
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Facebook, 
  ArrowRight, 
  Settings, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MapPin,
  Plus,
  Trash2
} from 'lucide-react';

interface FacebookForm {
  id: string;
  name: string;
  adName: string;
  status: 'active' | 'paused' | 'error';
  fields: FacebookField[];
  leads: number;
  lastSync: Date;
}

interface FacebookField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'dropdown' | 'checkbox' | 'date';
  required: boolean;
  options?: string[];
}

interface FieldMapping {
  facebookField: string;
  crmField: string;
  transform?: string;
}

interface Integration {
  id: string;
  formId: string;
  formName: string;
  mappings: FieldMapping[];
  isActive: boolean;
  autoSync: boolean;
  createdAt: Date;
}

export function FacebookLeadAdsIntegration() {
  const [activeTab, setActiveTab] = useState('forms');
  const [facebookForms, setFacebookForms] = useState<FacebookForm[]>([
    {
      id: 'form-1',
      name: 'Summer Sale Lead Form',
      adName: 'Summer Sale Campaign',
      status: 'active',
      fields: [
        { id: 'f1', name: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'f2', name: 'email', label: 'Email Address', type: 'email', required: true },
        { id: 'f3', name: 'phone_number', label: 'Phone Number', type: 'phone', required: false },
        { id: 'f4', name: 'company_size', label: 'Company Size', type: 'dropdown', required: false, options: ['1-10', '11-50', '51-200', '200+'] },
        { id: 'f5', name: 'interested_services', label: 'Interested Services', type: 'checkbox', required: false }
      ],
      leads: 156,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'int-1',
      formId: 'form-1',
      formName: 'Summer Sale Lead Form',
      mappings: [
        { facebookField: 'full_name', crmField: 'firstName', transform: 'split_first' },
        { facebookField: 'full_name', crmField: 'lastName', transform: 'split_last' },
        { facebookField: 'email', crmField: 'email' },
        { facebookField: 'phone_number', crmField: 'phone' },
        { facebookField: 'company_size', crmField: 'customField_company_size' }
      ],
      isActive: true,
      autoSync: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [selectedForm, setSelectedForm] = useState<FacebookForm | null>(null);
  const [newMappings, setNewMappings] = useState<FieldMapping[]>([]);

  const crmFields = [
    { value: 'firstName', label: 'First Name', type: 'text' },
    { value: 'lastName', label: 'Last Name', type: 'text' },
    { value: 'email', label: 'Email', type: 'email' },
    { value: 'phone', label: 'Phone', type: 'phone' },
    { value: 'company', label: 'Company', type: 'text' },
    { value: 'position', label: 'Position', type: 'text' },
    { value: 'customField_industry', label: 'Industry (Custom)', type: 'dropdown' },
    { value: 'customField_company_size', label: 'Company Size (Custom)', type: 'dropdown' },
    { value: 'customField_budget', label: 'Budget (Custom)', type: 'number' },
    { value: 'customField_timeline', label: 'Timeline (Custom)', type: 'date' },
    { value: 'customField_interests', label: 'Interests (Custom)', type: 'checkbox' }
  ];

  const transformOptions = [
    { value: '', label: 'No transformation' },
    { value: 'split_first', label: 'Extract first name' },
    { value: 'split_last', label: 'Extract last name' },
    { value: 'uppercase', label: 'Convert to uppercase' },
    { value: 'lowercase', label: 'Convert to lowercase' },
    { value: 'format_phone', label: 'Format phone number' }
  ];

  const handleConnectFacebook = () => {
    // Simulate Facebook connection
    toast.success('Facebook account connected successfully');
  };

  const handleSyncForm = (formId: string) => {
    setFacebookForms(forms => 
      forms.map(form => 
        form.id === formId 
          ? { ...form, lastSync: new Date() }
          : form
      )
    );
    toast.success('Form synced successfully');
  };

  const handleCreateIntegration = () => {
    if (!selectedForm || newMappings.length === 0) {
      toast.error('Please select a form and configure field mappings');
      return;
    }

    const integration: Integration = {
      id: Date.now().toString(),
      formId: selectedForm.id,
      formName: selectedForm.name,
      mappings: newMappings,
      isActive: true,
      autoSync: true,
      createdAt: new Date()
    };

    setIntegrations([...integrations, integration]);
    setSelectedForm(null);
    setNewMappings([]);
    toast.success('Integration created successfully');
  };

  const addMapping = () => {
    setNewMappings([...newMappings, { facebookField: '', crmField: '', transform: '' }]);
  };

  const updateMapping = (index: number, field: keyof FieldMapping, value: string) => {
    const updated = [...newMappings];
    updated[index] = { ...updated[index], [field]: value };
    setNewMappings(updated);
  };

  const removeMapping = (index: number) => {
    setNewMappings(newMappings.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facebook Lead Ads Integration</h2>
          <p className="text-gray-600">Connect and map Facebook Lead Ads to your CRM</p>
        </div>
        <Button onClick={handleConnectFacebook}>
          <Facebook className="h-4 w-4 mr-2" />
          Connect Facebook
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forms">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook Forms
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <MapPin className="h-4 w-4 mr-2" />
            Field Mappings
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid gap-4">
            {facebookForms.map((form) => (
              <Card key={form.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{form.name}</h3>
                      <p className="text-sm text-gray-600">Ad: {form.adName}</p>
                      <p className="text-xs text-gray-500">
                        {form.leads} leads • Last sync: {form.lastSync.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                        {form.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleSyncForm(form.id)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => setSelectedForm(form)}>
                        Configure Mapping
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Form Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {form.fields.map((field) => (
                        <Badge key={field.id} variant="outline" className="text-xs">
                          {field.label} ({field.type})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedForm && (
            <Card>
              <CardHeader>
                <CardTitle>Configure Field Mapping - {selectedForm.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {newMappings.map((mapping, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <Label>Facebook Field</Label>
                        <Select
                          value={mapping.facebookField}
                          onValueChange={(value) => updateMapping(index, 'facebookField', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Facebook field" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedForm.fields.map((field) => (
                              <SelectItem key={field.id} value={field.name}>
                                {field.label} ({field.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="col-span-4">
                        <Label>CRM Field</Label>
                        <Select
                          value={mapping.crmField}
                          onValueChange={(value) => updateMapping(index, 'crmField', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select CRM field" />
                          </SelectTrigger>
                          <SelectContent>
                            {crmFields.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Transform</Label>
                        <Select
                          value={mapping.transform || ''}
                          onValueChange={(value) => updateMapping(index, 'transform', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Optional" />
                          </SelectTrigger>
                          <SelectContent>
                            {transformOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeMapping(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={addMapping}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Mapping
                  </Button>
                  <Button onClick={handleCreateIntegration}>
                    Save Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{integration.formName}</h3>
                      <p className="text-sm text-gray-600">
                        Created: {integration.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={integration.isActive ? 'default' : 'secondary'}>
                        {integration.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Field Mappings:</p>
                    <div className="space-y-1">
                      {integration.mappings.map((mapping, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                            {mapping.facebookField}
                          </span>
                          <ArrowRight className="h-3 w-3 mx-2" />
                          <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">
                            {mapping.crmField}
                          </span>
                          {mapping.transform && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {mapping.transform}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium">Auto-Sync Enabled</h3>
                    <p className="text-sm text-gray-600 mb-4">Leads are automatically imported every 5 minutes</p>
                    <Button variant="outline" size="sm">Configure</Button>
                  </CardContent>
                </Card>
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h3 className="font-medium">Webhook Notifications</h3>
                    <p className="text-sm text-gray-600 mb-4">Get notified when new leads arrive</p>
                    <Button variant="outline" size="sm">Setup Webhook</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
