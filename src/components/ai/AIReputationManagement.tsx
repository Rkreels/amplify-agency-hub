
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Settings, Brain } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIReputationManagement() {
  const { 
    reputationResponses, 
    generateReputationResponse 
  } = useAIStore();
  
  const [reviewText, setReviewText] = useState('');
  const [sentiment, setSentiment] = useState('positive');
  const [platform, setPlatform] = useState('google');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateResponse = async () => {
    if (!reviewText.trim()) {
      toast.error('Please enter review text');
      return;
    }

    setIsGenerating(true);
    try {
      await generateReputationResponse(Date.now().toString(), reviewText, sentiment);
      setReviewText('');
      toast.success('AI response generated successfully!');
    } catch (error) {
      toast.error('Failed to generate response');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return ThumbsUp;
      case 'negative': return ThumbsDown;
      default: return MessageSquare;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6" />
            AI Reputation Management
          </h2>
          <p className="text-muted-foreground">
            Automatically respond to reviews and manage online reputation with AI
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Response Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Review Response</CardTitle>
            <CardDescription>Create AI-powered responses to customer reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="yelp">Yelp</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sentiment</Label>
                <Select value={sentiment} onValueChange={setSentiment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Review Text</Label>
              <Textarea
                placeholder="Paste the customer review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleGenerateResponse}
              disabled={isGenerating || !reviewText.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Generating Response...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Generate AI Response
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reputation Analytics</CardTitle>
            <CardDescription>Track your online reputation performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">4.8★</div>
                  <div className="text-sm text-yellow-600">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-green-600">Response Rate</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Responses Generated</span>
                  <span className="font-medium">{reputationResponses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Positive Reviews</span>
                  <span className="font-medium">{reputationResponses.filter(r => r.sentiment === 'positive').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Negative Reviews</span>
                  <span className="font-medium">{reputationResponses.filter(r => r.sentiment === 'negative').length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Responses</CardTitle>
          <CardDescription>Recent AI responses to customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reputationResponses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No responses generated yet. Create your first AI review response above!
              </div>
            ) : (
              reputationResponses.slice(-5).reverse().map((response) => {
                const SentimentIcon = getSentimentIcon(response.sentiment);
                return (
                  <div key={response.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SentimentIcon className={`h-4 w-4 ${getSentimentColor(response.sentiment)}`} />
                        <span className="font-medium capitalize">{response.platform}</span>
                        <Badge variant="outline" className="capitalize">
                          {response.sentiment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {response.tone}
                        </Badge>
                        <Badge variant={response.posted ? 'default' : 'outline'}>
                          {response.posted ? 'Posted' : 'Draft'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Original Review:</p>
                        <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                          {response.originalReview}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">AI Response:</p>
                        <p className="text-sm bg-blue-50 p-2 rounded">
                          {response.aiResponse}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Edit Response
                      </Button>
                      {!response.posted && (
                        <Button size="sm" variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          Post Response
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
