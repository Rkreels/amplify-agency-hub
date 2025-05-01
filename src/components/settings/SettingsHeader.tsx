
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SettingsHeaderProps {
  formChanged: boolean;
  isSaving: boolean;
  progress: number;
  handleSaveChanges: () => void;
}

export function SettingsHeader({ formChanged, isSaving, progress, handleSaveChanges }: SettingsHeaderProps) {
  return (
    <>
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
    </>
  );
}
