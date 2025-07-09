
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Mail, 
  MessageSquare, 
  Share2, 
  BarChart3, 
  Users, 
  TrendingUp,
  Calendar,
  Play,
  Pause,
  Plus,
  Settings,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'social' | 'ads';
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate: string;
  audience: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale Email Campaign',
    type: 'email',
    status: 'active',
    budget: 5000,
    spent: 3240,
    impressions: 45000,
    clicks: 2250,
    conversions: 189,
    roi: 285,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    audience: 'All Subscribers'
  },
  {
    id: '2',
    name: 'New Product Launch SMS',
    type: 'sms',
    status: 'active',
    budget: 2000,
    spent: 1890,
    impressions: 12000,
    clicks: 840,
    conversions: 67,
    roi: 156,
    startDate: '2024-06-15',
    endDate: '2024-07-15',
    audience: 'VIP Customers'
  },
  {
    id: '3',
    name: 'Facebook Lead Generation',
    type: 'social',
    status: 'paused',
    budget: 8000,
    spent: 4500,
    impressions: 89000,
    clicks: 3560,
    conversions: 245,
    roi: 198,
    startDate: '2024-05-01',
    endDate: '2024-08-01',
    audience: 'Lookalike Audience'
  }
];

const performanceData = [
  { month: 'Jan', revenue: 45000, leads: 1200, campaigns: 8 },
  { month: 'Feb', revenue: 52000, leads: 1400, campaigns: 10 },
  { month: 'Mar', revenue: 48000, leads: 1300, campaigns: 9 },
  { month: 'Apr', revenue: 61000, leads: 1650, campaigns: 12 },
  { month: 'May', revenue: 58000, leads: 1550, campaigns: 11 },
  { month: 'Jun', revenue: 67000, leads: 1800, campaigns: 15 }
];

export function MarketingHub() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'social': return Share2;
      case 'ads': return Target;
      default: return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'sms': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-purple-100 text-purple-800';
      case 'ads': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const marketingStats = [
    {
      title: "Active Campaigns",
      value: campaigns.filter(c => c.status === 'active').length.toString(),
      icon: Target,
      color: "text-blue-600"
    },
    {
      title: "Total Spent",
      value: `$${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Total Impressions",
      value: campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString(),
      icon: Eye,
      color: "text-purple-600"
    },
    {
      title: "Avg. ROI",
      value: `${Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length)}%`,
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Marketing Hub
          </h1>
          <p className="text-muted-foreground">Create, manage, and optimize your marketing campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Search */}
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">Filter</Button>
          </div>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => {
              const TypeIcon = getTypeIcon(campaign.type);
              const budgetUsed = (campaign.spent / campaign.budget) * 100;
              const clickRate = ((campaign.clicks / campaign.impressions) * 100).toFixed(2);
              const conversionRate = ((campaign.conversions / campaign.clicks) * 100).toFixed(2);

              return (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-5 w-5 text-primary" />
                        <Badge className={getTypeColor(campaign.type)}>
                          {campaign.type}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Audience: {campaign.audience}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Used</span>
                        <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                      </div>
                      <Progress value={budgetUsed} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                        <div className="font-semibold">{campaign.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                        <div className="font-semibold">{campaign.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Conversions</div>
                        <div className="font-semibold">{campaign.conversions}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                        <div className="font-semibold text-green-600">{campaign.roi}%</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-xs text-muted-foreground">
                        CTR: {clickRate}% • CVR: {conversionRate}%
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaign Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input placeholder="Enter campaign name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input placeholder="Email subject line" />
                </div>
                <div>
                  <label className="text-sm font-medium">Audience</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Subscribers</option>
                    <option>Active Customers</option>
                    <option>Prospects</option>
                    <option>VIP Customers</option>
                  </select>
                </div>
                <Button className="w-full">Create Email Campaign</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Open Rate</span>
                  <span className="font-semibold">24.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Click Rate</span>
                  <span className="font-semibold">5.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Unsubscribe Rate</span>
                  <span className="font-semibold">0.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Bounce Rate</span>
                  <span className="font-semibold">2.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SMS Campaign Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Campaign Name</label>
                  <Input placeholder="Enter campaign name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea 
                    className="w-full p-2 border rounded-md" 
                    rows={3}
                    placeholder="Your SMS message (160 characters max)"
                  />
                  <div className="text-xs text-muted-foreground mt-1">0/160 characters</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Recipients</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Contacts</option>
                    <option>Customers</option>
                    <option>Prospects</option>
                    <option>Custom Segment</option>
                  </select>
                </div>
                <Button className="w-full">Send SMS Campaign</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Delivery Rate</span>
                  <span className="font-semibold">98.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Rate</span>
                  <span className="font-semibold">12.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Opt-out Rate</span>
                  <span className="font-semibold">0.4%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Response Time</span>
                  <span className="font-semibold">8 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Campaigns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Facebook Ads</h4>
                      <p className="text-sm text-muted-foreground">3 active campaigns</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Instagram Ads</h4>
                      <p className="text-sm text-muted-foreground">2 active campaigns</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">LinkedIn Ads</h4>
                      <p className="text-sm text-muted-foreground">1 active campaign</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Reach</span>
                  <span className="font-semibold">125K</span>
                </div>
                <div className="flex justify-between">
                  <span>Engagement Rate</span>
                  <span className="font-semibold">3.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Click-through Rate</span>
                  <span className="font-semibold">2.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost per Click</span>
                  <span className="font-semibold">$1.24</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leads & Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="campaigns" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span>Email Marketing</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">ROI: 420%</span>
                    <Progress value={85} className="w-24" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span>SMS Marketing</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">ROI: 380%</span>
                    <Progress value={76} className="w-24" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-purple-600" />
                    <span>Social Media</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">ROI: 250%</span>
                    <Progress value={62} className="w-24" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span>Paid Advertising</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">ROI: 180%</span>
                    <Progress value={45} className="w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
