
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Copy, RefreshCw, Mail, MessageSquare, Share2, FileText } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AIContentGeneration() {
  const { 
    generatedContent, 
    isGeneratingContent, 
    generateContent 
  } = useAIStore();
  
  const [contentType, setContentType] = useState('email');
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [audience, setAudience] = useState('general');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a content prompt');
      return;
    }

    try {
      const result = await generateContent(contentType, prompt, { tone, audience });
      setSelectedContent(result.id);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const handleRegenerateContent = async (contentId: string) => {
    const content = generatedContent.find(c => c.id === contentId);
    if (content) {
      await generateContent(content.type, content.prompt, { tone, audience });
      toast.success('Content regenerated!');
    }
  };

  const contentTypes = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'social_post', label: 'Social Media', icon: Share2 },
    { value: 'ad_copy', label: 'Ad Copy', icon: FileText }
  ];

  const tones = [
    'professional', 'friendly', 'casual', 'formal', 'persuasive', 'empathetic'
  ];

  const audiences = [
    'general', 'customers', 'prospects', 'partners', 'team', 'investors'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Content Generation
          </h2>
          <p className="text-muted-foreground">
            Generate high-quality content for emails, SMS, social media, and more
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Content</CardTitle>
            <CardDescription>Create AI-powered content for your campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a.charAt(0).toUpperCase() + a.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content Prompt</Label>
              <Textarea
                placeholder="Describe what you want to create (e.g., 'Welcome email for new customers who signed up for our premium service')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleGenerateContent}
              disabled={isGeneratingContent || !prompt.trim()}
              className="w-full"
            >
              {isGeneratingContent ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Content Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>AI-powered content metrics and insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-sm text-blue-600">Avg. Readability</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">74%</div>
                  <div className="text-sm text-green-600">Engagement Score</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Email Content</span>
                  <span className="font-medium">{generatedContent.filter(c => c.type === 'email').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SMS Content</span>
                  <span className="font-medium">{generatedContent.filter(c => c.type === 'sms').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Social Posts</span>
                  <span className="font-medium">{generatedContent.filter(c => c.type === 'social_post').length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Content */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>Your AI-generated content library</CardDescription>
        </CardHeader>
        <CardContent>
          {generatedContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No content generated yet. Create your first AI-powered content above!
            </div>
          ) : (
            <div className="space-y-4">
              {generatedContent.slice(-5).reverse().map((content) => (
                <div key={content.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {content.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary">
                        {content.tone}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyContent(content.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRegenerateContent(content.id)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Prompt:</p>
                    <p className="text-sm text-muted-foreground bg-gray-50 p-2 rounded">
                      {content.prompt}
                    </p>
                  </div>
                  
                  <Tabs defaultValue="main" className="w-full">
                    <TabsList>
                      <TabsTrigger value="main">Main Content</TabsTrigger>
                      <TabsTrigger value="variations">Variations</TabsTrigger>
                      <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="main" className="mt-3">
                      <div className="bg-blue-50 p-3 rounded">
                        {content.content}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="variations" className="mt-3">
                      <div className="space-y-2">
                        {content.variations.map((variation, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded">
                            {variation}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="metrics" className="mt-3">
                      {content.metrics && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="font-medium">{content.metrics.readability}%</div>
                            <div className="text-sm text-muted-foreground">Readability</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{Math.round(content.metrics.sentiment * 100)}%</div>
                            <div className="text-sm text-muted-foreground">Positive Sentiment</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">{content.metrics.engagement_prediction}%</div>
                            <div className="text-sm text-muted-foreground">Engagement Prediction</div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="text-xs text-muted-foreground">
                    Generated {content.createdAt.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
