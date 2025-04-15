
import { LeadsBySource } from "./LeadsBySource";
import { SalesPipeline } from "./SalesPipeline";
import { RecentActivities } from "./RecentActivities";
import { UpcomingTasks } from "./UpcomingTasks";
import { StatCard } from "./StatCard";
import { 
  Users, 
  DollarSign, 
  BarChart2, 
  CalendarClock,
  Plus,
  Search,
  Filter,
  Download,
  ChevronDown 
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardView() {
  const [timeInterval, setTimeInterval] = useState("monthly");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeWidgets, setActiveWidgets] = useState([
    "stats", "leads", "pipeline", "activities", "tasks"
  ]);
  
  const [invoices, setInvoices] = useState([
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
  ]);
  
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  
  // Filter invoices when search term or status changes
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
  }, [filterStatus, searchTerm, invoices]);
  
  const handleExport = (format: string) => {
    toast.success(`Dashboard data exported as ${format.toUpperCase()}`);
  };
  
  const handleAddWidget = () => {
    toast.success("Widget added to dashboard");
  };

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
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-0">
            <LeadsBySource />
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-0">
            <SalesPipeline />
          </CardContent>
        </Card>
      </div>

      {/* Activities & Tasks row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-0">
            <RecentActivities />
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-0">
            <UpcomingTasks />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Invoices */}
      <Card className="shadow-sm hover:shadow-md transition-all">
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
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExport("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleAddWidget}>
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
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
    </div>
  );
}
