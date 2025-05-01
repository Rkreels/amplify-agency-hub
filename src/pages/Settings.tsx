
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsContentRenderer } from "@/components/settings/SettingsContentRenderer";

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
    if (tab && ["profile", "team", "billing", "domains", "notifications", 
                "security", "devices", "appearance", "email", "sms"].includes(tab)) {
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

  return (
    <AppLayout>
      <SettingsHeader 
        formChanged={formChanged}
        isSaving={isSaving}
        progress={progress}
        handleSaveChanges={handleSaveChanges}
      />
      
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <SettingsNavigation 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </div>
        
        <div className="col-span-12 lg:col-span-9">
          <SettingsContentRenderer 
            activeTab={activeTab}
            handleSettingChange={handleSettingChange}
          />
        </div>
      </div>
    </AppLayout>
  );
}
