
import { LeadsBySource } from "./LeadsBySource";
import { SalesPipeline } from "./SalesPipeline";
import { RecentActivities } from "./RecentActivities";
import { UpcomingTasks } from "./UpcomingTasks";
import { StatCard } from "./StatCard";
import { Users, DollarSign, BarChart2, CalendarClock } from "lucide-react";

export function DashboardView() {
  return (
    <div className="grid gap-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Leads"
          value="140"
          icon={Users}
          description="+12% from last month"
          positive
        />
        <StatCard
          title="Revenue"
          value="$35,482"
          icon={DollarSign}
          description="+8% from last month"
          positive
        />
        <StatCard
          title="Conversion Rate"
          value="4.3%"
          icon={BarChart2}
          description="-2% from last month"
          negative
        />
        <StatCard
          title="Appointments"
          value="23"
          icon={CalendarClock}
          description="+15% from last month"
          positive
        />
      </div>

      {/* Main charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsBySource />
        <SalesPipeline />
      </div>

      {/* Activities & Tasks row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities />
        <UpcomingTasks />
      </div>
    </div>
  );
}
