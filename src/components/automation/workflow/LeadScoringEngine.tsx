import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Target, 
  Plus, 
  Trash2, 
  Star,
  TrendingUp,
  Users,
  Activity,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  Edit,
  Save
} from 'lucide-react';

interface ScoringRule {
  id: string;
  name: string;
  category: 'demographic' | 'behavioral' | 'engagement' | 'firmographic';
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: string;
  points: number;
  isActive: boolean;
}

interface LeadProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  lastActivity: Date;
  activities: string[];
  demographics: Record<string, any>;
}

interface ScoringThreshold {
  grade: string;
  minScore: number;
  maxScore: number;
  color: string;
  label: string;
}

export function LeadScoringEngine() {
  const [scoringRules, setScoringRules] = useState<ScoringRule[]>([
    {
      id: 'rule-1',
      name: 'Email Opened',
      category: 'engagement',
      field: 'email_opened',
      operator: 'exists',
      value: '',
      points: 5,
      isActive: true
    },
    {
      id: 'rule-2',
      name: 'Visited Pricing Page',
      category: 'behavioral',
      field: 'page_visited',
      operator: 'equals',
      value: '/pricing',
      points: 15,
      isActive: true
    },
    {
      id: 'rule-3',
      name: 'Company Size > 100',
      category: 'firmographic',
      field: 'company_size',
      operator: 'greater_than',
      value: '100',
      points: 10,
      isActive: true
    },
    {
      id: 'rule-4',
      name: 'Job Title Contains Manager',
      category: 'demographic',
      field: 'job_title',
      operator: 'contains',
      value: 'manager',
      points: 8,
      isActive: true
    }
  ]);

  const [scoringThresholds, setScoringThresholds] = useState<ScoringThreshold[]>([
    { grade: 'A', minScore: 80, maxScore: 100, color: 'bg-green-500', label: 'Hot Lead' },
    { grade: 'B', minScore: 60, maxScore: 79, color: 'bg-blue-500', label: 'Warm Lead' },
    { grade: 'C', minScore: 40, maxScore: 59, color: 'bg-yellow-500', label: 'Qualified Lead' },
    { grade: 'D', minScore: 20, maxScore: 39, color: 'bg-orange-500', label: 'Cold Lead' },
    { grade: 'F', minScore: 0, maxScore: 19, color: 'bg-gray-500', label: 'Unqualified' }
  ]);

  const [leadProfiles, setLeadProfiles] = useState<LeadProfile[]>([
    {
      id: 'lead-1',
      name: 'John Smith',
      email: 'john@company.com',
      company: 'Tech Corp',
      score: 85,
      grade: 'A',
      lastActivity: new Date('2024-01-20'),
      activities: ['Email Opened', 'Visited Pricing', 'Downloaded Whitepaper'],
      demographics: { jobTitle: 'Sales Manager', companySize: 250, industry: 'Technology' }
    },
    {
      id: 'lead-2',
      name: 'Sarah Johnson',
      email: 'sarah@startup.io',
      company: 'Startup Inc',
      score: 42,
      grade: 'C',
      lastActivity: new Date('2024-01-18'),
      activities: ['Form Submitted', 'Email Opened'],
      demographics: { jobTitle: 'Founder', companySize: 15, industry: 'SaaS' }
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<ScoringRule>>({
    category: 'behavioral',
    operator: 'equals',
    points: 5,
    isActive: true
  });

  const [activeTab, setActiveTab] = useState('rules');

  const addScoringRule = () => {
    if (!newRule.name || !newRule.field) {
      toast.error('Please fill in all required fields');
      return;
    }

    const rule: ScoringRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name!,
      category: newRule.category as any,
      field: newRule.field!,
      operator: newRule.operator as any,
      value: newRule.value || '',
      points: newRule.points || 5,
      isActive: true
    };

    setScoringRules([...scoringRules, rule]);
    setNewRule({
      category: 'behavioral',
      operator: 'equals',
      points: 5,
      isActive: true
    });
    toast.success('Scoring rule added successfully');
  };

  const deleteScoringRule = (ruleId: string) => {
    setScoringRules(scoringRules.filter(rule => rule.id !== ruleId));
    toast.success('Scoring rule deleted');
  };

  const toggleRuleStatus = (ruleId: string) => {
    setScoringRules(scoringRules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getGradeForScore = (score: number) => {
    return scoringThresholds.find(threshold => 
      score >= threshold.minScore && score <= threshold.maxScore
    ) || scoringThresholds[scoringThresholds.length - 1];
  };

  const recalculateScores = () => {
    // Simulate score recalculation
    toast.success('Lead scores recalculated based on current rules');
  };

  const categoryIcons = {
    demographic: Users,
    behavioral: Activity,
    engagement: Mail,
    firmographic: Briefcase
  };

  const categoryColors = {
    demographic: 'bg-blue-100 text-blue-700',
    behavioral: 'bg-green-100 text-green-700',
    engagement: 'bg-purple-100 text-purple-700',
    firmographic: 'bg-orange-100 text-orange-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lead Scoring Engine</h2>
          <p className="text-gray-600">Automatically score leads based on activities and attributes</p>
        </div>
        <Button onClick={recalculateScores}>
          <Target className="h-4 w-4 mr-2" />
          Recalculate Scores
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-lg font-bold">67.3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Hot Leads (A)</p>
                <p className="text-lg font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Scored</p>
                <p className="text-lg font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Active Rules</p>
                <p className="text-lg font-bold">{scoringRules.filter(r => r.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scoring Rules */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Scoring Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Rule */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Add New Scoring Rule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Rule Name</Label>
                    <Input
                      value={newRule.name || ''}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      placeholder="e.g., Downloaded Whitepaper"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newRule.category}
                      onValueChange={(value) => setNewRule({ ...newRule, category: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demographic">Demographic</SelectItem>
                        <SelectItem value="behavioral">Behavioral</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                        <SelectItem value="firmographic">Firmographic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Field</Label>
                    <Input
                      value={newRule.field || ''}
                      onChange={(e) => setNewRule({ ...newRule, field: e.target.value })}
                      placeholder="e.g., page_visited"
                    />
                  </div>
                  <div>
                    <Label>Operator</Label>
                    <Select
                      value={newRule.operator}
                      onValueChange={(value) => setNewRule({ ...newRule, operator: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                        <SelectItem value="exists">Exists</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Value</Label>
                    <Input
                      value={newRule.value || ''}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                      placeholder="e.g., /pricing"
                    />
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      value={newRule.points || ''}
                      onChange={(e) => setNewRule({ ...newRule, points: parseInt(e.target.value) || 0 })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <Button onClick={addScoringRule} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </CardContent>
            </Card>

            {/* Existing Rules */}
            <div className="space-y-3">
              {scoringRules.map((rule) => {
                const CategoryIcon = categoryIcons[rule.category];
                const categoryColor = categoryColors[rule.category];
                
                return (
                  <Card key={rule.id} className={`${!rule.isActive ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <CategoryIcon className="h-4 w-4" />
                            <Badge className={categoryColor}>
                              {rule.category}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-medium">{rule.name}</h3>
                            <p className="text-sm text-gray-600">
                              {rule.field} {rule.operator} {rule.value || '(any)'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-bold text-lg">+{rule.points}</p>
                            <p className="text-xs text-gray-500">points</p>
                          </div>
                          <Switch
                            checked={rule.isActive}
                            onCheckedChange={() => toggleRuleStatus(rule.id)}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteScoringRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Score Thresholds & Top Leads */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scoringThresholds.map((threshold) => (
                <div key={threshold.grade} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${threshold.color}`} />
                    <div>
                      <p className="font-medium">Grade {threshold.grade}</p>
                      <p className="text-sm text-gray-600">{threshold.label}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p>{threshold.minScore}-{threshold.maxScore}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Scored Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leadProfiles.slice(0, 5).map((lead) => {
                const gradeInfo = getGradeForScore(lead.score);
                return (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                      <p className="text-xs text-gray-500">
                        Last active: {lead.lastActivity.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge className={gradeInfo.color.replace('bg-', 'bg-').replace('-500', '-100') + ' text-gray-700'}>
                          {lead.grade}
                        </Badge>
                        <span className="font-bold">{lead.score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
