
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  GitBranch, 
  Clock, 
  User, 
  Tag, 
  Mail, 
  DollarSign,
  Calendar,
  BarChart3,
  Globe,
  Database
} from 'lucide-react';

export interface ConditionRule {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
}

export interface ConditionGroup {
  id: string;
  operator: 'AND' | 'OR';
  rules: ConditionRule[];
}

export interface AdvancedCondition {
  id: string;
  name: string;
  description: string;
  groups: ConditionGroup[];
  truePath?: string;
  falsePath?: string;
}

const conditionFields = [
  // Contact Fields
  { id: 'contact.firstName', name: 'First Name', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.lastName', name: 'Last Name', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.email', name: 'Email', type: 'text', category: 'Contact', icon: Mail },
  { id: 'contact.phone', name: 'Phone', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.company', name: 'Company', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.city', name: 'City', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.state', name: 'State', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.country', name: 'Country', type: 'text', category: 'Contact', icon: User },
  { id: 'contact.leadScore', name: 'Lead Score', type: 'number', category: 'Contact', icon: BarChart3 },
  { id: 'contact.tags', name: 'Has Tag', type: 'select', category: 'Contact', icon: Tag },
  { id: 'contact.dateAdded', name: 'Date Added', type: 'date', category: 'Contact', icon: Calendar },
  { id: 'contact.lastActivity', name: 'Last Activity', type: 'date', category: 'Contact', icon: Clock },

  // Opportunity Fields
  { id: 'opportunity.value', name: 'Opportunity Value', type: 'number', category: 'Sales', icon: DollarSign },
  { id: 'opportunity.stage', name: 'Pipeline Stage', type: 'select', category: 'Sales', icon: DollarSign },
  { id: 'opportunity.source', name: 'Lead Source', type: 'select', category: 'Sales', icon: DollarSign },
  { id: 'opportunity.closeDate', name: 'Close Date', type: 'date', category: 'Sales', icon: Calendar },

  // Engagement Fields
  { id: 'engagement.emailOpened', name: 'Email Opened', type: 'boolean', category: 'Engagement', icon: Mail },
  { id: 'engagement.emailClicked', name: 'Email Clicked', type: 'boolean', category: 'Engagement', icon: Mail },
  { id: 'engagement.smsReplied', name: 'SMS Replied', type: 'boolean', category: 'Engagement', icon: Mail },
  { id: 'engagement.appointmentBooked', name: 'Appointment Booked', type: 'boolean', category: 'Engagement', icon: Calendar },
  { id: 'engagement.formSubmitted', name: 'Form Submitted', type: 'boolean', category: 'Engagement', icon: Globe },

  // Time-based Fields
  { id: 'time.dayOfWeek', name: 'Day of Week', type: 'select', category: 'Time', icon: Clock },
  { id: 'time.hourOfDay', name: 'Hour of Day', type: 'number', category: 'Time', icon: Clock },
  { id: 'time.timezone', name: 'Contact Timezone', type: 'select', category: 'Time', icon: Globe },

  // Custom Fields
  { id: 'custom.field1', name: 'Custom Field 1', type: 'text', category: 'Custom', icon: Database },
  { id: 'custom.field2', name: 'Custom Field 2', type: 'number', category: 'Custom', icon: Database },
  { id: 'custom.field3', name: 'Custom Field 3', type: 'boolean', category: 'Custom', icon: Database }
];

const operators = {
  text: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does not contain' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' }
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'greater_equal', label: 'Greater than or equal' },
    { value: 'less_equal', label: 'Less than or equal' },
    { value: 'between', label: 'Between' }
  ],
  date: [
    { value: 'equals', label: 'On date' },
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
    { value: 'between', label: 'Between dates' },
    { value: 'days_ago', label: 'X days ago' },
    { value: 'days_from_now', label: 'X days from now' }
  ],
  boolean: [
    { value: 'is_true', label: 'Is true' },
    { value: 'is_false', label: 'Is false' }
  ],
  select: [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'in', label: 'Is one of' },
    { value: 'not_in', label: 'Is not one of' }
  ]
};

interface AdvancedConditionBuilderProps {
  condition: AdvancedCondition;
  onChange: (condition: AdvancedCondition) => void;
}

