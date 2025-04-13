
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Crown, ClipboardList, DollarSign, ArrowUpRight, ChevronUp, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Memberships() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Memberships</h1>
          <p className="text-muted-foreground">
            Manage membership plans, tiers, and user access
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Active Plans</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <div className="flex items-center text-xs text-muted-foreground">
              3 published, 1 draft
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,256</div>
            <div className="flex items-center text-xs text-green-500">
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
              <span>8% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Membership Plans</CardTitle>
              <CardDescription>Manage your available membership tiers and offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "Basic Plan", price: "$29/month", members: 124, status: "published" },
                  { id: 2, name: "Pro Plan", price: "$79/month", members: 89, status: "published" },
                  { id: 3, name: "Enterprise Plan", price: "$199/month", members: 35, status: "published" },
                  { id: 4, name: "Summer Special", price: "$49/month", members: 0, status: "draft" },
                ].map((plan) => (
                  <div key={plan.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Crown className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{plan.name}</div>
                          <div className="text-sm text-muted-foreground">{plan.price}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.status === "published" ? "default" : "outline"}>
                          {plan.status === "published" ? "Published" : "Draft"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{plan.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {(Number(plan.price.replace(/[^0-9.]/g, '')) * plan.members).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0
                          })} monthly revenue
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>New Signups</CardTitle>
              <CardDescription>Recent membership registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", avatar: "", initials: "SJ", plan: "Pro Plan", time: "2 hours ago" },
                  { name: "Michael Brown", avatar: "", initials: "MB", plan: "Basic Plan", time: "Yesterday" },
                  { name: "Emma Davis", avatar: "", initials: "ED", plan: "Enterprise Plan", time: "2 days ago" },
                  { name: "James Wilson", avatar: "", initials: "JW", plan: "Basic Plan", time: "3 days ago" },
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{member.name}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Crown className="h-3 w-3 mr-1" />
                        {member.plan}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{member.time}</div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  View All Members
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Create New Plan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
