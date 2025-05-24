
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const opportunities = [
    {
      id: "1",
      name: "Website Redesign Project",
      contact: "Sarah Johnson",
      value: 15000,
      stage: "Proposal",
      probability: 70,
      closeDate: "2025-06-15"
    },
    {
      id: "2",
      name: "Marketing Campaign",
      contact: "Michael Brown", 
      value: 8500,
      stage: "Negotiation",
      probability: 85,
      closeDate: "2025-06-01"
    },
    {
      id: "3",
      name: "SEO Optimization",
      contact: "Emma Davis",
      value: 5000,
      stage: "Qualified",
      probability: 45,
      closeDate: "2025-07-10"
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Qualified": return "secondary";
      case "Proposal": return "outline";
      case "Negotiation": return "default";
      case "Closed Won": return "default";
      default: return "secondary";
    }
  };

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground">
            Track and manage your sales opportunities
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$9,500</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Close Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Close Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity) => (
                <TableRow key={opportunity.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{opportunity.name}</TableCell>
                  <TableCell>{opportunity.contact}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {opportunity.value.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStageColor(opportunity.stage)}>
                      {opportunity.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>{opportunity.probability}%</TableCell>
                  <TableCell>{opportunity.closeDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
