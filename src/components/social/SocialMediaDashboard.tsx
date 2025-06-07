
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  Image,
  Video,
  Send,
  Eye,
  BarChart3
} from 'lucide-react';
import { useSocialMediaStore } from '@/store/useSocialMediaStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';

export function SocialMediaDashboard() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook']);
  const [postContent, setPostContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  
  const { 
    posts, 
    analytics,
    accounts,
    schedulePost,
    publishPost 
  } = useSocialMediaStore();
  
  const { announceFeature } = useVoiceTraining();

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' }
  ];

  const handleCreatePost = () => {
    setIsComposerOpen(true);
    announceFeature('Social Media Composer', 'Opening multi-platform post composer with scheduling and analytics tracking');
  };

  const handleSchedulePost = () => {
    if (postContent && selectedPlatforms.length > 0) {
      schedulePost({
        content: postContent,
        platforms: selectedPlatforms,
        scheduledDate: scheduledDate || new Date(),
        status: 'scheduled'
      });
      announceFeature('Post Scheduled', `Post scheduled for ${selectedPlatforms.join(', ')} platforms`);
      setIsComposerOpen(false);
      setPostContent('');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    if (!platformData) return null;
    const Icon = platformData.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Management</h2>
          <p className="text-muted-foreground">Schedule posts, monitor engagement, and analyze performance across platforms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={handleCreatePost}>
            <Send className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Social Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34,567</div>
            <p className="text-xs text-muted-foreground">+1,234 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4%</div>
            <p className="text-xs text-muted-foreground">+0.8% vs last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Send className="h-4 w-4 mr-2" />
              Posts This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <div key={platform.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded ${platform.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Management Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {post.platforms.map((platform) => (
                          <div key={platform} className="flex items-center gap-1">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                      <Badge variant={
                        post.status === 'published' ? 'default' :
                        post.status === 'scheduled' ? 'secondary' : 'outline'
                      }>
                        {post.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {post.scheduledDate.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3">{post.content}</p>
                    
                    {post.status === 'published' && (
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.analytics?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {post.analytics?.comments || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share className="h-3 w-3" />
                          {post.analytics?.shares || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.analytics?.reach || 0}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {post.status === 'draft' && (
                      <Button size="sm">
                        <Send className="h-3 w-3 mr-1" />
                        Publish
                      </Button>
                    )}
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar mode="single" className="rounded-md border" />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Posts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {posts.filter(p => p.status === 'scheduled').slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center gap-2 p-2 border rounded">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{post.content.substring(0, 30)}...</div>
                        <div className="text-xs text-muted-foreground">
                          {post.scheduledDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Engagement analytics chart will be displayed here
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${platform.color} text-white`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">8.2%</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Brand Monitoring</h3>
                <p className="text-gray-600 mb-4">Monitor mentions, hashtags, and conversations about your brand</p>
                <Button>Set Up Monitoring</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Post Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create Social Media Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Platforms</label>
                <div className="flex gap-2">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        onClick={() => {
                          setSelectedPlatforms(prev => 
                            isSelected 
                              ? prev.filter(p => p !== platform.id)
                              : [...prev, platform.id]
                          );
                        }}
                        className={`p-3 rounded-lg border transition-colors ${
                          isSelected ? platform.color + ' text-white' : 'border-gray-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Post Content</label>
                <Textarea
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline">
                  <Image className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
                <Button variant="outline">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSchedulePost} disabled={!postContent || selectedPlatforms.length === 0}>
                  <Send className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="outline" onClick={() => setIsComposerOpen(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
