
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Target, Brain } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIAnalytics() {
  const { 
    analyticsInsights, 
    generateInsights 
  } = useAIStore();
  
  const [selectedDataType, setSelectedDataType] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30_days');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      await generateInsights(selectedDataType, selectedTimeframe);
      toast.success('AI insights generated successfully!');
    } catch (error) {
      toast.error('Failed to generate insights');
    } finally {
      setIsGenerating(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'prediction': return Target;
      default: return BarChart3;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            AI Analytics & Insights
          </h2>
          <p className="text-muted-foreground">
            Discover patterns and trends in your data with AI-powered analytics
          </p>
        </div>
        <Button variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          Advanced Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Insights</CardTitle>
            <CardDescription>Create AI-powered insights from your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Type</label>
              <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Data</SelectItem>
                  <SelectItem value="leads">Leads</SelectItem>
                  <SelectItem value="conversations">Conversations</SelectItem>
                  <SelectItem value="campaigns">Campaigns</SelectItem>
                  <SelectItem value="appointments">Appointments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7_days">Last 7 Days</SelectItem>
                  <SelectItem value="30_days">Last 30 Days</SelectItem>
                  <SelectItem value="90_days">Last 90 Days</SelectItem>
                  <SelectItem value="1_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Key metrics and performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-blue-600">Active Insights</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-green-600">Accuracy Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Trends Identified</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Anomalies Detected</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Recommendations</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
          <CardDescription>Latest insights and recommendations from AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {analyticsInsights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No insights generated yet. Use the insight generator above to analyze your data!
                  </div>
                ) : (
                  analyticsInsights.map((insight) => {
                    const Icon = getInsightIcon(insight.type);
                    return (
                      <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium">{insight.title}</h3>
                              <p className="text-sm text-muted-foreground">{insight.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {insight.type}
                            </Badge>
                            <Badge 
                              variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                            >
                              {insight.impact} impact
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              Confidence: {Math.round(insight.confidence * 100)}%
                            </span>
                            {insight.actionable && (
                              <Badge variant="secondary">Actionable</Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {insight.createdAt.toLocaleString()}
                          </span>
                        </div>
                        
                        {insight.actionable && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              Take Action
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
            
            {['trends', 'anomalies', 'recommendations', 'predictions'].map((type) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="space-y-4">
                  {analyticsInsights.filter(insight => insight.type === type.slice(0, -1) || (type === 'recommendations' && insight.type === 'recommendation')).map((insight) => {
                    const Icon = getInsightIcon(insight.type);
                    return (
                      <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <h3 className="font-medium">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {analyticsInsights.filter(insight => insight.type === type.slice(0, -1) || (type === 'recommendations' && insight.type === 'recommendation')).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No {type} found. Generate more insights to see data here.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
