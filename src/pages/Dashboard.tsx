
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Compass, BarChart2, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

// Sample data for charts
const opportunityStatusData = [
  { name: "Open", value: 60872, color: "#3498db" },
  { name: "Won", value: 2735, color: "#2ecc71" },
  { name: "Lost", value: 1, color: "#9b59b6" }
];

const opportunityValueData = [
  { name: "Open", value: 15000000, fill: "#3498db" },
  { name: "Won", value: 3770000, fill: "#2ecc71" },
  { name: "Lost", value: 500000, fill: "#9b59b6" },
];

const funnelData = [
  { name: "Registered", value: "$0", percent: "100.00%" },
  { name: "Attended", value: "$0", percent: "100.00%" },
  { name: "Attended but did not upgrade", value: "$0", percent: "100.00%" },
  { name: "Consult Booked", value: "$0", percent: "100.00%" },
  { name: "Left Voicemail", value: "$0", percent: "100.00%" },
  { name: "Trial Opt In", value: "$0", percent: "100.00%" },
  { name: "Trial Won", value: "$0", percent: "100.00%" },
];

const stageDistributionData = [
  { name: "Registered", value: 0, color: "#3498db" },
  { name: "Attended", value: 0, color: "#2ecc71" },
  { name: "Attended by", value: 0, color: "#9b59b6" },
  { name: "Consult Booked", value: 0, color: "#e74c3c" },
  { name: "Left Voicemail", value: 1, color: "#f1c40f" },
  { name: "Trial Opt In", value: 0, color: "#1abc9c" },
  { name: "Trial Won", value: 0, color: "#d35400" },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Opportunity Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Opportunity Status</CardTitle>
            <Compass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex justify-center items-center h-64">
              <ChartContainer
                config={{
                  open: { color: "#3498db", label: "Open" },
                  won: { color: "#2ecc71", label: "Won" },
                  lost: { color: "#9b59b6", label: "Lost" },
                }}
              >
                <PieChart>
                  <Pie
                    data={opportunityStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {opportunityStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                  >
                    {opportunityStatusData.reduce((sum, item) => sum + item.value, 0)}
                  </text>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {opportunityStatusData.map((item) => (
                <div key={item.name} className="flex items-center text-sm">
                  <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name} - {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Opportunity Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Opportunity Value</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64">
              <ChartContainer
                config={{
                  open: { color: "#3498db", label: "Open" },
                  won: { color: "#2ecc71", label: "Won" },
                  lost: { color: "#9b59b6", label: "Lost" },
                }}
              >
                <BarChart data={opportunityValueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                  <YAxis dataKey="name" type="category" width={50} />
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                  <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                    {opportunityValueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Total revenue</span>
                <span className="text-xl font-bold">$26.27M</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Conversion Rate</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex justify-center items-center h-64">
              <ChartContainer
                config={{
                  conversion: { color: "#3498db", label: "Conversion" },
                }}
              >
                <PieChart>
                  <Pie
                    data={[{ name: "Conversion", value: 4.3 }, { name: "Remaining", value: 95.7 }]}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell fill="#3498db" />
                    <Cell fill="#f1f1f4" />
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                  >
                    4.3%
                  </text>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Won revenue</span>
                <span className="text-xl font-bold">$3.77M</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Funnel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Funnel</CardTitle>
            <div className="flex items-center bg-background border rounded px-2 py-1 text-xs">
              <span>10/10/23 Masterclass</span>
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">0</th>
                    <th className="text-left py-2">1</th>
                    <th className="text-left py-2">Cumulative</th>
                    <th className="text-left py-2">Next Step Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {funnelData.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">
                        <div className="py-2 px-3 rounded-md text-white text-sm" 
                             style={{ backgroundColor: index % 2 === 0 ? '#3498db' : index % 3 === 0 ? '#9b59b6' : '#2ecc71' }}>
                          {item.name} - {item.value}
                        </div>
                      </td>
                      <td className="py-2 text-center">{item.percent}</td>
                      <td className="py-2 text-center">{item.percent}</td>
                      <td className="py-2 text-center">{item.percent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Stage Distribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Stage Distribution</CardTitle>
            <div className="flex items-center bg-background border rounded px-2 py-1 text-xs">
              <span>10/10/23 Masterclass</span>
              <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex justify-center items-center">
                <ChartContainer
                  config={{
                    distribution: { color: "#3498db", label: "Distribution" },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={stageDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold"
                    >
                      1
                    </text>
                  </PieChart>
                </ChartContainer>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                {stageDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">$0 (0.00%) - {item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
