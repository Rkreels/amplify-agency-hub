
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Facebook, Zap, Globe, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacebookLeadAdsIntegration } from "@/components/integrations/FacebookLeadAdsIntegration";
import { IntegrationSystem } from "@/components/automation/workflow/IntegrationSystem";

export default function Integrations() {
  const [activeTab, setActiveTab] = useState("facebook");

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect with external platforms and services
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="facebook">
            <Facebook className="h-4 w-4 mr-2" />
            Facebook Lead Ads
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Globe className="h-4 w-4 mr-2" />
            Webhooks & APIs
          </TabsTrigger>
          <TabsTrigger value="zapier">
            <Zap className="h-4 w-4 mr-2" />
            Zapier
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facebook" className="space-y-6">
          <FacebookLeadAdsIntegration />
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <IntegrationSystem />
        </TabsContent>

        <TabsContent value="zapier" className="space-y-6">
          <div className="text-center py-12">
            <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Zapier Integration</h3>
            <p className="text-gray-600">Advanced Zapier features will be available here</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Integration Settings</h3>
            <p className="text-gray-600">Global integration settings and preferences</p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
