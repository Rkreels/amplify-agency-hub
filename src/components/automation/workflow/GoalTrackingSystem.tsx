
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Filter,
  Edit,
  Trash2
} from 'lucide-react';

interface ConversionGoal {
  id: string;
  name: string;
  description: string;
  type: 'conversion_rate' | 'revenue' | 'lead_count' | 'engagement';
  target: number;
  current: number;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  workflows: string[];
}

interface FunnelStep {
  id: string;
  name: string;
  count: number;
  percentage: number;
  dropOffRate?: number;
}

interface ConversionFunnel {
  id: string;
  name: string;
  steps: FunnelStep[];
  totalEntries: number;
  conversionRate: number;
  timeframe: string;
}

interface GoalAnalytics {
  goalId: string;
  period: string;
  achieved: number;
  target: number;
  growth: number;
  timestamp: Date;
}

export function GoalTrackingSystem() {
  const [goals, setGoals] = useState<ConversionGoal[]>([
    {
      id: 'goal-1',
      name: 'Email Campaign Conversion',
      description: 'Increase email to purchase conversion rate',
      type: 'conversion_rate',
      target: 15,
      current: 12.3,
      timeframe: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      workflows: ['welcome-series', 'nurture-campaign']
    },
    {
      id: 'goal-2',
      name: 'Monthly Revenue Target',
      description: 'Generate $50k monthly recurring revenue',
      type: 'revenue',
      target: 50000,
      current: 42500,
      timeframe: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      workflows: ['sales-sequence', 'upsell-campaign']
    },
    {
      id: 'goal-3',
      name: 'Lead Generation',
      description: 'Generate 500 qualified leads per month',
      type: 'lead_count',
      target: 500,
      current: 387,
      timeframe: 'monthly',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      workflows: ['lead-magnet', 'webinar-funnel']
    }
  ]);

  const [funnels, setFunnels] = useState<ConversionFunnel[]>([
    {
      id: 'funnel-1',
      name: 'Lead to Customer',
      totalEntries: 2500,
      conversionRate: 8.4,
      timeframe: 'Last 30 days',
      steps: [
        { id: 'step-1', name: 'Lead Captured', count: 2500, percentage: 100 },
        { id: 'step-2', name: 'Email Opened', count: 1875, percentage: 75, dropOffRate: 25 },
        { id: 'step-3', name: 'Link Clicked', count: 938, percentage: 37.5, dropOffRate: 37.5 },
        { id: 'step-4', name: 'Demo Booked', count: 313, percentage: 12.5, dropOffRate: 25 },
        { id: 'step-5', name: 'Proposal Sent', count: 188, percentage: 7.5, dropOffRate: 5 },
        { id: 'step-6', name: 'Deal Closed', count: 210, percentage: 8.4, dropOffRate: -0.9 }
      ]
    },
    {
      id: 'funnel-2',
      name: 'Content to Trial',
      totalEntries: 5000,
      conversionRate: 12.2,
      timeframe: 'Last 30 days',
      steps: [
        { id: 'step-1', name: 'Content Downloaded', count: 5000, percentage: 100 },
        { id: 'step-2', name: 'Email Sequence Started', count: 4250, percentage: 85, dropOffRate: 15 },
        { id: 'step-3', name: 'Pricing Page Visited', count: 1500, percentage: 30, dropOffRate: 55 },
        { id: 'step-4', name: 'Trial Started', count: 610, percentage: 12.2, dropOffRate: 17.8 }
      ]
    }
  ]);

  const [newGoal, setNewGoal] = useState<Partial<ConversionGoal>>({
    type: 'conversion_rate',
    timeframe: 'monthly',
    isActive: true
  });

  const [activeTab, setActiveTab] = useState('goals');

  const addGoal = () => {
    if (!newGoal.name || !newGoal.target) {
      toast.error('Please fill in all required fields');
      return;
    }

    const goal: ConversionGoal = {
      id: `goal-${Date.now()}`,
      name: newGoal.name!,
      description: newGoal.description || '',
      type: newGoal.type as any,
      target: newGoal.target!,
      current: 0,
      timeframe: newGoal.timeframe as any,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
      workflows: []
    };

    setGoals([...goals, goal]);
    setNewGoal({
      type: 'conversion_rate',
      timeframe: 'monthly',
      isActive: true
    });
    toast.success('Goal created successfully');
  };

  const getGoalProgress = (goal: ConversionGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalStatus = (goal: ConversionGoal) => {
    const progress = getGoalProgress(goal);
    if (progress >= 100) return { status: 'completed', color: 'text-green-600', icon: CheckCircle };
    if (progress >= 75) return { status: 'on-track', color: 'text-blue-600', icon: TrendingUp };
    if (progress >= 50) return { status: 'at-risk', color: 'text-yellow-600', icon: AlertCircle };
    return { status: 'behind', color: 'text-red-600', icon: TrendingDown };
  };

  const formatGoalValue = (value: number, type: string) => {
    if (type === 'revenue') return `$${value.toLocaleString()}`;
    if (type === 'conversion_rate') return `${value}%`;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Goal Tracking System</h2>
          <p className="text-gray-600">Monitor conversion goals and funnel performance</p>
        </div>
        <Button onClick={() => setActiveTab('goals')}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-lg font-bold">{goals.filter(g => g.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-lg font-bold">
                  {goals.filter(g => getGoalProgress(g) >= 100).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-lg font-bold">
                  {Math.round(goals.reduce((acc, goal) => acc + getGoalProgress(goal), 0) / goals.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Funnels</p>
                <p className="text-lg font-bold">{funnels.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="funnels">
            <BarChart3 className="h-4 w-4 mr-2" />
            Funnels
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-6">
          {/* Add New Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Goal Name</Label>
                  <Input
                    value={newGoal.name || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    placeholder="e.g., Increase conversion rate"
                  />
                </div>
                <div>
                  <Label>Goal Type</Label>
                  <Select
                    value={newGoal.type}
                    onValueChange={(value) => setNewGoal({ ...newGoal, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversion_rate">Conversion Rate (%)</SelectItem>
                      <SelectItem value="revenue">Revenue ($)</SelectItem>
                      <SelectItem value="lead_count">Lead Count</SelectItem>
                      <SelectItem value="engagement">Engagement Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <Label>Timeframe</Label>
                  <Select
                    value={newGoal.timeframe}
                    onValueChange={(value) => setNewGoal({ ...newGoal, timeframe: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Describe what this goal aims to achieve"
                />
              </div>
              <Button onClick={addGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="grid gap-4">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal);
              const status = getGoalStatus(goal);
              const StatusIcon = status.icon;

              return (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{goal.name}</h3>
                          <Badge variant={goal.isActive ? "default" : "secondary"}>
                            {goal.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{goal.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Timeframe: {goal.timeframe}</span>
                          <span>Workflows: {goal.workflows.length}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm capitalize">{status.status}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">
                          {formatGoalValue(goal.current, goal.type)} / {formatGoalValue(goal.target, goal.type)}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-right text-sm text-gray-500">
                        {progress.toFixed(1)}% complete
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          {funnels.map((funnel) => (
            <Card key={funnel.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{funnel.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {funnel.timeframe} • {funnel.conversionRate}% conversion rate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{funnel.totalEntries.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">total entries</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnel.steps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{step.name}</h3>
                            <p className="text-sm text-gray-500">{step.count.toLocaleString()} contacts</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{step.percentage}%</p>
                          {step.dropOffRate !== undefined && step.dropOffRate > 0 && (
                            <p className="text-sm text-red-500">-{step.dropOffRate}% drop-off</p>
                          )}
                        </div>
                      </div>
                      <div 
                        className="h-2 bg-blue-600 rounded-full mt-2"
                        style={{ width: `${step.percentage}%` }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = getGoalProgress(goal);
                  const isOnTrack = progress >= 75;
                  
                  return (
                    <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${isOnTrack ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <h3 className="font-medium">{goal.name}</h3>
                          <p className="text-sm text-gray-600">{goal.timeframe} goal</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{progress.toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">
                          {formatGoalValue(goal.current, goal.type)} / {formatGoalValue(goal.target, goal.type)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
