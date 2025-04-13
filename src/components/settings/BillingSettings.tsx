
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Package, Shield, Check, ArrowRight, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface BillingSettingsProps {
  onChange: () => void;
}

export default function BillingSettings({ onChange }: BillingSettingsProps) {
  const plans = [
    {
      name: "Basic",
      price: "$49",
      description: "Perfect for small businesses",
      features: [
        "1,000 contacts",
        "2 team members",
        "10 campaigns",
        "Basic reporting",
        "Email support"
      ],
      current: false
    },
    {
      name: "Pro",
      price: "$99",
      description: "For growing businesses",
      features: [
        "10,000 contacts",
        "5 team members",
        "Unlimited campaigns",
        "Advanced reporting",
        "Priority support",
        "API access"
      ],
      current: true
    },
    {
      name: "Enterprise",
      price: "$299",
      description: "For large organizations",
      features: [
        "Unlimited contacts",
        "Unlimited team members",
        "Unlimited campaigns",
        "Custom reporting",
        "24/7 support",
        "API access",
        "White-label options",
        "Dedicated account manager"
      ],
      current: false
    }
  ];

  const invoices = [
    {
      id: "INV-001",
      date: "Apr 1, 2025",
      amount: "$99.00",
      status: "Paid"
    },
    {
      id: "INV-002",
      date: "Mar 1, 2025",
      amount: "$99.00",
      status: "Paid"
    },
    {
      id: "INV-003",
      date: "Feb 1, 2025",
      amount: "$99.00",
      status: "Paid"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Manage your subscription plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  Pro Plan <Badge className="ml-2">Current</Badge>
                </h3>
                <p className="text-sm text-muted-foreground">Your plan renews on May 1, 2025</p>
              </div>
              <Button variant="outline" onClick={onChange}>
                Change Plan
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Contacts: 4,256 / 10,000</span>
                  <span className="text-sm font-medium">43%</span>
                </div>
                <Progress value={43} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Storage: 1.2GB / 5GB</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <Progress value={24} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">API Calls: 45,892 / 100,000</span>
                  <span className="text-sm font-medium">46%</span>
                </div>
                <Progress value={46} className="h-2" />
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="font-medium mb-4">Payment Method</h3>
            <div className="flex items-center p-3 border rounded-md mb-4">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-xs text-muted-foreground">Expires 04/2026</div>
              </div>
              <Button variant="outline" size="sm" onClick={onChange}>
                Update
              </Button>
            </div>
            <div className="flex items-center p-3 border border-dashed rounded-md">
              <div className="bg-muted p-2 rounded-full mr-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Add new payment method</div>
              </div>
              <Button variant="outline" size="sm" onClick={onChange}>
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your previous invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={onChange}>
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Compare plans and find the best fit for your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={`border rounded-lg p-6 ${plan.current ? 'border-primary ring-1 ring-primary' : ''}`}
              >
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="text-2xl font-bold mt-2 mb-2">{plan.price}<span className="text-sm font-normal text-muted-foreground"> /month</span></div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.current ? "secondary" : "default"}
                  onClick={onChange}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                  {!plan.current && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
