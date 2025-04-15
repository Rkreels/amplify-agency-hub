
import { useState, useEffect } from "react";
import { StatCard } from "./StatCard";
import {
  Users,
  DollarSign,
  BarChart2,
  CalendarClock,
  Layout,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Mock data for opportunity status
const opportunityStatusData = [
  { name: "Open", value: 60872, color: "#3498db" },
  { name: "Won", value: 2735, color: "#2ecc71" },
  { name: "Lost", value: 1, color: "#e74c3c" }
];

// Mock data for opportunity value
const opportunityValueData = [
  { name: "Open", value: 20000000, color: "#3498db" },
  { name: "Won", value: 3770000, color: "#2ecc71" },
  { name: "Lost", value: 500000, color: "#e74c3c" }
];

// Mock data for funnel stages
const funnelStages = [
  { name: "Registered", value: "$0", percent: "100.0%" },
  { name: "Attended", value: "$0", percent: "100.0%", color: "#36cff8" },
  { name: "Attended but did not upgrade", value: "$0", percent: "100.0%", color: "#7986cb" },
  { name: "Consult Booked", value: "$0", percent: "100.0%", color: "#9c27b0" },
  { name: "Left Voicemail", value: "$0", percent: "100.0%", color: "#2196f3" },
  { name: "Trial Opt In", value: "$0", percent: "100.0%", color: "#00bcd4" },
  { name: "Trial Won", value: "$0", percent: "100.0%", color: "#4caf50" }
];

// Mock data for stage distribution
const stageDistributionData = [
  { name: "Stage 1", value: 1, color: "#36cff8" },
];

export function DashboardView() {
  const [dateRange, setDateRange] = useState("monthly");
  const [selectedMasterclass, setSelectedMasterclass] = useState("10/10/23 Masterclass");
  const totalOpportunities = opportunityStatusData.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = opportunityValueData.reduce((sum, item) => sum + item.value, 0);
  const wonRevenue = opportunityValueData.find(item => item.name === "Won")?.value || 0;
  const conversionRate = "4.3%";

  const COLORS = ["#3498db", "#2ecc71", "#e74c3c", "#f1c40f", "#9b59b6"];

  const handleMasterclassChange = (value: string) => {
    setSelectedMasterclass(value);
    toast.success(`Loaded data for ${value}`);
  };

  return (
    <div className="grid gap-6">
      {/* Date and Edit Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded">
            <Layout className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-md px-3 py-1.5">
            <span className="text-sm">2023-11-05</span>
            <span className="mx-2">→</span>
            <span className="text-sm">2023-12-05</span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </div>
          <Button variant="outline" size="sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4V11H11V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 4H13V11H20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 13H13V20H20V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 13H4V20H11V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          <Button variant="ghost" size="sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="19" cy="12" r="2" fill="currentColor"/>
              <circle cx="5" cy="12" r="2" fill="currentColor"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Opportunity Status */}
        <StatCard
          title="Opportunity Status"
          value={totalOpportunities}
          variant="simple"
          className="relative"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={opportunityStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {opportunityStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-3xl font-bold">{totalOpportunities.toLocaleString()}</div>
          </div>
          <div className="mt-8 space-y-2">
            {opportunityStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                <span>{item.name} - {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Opportunity Value */}
        <StatCard
          title="Opportunity Value"
          value=""
          variant="simple"
          className="pb-4"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                layout="vertical"
                data={[
                  { name: "Won", value: 3770000 },
                  { name: "Open", value: 20000000 }
                ]}
                margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 25000000]} tickFormatter={(value) => `$${value/1000000}M`} />
                <YAxis type="category" dataKey="name" />
                <Bar dataKey="value" fill="#3498db" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <div className="text-sm">Total revenue</div>
            <div className="text-xl font-bold">${(totalRevenue/1000000).toFixed(2)}M</div>
          </div>
          <div className="text-center mt-1">
            <div className="text-sm">Won revenue</div>
            <div className="text-xl font-bold">${(wonRevenue/1000000).toFixed(2)}M</div>
          </div>
        </StatCard>

        {/* Conversion Rate */}
        <StatCard
          title="Conversion Rate"
          value=""
          variant="simple"
        >
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ name: "Converted", value: 4.3 }, { name: "Not Converted", value: 95.7 }]}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell fill="#36cff8" />
                  <Cell fill="#f0f0f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl font-bold">{conversionRate}</div>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-sm">Won revenue</div>
            <div className="text-xl font-bold">${(wonRevenue/1000000).toFixed(2)}M</div>
          </div>
        </StatCard>
      </div>

      {/* Bottom Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funnel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Funnel</h2>
              <Select 
                value={selectedMasterclass}
                onValueChange={handleMasterclassChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select masterclass" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10/10/23 Masterclass">10/10/23 Masterclass</SelectItem>
                  <SelectItem value="11/15/23 Masterclass">11/15/23 Masterclass</SelectItem>
                  <SelectItem value="12/05/23 Masterclass">12/05/23 Masterclass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium">
                <div>0</div>
                <div className="text-center">1</div>
                <div className="grid grid-cols-2">
                  <div>Cumulative Conversion</div>
                  <div>Next Step Conversion</div>
                </div>
              </div>
              
              {funnelStages.map((stage, index) => (
                <div key={index} className="space-y-1">
                  <div className="h-10 bg-blue-500 flex items-center px-3 text-white text-sm" style={{ backgroundColor: stage.color || '#3498db' }}>
                    {stage.name} - {stage.value}
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div></div>
                    <div></div>
                    <div className="grid grid-cols-2">
                      <div>{stage.percent}</div>
                      <div>{stage.percent}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Stage Distribution</h2>
              <Select 
                value={selectedMasterclass}
                onValueChange={handleMasterclassChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select masterclass" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10/10/23 Masterclass">10/10/23 Masterclass</SelectItem>
                  <SelectItem value="11/15/23 Masterclass">11/15/23 Masterclass</SelectItem>
                  <SelectItem value="12/05/23 Masterclass">12/05/23 Masterclass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex">
              <div className="w-1/2 relative">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stageDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {stageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl font-bold">1</div>
                </div>
              </div>
              <div className="w-1/2 space-y-2">
                {funnelStages.map((stage, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3" style={{ backgroundColor: stage.color || '#3498db' }}></div>
                    <span>{stage.name}</span>
                    <span className="text-gray-500">$0 (0.00%) - 0</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
