import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  DollarSign, 
  Calendar,
  User,
  Phone,
  Mail,
  Edit,
  Trash2,
  Target
} from 'lucide-react';
import { useOpportunityStore } from '@/store/useOpportunityStore';
import { toast } from 'sonner';

interface NewOpportunityData {
  name: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  source: string;
  assignedTo: string;
  tags: string[];
  notes: string;
}

export function OpportunityPipeline() {
  const {
    opportunities,
    pipelines,
    selectedPipeline,
    searchQuery,
    filters,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    moveOpportunity,
    addActivity,
    setSelectedPipeline,
    setSearchQuery,
    setFilters,
    getOpportunitiesByStage,
    getTotalValue
  } = useOpportunityStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [newOpportunityData, setNewOpportunityData] = useState<NewOpportunityData>({
    name: '',
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    value: 0,
    stage: 'qualification',
    probability: 25,
    expectedCloseDate: '',
    source: 'website',
    assignedTo: 'Sarah Johnson',
    tags: [],
    notes: ''
  });

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline);

  const handleCreateOpportunity = () => {
    if (!newOpportunityData.name.trim() || !newOpportunityData.company.trim()) {
      toast.error('Name and Company are required');
      return;
    }

    const newOpportunity = {
      ...newOpportunityData,
      expectedCloseDate: new Date(newOpportunityData.expectedCloseDate || Date.now()),
      tags: newOpportunityData.tags.filter(tag => tag.trim()),
      activities: []
    };

    addOpportunity(newOpportunity);
    setNewOpportunityData({
      name: '',
      company: '',
      contactPerson: '',
      email: '',
      phone: '',
      value: 0,
      stage: 'qualification',
      probability: 25,
      expectedCloseDate: '',
      source: 'website',
      assignedTo: 'Sarah Johnson',
      tags: [],
      notes: ''
    });
    setShowCreateDialog(false);
    toast.success('Opportunity created successfully');
  };

  const handleUpdateOpportunity = () => {
    if (!selectedOpportunity) return;

    updateOpportunity(selectedOpportunity.id, {
      ...newOpportunityData,
      expectedCloseDate: new Date(newOpportunityData.expectedCloseDate),
      tags: newOpportunityData.tags.filter(tag => tag.trim())
    });
    setShowEditDialog(false);
    setSelectedOpportunity(null);
    toast.success('Opportunity updated successfully');
  };

  const handleDeleteOpportunity = (opportunityId: string) => {
    deleteOpportunity(opportunityId);
    toast.success('Opportunity deleted successfully');
  };

  const handleEditOpportunity = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setNewOpportunityData({
      name: opportunity.name,
      company: opportunity.company,
      contactPerson: opportunity.contactPerson,
      email: opportunity.email,
      phone: opportunity.phone,
      value: opportunity.value,
      stage: opportunity.stage,
      probability: opportunity.probability,
      expectedCloseDate: opportunity.expectedCloseDate.toISOString().split('T')[0],
      source: opportunity.source,
      assignedTo: opportunity.assignedTo,
      tags: opportunity.tags,
      notes: opportunity.notes
    });
    setShowEditDialog(true);
  };

  const handleStageChange = (opportunityId: string, newStage: string) => {
    moveOpportunity(opportunityId, newStage);
    toast.success('Opportunity moved successfully');
  };

  const handleAddActivity = (opportunityId: string, activityType: 'call' | 'email' | 'meeting' | 'note' | 'task') => {
    const activity = {
      type: activityType,
      title: `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} activity`,
      description: `New ${activityType} activity added`,
      timestamp: new Date(),
      completedBy: 'Current User'
    };
    addActivity(opportunityId, activity);
    toast.success(`${activityType} activity added`);
  };

  const OpportunityCard = ({ opportunity }: { opportunity: any }) => (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium">{opportunity.name}</CardTitle>
            <CardDescription className="text-xs">{opportunity.company}</CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditOpportunity(opportunity)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteOpportunity(opportunity.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-600">
              ${opportunity.value.toLocaleString()}
            </span>
            <Badge variant="outline" className="text-xs">
              {opportunity.probability}%
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{opportunity.contactPerson}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{opportunity.expectedCloseDate.toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {opportunity.source}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {opportunity.assignedTo}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {opportunity.tags.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {opportunity.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{opportunity.tags.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex space-x-1 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddActivity(opportunity.id, 'call')}
              className="flex-1 text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddActivity(opportunity.id, 'email')}
              className="flex-1 text-xs"
            >
              <Mail className="h-3 w-3 mr-1" />
              Email
            </Button>
          </div>

          <Select
            value={opportunity.stage}
            onValueChange={(value) => handleStageChange(opportunity.id, value)}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentPipeline?.stages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">
            Manage your sales pipeline and track deal progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Opportunity</DialogTitle>
                <DialogDescription>
                  Add a new opportunity to your sales pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Opportunity Name *</Label>
                  <Input
                    id="name"
                    value={newOpportunityData.name}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter opportunity name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={newOpportunityData.company}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={newOpportunityData.contactPerson}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Enter contact person"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newOpportunityData.email}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newOpportunityData.phone}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newOpportunityData.value}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, value: Number(e.target.value) }))}
                    placeholder="Enter opportunity value"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select
                    value={newOpportunityData.stage}
                    onValueChange={(value) => setNewOpportunityData(prev => ({ ...prev, stage: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currentPipeline?.stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={newOpportunityData.probability}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, probability: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={newOpportunityData.expectedCloseDate}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={newOpportunityData.source}
                    onValueChange={(value) => setNewOpportunityData(prev => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="ads">Advertisements</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select
                    value={newOpportunityData.assignedTo}
                    onValueChange={(value) => setNewOpportunityData(prev => ({ ...prev, assignedTo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                      <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                      <SelectItem value="John Smith">John Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newOpportunityData.tags.join(', ')}
                    onChange={(e) => setNewOpportunityData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()) 
                    }))}
                    placeholder="Enter tags"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newOpportunityData.notes}
                    onChange={(e) => setNewOpportunityData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter notes"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOpportunity}>
                  Create Opportunity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.assignedTo} onValueChange={(value) => setFilters({ assignedTo: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                <SelectItem value="John Smith">John Smith</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.source} onValueChange={(value) => setFilters({ source: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="ads">Advertisements</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setFilters({ stage: '', assignedTo: '', source: '', valueRange: [0, 100000] });
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${getTotalValue().toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {opportunities.filter(o => !['closed-won', 'closed-lost'].includes(o.stage)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Won This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {opportunities.filter(o => o.stage === 'closed-won').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sales Pipeline</h2>
          <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {currentPipeline?.stages.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            const stageValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);
            
            return (
              <div key={stage.id} className="space-y-3">
                <div className="bg-card rounded-lg p-3 border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm" style={{ color: stage.color }}>
                      {stage.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {stageOpportunities.length}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${stageValue.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-2 min-h-[200px]">
                  {stageOpportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Opportunity</DialogTitle>
            <DialogDescription>
              Update opportunity information
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Opportunity Name *</Label>
              <Input
                id="name"
                value={newOpportunityData.name}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter opportunity name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={newOpportunityData.company}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={newOpportunityData.contactPerson}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, contactPerson: e.target.value }))}
                placeholder="Enter contact person"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newOpportunityData.email}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newOpportunityData.phone}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                value={newOpportunityData.value}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, value: Number(e.target.value) }))}
                placeholder="Enter opportunity value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={newOpportunityData.stage}
                onValueChange={(value) => setNewOpportunityData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentPipeline?.stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={newOpportunityData.probability}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, probability: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={newOpportunityData.expectedCloseDate}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={newOpportunityData.source}
                onValueChange={(value) => setNewOpportunityData(prev => ({ ...prev, source: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="ads">Advertisements</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select
                value={newOpportunityData.assignedTo}
                onValueChange={(value) => setNewOpportunityData(prev => ({ ...prev, assignedTo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
                  <SelectItem value="Emma Davis">Emma Davis</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newOpportunityData.tags.join(', ')}
                onChange={(e) => setNewOpportunityData(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()) 
                }))}
                placeholder="Enter tags"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newOpportunityData.notes}
                onChange={(e) => setNewOpportunityData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter notes"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOpportunity}>
              Update Opportunity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
