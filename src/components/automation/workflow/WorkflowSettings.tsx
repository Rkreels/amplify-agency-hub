
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Workflow, useWorkflowStore } from '@/store/useWorkflowStore';

interface WorkflowSettingsProps {
  workflow: Workflow;
  onClose: () => void;
}

export function WorkflowSettings({ workflow, onClose }: WorkflowSettingsProps) {
  const { updateWorkflowSettings } = useWorkflowStore();
  const [settings, setSettings] = useState(workflow.settings);

  const handleSave = () => {
    updateWorkflowSettings(settings);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Workflow Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Execution Settings</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxTime">Max Execution Time (seconds)</Label>
                <Input
                  id="maxTime"
                  type="number"
                  value={settings.maxExecutionTime}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    maxExecutionTime: parseInt(e.target.value) || 3600
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="retries">Retry Attempts</Label>
                <Input
                  id="retries"
                  type="number"
                  value={settings.retryAttempts}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    retryAttempts: parseInt(e.target.value) || 3
                  }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="errorHandling">Error Handling</Label>
              <Select
                value={settings.errorHandling || 'stop'}
                onValueChange={(value) => setSettings(prev => ({
                  ...prev,
                  errorHandling: value as 'stop' | 'continue' | 'retry'
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stop">Stop on Error</SelectItem>
                  <SelectItem value="continue">Continue on Error</SelectItem>
                  <SelectItem value="retry">Retry on Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Logging & Monitoring</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="logging">Enable Logging</Label>
              <Switch
                id="logging"
                checked={settings.enableLogging}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  enableLogging: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reentry">Allow Re-entry</Label>
              <Switch
                id="reentry"
                checked={settings.allowReentry || false}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  allowReentry: checked
                }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Notifications</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="successNotif">Notify on Success</Label>
              <Switch
                id="successNotif"
                checked={settings.notifications.onSuccess}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, onSuccess: checked }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="failureNotif">Notify on Failure</Label>
              <Switch
                id="failureNotif"
                checked={settings.notifications.onFailure}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, onFailure: checked }
                }))}
              />
            </div>

            <div>
              <Label htmlFor="email">Notification Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.notifications.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.value }
                }))}
                placeholder="admin@example.com"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
