
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
  ResponsiveContainer 
} from "recharts";

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
        <ResponsiveContainer width="100%" height={250}>
          <RechartBarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} leads`, 'Count']}
              contentStyle={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Bar dataKey="value" fill="#4361ee" radius={[4, 4, 0, 0]} />
          </RechartBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
