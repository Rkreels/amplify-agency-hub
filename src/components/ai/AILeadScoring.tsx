
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, User, Settings, RefreshCw, Target, Brain } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AILeadScoring() {
  const { 
    leadScores, 
    scoringModel, 
    updateLeadScore 
  } = useAIStore();
  
  const [testContactId, setTestContactId] = useState('');
  const [selectedModel, setSelectedModel] = useState(scoringModel);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateScore = async () => {
    if (!testContactId.trim()) {
      toast.error('Please enter a contact ID');
      return;
    }

    setIsUpdating(true);
    try {
      await updateLeadScore(testContactId);
      setTestContactId('');
      toast.success('Lead score updated successfully!');
    } catch (error) {
      toast.error('Failed to update lead score');
    } finally {
      setIsUpdating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    return 'Cold';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            AI Lead Scoring
          </h2>
          <p className="text-muted-foreground">
            Automatically score and prioritize leads using machine learning
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Scoring Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scoring Configuration</CardTitle>
            <CardDescription>Configure AI lead scoring parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Scoring Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advanced_ml_v2">Advanced ML v2</SelectItem>
                  <SelectItem value="basic_rules">Basic Rules</SelectItem>
                  <SelectItem value="neural_network">Neural Network</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Test Contact ID</Label>
              <Input
                placeholder="Enter contact ID to score"
                value={testContactId}
                onChange={(e) => setTestContactId(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleUpdateScore}
              disabled={isUpdating || !testContactId.trim()}
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Calculating Score...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Calculate Lead Score
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scoring Metrics</CardTitle>
            <CardDescription>Performance insights for lead scoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Model Accuracy</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {leadScores.filter(s => s.score >= 80).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hot Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {leadScores.filter(s => s.score >= 60 && s.score < 80).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Warm Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {leadScores.filter(s => s.score < 60).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Cold Leads</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Lead Scores</CardTitle>
          <CardDescription>Latest AI-generated lead scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadScores.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No lead scores generated yet. Test the scoring feature above!
              </div>
            ) : (
              leadScores.slice(-5).reverse().map((score) => (
                <div key={score.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">Contact {score.contactId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={score.score >= 80 ? 'default' : score.score >= 60 ? 'secondary' : 'destructive'}>
                        {getScoreBadge(score.score)}
                      </Badge>
                      <span className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                        {score.score}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Scoring Factors:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {score.factors.map((factor, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="capitalize">{factor.factor}</span>
                          <span className="font-medium">+{factor.contribution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Confidence: {Math.round(score.confidence * 100)}%</span>
                    <span>Updated {score.lastUpdated.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
