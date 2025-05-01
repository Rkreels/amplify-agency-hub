
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Settings,
  User, 
  Users, 
  CreditCard, 
  Globe, 
  BellRing, 
  ShieldCheck, 
  Smartphone, 
  Palette, 
  Mail, 
  MessageSquare
} from "lucide-react";

interface SettingsNavigationProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

export function SettingsNavigation({ activeTab, handleTabChange }: SettingsNavigationProps) {
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

  return (
    <Card>
      <div className="flex flex-col">
        {settingsTabs.map((item) => (
          <div 
            key={item.value} 
            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
              activeTab === item.value ? 'bg-muted' : ''
            }`}
            onClick={() => handleTabChange(item.value)}
          >
            <item.icon className={`h-5 w-5 ${
              activeTab === item.value ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className={activeTab === item.value ? 'font-medium' : ''}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
