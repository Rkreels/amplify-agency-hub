
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  DollarSign,
  Target,
  Activity,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: 'Jan', revenue: 45000, leads: 120, appointments: 45 },
  { month: 'Feb', revenue: 52000, leads: 140, appointments: 52 },
  { month: 'Mar', revenue: 48000, leads: 130, appointments: 48 },
  { month: 'Apr', revenue: 61000, leads: 165, appointments: 61 },
  { month: 'May', revenue: 58000, leads: 155, appointments: 58 },
  { month: 'Jun', revenue: 67000, leads: 180, appointments: 67 }
];

const leadSourceData = [
  { name: 'Google Ads', value: 35, color: '#8884d8' },
  { name: 'Facebook', value: 28, color: '#82ca9d' },
  { name: 'Referrals', value: 20, color: '#ffc658' },
  { name: 'Direct', value: 17, color: '#ff7300' }
];

const conversionData = [
  { stage: 'Leads', count: 450, percentage: 100 },
  { stage: 'Qualified', count: 315, percentage: 70 },
  { stage: 'Proposals', count: 180, percentage: 40 },
  { stage: 'Closed', count: 90, percentage: 20 }
];

export function ComprehensiveDashboard() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: "Total Revenue",
      value: "$67,340",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Leads",
      value: "1,248",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Appointments",
      value: "156",
      change: "-2.1%",
      trend: "down",
      icon: Calendar,
      color: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: "18.4%",
      change: "+3.2%",
      trend: "up",
      icon: Target,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    { id: 1, type: 'lead', message: 'New lead from Facebook campaign', time: '2 minutes ago', icon: Users },
    { id: 2, type: 'appointment', message: 'Meeting scheduled with John Doe', time: '15 minutes ago', icon: Calendar },
    { id: 3, type: 'call', message: 'Missed call from (555) 123-4567', time: '32 minutes ago', icon: Phone },
    { id: 4, type: 'email', message: 'Email campaign sent to 450 contacts', time: '1 hour ago', icon: Mail },
    { id: 5, type: 'review', message: 'New 5-star review received', time: '2 hours ago', icon: Star }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeRange('7d')} 
                  className={timeRange === '7d' ? 'bg-primary text-primary-foreground' : ''}>
            7 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('30d')}
                  className={timeRange === '30d' ? 'bg-primary text-primary-foreground' : ''}>
            30 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('90d')}
                  className={timeRange === '90d' ? 'bg-primary text-primary-foreground' : ''}>
            90 Days
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium">{stage.stage}</div>
                      <Progress value={stage.percentage} className="w-64" />
                      <div className="text-sm text-muted-foreground">{stage.percentage}%</div>
                    </div>
                    <div className="font-semibold">{stage.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads & Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Leads & Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="appointments" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Email Open Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={68} className="w-24" />
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Click-through Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={24} className="w-24" />
                      <span className="text-sm font-medium">24%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Call Answer Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={82} className="w-24" />
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SMS Response Rate</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={91} className="w-24" />
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                    <div className="p-2 rounded-full bg-primary/10">
                      <activity.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Revenue Goal</span>
                    <span>$67,340 / $80,000</span>
                  </div>
                  <Progress value={84} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Lead Goal</span>
                    <span>1,248 / 1,500</span>
                  </div>
                  <Progress value={83} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Appointment Goal</span>
                    <span>156 / 200</span>
                  </div>
                  <Progress value={78} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Sarah Johnson</span>
                  <Badge variant="default">Top Performer</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mike Chen</span>
                  <Badge variant="secondary">Above Target</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lisa Wang</span>
                  <Badge variant="outline">On Track</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
