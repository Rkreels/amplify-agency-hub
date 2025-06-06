
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Webhook, 
  Globe, 
  Zap, 
  Plus, 
  Settings, 
  Play, 
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
  isActive: boolean;
  lastTriggered?: Date;
}

interface ApiConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  endpoints: {
    id: string;
    path: string;
    method: string;
    description: string;
  }[];
}

interface ZapierConfig {
  id: string;
  name: string;
  webhookUrl: string;
  description: string;
  isActive: boolean;
}

export function IntegrationSystem() {
  const [activeTab, setActiveTab] = useState('webhooks');
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: 'webhook-1',
      name: 'Slack Notification',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"text": "New lead: {{contact.name}}"}',
      isActive: true,
      lastTriggered: new Date()
    }
  ]);

  const [apis, setApis] = useState<ApiConfig[]>([
    {
      id: 'api-1',
      name: 'CRM Integration',
      baseUrl: 'https://api.crm.com/v1',
      apiKey: 'sk_test_...',
      endpoints: [
        { id: 'ep-1', path: '/contacts', method: 'POST', description: 'Create contact' },
        { id: 'ep-2', path: '/deals', method: 'POST', description: 'Create deal' }
      ]
    }
  ]);

  const [zapierIntegrations, setZapierIntegrations] = useState<ZapierConfig[]>([
    {
      id: 'zap-1',
      name: 'Lead to Google Sheets',
      webhookUrl: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
      description: 'Automatically add new leads to Google Sheets',
      isActive: true
    }
  ]);

  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const handleAddWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    const webhook: WebhookConfig = {
      id: `webhook-${Date.now()}`,
      name: newWebhook.name,
      url: newWebhook.url,
      method: newWebhook.method || 'POST',
      headers: newWebhook.headers || {},
      body: newWebhook.body,
      isActive: true
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ method: 'POST', headers: { 'Content-Type': 'application/json' } });
    toast.success('Webhook added successfully');
  };

  const testWebhook = async (webhook: WebhookConfig) => {
    try {
      const response = await fetch(webhook.url, {
        method: webhook.method,
        headers: webhook.headers,
        body: webhook.body,
        mode: 'no-cors'
      });
      
      toast.success(`Webhook test sent to ${webhook.name}`);
    } catch (error) {
      toast.error('Failed to test webhook');
    }
  };

  const triggerZapier = async (zap: ZapierConfig) => {
    try {
      await fetch(zap.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          test_data: { name: 'Test Lead', email: 'test@example.com' }
        }),
        mode: 'no-cors'
      });
      
      toast.success(`Zapier integration "${zap.name}" triggered`);
    } catch (error) {
      toast.error('Failed to trigger Zapier integration');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integration System</h2>
          <p className="text-gray-600">Manage webhooks, APIs, and third-party integrations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="apis">
            <Globe className="h-4 w-4 mr-2" />
            APIs
          </TabsTrigger>
          <TabsTrigger value="zapier">
            <Zap className="h-4 w-4 mr-2" />
            Zapier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newWebhook.name || ''}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="Webhook name"
                  />
                </div>
                <div>
                  <Label>Method</Label>
                  <Select
                    value={newWebhook.method}
                    onValueChange={(value) => setNewWebhook({ ...newWebhook, method: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={newWebhook.url || ''}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div>
                <Label>Body (JSON)</Label>
                <Textarea
                  value={newWebhook.body || ''}
                  onChange={(e) => setNewWebhook({ ...newWebhook, body: e.target.value })}
                  placeholder='{"message": "{{contact.name}} signed up"}'
                />
              </div>
              <Button onClick={handleAddWebhook}>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{webhook.name}</h3>
                      <p className="text-sm text-gray-500">{webhook.method} {webhook.url}</p>
                      {webhook.lastTriggered && (
                        <p className="text-xs text-gray-400">
                          Last triggered: {webhook.lastTriggered.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={webhook.isActive ? "default" : "secondary"}>
                        {webhook.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => testWebhook(webhook)}>
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apis" className="space-y-4">
          <div className="grid gap-4">
            {apis.map((api) => (
              <Card key={api.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {api.name}
                    <Badge>Connected</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{api.baseUrl}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium">Available Endpoints:</h4>
                    {api.endpoints.map((endpoint) => (
                      <div key={endpoint.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <Badge variant="outline" className="mr-2">{endpoint.method}</Badge>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                          <p className="text-xs text-gray-500">{endpoint.description}</p>
                        </div>
                        <Button size="sm" variant="outline">Test</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="zapier" className="space-y-4">
          <div className="grid gap-4">
            {zapierIntegrations.map((zap) => (
              <Card key={zap.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-orange-500" />
                        {zap.name}
                      </h3>
                      <p className="text-sm text-gray-500">{zap.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={zap.isActive ? "default" : "secondary"}>
                        {zap.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => triggerZapier(zap)}>
                        <Play className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
