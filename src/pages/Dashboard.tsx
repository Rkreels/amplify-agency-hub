
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart3, Contact2, Landmark, TrendingUp, Users } from "lucide-react";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { SalesPipeline } from "@/components/dashboard/SalesPipeline";
import { LeadsBySource } from "@/components/dashboard/LeadsBySource";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardHeader />
      
      <div className="dashboard-grid mb-6">
        <StatCard
          title="Total Contacts"
          value="3,256"
          icon={Users}
          description="+24 this week"
          positive
        />
        <StatCard
          title="New Leads"
          value="128"
          icon={Contact2}
          description="+12% from last month"
          positive
        />
        <StatCard
          title="Pipeline Value"
          value="$135,800"
          icon={Landmark}
          description="-3% from last week"
          negative
        />
        <StatCard
          title="Revenue"
          value="$42,500"
          icon={TrendingUp}
          description="+18% from last month"
          positive
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <LeadsBySource />
        <SalesPipeline />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <UpcomingTasks />
      </div>
    </AppLayout>
  );
}
