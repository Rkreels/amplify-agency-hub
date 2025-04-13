
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { 
  BarChart as RechartBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  {
    name: "Organic",
    value: 45,
    fill: "#4361ee"
  },
  {
    name: "Referral",
    value: 32,
    fill: "#7209b7"
  },
  {
    name: "Social",
    value: 28,
    fill: "#f72585"
  },
  {
    name: "Email",
    value: 20,
    fill: "#4cc9f0"
  },
  {
    name: "PPC",
    value: 15,
    fill: "#560bad"
  }
];

export function LeadsBySource() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-0.5">
          <CardTitle>Leads by Source</CardTitle>
          <CardDescription>
            Lead distribution across different channels.
          </CardDescription>
        </div>
        <BarChart className="w-4 h-4 ml-auto text-muted-foreground" />
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={{
            organic: { color: "#4361ee", label: "Organic" },
            referral: { color: "#7209b7", label: "Referral" },
            social: { color: "#f72585", label: "Social" },
            email: { color: "#4cc9f0", label: "Email" },
            ppc: { color: "#560bad", label: "PPC" },
          }}
        >
          <ResponsiveContainer width="100%" height={250}>
            <RechartBarChart data={data} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </RechartBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
