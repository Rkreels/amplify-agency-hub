
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, DollarSign, FileText, Gauge, MoreHorizontal, Calendar, Clock } from "lucide-react";

export default function Payments() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage transactions, invoices, and payment processing.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,380.00</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Invoices Due</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,245.00</div>
            <p className="text-xs text-muted-foreground">8 invoices pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Recurring Revenue</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,750.00</div>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>List of your latest payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {[
                    { id: 1, transaction: "Invoice #1042", client: "Sarah Johnson", date: "Apr 12, 2025", status: "paid", amount: "$1,250.00" },
                    { id: 2, transaction: "Invoice #1041", client: "Michael Brown", date: "Apr 10, 2025", status: "pending", amount: "$850.00" },
                    { id: 3, transaction: "Subscription", client: "Emma Davis", date: "Apr 5, 2025", status: "paid", amount: "$99.00" },
                    { id: 4, transaction: "Invoice #1040", client: "James Wilson", date: "Apr 2, 2025", status: "overdue", amount: "$2,500.00" },
                    { id: 5, transaction: "Invoice #1039", client: "Olivia Smith", date: "Mar 28, 2025", status: "paid", amount: "$1,800.00" },
                  ].map((item) => (
                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">{item.transaction}</td>
                      <td className="p-4 align-middle">{item.client}</td>
                      <td className="p-4 align-middle">{item.date}</td>
                      <td className="p-4 align-middle">
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                            : item.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">{item.amount}</td>
                      <td className="p-4 align-middle">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Your active payment processing methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Credit Card</div>
                    <div className="text-sm text-muted-foreground">Process Visa, MasterCard, Amex</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full px-2 py-0.5">
                    Active
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between border rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-muted-foreground">Process PayPal payments</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full px-2 py-0.5">
                    Active
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Scheduled payments and recurring bills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 1, description: "Monthly Website Maintenance", client: "Sarah Johnson", date: "Apr 20, 2025", amount: "$250.00" },
                { id: 2, description: "SEO Services", client: "Michael Brown", date: "Apr 25, 2025", amount: "$850.00" },
                { id: 3, description: "Social Media Management", client: "Emma Davis", date: "May 1, 2025", amount: "$500.00" },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-muted-foreground">{item.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.amount}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                View All Scheduled Payments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
