
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, John! Here's an overview of your business performance.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-muted/50 rounded-md px-3 py-2 flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>Last 30 days</span>
        </div>
        <Button className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>
    </div>
  );
}
