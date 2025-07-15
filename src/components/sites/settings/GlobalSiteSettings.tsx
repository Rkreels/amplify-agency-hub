
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Globe, Shield, Zap, Database, Code, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';

export function GlobalSiteSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    defaultDomain: 'yourdomain.com',
    defaultTitle: 'My Awesome Site',
    defaultDescription: 'Create amazing websites with our page builder',
    defaultKeywords: 'website builder, landing pages, funnels',
    timezone: 'UTC',
    language: 'en',
    
    // SEO Settings
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
    metaRobots: 'index,follow',
    sitemap: true,
    schemaMarkup: true,
    
    // Performance
    caching: true,
    compression: true,
    lazyLoading: true,
    imageOptimization: true,
    cdnEnabled: false,
    
    // Security
    sslForced: true,
    corsEnabled: false,
    rateLimit: true,
    securityHeaders: true,
    
    // Integrations
    emailProvider: 'sendgrid',
    storageProvider: 'aws',
    analyticsProvider: 'google',
    
    // Notifications
    emailNotifications: true,
    slackNotifications: false,
    webhookUrl: ''
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    toast.info('Settings reset to defaults');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Global Settings</h2>
          <p className="text-gray-600">Configure global settings for all your sites</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultDomain">Default Domain</Label>
                  <Input
                    id="defaultDomain"
                    value={settings.defaultDomain}
                    onChange={(e) => setSettings({...settings, defaultDomain: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTitle">Default Page Title</Label>
                <Input
                  id="defaultTitle"
                  value={settings.defaultTitle}
                  onChange={(e) => setSettings({...settings, defaultTitle: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultDescription">Default Meta Description</Label>
                <Textarea
                  id="defaultDescription"
                  value={settings.defaultDescription}
                  onChange={(e) => setSettings({...settings, defaultDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultKeywords">Default Keywords</Label>
                <Input
                  id="defaultKeywords"
                  value={settings.defaultKeywords}
                  onChange={(e) => setSettings({...settings, defaultKeywords: e.target.value})}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                SEO Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={settings.googleAnalytics}
                  onChange={(e) => setSettings({...settings, googleAnalytics: e.target.value})}
                  placeholder="GA4-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManager"
                  value={settings.googleTagManager}
                  onChange={(e) => setSettings({...settings, googleTagManager: e.target.value})}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixel"
                  value={settings.facebookPixel}
                  onChange={(e) => setSettings({...settings, facebookPixel: e.target.value})}
                  placeholder="XXXXXXXXXXXXXXX"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Generate Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate XML sitemap for search engines
                  </p>
                </div>
                <Switch
                  checked={settings.sitemap}
                  onCheckedChange={(checked) => setSettings({...settings, sitemap: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Schema Markup</Label>
                  <p className="text-sm text-muted-foreground">
                    Add structured data markup for better SEO
                  </p>
                </div>
                <Switch
                  checked={settings.schemaMarkup}
                  onCheckedChange={(checked) => setSettings({...settings, schemaMarkup: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Caching</Label>
                  <p className="text-sm text-muted-foreground">
                    Cache static content for faster loading
                  </p>
                </div>
                <Switch
                  checked={settings.caching}
                  onCheckedChange={(checked) => setSettings({...settings, caching: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>GZIP Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress files to reduce bandwidth usage
                  </p>
                </div>
                <Switch
                  checked={settings.compression}
                  onCheckedChange={(checked) => setSettings({...settings, compression: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lazy Loading</Label>
                  <p className="text-sm text-muted-foreground">
                    Load images and content as users scroll
                  </p>
                </div>
                <Switch
                  checked={settings.lazyLoading}
                  onCheckedChange={(checked) => setSettings({...settings, lazyLoading: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Image Optimization</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically optimize images for web
                  </p>
                </div>
                <Switch
                  checked={settings.imageOptimization}
                  onCheckedChange={(checked) => setSettings({...settings, imageOptimization: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>CDN</Label>
                  <p className="text-sm text-muted-foreground">
                    Distribute content via Content Delivery Network
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Pro Feature</Badge>
                  <Switch
                    checked={settings.cdnEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, cdnEnabled: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Force SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Redirect all traffic to HTTPS
                  </p>
                </div>
                <Switch
                  checked={settings.sslForced}
                  onCheckedChange={(checked) => setSettings({...settings, sslForced: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>CORS Protection</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable Cross-Origin Resource Sharing protection
                  </p>
                </div>
                <Switch
                  checked={settings.corsEnabled}
                  onCheckedChange={(checked) => setSettings({...settings, corsEnabled: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit requests to prevent abuse
                  </p>
                </div>
                <Switch
                  checked={settings.rateLimit}
                  onCheckedChange={(checked) => setSettings({...settings, rateLimit: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Security Headers</Label>
                  <p className="text-sm text-muted-foreground">
                    Add security headers to responses
                  </p>
                </div>
                <Switch
                  checked={settings.securityHeaders}
                  onCheckedChange={(checked) => setSettings({...settings, securityHeaders: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Third-party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Service Provider</Label>
                <Select value={settings.emailProvider} onValueChange={(value) => setSettings({...settings, emailProvider: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                    <SelectItem value="postmark">Postmark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Storage Provider</Label>
                <Select value={settings.storageProvider} onValueChange={(value) => setSettings({...settings, storageProvider: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">Amazon S3</SelectItem>
                    <SelectItem value="cloudinary">Cloudinary</SelectItem>
                    <SelectItem value="firebase">Firebase Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Analytics Provider</Label>
                <Select value={settings.analyticsProvider} onValueChange={(value) => setSettings({...settings, analyticsProvider: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Analytics</SelectItem>
                    <SelectItem value="mixpanel">Mixpanel</SelectItem>
                    <SelectItem value="amplitude">Amplitude</SelectItem>
                    <SelectItem value="hotjar">Hotjar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to Slack channel
                  </p>
                </div>
                <Switch
                  checked={settings.slackNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, slackNotifications: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={settings.webhookUrl}
                  onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
                  placeholder="https://your-webhook-url.com/endpoint"
                />
                <p className="text-sm text-muted-foreground">
                  Send notifications to custom webhook endpoint
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
