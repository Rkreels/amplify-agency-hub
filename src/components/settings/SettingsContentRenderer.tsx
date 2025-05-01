
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

interface SettingsContentRendererProps {
  activeTab: string;
  handleSettingChange: () => void;
}

export function SettingsContentRenderer({ activeTab, handleSettingChange }: SettingsContentRendererProps) {
  switch (activeTab) {
    case "profile":
      return <ProfileSettings onChange={handleSettingChange} />;
    case "team":
      return <TeamSettings onChange={handleSettingChange} />;
    case "billing":
      return <BillingSettings onChange={handleSettingChange} />;
    case "domains":
      return <DomainSettings onChange={handleSettingChange} />;
    case "notifications":
      return <NotificationSettings onChange={handleSettingChange} />;
    case "security":
      return <SecuritySettings onChange={handleSettingChange} />;
    case "devices":
      return <DeviceSettings onChange={handleSettingChange} />;
    case "appearance":
      return <AppearanceSettings onChange={handleSettingChange} />;
    case "email":
      return <EmailTemplateSettings onChange={handleSettingChange} />;
    case "sms":
      return <SmsTemplateSettings onChange={handleSettingChange} />;
    default:
      return <ProfileSettings onChange={handleSettingChange} />;
  }
}
