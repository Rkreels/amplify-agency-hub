
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 12000, leads: 45 },
  { month: 'Feb', revenue: 15000, leads: 52 },
  { month: 'Mar', revenue: 18000, leads: 61 },
  { month: 'Apr', revenue: 22000, leads: 58 },
  { month: 'May', revenue: 25000, leads: 67 },
  { month: 'Jun', revenue: 28000, leads: 73 }
];

const dashboardStats = {
  totalContacts: 1247,
  totalRevenue: 125430,
  activeOpportunities: 24,
  callsToday: 18,
  emailsSent: 156,
  conversionRate: 8.2
};

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>

        <DashboardStats stats={dashboardStats} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Lead Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <RecentActivity />
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add New Contact
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Create Opportunity
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
