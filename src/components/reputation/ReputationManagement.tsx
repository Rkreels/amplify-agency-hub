
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  TrendingUp, 
  MessageSquare, 
  ExternalLink,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Mail,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';

interface Review {
  id: string;
  platform: 'google' | 'facebook' | 'yelp' | 'trustpilot';
  rating: number;
  author: string;
  content: string;
  date: Date;
  responded: boolean;
  response?: string;
  location?: string;
}

export function ReputationManagement() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  
  const { announceFeature } = useVoiceTraining();

  const mockReviews: Review[] = [
    {
      id: '1',
      platform: 'google',
      rating: 5,
      author: 'Sarah Johnson',
      content: 'Excellent service! The team was professional and delivered exactly what was promised.',
      date: new Date('2025-01-05'),
      responded: true,
      response: 'Thank you Sarah! We appreciate your feedback and look forward to serving you again.',
      location: 'San Francisco, CA'
    },
    {
      id: '2',
      platform: 'facebook',
      rating: 4,
      author: 'Mike Chen',
      content: 'Great experience overall. Quick response time and good communication.',
      date: new Date('2025-01-03'),
      responded: false,
      location: 'Los Angeles, CA'
    },
    {
      id: '3',
      platform: 'yelp',
      rating: 2,
      author: 'Jennifer Smith',
      content: 'Service was slow and communication could be better. Expected more for the price.',
      date: new Date('2025-01-02'),
      responded: false,
      location: 'New York, NY'
    }
  ];

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review);
    announceFeature('Review Response', `Responding to ${review.rating}-star review from ${review.author} on ${review.platform}`);
  };

  const submitResponse = () => {
    if (selectedReview && responseText) {
      announceFeature('Response Submitted', 'Your response has been posted and the customer will be notified');
      setSelectedReview(null);
      setResponseText('');
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'google': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'yelp': return 'bg-red-100 text-red-800';
      case 'trustpilot': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reputation Management</h2>
          <p className="text-muted-foreground">Monitor and manage your online reviews and reputation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Google My Business
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send Review Request
          </Button>
        </div>
      </div>

      {/* Reputation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3 this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground">+18 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Response Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Within 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pending Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Management */}
      <Tabs defaultValue="reviews" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Review Campaigns</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search reviews..." />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPlatformColor(review.platform)}>
                          {review.platform}
                        </Badge>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {review.date.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.author}</span>
                        {review.location && (
                          <span className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {review.location}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm mb-4">{review.content}</p>
                      
                      {review.responded && review.response && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Your Response</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.response}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!review.responded && (
                        <Button 
                          onClick={() => handleRespondToReview(review)}
                          size="sm"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Respond
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm w-6">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${(rating === 5 ? 45 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 7 : 3)}%` }}
                        />
                      </div>
                      <span className="text-sm w-8">
                        {rating === 5 ? '45%' : rating === 4 ? '30%' : rating === 3 ? '15%' : rating === 2 ? '7%' : '3%'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['google', 'facebook', 'yelp', 'trustpilot'].map((platform) => (
                    <div key={platform} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getPlatformColor(platform)}>
                          {platform}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">4.3 ⭐</div>
                        <div className="text-sm text-muted-foreground">42 reviews</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Request Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Automated Review Requests</h3>
                <p className="text-gray-600 mb-4">Set up automated campaigns to request reviews from satisfied customers</p>
                <Button>Create Campaign</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google My Business Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Google My Business
              </Button>
              <p className="text-sm text-muted-foreground">
                Connect your Google My Business account to automatically sync reviews and respond directly from this dashboard.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Response Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Respond to Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{selectedReview.author}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < selectedReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedReview.content}</p>
              </div>
              
              <Textarea
                placeholder="Write your response..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
              
              <div className="flex gap-2">
                <Button onClick={submitResponse} disabled={!responseText}>
                  Post Response
                </Button>
                <Button variant="outline" onClick={() => setSelectedReview(null)}>
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
