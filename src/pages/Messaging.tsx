
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MessageSquare, Shield, Users, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { A2PComplianceSystem } from "@/components/messaging/A2PComplianceSystem";
import { SmsCampaignBuilder } from "@/components/marketing/SmsCampaignBuilder";
import { SmsAutomationBuilder } from "@/components/automation/SmsAutomationBuilder";

export default function Messaging() {
  const [activeTab, setActiveTab] = useState("campaigns");

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messaging</h1>
          <p className="text-muted-foreground">
            Manage SMS campaigns, automations, and compliance
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="campaigns">
            <MessageSquare className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="automations">
            <Settings className="h-4 w-4 mr-2" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            A2P Compliance
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Contact Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <SmsCampaignBuilder />
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <SmsAutomationBuilder />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <A2PComplianceSystem />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Contact Management</h3>
            <p className="text-gray-600">Contact management features will be implemented here</p>
          </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
