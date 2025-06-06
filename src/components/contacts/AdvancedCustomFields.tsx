import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Type, 
  Hash, 
  Mail, 
  Phone, 
  Calendar, 
  List, 
  CheckSquare,
  Link,
  FileText,
  Star,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { useContactsStore } from '@/store/useContactsStore';

interface CustomFieldTemplate {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'url' | 'date' | 'datetime' | 'textarea' | 'dropdown' | 'checkbox' | 'radio' | 'file' | 'rating';
  options?: string[];
  defaultValue?: any;
  isRequired: boolean;
  isVisible: boolean;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  group?: string;
  order: number;
}

export function AdvancedCustomFields() {
  const { customFieldTemplates, addCustomFieldTemplate } = useContactsStore();
  
  const [fieldTemplates, setFieldTemplates] = useState<CustomFieldTemplate[]>([
    {
      id: '1',
      name: 'industry',
      label: 'Industry',
      type: 'dropdown',
      options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing'],
      isRequired: false,
      isVisible: true,
      description: 'Primary industry the contact works in',
      group: 'Business Information',
      order: 1
    },
    {
      id: '2',
      name: 'annual_revenue',
      label: 'Annual Revenue',
      type: 'number',
      validation: { min: 0, max: 10000000000 },
      isRequired: false,
      isVisible: true,
      description: 'Company annual revenue in USD',
      group: 'Business Information',
      order: 2
    },
    {
      id: '3',
      name: 'satisfaction_rating',
      label: 'Satisfaction Rating',
      type: 'rating',
      validation: { min: 1, max: 5 },
      isRequired: false,
      isVisible: true,
      description: 'Customer satisfaction rating',
      group: 'Feedback',
      order: 3
    }
  ]);

  const [newField, setNewField] = useState<Partial<CustomFieldTemplate>>({
    type: 'text',
    isRequired: false,
    isVisible: true,
    order: fieldTemplates.length + 1
  });

  const [editingField, setEditingField] = useState<string | null>(null);

  const fieldTypes = [
    { value: 'text', label: 'Single Line Text', icon: Type },
    { value: 'textarea', label: 'Multi-line Text', icon: FileText },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'url', label: 'URL', icon: Link },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'datetime', label: 'Date & Time', icon: Calendar },
    { value: 'dropdown', label: 'Dropdown', icon: List },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'radio', label: 'Radio Buttons', icon: CheckSquare },
    { value: 'rating', label: 'Star Rating', icon: Star },
    { value: 'file', label: 'File Upload', icon: FileText }
  ];

  const fieldGroups = [
    'Contact Information',
    'Business Information',
    'Personal Details',
    'Preferences',
    'Feedback',
    'Custom'
  ];

  const handleCreateField = () => {
    if (!newField.name || !newField.label) {
      toast.error('Please fill in field name and label');
      return;
    }

    if (fieldTemplates.some(f => f.name === newField.name)) {
      toast.error('Field name already exists');
      return;
    }

    const field: CustomFieldTemplate = {
      id: Date.now().toString(),
      name: newField.name!,
      label: newField.label!,
      type: newField.type!,
      options: newField.options,
      defaultValue: newField.defaultValue,
      isRequired: newField.isRequired!,
      isVisible: newField.isVisible!,
      description: newField.description,
      validation: newField.validation,
      group: newField.group || 'Custom',
      order: newField.order!
    };

    setFieldTemplates([...fieldTemplates, field]);
    setNewField({
      type: 'text',
      isRequired: false,
      isVisible: true,
      order: fieldTemplates.length + 2
    });
    toast.success('Custom field created successfully');
  };

  const handleUpdateField = (fieldId: string, updates: Partial<CustomFieldTemplate>) => {
    setFieldTemplates(fieldTemplates.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const handleDeleteField = (fieldId: string) => {
    setFieldTemplates(fieldTemplates.filter(field => field.id !== fieldId));
    toast.success('Field deleted successfully');
  };

  const renderFieldPreview = (field: CustomFieldTemplate) => {
    const fieldIcon = fieldTypes.find(t => t.value === field.type)?.icon || Type;
    const IconComponent = fieldIcon;

    switch (field.type) {
      case 'dropdown':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <Label>{field.label}</Label>
          </div>
        );
      case 'textarea':
        return <Textarea disabled placeholder={`Enter ${field.label.toLowerCase()}`} />;
      case 'rating':
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-gray-300" />
            ))}
          </div>
        );
      default:
        return <Input disabled placeholder={`Enter ${field.label.toLowerCase()}`} type={field.type} />;
    }
  };

  const groupedFields = fieldTemplates.reduce((acc, field) => {
    const group = field.group || 'Custom';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {} as Record<string, CustomFieldTemplate[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Custom Fields</h2>
          <p className="text-gray-600">Create and manage custom fields for your contacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create New Field */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Field Name *</Label>
                <Input
                  value={newField.name || ''}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="field_name"
                />
              </div>
              <div>
                <Label>Display Label *</Label>
                <Input
                  value={newField.label || ''}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="Field Label"
                />
              </div>
            </div>

            <div>
              <Label>Field Type</Label>
              <Select
                value={newField.type}
                onValueChange={(value) => setNewField({ ...newField, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <IconComponent className="h-4 w-4 mr-2" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {(newField.type === 'dropdown' || newField.type === 'radio') && (
              <div>
                <Label>Options (one per line)</Label>
                <Textarea
                  value={newField.options?.join('\n') || ''}
                  onChange={(e) => setNewField({ 
                    ...newField, 
                    options: e.target.value.split('\n').filter(Boolean) 
                  })}
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}

            <div>
              <Label>Group</Label>
              <Select
                value={newField.group}
                onValueChange={(value) => setNewField({ ...newField, group: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {fieldGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={newField.description || ''}
                onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                placeholder="Help text for this field"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newField.isRequired}
                  onCheckedChange={(checked) => setNewField({ ...newField, isRequired: !!checked })}
                />
                <Label>Required field</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newField.isVisible}
                  onCheckedChange={(checked) => setNewField({ ...newField, isVisible: !!checked })}
                />
                <Label>Visible in forms</Label>
              </div>
            </div>

            <Button onClick={handleCreateField}>
              <Plus className="h-4 w-4 mr-2" />
              Create Field
            </Button>
          </CardContent>
        </Card>

        {/* Field Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Field Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {newField.label ? (
              <div className="space-y-2">
                <Label>
                  {newField.label}
                  {newField.isRequired && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {newField.description && (
                  <p className="text-sm text-gray-600">{newField.description}</p>
                )}
                {renderFieldPreview(newField as CustomFieldTemplate)}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Configure field to see preview</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Fields */}
      <div className="space-y-6">
        {Object.entries(groupedFields).map(([groupName, fields]) => (
          <Card key={groupName}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {groupName}
                <Badge variant="outline">{fields.length} fields</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fields.sort((a, b) => a.order - b.order).map((field) => {
                  const fieldIcon = fieldTypes.find(t => t.value === field.type)?.icon || Type;
                  const IconComponent = fieldIcon;
                  
                  return (
                    <div key={field.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-4 w-4 text-gray-500" />
                        <div>
                          <h3 className="font-medium">
                            {field.label}
                            {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {field.name} • {fieldTypes.find(t => t.value === field.type)?.label}
                          </p>
                          {field.description && (
                            <p className="text-xs text-gray-500">{field.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost">
                          {field.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingField(field.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteField(field.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
