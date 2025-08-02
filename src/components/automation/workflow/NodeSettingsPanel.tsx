import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Save, 
  Settings, 
  TestTube, 
  Calendar, 
  Clock, 
  Mail, 
  MessageSquare,
  Phone,
  DollarSign,
  Users,
  Tag,
  Filter,
  Zap,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { triggerTypes } from './AdvancedTriggerTypes';
import { actionTypes } from './AdvancedActionTypes';
import { toast } from 'sonner';

interface NodeSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  node: any;
  onSave: (nodeId: string, config: any) => void;
}

interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'boolean' | 'email' | 'url' | 'time' | 'date';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export function NodeSettingsPanel({ isOpen, onClose, node, onSave }: NodeSettingsPanelProps) {
  const [config, setConfig] = useState<any>({});
  const [activeTab, setActiveTab] = useState('settings');
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (node) {
      setConfig(node.data.config || {});
      validateConfig(node.data.config || {});
    }
  }, [node]);

  const getNodeTypeConfig = (): FieldConfig[] => {
    if (!node) return [];

    switch (node.type) {
      case 'trigger':
        return getTriggerConfig(node.data.triggerType);
      case 'action':
        return getActionConfig(node.data.actionType);
      case 'condition':
        return getConditionConfig();
      case 'wait':
        return getWaitConfig();
      default:
        return [];
    }
  };

  const getTriggerConfig = (triggerType: string): FieldConfig[] => {
    const trigger = triggerTypes.find(t => t.id === triggerType);
    if (!trigger) return [];

    const baseConfig: FieldConfig[] = [
      { id: 'name', label: 'Trigger Name', type: 'text', required: true, placeholder: 'Enter trigger name' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe what this trigger does' }
    ];

    switch (triggerType) {
      case 'form_submission':
        return [
          ...baseConfig,
          { id: 'formId', label: 'Form', type: 'select', required: true, options: [
            { value: 'contact-form', label: 'Contact Form' },
            { value: 'lead-form', label: 'Lead Generation Form' },
            { value: 'signup-form', label: 'Signup Form' }
          ]},
          { id: 'filterByField', label: 'Filter by Field', type: 'boolean' },
          { id: 'fieldName', label: 'Field Name', type: 'text', placeholder: 'e.g., source' },
          { id: 'fieldValue', label: 'Field Value', type: 'text', placeholder: 'Expected value' }
        ];
      
      case 'email_opened':
        return [
          ...baseConfig,
          { id: 'campaignId', label: 'Email Campaign', type: 'select', required: true, options: [
            { value: 'welcome-series', label: 'Welcome Series' },
            { value: 'promotion-email', label: 'Promotion Email' },
            { value: 'newsletter', label: 'Newsletter' }
          ]},
          { id: 'timeWindow', label: 'Time Window (hours)', type: 'number', validation: { min: 1, max: 168 } }
        ];

      case 'contact_created':
        return [
          ...baseConfig,
          { id: 'sourceFilter', label: 'Filter by Source', type: 'boolean' },
          { id: 'allowedSources', label: 'Allowed Sources', type: 'select', options: [
            { value: 'manual', label: 'Manual Entry' },
            { value: 'form', label: 'Form Submission' },
            { value: 'import', label: 'Import' },
            { value: 'api', label: 'API' }
          ]},
          { id: 'requireTags', label: 'Require Tags', type: 'boolean' },
          { id: 'requiredTags', label: 'Required Tags', type: 'text', placeholder: 'tag1, tag2, tag3' }
        ];

      default:
        return baseConfig;
    }
  };

  const getActionConfig = (actionType: string): FieldConfig[] => {
    const action = actionTypes.find(a => a.id === actionType);
    if (!action) return [];

    const baseConfig: FieldConfig[] = [
      { id: 'name', label: 'Action Name', type: 'text', required: true, placeholder: 'Enter action name' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe what this action does' }
    ];

    switch (actionType) {
      case 'send_email':
        return [
          ...baseConfig,
          { id: 'templateId', label: 'Email Template', type: 'select', required: true, options: [
            { value: 'welcome', label: 'Welcome Email' },
            { value: 'followup', label: 'Follow-up Email' },
            { value: 'promotion', label: 'Promotion Email' }
          ]},
          { id: 'subject', label: 'Subject Line', type: 'text', required: true, placeholder: 'Email subject' },
          { id: 'fromEmail', label: 'From Email', type: 'email', required: true },
          { id: 'fromName', label: 'From Name', type: 'text', required: true },
          { id: 'delayMinutes', label: 'Delay (minutes)', type: 'number', validation: { min: 0, max: 1440 } },
          { id: 'trackOpens', label: 'Track Opens', type: 'boolean' },
          { id: 'trackClicks', label: 'Track Clicks', type: 'boolean' }
        ];

      case 'send_sms':
        return [
          ...baseConfig,
          { id: 'message', label: 'SMS Message', type: 'textarea', required: true, placeholder: 'Enter SMS content (max 160 chars)', validation: { max: 160 } },
          { id: 'fromNumber', label: 'From Number', type: 'select', required: true, options: [
            { value: '+1234567890', label: '+1 (234) 567-890' },
            { value: '+0987654321', label: '+0 (987) 654-321' }
          ]},
          { id: 'delayMinutes', label: 'Delay (minutes)', type: 'number', validation: { min: 0, max: 1440 } },
          { id: 'respectOptOut', label: 'Respect Opt-out', type: 'boolean' }
        ];

      case 'add_tag':
        return [
          ...baseConfig,
          { id: 'tags', label: 'Tags to Add', type: 'text', required: true, placeholder: 'tag1, tag2, tag3' },
          { id: 'overwriteExisting', label: 'Overwrite Existing', type: 'boolean' }
        ];

      case 'create_task':
        return [
          ...baseConfig,
          { id: 'taskTitle', label: 'Task Title', type: 'text', required: true, placeholder: 'Task title' },
          { id: 'taskDescription', label: 'Task Description', type: 'textarea', placeholder: 'Task description' },
          { id: 'assigneeId', label: 'Assign To', type: 'select', required: true, options: [
            { value: 'user1', label: 'John Doe' },
            { value: 'user2', label: 'Jane Smith' },
            { value: 'user3', label: 'Bob Wilson' }
          ]},
          { id: 'dueDate', label: 'Due Date', type: 'date' },
          { id: 'priority', label: 'Priority', type: 'select', options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' }
          ]}
        ];

      default:
        return baseConfig;
    }
  };

  const getConditionConfig = (): FieldConfig[] => {
    return [
      { id: 'name', label: 'Condition Name', type: 'text', required: true, placeholder: 'Enter condition name' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the condition' },
      { id: 'field', label: 'Field to Check', type: 'select', required: true, options: [
        { value: 'email', label: 'Email' },
        { value: 'phone', label: 'Phone' },
        { value: 'tags', label: 'Tags' },
        { value: 'customField', label: 'Custom Field' }
      ]},
      { id: 'operator', label: 'Operator', type: 'select', required: true, options: [
        { value: 'equals', label: 'Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
        { value: 'isEmpty', label: 'Is Empty' },
        { value: 'isNotEmpty', label: 'Is Not Empty' }
      ]},
      { id: 'value', label: 'Value', type: 'text', placeholder: 'Enter comparison value' }
    ];
  };

  const getWaitConfig = (): FieldConfig[] => {
    return [
      { id: 'name', label: 'Wait Name', type: 'text', required: true, placeholder: 'Enter wait step name' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the wait step' },
      { id: 'duration', label: 'Duration', type: 'number', required: true, validation: { min: 1 } },
      { id: 'unit', label: 'Time Unit', type: 'select', required: true, options: [
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' },
        { value: 'weeks', label: 'Weeks' }
      ]},
      { id: 'waitType', label: 'Wait Type', type: 'select', options: [
        { value: 'fixed', label: 'Fixed Duration' },
        { value: 'untilTime', label: 'Until Specific Time' },
        { value: 'untilDay', label: 'Until Specific Day' }
      ]},
      { id: 'skipWeekends', label: 'Skip Weekends', type: 'boolean' },
      { id: 'skipHolidays', label: 'Skip Holidays', type: 'boolean' }
    ];
  };

  const validateConfig = (configData: any) => {
    const fields = getNodeTypeConfig();
    const newErrors: Record<string, string> = {};
    let valid = true;

    fields.forEach(field => {
      const value = configData[field.id];
      
      if (field.required && (!value || value.toString().trim() === '')) {
        newErrors[field.id] = `${field.label} is required`;
        valid = false;
      }

      if (field.validation && value) {
        if (field.validation.min !== undefined && Number(value) < field.validation.min) {
          newErrors[field.id] = `${field.label} must be at least ${field.validation.min}`;
          valid = false;
        }
        
        if (field.validation.max !== undefined && Number(value) > field.validation.max) {
          newErrors[field.id] = `${field.label} must be at most ${field.validation.max}`;
          valid = false;
        }

        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          newErrors[field.id] = `${field.label} format is invalid`;
          valid = false;
        }
      }
    });

    setErrors(newErrors);
    setIsValid(valid && fields.length > 0);
  };

  const handleConfigChange = (fieldId: string, value: any) => {
    const newConfig = { ...config, [fieldId]: value };
    setConfig(newConfig);
    validateConfig(newConfig);
  };

  const handleSave = () => {
    if (!isValid) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    onSave(node.id, config);
    toast.success('Node settings saved successfully');
    onClose();
  };

  const handleTest = () => {
    if (!isValid) {
      toast.error('Please configure all required fields before testing');
      return;
    }

    toast.success('Test executed successfully');
  };

  const renderField = (field: FieldConfig) => {
    const value = config[field.id] || '';
    const error = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleConfigChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => handleConfigChange(field.id, Number(e.target.value))}
              placeholder={field.placeholder}
              min={field.validation?.min}
              max={field.validation?.max}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => handleConfigChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
              rows={3}
            />
            {field.validation?.max && (
              <p className="text-xs text-muted-foreground">
                {value.length} / {field.validation.max} characters
              </p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={(val) => handleConfigChange(field.id, val)}>
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.id} className="flex items-center justify-between">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Switch
              id={field.id}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handleConfigChange(field.id, checked)}
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleConfigChange(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      case 'time':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type="time"
              value={value}
              onChange={(e) => handleConfigChange(field.id, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen || !node) return null;

  const nodeType = node.type;
  const typeInfo = nodeType === 'trigger' 
    ? triggerTypes.find(t => t.id === node.data.triggerType)
    : nodeType === 'action'
    ? actionTypes.find(a => a.id === node.data.actionType)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {typeInfo && (
                <div className={`p-2 rounded-lg ${typeInfo.color} text-white`}>
                  <typeInfo.icon className="h-5 w-5" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">
                  Configure {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {typeInfo?.name || 'Configure node settings'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  {isValid ? 'Valid' : 'Incomplete'}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="flex-1 mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {getNodeTypeConfig().map(renderField)}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="advanced" className="flex-1 mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Node ID</Label>
                    <Input value={node.id} disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Error Handling</Label>
                    <Select 
                      value={config.errorHandling || 'stop'} 
                      onValueChange={(val) => handleConfigChange('errorHandling', val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stop">Stop Workflow</SelectItem>
                        <SelectItem value="continue">Continue to Next</SelectItem>
                        <SelectItem value="retry">Retry 3 Times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Execution Timeout (seconds)</Label>
                    <Input
                      type="number"
                      value={config.timeout || 30}
                      onChange={(e) => handleConfigChange('timeout', Number(e.target.value))}
                      min={1}
                      max={300}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Enable Logging</Label>
                    <Switch
                      checked={config.enableLogging !== false}
                      onCheckedChange={(checked) => handleConfigChange('enableLogging', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Skip on Weekends</Label>
                    <Switch
                      checked={Boolean(config.skipWeekends)}
                      onCheckedChange={(checked) => handleConfigChange('skipWeekends', checked)}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="testing" className="flex-1 mt-4">
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="font-medium mb-2">Test Configuration</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Test this node with sample data to ensure it's configured correctly.
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Test Contact Email</Label>
                    <Input
                      type="email"
                      value={config.testEmail || 'test@example.com'}
                      onChange={(e) => handleConfigChange('testEmail', e.target.value)}
                      placeholder="test@example.com"
                    />
                  </div>

                  <Button 
                    onClick={handleTest} 
                    className="w-full mt-4"
                    disabled={!isValid}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Run Test
                  </Button>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Configuration Summary</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(config).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-mono text-xs">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <div className="flex-shrink-0 p-6 border-t border-border">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}