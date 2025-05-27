
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Facebook, Instagram, Twitter, Linkedin, Calendar, TrendingUp, Brain } from 'lucide-react';
import { useAIStore } from '@/store/useAIStore';
import { toast } from 'sonner';

export function AISocialMediaManagement() {
  const { 
    aiSocialPosts, 
    generateSocialMediaPost 
  } = useAIStore();
  
  const [platform, setPlatform] = useState('facebook');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      await generateSocialMediaPost(platform, topic, tone);
      setTopic('');
      toast.success('Social media post generated successfully!');
    } catch (error) {
      toast.error('Failed to generate post');
    } finally {
      setIsGenerating(false);
    }
  };

  const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="h-6 w-6" />
            AI Social Media Management
          </h2>
          <p className="text-muted-foreground">
            Generate and schedule social media content with AI
          </p>
        </div>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Content Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Social Post</CardTitle>
            <CardDescription>Create AI-powered social media content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="exciting">Exciting</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Topic/Theme</Label>
              <Textarea
                placeholder="Describe what you want to post about (e.g., 'New product launch', 'Industry insights', 'Company culture')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleGeneratePost}
              disabled={isGenerating || !topic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Generating Post...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Social Post
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>AI-powered social media analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">45%</div>
                  <div className="text-sm text-purple-600">Engagement Boost</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-green-600">Content Quality</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Posts Generated</span>
                  <span className="font-medium">{aiSocialPosts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Engagement</span>
                  <span className="font-medium">+45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Best Performing Platform</span>
                  <span className="font-medium">LinkedIn</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Social Posts</CardTitle>
          <CardDescription>AI-created social media content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiSocialPosts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No social posts generated yet. Create your first AI-powered post above!
              </div>
            ) : (
              aiSocialPosts.slice(-5).reverse().map((post) => {
                const PlatformIcon = platformIcons[post.platform as keyof typeof platformIcons];
                return (
                  <div key={post.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformIcon className="h-4 w-4" />
                        <span className="font-medium capitalize">{post.platform}</span>
                        {post.generated && <Badge variant="secondary">AI Generated</Badge>}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {post.scheduledAt.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm">{post.content}</p>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      {post.hashtags.map((hashtag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{hashtag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <div className="font-medium">{post.performance_prediction.engagement_score}%</div>
                        <div className="text-xs text-muted-foreground">Predicted Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{post.performance_prediction.reach_estimate}</div>
                        <div className="text-xs text-muted-foreground">Estimated Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">
                          {post.performance_prediction.best_posting_time.toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Best Time</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3 mr-1" />
                        Post Now
                      </Button>
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