export const AdvancedConditionBuilder: React.FC<AdvancedConditionBuilderProps> = ({
  condition,
  onChange
}) => {
  const [selectedField, setSelectedField] = useState<string>('');

  const addConditionGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      operator: 'AND',
      rules: []
    };

    onChange({
      ...condition,
      groups: [...condition.groups, newGroup]
    });
  };

  const updateGroup = (groupId: string, updates: Partial<ConditionGroup>) => {
    onChange({
      ...condition,
      groups: condition.groups.map(group =>
        group.id === groupId ? { ...group, ...updates } : group
      )
    });
  };

  const removeGroup = (groupId: string) => {
    onChange({
      ...condition,
      groups: condition.groups.filter(group => group.id !== groupId)
    });
  };

  const addRule = (groupId: string) => {
    const field = conditionFields.find(f => f.id === selectedField);
    if (!field) return;

    const newRule: ConditionRule = {
      id: `rule-${Date.now()}`,
      field: field.id,
      operator: operators[field.type as keyof typeof operators][0].value,
      value: field.type === 'boolean' ? false : '',
      type: field.type as any
    };

    const group = condition.groups.find(g => g.id === groupId);
    if (group) {
      updateGroup(groupId, {
        rules: [...group.rules, newRule]
      });
    }
  };

  const updateRule = (groupId: string, ruleId: string, updates: Partial<ConditionRule>) => {
    const group = condition.groups.find(g => g.id === groupId);
    if (group) {
      updateGroup(groupId, {
        rules: group.rules.map(rule =>
          rule.id === ruleId ? { ...rule, ...updates } : rule
        )
      });
    }
  };

  const removeRule = (groupId: string, ruleId: string) => {
    const group = condition.groups.find(g => g.id === groupId);
    if (group) {
      updateGroup(groupId, {
        rules: group.rules.filter(rule => rule.id !== ruleId)
      });
    }
  };

  const categories = [...new Set(conditionFields.map(f => f.category))];

  return (
    <div className="space-y-6">
      {/* Condition Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Advanced Condition</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="condition-name">Condition Name</Label>
            <Input
              id="condition-name"
              value={condition.name}
              onChange={(e) => onChange({ ...condition, name: e.target.value })}
              placeholder="Enter condition name"
            />
          </div>
          <div>
            <Label htmlFor="condition-description">Description</Label>
            <Input
              id="condition-description"
              value={condition.description}
              onChange={(e) => onChange({ ...condition, description: e.target.value })}
              placeholder="Describe what this condition checks"
            />
          </div>
        </div>
      </div>

      {/* Condition Groups */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Condition Rules</h4>
          <Button onClick={addConditionGroup} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Group
          </Button>
        </div>

        {condition.groups.map((group, groupIndex) => (
          <Card key={group.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  Group {groupIndex + 1}
                </Badge>
                <Select
                  value={group.operator}
                  onValueChange={(value: 'AND' | 'OR') => updateGroup(group.id, { operator: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={() => removeGroup(group.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Rules in this group */}
            <div className="space-y-3">
              {group.rules.map((rule, ruleIndex) => {
                const field = conditionFields.find(f => f.id === rule.field);
                const availableOperators = operators[rule.type as keyof typeof operators] || [];

                return (
                  <div key={rule.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    {ruleIndex > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {group.operator}
                      </Badge>
                    )}
                    
                    <Select
                      value={rule.field}
                      onValueChange={(value) => {
                        const newField = conditionFields.find(f => f.id === value);
                        if (newField) {
                          updateRule(group.id, rule.id, {
                            field: value,
                            type: newField.type as any,
                            operator: operators[newField.type as keyof typeof operators][0].value,
                            value: newField.type === 'boolean' ? false : ''
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100">
                              {category}
                            </div>
                            {conditionFields
                              .filter(f => f.category === category)
                              .map(field => {
                                const IconComponent = field.icon;
                                return (
                                  <SelectItem key={field.id} value={field.id}>
                                    <div className="flex items-center space-x-2">
                                      <IconComponent className="h-4 w-4" />
                                      <span>{field.name}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={rule.operator}
                      onValueChange={(value) => updateRule(group.id, rule.id, { operator: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOperators.map(op => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {rule.type === 'boolean' ? (
                      <Switch
                        checked={rule.value as boolean}
                        onCheckedChange={(checked) => updateRule(group.id, rule.id, { value: checked })}
                      />
                    ) : (
                      <Input
                        value={rule.value as string}
                        onChange={(e) => updateRule(group.id, rule.id, { value: e.target.value })}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                    )}

                    <Button
                      onClick={() => removeRule(group.id, rule.id)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}

              {/* Add rule to group */}
              <div className="flex items-center space-x-2">
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select field to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100">
                          {category}
                        </div>
                        {conditionFields
                          .filter(f => f.category === category)
                          .map(field => {
                            const IconComponent = field.icon;
                            return (
                              <SelectItem key={field.id} value={field.id}>
                                <div className="flex items-center space-x-2">
                                  <IconComponent className="h-4 w-4" />
                                  <span>{field.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={() => addRule(group.id)}
                  size="sm"
                  variant="outline"
                  disabled={!selectedField}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {condition.groups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No condition groups yet</p>
            <p className="text-sm">Add a group to start building your condition</p>
          </div>
        )}
      </div>
    </div>
  );
};
