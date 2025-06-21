
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PipelineStage {
  name: string;
  value: number;
  count: number;
  color: string;
  percentage: number;
}

export function PipelineWidget() {
  const navigate = useNavigate();

  const pipelineStages: PipelineStage[] = [
    { name: 'Leads', value: 45600, count: 23, color: 'bg-gray-500', percentage: 100 },
    { name: 'Qualified', value: 38200, count: 18, color: 'bg-blue-500', percentage: 84 },
    { name: 'Proposal', value: 28400, count: 12, color: 'bg-yellow-500', percentage: 62 },
    { name: 'Negotiation', value: 19800, count: 8, color: 'bg-orange-500', percentage: 43 },
    { name: 'Closed Won', value: 12300, count: 5, color: 'bg-green-500', percentage: 27 }
  ];

  const totalValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0);
  const conversionRate = ((pipelineStages[4].count / pipelineStages[0].count) * 100).toFixed(1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Sales Pipeline
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/opportunities')}>
          <Eye className="h-4 w-4 mr-1" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pipeline Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
              <DollarSign className="h-5 w-5" />
              {(totalValue / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-gray-600">Total Pipeline</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {conversionRate}%
            </div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-purple-600">
              <TrendingUp className="h-5 w-5" />
              23%
            </div>
            <p className="text-sm text-gray-600">Growth</p>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="space-y-4">
          {pipelineStages.map((stage, index) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <span className="font-medium">{stage.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {stage.count} deals
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="font-semibold">${(stage.value / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <div className="ml-6">
                <Progress value={stage.percentage} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Funnel Visualization */}
        <div className="relative">
          <div className="text-sm font-medium text-gray-700 mb-3">Conversion Funnel</div>
          <div className="space-y-1">
            {pipelineStages.map((stage, index) => (
              <div
                key={stage.name}
                className="flex items-center justify-between p-2 rounded"
                style={{
                  background: `linear-gradient(to right, ${stage.color.replace('bg-', '#')} ${stage.percentage}%, #f3f4f6 ${stage.percentage}%)`,
                  marginLeft: `${index * 8}px`,
                  marginRight: `${index * 8}px`
                }}
              >
                <span className="text-xs font-medium text-white mix-blend-difference">
                  {stage.name}
                </span>
                <span className="text-xs font-medium text-white mix-blend-difference">
                  {stage.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Opportunities */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Recent Opportunities</h4>
          <div className="space-y-2">
            {[
              { name: 'ABC Corp - Enterprise Plan', value: '$15,000', stage: 'Negotiation', probability: '75%' },
              { name: 'Tech Solutions - Premium', value: '$8,500', stage: 'Proposal', probability: '60%' },
              { name: 'Marketing Agency Deal', value: '$12,000', stage: 'Qualified', probability: '40%' }
            ].map((opp, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-sm">{opp.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{opp.stage}</Badge>
                    <span className="text-xs text-gray-500">Prob: {opp.probability}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{opp.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
