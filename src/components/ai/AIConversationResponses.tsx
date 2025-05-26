
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Bot, Send, ThumbsUp, ThumbsDown, Settings } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIConversationResponses() {
  const { 
    conversationResponses, 
    isGeneratingResponse, 
    generateConversationResponse 
  } = useAIStore();
  
  const [testMessage, setTestMessage] = useState('');
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const [responseDelay, setResponseDelay] = useState(2);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);

  const handleTestResponse = async () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    try {
      await generateConversationResponse(testMessage, 'test-conversation');
      setTestMessage('');
      toast.success('AI response generated successfully!');
    } catch (error) {
      toast.error('Failed to generate response');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            AI Conversation Responses
          </h2>
          <p className="text-muted-foreground">
            Automatically generate intelligent responses to customer messages using AI
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Advanced Settings
        </Button>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Settings</CardTitle>
            <CardDescription>Configure how AI responds to conversations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Response</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate responses
                </p>
              </div>
              <Switch 
                checked={autoResponseEnabled}
                onCheckedChange={setAutoResponseEnabled}
              />
            </div>

            <div className="space-y-2">
              <Label>Response Delay (seconds)</Label>
              <Input
                type="number"
                value={responseDelay}
                onChange={(e) => setResponseDelay(Number(e.target.value))}
                min="0"
                max="30"
              />
            </div>

            <div className="space-y-2">
              <Label>Confidence Threshold</Label>
              <Input
                type="number"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                min="0"
                max="1"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground">
                Minimum confidence required to send auto-response
              </p>
            </div>

            <Button className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test AI Response</CardTitle>
            <CardDescription>Try out the AI response generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Test Message</Label>
              <Textarea
                placeholder="Enter a customer message to test AI response..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleTestResponse}
              disabled={isGeneratingResponse || !testMessage.trim()}
              className="w-full"
            >
              {isGeneratingResponse ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Generating Response...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate AI Response
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Responses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Responses</CardTitle>
          <CardDescription>
            Latest AI-generated conversation responses with performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversationResponses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No AI responses generated yet. Try the test feature above!
              </div>
            ) : (
              conversationResponses.slice(-5).reverse().map((response) => (
                <div key={response.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {response.intent}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant={response.confidence > 0.8 ? 'default' : 'secondary'}>
                        {Math.round(response.confidence * 100)}% confidence
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Original Message:</p>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                        {response.originalMessage}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">AI Response:</p>
                      <p className="text-sm bg-blue-50 p-2 rounded">
                        {response.aiResponse}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Generated {response.timestamp.toLocaleString()}
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
