
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { useContactsStore, type CustomField } from '@/store/useContactsStore';
import { toast } from 'sonner';

export function AdvancedCustomFields() {
  const { customFields, addCustomField, updateCustomField, deleteCustomField } = useContactsStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'text' as CustomField['type'],
    options: [] as string[],
    required: false,
    order: 0
  });
  
  const [newOption, setNewOption] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'text',
      options: [],
      required: false,
      order: 0
    });
    setNewOption('');
    setEditingField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Field name is required');
      return;
    }

    const fieldData = {
      ...formData,
      order: editingField?.order || customFields.length
    };

    if (editingField) {
      updateCustomField(editingField.id, fieldData);
      toast.success('Custom field updated');
    } else {
      addCustomField(fieldData);
      toast.success('Custom field created');
    }

    resetForm();
    setShowCreateDialog(false);
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      type: field.type,
      options: field.options || [],
      required: field.required,
      order: field.order
    });
    setShowCreateDialog(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this custom field? This will remove it from all contacts.')) {
      deleteCustomField(id);
      toast.success('Custom field deleted');
    }
  };

  const addOption = () => {
    if (newOption.trim() && !formData.options.includes(newOption.trim())) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const removeOption = (option: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt !== option)
    }));
  };

  const getFieldTypeLabel = (type: string) => {
    const types = {
      text: 'Text',
      number: 'Number',
      email: 'Email',
      phone: 'Phone',
      date: 'Date',
      select: 'Dropdown',
      multiselect: 'Multi-select'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Fields</h2>
          <p className="text-gray-600">
            Create custom fields to capture additional contact information
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingField ? 'Edit Custom Field' : 'Create Custom Field'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fieldName">Field Name</Label>
                <Input
                  id="fieldName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Industry, Company Size"
                />
              </div>

              <div>
                <Label>Field Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: CustomField['type']) => 
                    setFormData(prev => ({ ...prev, type: value, options: [] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="multiselect">Multi-select</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.type === 'select' || formData.type === 'multiselect') && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add option"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                      />
                      <Button type="button" onClick={addOption} size="sm">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.options.map((option) => (
                        <Badge key={option} variant="secondary" className="flex items-center gap-1">
                          {option}
                          <button
                            type="button"
                            onClick={() => removeOption(option)}
                            className="ml-1 hover:bg-red-100 rounded"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                />
                <Label>Required field</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingField ? 'Update Field' : 'Create Field'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customFields.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No custom fields yet</h3>
            <p className="text-gray-600 mb-4">
              Create custom fields to capture additional information about your contacts
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Custom Field
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Existing Custom Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customFields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{field.name}</span>
                          {field.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Type: {getFieldTypeLabel(field.type)}
                          {field.options && field.options.length > 0 && (
                            <span> • {field.options.length} options</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(field)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
