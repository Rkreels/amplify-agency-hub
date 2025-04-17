
import { useState, useEffect } from "react";
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
import { toast } from "sonner"; // Changed from direct import
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
import { Progress } from "@/components/ui/progress";
import { useLocation, useNavigate } from "react-router-dom";

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [formChanged, setFormChanged] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedSettings, setSavedSettings] = useState<Record<string, any>>({});

  // Handle URL params to select tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && settingsTabs.some(item => item.value === tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
  }, [activeTab, navigate, location.search]);

  const handleTabChange = (tab: string) => {
    if (formChanged) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave this tab?")) {
        setFormChanged(false);
        setActiveTab(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  const handleSaveChanges = () => {
    setSaving(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSaving(false);
          
          // Save the current settings state
          setSavedSettings(prev => ({
            ...prev,
            [activeTab]: Date.now() // Store timestamp of when settings were saved
          }));
          
          toast.success("Settings saved successfully");
          setFormChanged(false);
          return 0;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleSettingChange = () => {
    console.log("Settings changed");
    setFormChanged(true);
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
        <Button 
          onClick={handleSaveChanges} 
          disabled={!formChanged || isSaving}
          className={isSaving ? "opacity-70" : ""}
        >
          {isSaving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-pulse" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      {isSaving && (
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
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
        </div>
        
        <div className="col-span-12 lg:col-span-9">
          {renderTabContent()}
        </div>
      </div>
    </AppLayout>
  );
}
