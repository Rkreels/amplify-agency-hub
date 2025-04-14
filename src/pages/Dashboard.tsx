import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CalendarDays,
  DollarSign,
  FileText,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  MessagesSquare,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
}

function DashboardCard({ title, value, icon: Icon, description }: DashboardCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">{title}</h2>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}

const data = [
  { name: "Jan", Revenue: 4000, Deals: 2400, amt: 2400 },
  { name: "Feb", Revenue: 3000, Deals: 1398, amt: 2210 },
  { name: "Mar", Revenue: 2000, Deals: 9800, amt: 2290 },
  { name: "Apr", Revenue: 2780, Deals: 3908, amt: 2000 },
  { name: "May", Revenue: 1890, Deals: 4800, amt: 2181 },
  { name: "Jun", Revenue: 2390, Deals: 3800, amt: 2500 },
  { name: "Jul", Revenue: 3490, Deals: 4300, amt: 2100 },
  { name: "Aug", Revenue: 4000, Deals: 2400, amt: 2400 },
  { name: "Sep", Revenue: 3000, Deals: 1398, amt: 2210 },
  { name: "Oct", Revenue: 2000, Deals: 9800, amt: 2290 },
  { name: "Nov", Revenue: 2780, Deals: 3908, amt: 2000 },
  { name: "Dec", Revenue: 1890, Deals: 4800, amt: 2181 },
];

const invoices = [
  {
    id: "INV001",
    customer: "ABC Corp",
    date: "2025-04-15",
    amount: 1200.00,
    status: "Paid",
  },
  {
    id: "INV002",
    customer: "XYZ Inc",
    date: "2025-04-10",
    amount: 850.50,
    status: "Due",
  },
  {
    id: "INV003",
    customer: "Acme Co",
    date: "2025-04-05",
    amount: 950.00,
    status: "Paid",
  },
  {
    id: "INV004",
    customer: "Tech Solutions",
    date: "2025-03-28",
    amount: 2800.00,
    status: "Paid",
  },
  {
    id: "INV005",
    customer: "Global Enterprises",
    date: "2025-03-20",
    amount: 1500.00,
    status: "Due",
  },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track key performance indicators and gain insights
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Revenue"
          value="$245,300"
          icon={DollarSign}
          description="From all sources"
        />
        <DashboardCard
          title="New Leads"
          value="1,450"
          icon={Users}
          description="This month"
        />
        <DashboardCard
          title="Active Deals"
          value="324"
          icon={FileText}
          description="Currently in progress"
        />
        <DashboardCard
          title="Tasks Completed"
          value="2,876"
          icon={ListChecks}
          description="This quarter"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-6">
        <div className="lg:col-span-5">
          <Card className="shadow-md">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  Revenue & Deals
                </h2>
                <div className="flex items-center gap-2">
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm">
                    Export
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="Deals" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="shadow-md">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold tracking-tight">
                  Tasks Overview
                </h2>
                <Button size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Design Mockups</h3>
                    <p className="text-muted-foreground text-xs">Due in 2 days</p>
                  </div>
                  <div className="text-sm">65%</div>
                </div>
                <Progress value={65} />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Develop Website</h3>
                    <p className="text-muted-foreground text-xs">Due in 5 days</p>
                  </div>
                  <div className="text-sm">40%</div>
                </div>
                <Progress value={40} />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">SEO Optimization</h3>
                    <p className="text-muted-foreground text-xs">Due in 1 week</p>
                  </div>
                  <div className="text-sm">80%</div>
                </div>
                <Progress value={80} />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Social Media Campaign</h3>
                    <p className="text-muted-foreground text-xs">Due in 2 weeks</p>
                  </div>
                  <div className="text-sm">25%</div>
                </div>
                <Progress value={25} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-md">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Recent Invoices
            </h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-8 bg-muted/30 h-9"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="due">Due</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {invoice.status === "Paid" ? (
                      <Badge variant="outline">Paid</Badge>
                    ) : (
                      <Badge>Due</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
