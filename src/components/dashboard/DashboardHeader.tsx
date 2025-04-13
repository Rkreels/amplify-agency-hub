
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreHorizontal, ChevronDown } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
      <div className="flex items-center">
        <div className="bg-blue-500 text-white p-2 rounded mr-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
            <path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-background border rounded-md px-3 py-1.5">
          <span className="text-sm">2023-11-05</span>
          <span className="mx-2">→</span>
          <span className="text-sm">2023-12-05</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </div>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
