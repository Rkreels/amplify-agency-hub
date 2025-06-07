
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  MousePointer, 
  Timer, 
  Settings, 
  Plus,
  Trash2,
  Copy,
  Play
} from 'lucide-react';

interface ConditionalRule {
  id: string;
  name: string;
  trigger: {
    type: 'click' | 'hover' | 'scroll' | 'timer' | 'form_submit' | 'page_load';
    elementId?: string;
    delay?: number;
    scrollPercentage?: number;
  };
  action: {
    type: 'show' | 'hide' | 'toggle';
    targetElementId: string;
    animation?: 'fade' | 'slide' | 'scale' | 'none';
    duration?: number;
  };
  conditions?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: string;
  }[];
  isActive: boolean;
}

interface PageElement {
  id: string;
  name: string;
  type: 'button' | 'text' | 'image' | 'form' | 'section' | 'div';
  selector: string;
}

export function ConditionalVisibilitySystem() {
  const [rules, setRules] = useState<ConditionalRule[]>([
    {
      id: 'rule-1',
      name: 'Show Special Offer on CTA Click',
      trigger: {
        type: 'click',
        elementId: 'main-cta-button'
      },
      action: {
        type: 'show',
        targetElementId: 'special-offer-section',
        animation: 'fade',
        duration: 300
      },
      isActive: true
    },
    {
      id: 'rule-2',
      name: 'Hide Pricing After Form Submit',
      trigger: {
        type: 'form_submit',
        elementId: 'contact-form'
      },
      action: {
        type: 'hide',
        targetElementId: 'pricing-section',
        animation: 'slide',
        duration: 500
      },
      isActive: true
    }
  ]);

  const [pageElements, setPageElements] = useState<PageElement[]>([
    { id: 'main-cta-button', name: 'Main CTA Button', type: 'button', selector: '#main-cta' },
    { id: 'special-offer-section', name: 'Special Offer Section', type: 'section', selector: '.special-offer' },
    { id: 'pricing-section', name: 'Pricing Section', type: 'section', selector: '.pricing' },
    { id: 'contact-form', name: 'Contact Form', type: 'form', selector: '#contact-form' },
    { id: 'testimonials', name: 'Testimonials Section', type: 'section', selector: '.testimonials' },
    { id: 'hero-image', name: 'Hero Image', type: 'image', selector: '.hero-img' }
  ]);

  const [newRule, setNewRule] = useState<Partial<ConditionalRule>>({
    trigger: { type: 'click' },
    action: { type: 'show', targetElementId: '', animation: 'fade', duration: 300 },
    isActive: true
  });

  const [selectedPage, setSelectedPage] = useState('landing-page-1');

  const triggerTypes = [
    { value: 'click', label: 'Button Click', icon: MousePointer },
    { value: 'hover', label: 'Mouse Hover', icon: MousePointer },
    { value: 'scroll', label: 'Scroll Position', icon: Eye },
    { value: 'timer', label: 'Timer Delay', icon: Timer },
    { value: 'form_submit', label: 'Form Submission', icon: Settings },
    { value: 'page_load', label: 'Page Load', icon: Play }
  ];

  const actionTypes = [
    { value: 'show', label: 'Show Element' },
    { value: 'hide', label: 'Hide Element' },
    { value: 'toggle', label: 'Toggle Visibility' }
  ];

  const animationTypes = [
    { value: 'none', label: 'No Animation' },
    { value: 'fade', label: 'Fade In/Out' },
    { value: 'slide', label: 'Slide Up/Down' },
    { value: 'scale', label: 'Scale Up/Down' }
  ];

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.trigger?.type || !newRule.action?.targetElementId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const rule: ConditionalRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      trigger: newRule.trigger!,
      action: newRule.action!,
      conditions: newRule.conditions,
      isActive: true
    };

    setRules([...rules, rule]);
    setNewRule({
      trigger: { type: 'click' },
      action: { type: 'show', targetElementId: '', animation: 'fade', duration: 300 },
      isActive: true
    });
    toast.success('Conditional rule created successfully');
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast.success('Rule deleted successfully');
  };

  const duplicateRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      const duplicated = {
        ...rule,
        id: Date.now().toString(),
        name: rule.name + ' (Copy)'
      };
      setRules([...rules, duplicated]);
      toast.success('Rule duplicated successfully');
    }
  };

  const generateRuleCode = (rule: ConditionalRule) => {
    const triggerCode = rule.trigger.type === 'click' 
      ? `document.getElementById('${rule.trigger.elementId}').addEventListener('click', function() {`
      : `// Add ${rule.trigger.type} event listener`;
    
    const actionCode = rule.action.type === 'show'
      ? `document.getElementById('${rule.action.targetElementId}').style.display = 'block';`
      : `document.getElementById('${rule.action.targetElementId}').style.display = 'none';`;

    return `${triggerCode}\n  ${actionCode}\n});`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conditional Visibility</h2>
          <p className="text-gray-600">Create dynamic interactions for your funnels and websites</p>
        </div>
        <Select value={selectedPage} onValueChange={setSelectedPage}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="landing-page-1">Landing Page 1</SelectItem>
            <SelectItem value="landing-page-2">Landing Page 2</SelectItem>
            <SelectItem value="sales-funnel">Sales Funnel</SelectItem>
            <SelectItem value="thank-you-page">Thank You Page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create New Rule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Create New Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rule Name</Label>
              <Input
                value={newRule.name || ''}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Show offer on button click"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Trigger Type</Label>
                <Select
                  value={newRule.trigger?.type}
                  onValueChange={(value) => setNewRule({
                    ...newRule,
                    trigger: { ...newRule.trigger, type: value as any }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              {(newRule.trigger?.type === 'click' || newRule.trigger?.type === 'hover' || newRule.trigger?.type === 'form_submit') && (
                <div>
                  <Label>Trigger Element</Label>
                  <Select
                    value={newRule.trigger?.elementId}
                    onValueChange={(value) => setNewRule({
                      ...newRule,
                      trigger: { ...newRule.trigger, elementId: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select element" />
                    </SelectTrigger>
                    <SelectContent>
                      {pageElements.map((element) => (
                        <SelectItem key={element.id} value={element.id}>
                          {element.name} ({element.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {newRule.trigger?.type === 'timer' && (
              <div>
                <Label>Delay (seconds)</Label>
                <Input
                  type="number"
                  value={newRule.trigger?.delay || ''}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    trigger: { ...newRule.trigger, delay: parseInt(e.target.value) }
                  })}
                  placeholder="5"
                />
              </div>
            )}

            {newRule.trigger?.type === 'scroll' && (
              <div>
                <Label>Scroll Percentage</Label>
                <Input
                  type="number"
                  value={newRule.trigger?.scrollPercentage || ''}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    trigger: { ...newRule.trigger, scrollPercentage: parseInt(e.target.value) }
                  })}
                  placeholder="50"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Action Type</Label>
                <Select
                  value={newRule.action?.type}
                  onValueChange={(value) => setNewRule({
                    ...newRule,
                    action: { ...newRule.action, type: value as any, targetElementId: newRule.action?.targetElementId || '' }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
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

              <div>
                <Label>Target Element</Label>
                <Select
                  value={newRule.action?.targetElementId}
                  onValueChange={(value) => setNewRule({
                    ...newRule,
                    action: { ...newRule.action, targetElementId: value, type: newRule.action?.type || 'show' }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select element" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageElements.map((element) => (
                      <SelectItem key={element.id} value={element.id}>
                        {element.name} ({element.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Animation</Label>
                <Select
                  value={newRule.action?.animation}
                  onValueChange={(value) => setNewRule({
                    ...newRule,
                    action: { ...newRule.action, animation: value as any, type: newRule.action?.type || 'show', targetElementId: newRule.action?.targetElementId || '' }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {animationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duration (ms)</Label>
                <Input
                  type="number"
                  value={newRule.action?.duration || ''}
                  onChange={(e) => setNewRule({
                    ...newRule,
                    action: { ...newRule.action, duration: parseInt(e.target.value), type: newRule.action?.type || 'show', targetElementId: newRule.action?.targetElementId || '' }
                  })}
                  placeholder="300"
                />
              </div>
            </div>

            <Button onClick={handleCreateRule}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </CardContent>
        </Card>

        {/* Page Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Page Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pageElements.map((element) => (
                <div key={element.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-sm">{element.name}</p>
                    <p className="text-xs text-gray-500">{element.type}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {element.selector}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Existing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id} className={`${!rule.isActive ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{rule.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>
                          Trigger: {triggerTypes.find(t => t.value === rule.trigger.type)?.label}
                          {rule.trigger.elementId && ` (${pageElements.find(e => e.id === rule.trigger.elementId)?.name})`}
                        </span>
                        <span>→</span>
                        <span>
                          Action: {actionTypes.find(a => a.value === rule.action.type)?.label}
                          {` (${pageElements.find(e => e.id === rule.action.targetElementId)?.name})`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                      />
                      <Button size="sm" variant="outline" onClick={() => duplicateRule(rule.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-gray-100 rounded">
                    <p className="text-xs font-mono">{generateRuleCode(rule)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
