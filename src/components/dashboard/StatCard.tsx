
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  BarChart2,
  CalendarClock,
  Layout,
  ListChecks,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

type StatCardIcon = "users" | "dollar-sign" | "bar-chart-2" | "calendar-clock" | "layout" | "list-checks" | "file-text";

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  description?: string;
  icon?: StatCardIcon;
  change?: number;
  variant?: "simple" | "chart";
  chart?: "pie" | "bar" | "radial";
  className?: string;
  children?: ReactNode;
}

const IconMap: Record<StatCardIcon, ReactNode> = {
  "users": <Users className="h-4 w-4" />,
  "dollar-sign": <DollarSign className="h-4 w-4" />,
  "bar-chart-2": <BarChart2 className="h-4 w-4" />,
  "calendar-clock": <CalendarClock className="h-4 w-4" />,
  "layout": <Layout className="h-4 w-4" />,
  "list-checks": <ListChecks className="h-4 w-4" />,
  "file-text": <FileText className="h-4 w-4" />
};

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

export function StatCard({
  title,
  value,
  description,
  icon,
  change,
  variant = "simple",
  chart = "pie",
  className,
  children,
}: StatCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {IconMap[icon]}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex flex-col justify-between h-[calc(100%-60px)]">
        <div>
          {variant === "simple" ? (
            <div className="text-2xl font-bold">{value}</div>
          ) : variant === "chart" && chart === "pie" ? (
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={opportunityStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {opportunityStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-bold">{value}</div>
              </div>
            </div>
          ) : variant === "chart" && chart === "bar" ? (
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical"
                  data={opportunityValueData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Bar dataKey="value" fill="#3498db" radius={[0, 4, 4, 0]}>
                    {opportunityValueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="text-2xl font-bold text-center mt-2">{value}</div>
            </div>
          ) : variant === "chart" && chart === "radial" ? (
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: "Converted", value: 4.3 }, { name: "Not Converted", value: 95.7 }]}
                    cx="50%"
                    cy="50%"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius={50}
                    outerRadius={60}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    <Cell fill="#36cff8" />
                    <Cell fill="#f0f0f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-bold">{value}</div>
              </div>
            </div>
          ) : null}
          {children}
        </div>
        {description && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">{description}</p>
            {typeof change === "number" && (
              <Badge
                variant={change >= 0 ? "outline" : "destructive"}
                className={change >= 0 ? "text-green-600" : ""}
              >
                {change >= 0 ? "+" : ""}
                {change}%
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
