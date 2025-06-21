
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  Settings,
  ExternalLink
} from 'lucide-react';
import { type EmailDeliverability } from '@/store/useEmailMarketingStore';

interface EmailDeliverabilityReportProps {
  deliverability: EmailDeliverability;
}

export function EmailDeliverabilityReport({ deliverability }: EmailDeliverabilityReportProps) {
  const getReputationColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSetupStatus = (isSetup: boolean) => {
    return isSetup ? (
      <Badge variant="default" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Configured
      </Badge>
    ) : (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Not Configured
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Domain Reputation</p>
                <p className={`text-3xl font-bold ${getReputationColor(deliverability.reputation)}`}>
                  {deliverability.reputation}/100
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Deliverability Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {deliverability.deliverabilityRate}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Spam Score</p>
                <p className="text-3xl font-bold text-orange-600">
                  {deliverability.spamScore}/10
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">DKIM (DomainKeys Identified Mail)</h4>
                <p className="text-sm text-gray-600">Authenticates your emails and improves deliverability</p>
              </div>
              <div className="flex items-center gap-2">
                {getSetupStatus(deliverability.dkimSetup)}
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SPF (Sender Policy Framework)</h4>
                <p className="text-sm text-gray-600">Prevents email spoofing and spam</p>
              </div>
              <div className="flex items-center gap-2">
                {getSetupStatus(deliverability.spfSetup)}
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">DMARC (Domain-based Message Authentication)</h4>
                <p className="text-sm text-gray-600">Protects against email spoofing and phishing</p>
              </div>
              <div className="flex items-center gap-2">
                {getSetupStatus(deliverability.dmarcSetup)}
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Delivery Rate</span>
                <span>{deliverability.deliverabilityRate}%</span>
              </div>
              <Progress value={deliverability.deliverabilityRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Bounce Rate</span>
                <span>{deliverability.bounceRate}%</span>
              </div>
              <Progress value={deliverability.bounceRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Spam Rate</span>
                <span>{deliverability.spamRate}%</span>
              </div>
              <Progress value={deliverability.spamRate} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Improvement Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!deliverability.dmarcSetup && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">Setup DMARC Authentication</p>
                  <p className="text-sm text-yellow-700">Improve deliverability by 15-20%</p>
                </div>
                <Button variant="outline" size="sm">
                  Setup
                </Button>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Warm Up Your Domain</p>
                <p className="text-sm text-blue-700">Gradually increase sending volume for better reputation</p>
              </div>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
