
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, MessageCircle, TrendingUp, Link2, Plus, ExternalLink, ThumbsUp, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Reputation() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reputation</h1>
          <p className="text-muted-foreground">
            Manage reviews, testimonials, and your online reputation
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Overall Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5.0</div>
            <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Total Reviews</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">+15 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Review Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-xs text-muted-foreground">From review requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Active Campaigns</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Review generation</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Your latest reviews across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    id: 1, 
                    name: "Sarah Johnson", 
                    platform: "Google", 
                    rating: 5, 
                    content: "Excellent service! Their team was professional, responsive, and delivered outstanding results.",
                    date: "2 days ago" 
                  },
                  { 
                    id: 2, 
                    name: "Michael Brown", 
                    platform: "Facebook", 
                    rating: 4, 
                    content: "Very good experience overall. The only reason for 4 stars is that it took slightly longer than expected.",
                    date: "1 week ago" 
                  },
                  { 
                    id: 3, 
                    name: "Emma Davis", 
                    platform: "Yelp", 
                    rating: 5, 
                    content: "I cannot recommend this company enough. They went above and beyond to meet our needs and exceeded our expectations.",
                    date: "2 weeks ago" 
                  },
                ].map((review) => (
                  <div key={review.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{review.platform}</Badge>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm mb-3">{review.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{review.name}</div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Respond
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platforms Overview</CardTitle>
              <CardDescription>Your presence across review platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Google", reviews: 68, rating: 4.8, connected: true },
                  { name: "Facebook", reviews: 42, rating: 4.6, connected: true },
                  { name: "Yelp", reviews: 14, rating: 4.4, connected: true },
                  { name: "Trustpilot", reviews: 0, rating: 0, connected: false },
                ].map((platform, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{platform.name}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {platform.connected ? (
                          <>
                            <div className="flex mr-2">
                              {Array(5).fill(0).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < Math.floor(platform.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                              ))}
                            </div>
                            <span>{platform.rating} ({platform.reviews})</span>
                          </>
                        ) : (
                          <span>Not connected</span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {platform.connected ? (
                        <>
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </>
                      ) : (
                        <>
                          <Link2 className="h-3.5 w-3.5 mr-1.5" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Review Campaigns</CardTitle>
              <CardDescription>Generate more customer reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "Post-Purchase Review", status: "active", stats: { sent: 85, completed: 23 } },
                  { id: 2, name: "30-Day Follow-up", status: "active", stats: { sent: 124, completed: 41 } },
                  { id: 3, name: "Testimonial Collection", status: "active", stats: { sent: 48, completed: 12 } },
                ].map((campaign) => (
                  <div key={campaign.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{campaign.name}</div>
                      <Badge>{campaign.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{campaign.stats.sent} sent</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{campaign.stats.completed} completed</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
