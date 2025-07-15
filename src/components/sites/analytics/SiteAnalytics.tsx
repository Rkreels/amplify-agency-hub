
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, Eye, Clock, MousePointer, Smartphone, Monitor, Tablet, Globe, Calendar, Download } from 'lucide-react';

const trafficData = [
  { date: '2024-01-01', visitors: 1245, pageViews: 3421, bounceRate: 45, avgSession: 180 },
  { date: '2024-01-02', visitors: 1456, pageViews: 3876, bounceRate: 42, avgSession: 195 },
  { date: '2024-01-03', visitors: 1123, pageViews: 2987, bounceRate: 48, avgSession: 165 },
  { date: '2024-01-04', visitors: 1678, pageViews: 4234, bounceRate: 38, avgSession: 210 },
  { date: '2024-01-05', visitors: 1534, pageViews: 3987, bounceRate: 41, avgSession: 187 },
  { date: '2024-01-06', visitors: 1789, pageViews: 4567, bounceRate: 35, avgSession: 225 },
  { date: '2024-01-07', visitors: 1923, pageViews: 4876, bounceRate: 32, avgSession: 240 }
];

const deviceData = [
  { name: 'Desktop', value: 45, color: '#8884d8' },
  { name: 'Mobile', value: 35, color: '#82ca9d' },
  { name: 'Tablet', value: 20, color: '#ffc658' }
];

const topPages = [
  { page: '/', views: 12543, bounce: 32, avgTime: '2:45' },
  { page: '/about', views: 8765, bounce: 28, avgTime: '3:12' },
  { page: '/services', views: 6543, bounce: 35, avgTime: '2:30' },
  { page: '/contact', views: 4321, bounce: 25, avgTime: '1:45' },
  { page: '/blog', views: 3456, bounce: 45, avgTime: '4:20' }
];

const conversionData = [
  { page: 'Landing Page A', visitors: 1000, conversions: 45, rate: 4.5 },
  { page: 'Landing Page B', visitors: 800, conversions: 52, rate: 6.5 },
  { page: 'Contact Form', visitors: 600, conversions: 78, rate: 13.0 },
  { page: 'Pricing Page', visitors: 400, conversions: 28, rate: 7.0 }
];

export function SiteAnalytics() {
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Analytics</h2>
          <p className="text-gray-600">Track your website performance and visitor behavior</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10,748</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +12.5% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">27,948</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  +8.2% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3:42</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  -2.1% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38.2%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                  -5.3% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Traffic Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="visitors" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="pageViews" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-gray-500">{page.views.toLocaleString()} views</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{page.bounce}% bounce</div>
                        <div className="text-xs text-gray-500">{page.avgTime} avg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Behavior Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Globe className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Behavior Flow Analysis</h3>
                <p className="text-muted-foreground">Track how users navigate through your site</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.page}</div>
                      <div className="text-sm text-gray-500">{item.visitors} visitors</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{item.rate}%</div>
                      <div className="text-sm text-gray-500">{item.conversions} conversions</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">247</div>
                <p className="text-sm text-muted-foreground">Users online now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Active Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>/</span>
                    <Badge variant="secondary">89</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>/about</span>
                    <Badge variant="secondary">45</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>/services</span>
                    <Badge variant="secondary">32</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Direct</span>
                    <span>45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Search</span>
                    <span>35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Social</span>
                    <span>20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
