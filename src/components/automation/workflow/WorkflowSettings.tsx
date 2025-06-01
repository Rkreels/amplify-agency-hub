
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { toast } from 'sonner';

export function WorkflowSettings() {
  const { currentWorkflow, updateWorkflowSettings, updateWorkflowName } = useWorkflowStore();
  const [settingsTab, setSettingsTab] = useState('general');
  
  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No workflow selected</p>
      </div>
    );
  }

  const handleSaveSettings = () => {
    toast.success('Workflow settings saved');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Workflow Settings</h2>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>

      <Tabs value={settingsTab} onValueChange={setSettingsTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input 
                  id="workflow-name" 
                  value={currentWorkflow.name} 
                  onChange={(e) => updateWorkflowName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workflow-description">Description</Label>
                <Input 
                  id="workflow-description" 
                  value={currentWorkflow.description} 
                  onChange={(e) => updateWorkflowSettings({ description: e.target.value } as any)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="workflow-active" className="block mb-1">Active</Label>
                  <span className="text-sm text-gray-500">Enable or disable this workflow</span>
                </div>
                <Switch 
                  id="workflow-active" 
                  checked={currentWorkflow.isActive} 
                  onCheckedChange={(checked) => {
                    if (checked) {
                      useWorkflowStore.getState().activateWorkflow(currentWorkflow.id);
                    } else {
                      useWorkflowStore.getState().deactivateWorkflow(currentWorkflow.id);
                    }
                  }} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tags & Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input placeholder="Add tags separated by commas" />
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue="automation">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automation">Automation</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-reentry" className="block mb-1">Allow Re-entry</Label>
                  <span className="text-sm text-gray-500">Allow contacts to enter this workflow multiple times</span>
                </div>
                <Switch 
                  id="allow-reentry" 
                  checked={currentWorkflow.settings.allowReentry}
                  onCheckedChange={(checked) => updateWorkflowSettings({ allowReentry: checked })}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label>Error Handling</Label>
                <Select 
                  value={currentWorkflow.settings.errorHandling}
                  onValueChange={(value: 'stop' | 'continue' | 'retry') => 
                    updateWorkflowSettings({ errorHandling: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stop">Stop workflow on error</SelectItem>
                    <SelectItem value="continue">Skip node and continue</SelectItem>
                    <SelectItem value="retry">Retry failed node</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label>Max Execution Time (seconds)</Label>
                <Input 
                  type="number" 
                  value={currentWorkflow.settings.maxExecutionTime}
                  onChange={(e) => updateWorkflowSettings({ maxExecutionTime: Number(e.target.value) })}
                  min={0}
                />
                <span className="text-xs text-gray-500">
                  Maximum time a workflow can run before timing out (0 for no limit)
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Throttling & Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Maximum Daily Executions</Label>
                <Input type="number" min={0} placeholder="Unlimited" />
                <span className="text-xs text-gray-500">
                  Limit how many times this workflow can run per day (0 for unlimited)
                </span>
              </div>
              
              <div className="space-y-2">
                <Label>Rate Limiting (executions per minute)</Label>
                <Input type="number" min={0} placeholder="Unlimited" />
                <span className="text-xs text-gray-500">
                  Limit simultaneous executions to prevent system overload
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block mb-1">Error Notifications</Label>
                  <span className="text-sm text-gray-500">Send notifications when workflow encounters errors</span>
                </div>
                <Switch id="error-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block mb-1">Completion Notifications</Label>
                  <span className="text-sm text-gray-500">Send notifications when workflow completes</span>
                </div>
                <Switch id="completion-notifications" />
              </div>
              
              <div className="space-y-2">
                <Label>Notify Users</Label>
                <Select defaultValue="owner">
                  <SelectTrigger>
                    <SelectValue placeholder="Select users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Workflow Owner</SelectItem>
                    <SelectItem value="admins">All Admins</SelectItem>
                    <SelectItem value="custom">Custom Users...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
