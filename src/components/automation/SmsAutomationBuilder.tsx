
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Save, Send, X } from "lucide-react";

interface Trigger {
  id: string;
  type: string;
  value: string;
}

interface Action {
  id: string;
  type: string; 
  content: string;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
}

export function SmsAutomationBuilder() {
  const [automationName, setAutomationName] = useState("");
  const [triggers, setTriggers] = useState<Trigger[]>([
    { id: "1", type: "appointment_booked", value: "any" }
  ]);
  const [actions, setActions] = useState<Action[]>([
    { id: "1", type: "send_sms", content: "", delay: 0, delayUnit: 'minutes' }
  ]);
  const [isActive, setIsActive] = useState(false);
  
  const triggerTypes = [
    { value: "appointment_booked", label: "Appointment Booked" },
    { value: "appointment_cancelled", label: "Appointment Cancelled" },
    { value: "contact_created", label: "Contact Created" },
    { value: "form_submitted", label: "Form Submitted" },
    { value: "tag_applied", label: "Tag Applied" }
  ];
  
  const actionTypes = [
    { value: "send_sms", label: "Send SMS" },
    { value: "send_email", label: "Send Email" },
    { value: "add_tag", label: "Add Tag" },
    { value: "remove_tag", label: "Remove Tag" },
    { value: "create_task", label: "Create Task" }
  ];
  
  const handleAddTrigger = () => {
    setTriggers([...triggers, { 
      id: Date.now().toString(), 
      type: "appointment_booked", 
      value: "any" 
    }]);
  };
  
  const handleAddAction = () => {
    setActions([...actions, { 
      id: Date.now().toString(), 
      type: "send_sms", 
      content: "", 
      delay: 0, 
      delayUnit: 'minutes' 
    }]);
  };
  
  const handleRemoveTrigger = (id: string) => {
    if (triggers.length > 1) {
      setTriggers(triggers.filter(trigger => trigger.id !== id));
    } else {
      toast.error("You need at least one trigger");
    }
  };
  
  const handleRemoveAction = (id: string) => {
    if (actions.length > 1) {
      setActions(actions.filter(action => action.id !== id));
    } else {
      toast.error("You need at least one action");
    }
  };
  
  const handleUpdateTrigger = (id: string, field: 'type' | 'value', value: string) => {
    setTriggers(triggers.map(trigger => 
      trigger.id === id ? { ...trigger, [field]: value } : trigger
    ));
  };
  
  const handleUpdateAction = (id: string, field: keyof Action, value: any) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, [field]: value } : action
    ));
  };
  
  const handleSave = () => {
    if (!automationName) {
      toast.error("Please enter an automation name");
      return;
    }
    
    if (!triggers.length || !actions.length) {
      toast.error("You need at least one trigger and one action");
      return;
    }
    
    // Check if all actions have content
    const emptyActions = actions.filter(action => action.type === 'send_sms' && !action.content);
    if (emptyActions.length > 0) {
      toast.error("Please fill in all SMS message content");
      return;
    }
    
    toast.success("Automation saved successfully");
  };
  
  const handleTestSend = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action && action.content) {
      toast.success("Test SMS sent to your number");
    } else {
      toast.error("Please enter message content before testing");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SMS Automation Builder</CardTitle>
        <CardDescription>
          Create automated SMS sequences triggered by specific events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="automation-name">Automation Name</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="active">Active</Label>
              <Switch 
                id="active" 
                checked={isActive} 
                onCheckedChange={setIsActive} 
              />
            </div>
          </div>
          <Input
            id="automation-name"
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
            placeholder="e.g. Appointment Reminder Sequence"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Triggers</h3>
            <Button variant="outline" size="sm" onClick={handleAddTrigger}>
              <Plus className="h-4 w-4 mr-2" />
              Add Trigger
            </Button>
          </div>
          
          <div className="space-y-3">
            {triggers.map((trigger) => (
              <div key={trigger.id} className="flex items-end gap-2 border rounded-md p-3">
                <div className="flex-1">
                  <Label htmlFor={`trigger-type-${trigger.id}`} className="mb-2 block">
                    When this happens:
                  </Label>
                  <Select 
                    value={trigger.type} 
                    onValueChange={(value) => handleUpdateTrigger(trigger.id, 'type', value)}
                  >
                    <SelectTrigger id={`trigger-type-${trigger.id}`}>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {trigger.type === 'tag_applied' && (
                  <div className="flex-1">
                    <Label htmlFor={`trigger-value-${trigger.id}`} className="mb-2 block">
                      Tag:
                    </Label>
                    <Input 
                      id={`trigger-value-${trigger.id}`}
                      value={trigger.value}
                      onChange={(e) => handleUpdateTrigger(trigger.id, 'value', e.target.value)}
                      placeholder="Enter tag name"
                    />
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveTrigger(trigger.id)}
                  className="mb-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Actions</h3>
            <Button variant="outline" size="sm" onClick={handleAddAction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
          
          <div className="space-y-4">
            {actions.map((action, index) => (
              <div key={action.id} className="border rounded-md p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Label className="text-base font-medium">Step {index + 1}</Label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveAction(action.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`action-type-${action.id}`} className="mb-2 block">
                      Action Type
                    </Label>
                    <Select 
                      value={action.type} 
                      onValueChange={(value) => handleUpdateAction(action.id, 'type', value)}
                    >
                      <SelectTrigger id={`action-type-${action.id}`}>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        {actionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`delay-${action.id}`} className="mb-2 block">
                        Delay
                      </Label>
                      <Input 
                        id={`delay-${action.id}`}
                        type="number"
                        min="0"
                        value={action.delay}
                        onChange={(e) => handleUpdateAction(action.id, 'delay', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`delay-unit-${action.id}`} className="mb-2 block">
                        Unit
                      </Label>
                      <Select 
                        value={action.delayUnit} 
                        onValueChange={(value: 'minutes' | 'hours' | 'days') => handleUpdateAction(action.id, 'delayUnit', value)}
                      >
                        <SelectTrigger id={`delay-unit-${action.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {action.type === 'send_sms' && (
                  <div className="space-y-2">
                    <Label htmlFor={`sms-content-${action.id}`}>
                      SMS Message
                    </Label>
                    <div className="relative">
                      <Textarea 
                        id={`sms-content-${action.id}`}
                        value={action.content}
                        onChange={(e) => handleUpdateAction(action.id, 'content', e.target.value)}
                        placeholder="Enter your SMS message here. Use {first_name}, {last_name} for personalization."
                        rows={4}
                      />
                      <div className="absolute bottom-2 right-2">
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleTestSend(action.id)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Test Send
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {action.content.length} / 160 characters
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Automation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
