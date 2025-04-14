
import { useState, useEffect } from "react";
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
  BarChart,
  Bar,
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
  Filter,
  Download,
  ChevronDown,
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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
  change?: number;
}

function DashboardCard({ title, value, icon: Icon, description, change }: DashboardCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">{title}</h2>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">{description}</p>
          {change !== undefined && (
            <Badge variant={change >= 0 ? "outline" : "destructive"} className={change >= 0 ? "text-green-600" : ""}>
              {change >= 0 ? "+" : ""}{change}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const generateMonthlyData = (months: number) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);
    
    data.unshift({
      name: date.toLocaleString('default', { month: 'short' }),
      Revenue: Math.floor(Math.random() * 5000) + 1000,
      Deals: Math.floor(Math.random() * 50) + 10,
    });
  }
  
  return data;
};

const generateWeeklyData = (weeks: number) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = 0; i < weeks; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - (i * 7));
    
    data.unshift({
      name: `Week ${weeks - i}`,
      Revenue: Math.floor(Math.random() * 2000) + 500,
      Deals: Math.floor(Math.random() * 20) + 5,
    });
  }
  
  return data;
};

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
  const [timeInterval, setTimeInterval] = useState("monthly");
  const [chartData, setChartData] = useState(generateMonthlyData(12));
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeWidgets, setActiveWidgets] = useState([
    "stats", "revenue", "tasks", "invoices"
  ]);
  
  // Handle time interval change
  useEffect(() => {
    if (timeInterval === "weekly") {
      setChartData(generateWeeklyData(8));
    } else if (timeInterval === "monthly") {
      setChartData(generateMonthlyData(12));
    } else if (timeInterval === "yearly") {
      // Yearly data (quarters)
      setChartData([
        { name: "Q1", Revenue: 12000, Deals: 120 },
        { name: "Q2", Revenue: 19000, Deals: 185 },
        { name: "Q3", Revenue: 15000, Deals: 135 },
        { name: "Q4", Revenue: 21000, Deals: 210 },
      ]);
    } else {
      // Daily (last 7 days)
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailyData = Array(7).fill(0).map((_, i) => ({
        name: days[(new Date().getDay() + i) % 7],
        Revenue: Math.floor(Math.random() * 1000) + 200,
        Deals: Math.floor(Math.random() * 10) + 1,
      }));
      setChartData(dailyData);
    }
  }, [timeInterval]);
  
  // Filter invoices
  useEffect(() => {
    let filtered = [...invoices];
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(inv => inv.status.toLowerCase() === filterStatus.toLowerCase());
    }
    
    if (searchTerm) {
      filtered = filtered.filter(inv => 
        inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredInvoices(filtered);
  }, [filterStatus, searchTerm]);
  
  const handleExport = (format: string) => {
    toast.success(`Dashboard data exported as ${format.toUpperCase()}`);
    setShowExportOptions(false);
  };
  
  const handleAddWidget = () => {
    toast.success("Widget added to dashboard");
  };
  
  const toggleWidget = (widgetId: string) => {
    if (activeWidgets.includes(widgetId)) {
      setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
    } else {
      setActiveWidgets([...activeWidgets, widgetId]);
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track key performance indicators and gain insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toggleWidget("customize")}>
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button onClick={handleAddWidget}>
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {activeWidgets.includes("stats") && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <DashboardCard
            title="Total Revenue"
            value="$245,300"
            icon={DollarSign}
            description="From all sources"
            change={12}
          />
          <DashboardCard
            title="New Leads"
            value="1,450"
            icon={Users}
            description="This month"
            change={5}
          />
          <DashboardCard
            title="Active Deals"
            value="324"
            icon={FileText}
            description="Currently in progress"
            change={-2}
          />
          <DashboardCard
            title="Tasks Completed"
            value="2,876"
            icon={ListChecks}
            description="This quarter"
            change={15}
          />
        </div>
      )}

      {activeWidgets.includes("revenue") && (
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-6 mb-6">
          <div className="lg:col-span-5">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Revenue & Deals
                  </h2>
                  <div className="flex items-center gap-2">
                    <Select 
                      defaultValue={timeInterval}
                      onValueChange={(value) => setTimeInterval(value)}
                    >
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
                    <div className="relative">
                      <Button 
                        size="sm" 
                        onClick={() => setShowExportOptions(prev => !prev)}
                      >
                        Export
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                      {showExportOptions && (
                        <div className="absolute right-0 top-10 z-10 bg-white dark:bg-gray-800 shadow-md rounded-md p-2 w-32">
                          <div 
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm"
                            onClick={() => handleExport("csv")}
                          >
                            CSV
                          </div>
                          <div 
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm"
                            onClick={() => handleExport("pdf")}
                          >
                            PDF
                          </div>
                          <div 
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm"
                            onClick={() => handleExport("excel")}
                          >
                            Excel
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Tabs defaultValue="line">
                  <TabsList className="mb-4">
                    <TabsTrigger value="line">Line</TabsTrigger>
                    <TabsTrigger value="bar">Bar</TabsTrigger>
                  </TabsList>
                  <TabsContent value="line">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={chartData}
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
                  </TabsContent>
                  <TabsContent value="bar">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={chartData}
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
                        <Bar dataKey="Revenue" fill="#8884d8" />
                        <Bar dataKey="Deals" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {activeWidgets.includes("tasks") && (
            <div className="lg:col-span-3">
              <Card className="shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Tasks Overview
                    </h2>
                    <Button size="sm" onClick={() => toast.success("All tasks viewed")}>
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
          )}
        </div>
      )}

      {activeWidgets.includes("invoices") && (
        <Card className="shadow-md mb-6">
          <CardContent className="pt-6">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => handleExport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {invoice.status === "Paid" ? (
                          <Badge variant="outline" className="text-green-600">Paid</Badge>
                        ) : (
                          <Badge>Due</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast.success(`Invoice ${invoice.id} details viewed`)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
