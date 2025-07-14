
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  DollarSign, 
  Calendar, 
  User, 
  Building, 
  Phone, 
  Mail, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Filter,
  Search,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  value: number;
  probability: number;
  stage: string;
  expectedCloseDate: Date;
  source: string;
  assignedTo: string;
  tags: string[];
  notes: string;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    date: Date;
    user: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  probability: number;
  opportunities: Opportunity[];
}

export function OpportunityPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([
    {
      id: 'lead',
      name: 'Lead',
      color: 'bg-gray-500',
      probability: 10,
      opportunities: [
        {
          id: 'opp-1',
          title: 'Website Redesign Project',
          company: 'TechCorp Inc.',
          contact: {
            name: 'Sarah Johnson',
            email: 'sarah@techcorp.com',
            phone: '+1234567890'
          },
          value: 15000,
          probability: 10,
          stage: 'lead',
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          source: 'Website',
          assignedTo: 'John Doe',
          tags: ['web-design', 'high-value'],
          notes: 'Initial interest shown in complete website overhaul',
          activities: [],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: 'qualified',
      name: 'Qualified',
      color: 'bg-blue-500',
      probability: 25,
      opportunities: [
        {
          id: 'opp-2',
          title: 'CRM Implementation',
          company: 'StartupXYZ',
          contact: {
            name: 'Mike Chen',
            email: 'mike@startupxyz.com'
          },
          value: 25000,
          probability: 25,
          stage: 'qualified',
          expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          source: 'Referral',
          assignedTo: 'Jane Smith',
          tags: ['crm', 'startup'],
          notes: 'Budget confirmed, decision makers identified',
          activities: [],
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: 'proposal',
      name: 'Proposal',
      color: 'bg-yellow-500',
      probability: 50,
      opportunities: [
        {
          id: 'opp-3',
          title: 'Mobile App Development',
          company: 'RetailCo',
          contact: {
            name: 'Lisa Wang',
            email: 'lisa@retailco.com'
          },
          value: 50000,
          probability: 50,
          stage: 'proposal',
          expectedCloseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          source: 'Cold Outreach',
          assignedTo: 'Bob Wilson',
          tags: ['mobile', 'retail'],
          notes: 'Proposal submitted, awaiting feedback',
          activities: [],
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ]
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      color: 'bg-orange-500',
      probability: 75,
      opportunities: []
    },
    {
      id: 'closed-won',
      name: 'Closed Won',
      color: 'bg-green-500',
      probability: 100,
      opportunities: []
    },
    {
      id: 'closed-lost',
      name: 'Closed Lost',
      color: 'bg-red-500',
      probability: 0,
      opportunities: []
    }
  ]);

  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    value: '',
    probability: '',
    stage: 'lead',
    expectedCloseDate: '',
    source: '',
    assignedTo: '',
    notes: ''
  });

  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setStages(prev => {
      const newStages = [...prev];
      
      // Find source and destination stages
      const sourceStage = newStages.find(stage => stage.id === source.droppableId);
      const destStage = newStages.find(stage => stage.id === destination.droppableId);
      
      if (!sourceStage || !destStage) return prev;

      // Remove opportunity from source stage
      const [movedOpportunity] = sourceStage.opportunities.splice(source.index, 1);
      
      // Update opportunity stage and probability
      const updatedOpportunity = {
        ...movedOpportunity,
        stage: destination.droppableId,
        probability: destStage.probability,
        updatedAt: new Date()
      };

      // Add opportunity to destination stage
      destStage.opportunities.splice(destination.index, 0, updatedOpportunity);

      toast.success(`Opportunity moved to ${destStage.name}`);
      return newStages;
    });
  }, []);

  const createOpportunity = () => {
    if (!newOpportunity.title || !newOpportunity.company || !newOpportunity.contactEmail) {
      toast.error('Please fill in required fields');
      return;
    }

    const opportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newOpportunity.title,
      company: newOpportunity.company,
      contact: {
        name: newOpportunity.contactName,
        email: newOpportunity.contactEmail,
        phone: newOpportunity.contactPhone
      },
      value: parseFloat(newOpportunity.value) || 0,
      probability: parseInt(newOpportunity.probability) || 10,
      stage: newOpportunity.stage,
      expectedCloseDate: new Date(newOpportunity.expectedCloseDate),
      source: newOpportunity.source,
      assignedTo: newOpportunity.assignedTo,
      tags: [],
      notes: newOpportunity.notes,
      activities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setStages(prev => 
      prev.map(stage => 
        stage.id === newOpportunity.stage
          ? { ...stage, opportunities: [...stage.opportunities, opportunity] }
          : stage
      )
    );

    // Reset form
    setNewOpportunity({
      title: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      value: '',
      probability: '',
      stage: 'lead',
      expectedCloseDate: '',
      source: '',
      assignedTo: '',
      notes: ''
    });

    setIsCreateDialogOpen(false);
    toast.success('Opportunity created successfully!');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTotalValue = () => {
    return stages.reduce((total, stage) => 
      total + stage.opportunities.reduce((stageTotal, opp) => stageTotal + opp.value, 0), 0
    );
  };

  const getWeightedValue = () => {
    return stages.reduce((total, stage) => 
      total + stage.opportunities.reduce((stageTotal, opp) => 
        stageTotal + (opp.value * opp.probability / 100), 0
      ), 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Opportunity Pipeline</h1>
          <p className="text-muted-foreground">Track and manage your sales opportunities</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Opportunity</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newOpportunity.title}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, title: e.target.value}))}
                    placeholder="Website Redesign Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={newOpportunity.company}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, company: e.target.value}))}
                    placeholder="TechCorp Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={newOpportunity.contactName}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, contactName: e.target.value}))}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={newOpportunity.contactEmail}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, contactEmail: e.target.value}))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newOpportunity.value}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, value: e.target.value}))}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={newOpportunity.stage} onValueChange={(value) => setNewOpportunity(prev => ({...prev, stage: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>{stage.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={newOpportunity.expectedCloseDate}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, expectedCloseDate: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select value={newOpportunity.source} onValueChange={(value) => setNewOpportunity(prev => ({...prev, source: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="cold-outreach">Cold Outreach</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newOpportunity.notes}
                    onChange={(e) => setNewOpportunity(prev => ({...prev, notes: e.target.value}))}
                    placeholder="Additional notes about this opportunity..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createOpportunity}>
                  Create Opportunity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalValue())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
                <p className="text-2xl font-bold">{formatCurrency(getWeightedValue())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Opportunities</p>
                <p className="text-2xl font-bold">
                  {stages.reduce((total, stage) => total + stage.opportunities.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className="min-w-80 flex-shrink-0">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      {stage.name}
                      <Badge variant="secondary">{stage.opportunities.length}</Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(stage.opportunities.reduce((sum, opp) => sum + opp.value, 0))}
                    </div>
                  </div>
                </CardHeader>
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <CardContent
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-96 ${
                        snapshot.isDraggingOver ? 'bg-muted/50' : ''
                      }`}
                    >
                      {stage.opportunities.map((opportunity, index) => (
                        <Draggable
                          key={opportunity.id}
                          draggableId={opportunity.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
                              }`}
                              onClick={() => setSelectedOpportunity(opportunity)}
                            >
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-sm line-clamp-2">
                                      {opportunity.title}
                                    </h4>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Building className="h-3 w-3" />
                                      {opportunity.company}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={opportunity.contact.avatar} />
                                        <AvatarFallback className="text-xs">
                                          {opportunity.contact.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{opportunity.contact.name}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <span className="font-semibold text-green-600">
                                        {formatCurrency(opportunity.value)}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {opportunity.probability}%
                                      </span>
                                    </div>
                                    
                                    <Progress value={opportunity.probability} className="h-1" />
                                    
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                      <span>Close: {opportunity.expectedCloseDate.toLocaleDateString()}</span>
                                      <span>{opportunity.source}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
