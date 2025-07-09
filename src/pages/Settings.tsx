
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";
import { SettingsContentRenderer } from "@/components/settings/SettingsContentRenderer";
import { toast } from "sonner";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [formChanged, setFormChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTabChange = (tab: string) => {
    if (formChanged) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this section?"
      );
      if (!confirmLeave) return;
    }
    setActiveTab(tab);
    setFormChanged(false);
  };

  const handleSettingChange = () => {
    setFormChanged(true);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setFormChanged(false);
      setProgress(0);
      toast.success("Settings saved successfully");
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <SettingsHeader 
          formChanged={formChanged}
          isSaving={isSaving}
          progress={progress}
          handleSaveChanges={handleSaveChanges}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SettingsNavigation 
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <SettingsContentRenderer 
              activeTab={activeTab}
              handleSettingChange={handleSettingChange}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
