
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Settings as SettingsIcon, 
  User, 
  Users, 
  CreditCard, 
  Globe, 
  BellRing, 
  ShieldCheck, 
  Smartphone, 
  Palette, 
  Mail, 
  MessageSquare,
  Save
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ProfileSettings from "@/components/settings/ProfileSettings";
import TeamSettings from "@/components/settings/TeamSettings";
import BillingSettings from "@/components/settings/BillingSettings";
import DomainSettings from "@/components/settings/DomainSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import DeviceSettings from "@/components/settings/DeviceSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import EmailTemplateSettings from "@/components/settings/EmailTemplateSettings";
import SmsTemplateSettings from "@/components/settings/SmsTemplateSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formChanged, setFormChanged] = useState(false);

  const handleSaveChanges = () => {
    toast.success("Settings saved successfully");
    setFormChanged(false);
  };

  const settingsTabs = [
    { icon: User, label: "Profile", value: "profile" },
    { icon: Users, label: "Team", value: "team" },
    { icon: CreditCard, label: "Billing", value: "billing" },
    { icon: Globe, label: "Domains", value: "domains" },
    { icon: BellRing, label: "Notifications", value: "notifications" },
    { icon: ShieldCheck, label: "Security", value: "security" },
    { icon: Smartphone, label: "Devices", value: "devices" },
    { icon: Palette, label: "Appearance", value: "appearance" },
    { icon: Mail, label: "Email Templates", value: "email" },
    { icon: MessageSquare, label: "SMS Templates", value: "sms" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings onChange={() => setFormChanged(true)} />;
      case "team":
        return <TeamSettings onChange={() => setFormChanged(true)} />;
      case "billing":
        return <BillingSettings onChange={() => setFormChanged(true)} />;
      case "domains":
        return <DomainSettings onChange={() => setFormChanged(true)} />;
      case "notifications":
        return <NotificationSettings onChange={() => setFormChanged(true)} />;
      case "security":
        return <SecuritySettings onChange={() => setFormChanged(true)} />;
      case "devices":
        return <DeviceSettings onChange={() => setFormChanged(true)} />;
      case "appearance":
        return <AppearanceSettings onChange={() => setFormChanged(true)} />;
      case "email":
        return <EmailTemplateSettings onChange={() => setFormChanged(true)} />;
      case "sms":
        return <SmsTemplateSettings onChange={() => setFormChanged(true)} />;
      default:
        return <ProfileSettings onChange={() => setFormChanged(true)} />;
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
        <Button onClick={handleSaveChanges} disabled={!formChanged}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <div className="flex flex-col">
              {settingsTabs.map((item) => (
                <div 
                  key={item.value} 
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                    activeTab === item.value ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveTab(item.value)}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="col-span-12 lg:col-span-9">
          {renderTabContent()}
        </div>
      </div>
    </AppLayout>
  );
}
