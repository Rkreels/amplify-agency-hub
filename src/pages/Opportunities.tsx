
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, BarChart3, List, Grid } from "lucide-react";
import { OpportunityBoard } from "@/components/opportunities/OpportunityBoard";
import { OpportunityForm } from "@/components/opportunities/OpportunityForm";
import { OpportunityDetails } from "@/components/opportunities/OpportunityDetails";
import { useOpportunitiesStore } from "@/store/useOpportunitiesStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Opportunities() {
  const { 
    opportunities, 
    searchQuery, 
    stageFilter,
    selectedOpportunity,
    setSearchQuery, 
    setStageFilter,
    setSelectedOpportunity,
    deleteOpportunity
  } = useOpportunitiesStore();
  
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [showNewOpportunityDialog, setShowNewOpportunityDialog] = useState(false);
  const [showOpportunityDetails, setShowOpportunityDetails] = useState(false);

  // Filter opportunities based on search and stage
  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const avgProbability = filteredOpportunities.length > 0 
    ? filteredOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / filteredOpportunities.length 
    : 0;
  const closedWonCount = filteredOpportunities.filter(opp => opp.stage === 'closed-won').length;

  const handleViewDetails = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setShowOpportunityDetails(true);
  };

  const handleDelete = (id: string) => {
    deleteOpportunity(id);
    toast.success("Opportunity deleted successfully");
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'secondary';
      case 'qualified': return 'outline';
      case 'proposal': return 'default';
      case 'negotiation': return 'destructive';
      case 'closed-won': return 'default';
      case 'closed-lost': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground">
            Track and manage your sales pipeline
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowNewOpportunityDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{filteredOpportunities.length} opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{avgProbability.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Weighted average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Closed Won</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{closedWonCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {filteredOpportunities.length > 0 ? ((closedWonCount / filteredOpportunities.length) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed-won">Closed Won</SelectItem>
              <SelectItem value="closed-lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={viewMode === 'board' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('board')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <OpportunityBoard />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.map((opportunity) => (
                    <TableRow 
                      key={opportunity.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(opportunity)}
                    >
                      <TableCell className="font-medium">{opportunity.title}</TableCell>
                      <TableCell>{opportunity.contactName}</TableCell>
                      <TableCell>${opportunity.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStageColor(opportunity.stage)}>
                          {opportunity.stage.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{opportunity.probability}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {opportunity.assignedTo.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{opportunity.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(opportunity.id);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showNewOpportunityDialog} onOpenChange={setShowNewOpportunityDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Opportunity</DialogTitle>
          </DialogHeader>
          <OpportunityForm onComplete={() => setShowNewOpportunityDialog(false)} />
        </DialogContent>
      </Dialog>

      {selectedOpportunity && (
        <Dialog open={showOpportunityDetails} onOpenChange={setShowOpportunityDetails}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Opportunity Details</DialogTitle>
            </DialogHeader>
            <OpportunityDetails
              opportunity={selectedOpportunity}
              onClose={() => setShowOpportunityDetails(false)}
              onDelete={handleDelete}
            />
          </DialogContent>
        </Dialog>
      )}
    </AppLayout>
  );
}
