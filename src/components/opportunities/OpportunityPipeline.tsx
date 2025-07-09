
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  DollarSign, 
  Calendar, 
  User,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  Target,
  Clock,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Opportunity {
  id: string;
  title: string;
  contact: string;
  email: string;
  phone: string;
  value: number;
  probability: number;
  stage: string;
  priority: 'high' | 'medium' | 'low';
  lastActivity: string;
  nextActivity: string;
  assignedTo: string;
  tags: string[];
  notes: string;
}

const initialOpportunities: Record<string, Opportunity[]> = {
  'lead': [
    {
      id: '1',
      title: 'Website Redesign Project',
      contact: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      value: 15000,
      probability: 25,
      stage: 'lead',
      priority: 'high',
      lastActivity: 'Initial contact made',
      nextActivity: 'Schedule discovery call',
      assignedTo: 'John Doe',
      tags: ['web design', 'new client'],
      notes: 'Interested in complete website overhaul. Budget confirmed.'
    },
    {
      id: '2',
      title: 'Marketing Automation Setup',
      contact: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 (555) 234-5678',
      value: 8500,
      probability: 30,
      stage: 'lead',
      priority: 'medium',
      lastActivity: 'Sent proposal',
      nextActivity: 'Follow up on proposal',
      assignedTo: 'Jane Smith',
      tags: ['automation', 'existing client'],
      notes: 'Existing client looking to expand services.'
    }
  ],
  'qualified': [
    {
      id: '3',
      title: 'E-commerce Platform',
      contact: 'Emily Rodriguez',
      email: 'emily@example.com',
      phone: '+1 (555) 345-6789',
      value: 25000,
      probability: 60,
      stage: 'qualified',
      priority: 'high',
      lastActivity: 'Requirements gathering',
      nextActivity: 'Technical proposal',
      assignedTo: 'John Doe',
      tags: ['e-commerce', 'large project'],
      notes: 'Detailed requirements provided. Very interested.'
    }
  ],
  'proposal': [
    {
      id: '4',
      title: 'Brand Identity Package',
      contact: 'David Kim',
      email: 'david@example.com',
      phone: '+1 (555) 456-7890',
      value: 12000,
      probability: 75,
      stage: 'proposal',
      priority: 'medium',
      lastActivity: 'Proposal presented',
      nextActivity: 'Contract negotiation',
      assignedTo: 'Jane Smith',
      tags: ['branding', 'design'],
      notes: 'Proposal well received. Minor adjustments needed.'
    }
  ],
  'negotiation': [
    {
      id: '5',
      title: 'Mobile App Development',
      contact: 'Lisa Wang',
      email: 'lisa@example.com',
      phone: '+1 (555) 567-8901',
      value: 35000,
      probability: 85,
      stage: 'negotiation',
      priority: 'high',
      lastActivity: 'Contract review',
      nextActivity: 'Final contract signing',
      assignedTo: 'John Doe',
      tags: ['mobile', 'development'],
      notes: 'Final terms being discussed. Close to signing.'
    }
  ],
  'closed-won': [
    {
      id: '6',
      title: 'SEO Optimization',
      contact: 'Robert Brown',
      email: 'robert@example.com',
      phone: '+1 (555) 678-9012',
      value: 5000,
      probability: 100,
      stage: 'closed-won',
      priority: 'low',
      lastActivity: 'Contract signed',
      nextActivity: 'Project kickoff',
      assignedTo: 'Jane Smith',
      tags: ['seo', 'monthly retainer'],
      notes: 'Contract signed. Project starting next week.'
    }
  ],
  'closed-lost': []
};

const stages = [
  { id: 'lead', title: 'Lead', color: 'bg-blue-100 text-blue-800' },
  { id: 'qualified', title: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'proposal', title: 'Proposal', color: 'bg-orange-100 text-orange-800' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-purple-100 text-purple-800' },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-100 text-red-800' }
];

export function OpportunityPipeline() {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showNewOpportunity, setShowNewOpportunity] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same stage
      const stageOpportunities = Array.from(opportunities[source.droppableId]);
      const [removed] = stageOpportunities.splice(source.index, 1);
      stageOpportunities.splice(destination.index, 0, removed);
      
      setOpportunities({
        ...opportunities,
        [source.droppableId]: stageOpportunities
      });
    } else {
      // Moving between stages
      const sourceOpportunities = Array.from(opportunities[source.droppableId]);
      const destOpportunities = Array.from(opportunities[destination.droppableId]);
      const [removed] = sourceOpportunities.splice(source.index, 1);
      
      // Update the opportunity's stage
      removed.stage = destination.droppableId;
      
      destOpportunities.splice(destination.index, 0, removed);
      
      setOpportunities({
        ...opportunities,
        [source.droppableId]: sourceOpportunities,
        [destination.droppableId]: destOpportunities
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalValue = () => {
    return Object.values(opportunities).flat().reduce((total, opp) => total + opp.value, 0);
  };

  const getStageValue = (stageId: string) => {
    return opportunities[stageId]?.reduce((total, opp) => total + opp.value, 0) || 0;
  };

  const getWeightedValue = () => {
    return Object.values(opportunities).flat().reduce((total, opp) => {
      return total + (opp.value * opp.probability / 100);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Opportunity Pipeline</h1>
          <p className="text-muted-foreground">Track and manage your sales opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={showNewOpportunity} onOpenChange={setShowNewOpportunity}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Opportunity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Opportunity title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Contact</label>
                    <Input placeholder="Contact name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Value</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Probability</label>
                    <Input type="number" placeholder="0" max="100" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea placeholder="Add notes about this opportunity" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewOpportunity(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewOpportunity(false)}>
                    Create Opportunity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Pipeline Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalValue().toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Weighted Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getWeightedValue().toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Total Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(opportunities).flat().length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Avg. Deal Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(getTotalValue() / Math.max(Object.values(opportunities).flat().length, 1)).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search opportunities..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 h-[600px] overflow-x-auto">
          {stages.map((stage) => (
            <div key={stage.id} className="min-w-[300px]">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{stage.title}</CardTitle>
                    <Badge className={stage.color}>
                      {opportunities[stage.id]?.length || 0}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${getStageValue(stage.id).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent className="p-2">
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-2 min-h-[400px] p-2 rounded-md transition-colors ${
                          snapshot.isDraggingOver ? 'bg-muted/50' : ''
                        }`}
                      >
                        {opportunities[stage.id]?.map((opportunity, index) => (
                          <Draggable
                            key={opportunity.id}
                            draggableId={opportunity.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`transition-shadow ${
                                  snapshot.isDragging ? 'shadow-lg' : ''
                                }`}
                              >
                                <Card className="cursor-pointer hover:shadow-md transition-shadow"
                                      onClick={() => setSelectedOpportunity(opportunity)}>
                                  <CardContent className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between">
                                        <h4 className="font-medium text-sm leading-tight">
                                          {opportunity.title}
                                        </h4>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <MoreVertical className="h-3 w-3" />
                                        </Button>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs">
                                            {opportunity.contact.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground truncate">
                                          {opportunity.contact}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-green-600">
                                          ${opportunity.value.toLocaleString()}
                                        </span>
                                        <Badge variant="outline" className={getPriorityColor(opportunity.priority)}>
                                          {opportunity.priority}
                                        </Badge>
                                      </div>
                                      
                                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{opportunity.probability}% probability</span>
                                        <span>{opportunity.assignedTo}</span>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-1">
                                        {opportunity.tags.slice(0, 2).map(tag => (
                                          <Badge key={tag} variant="secondary" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {opportunity.tags.length > 2 && (
                                          <Badge variant="secondary" className="text-xs">
                                            +{opportunity.tags.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Opportunity Details Dialog */}
      {selectedOpportunity && (
        <Dialog open={!!selectedOpportunity} onOpenChange={() => setSelectedOpportunity(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedOpportunity.title}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOpportunity.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOpportunity.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOpportunity.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Opportunity Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Value:</span>
                      <span className="font-semibold">${selectedOpportunity.value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Probability:</span>
                      <span>{selectedOpportunity.probability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge className={getPriorityColor(selectedOpportunity.priority)}>
                        {selectedOpportunity.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned to:</span>
                      <span>{selectedOpportunity.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Activities</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last: {selectedOpportunity.lastActivity}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Next: {selectedOpportunity.nextActivity}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedOpportunity.notes}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  SMS
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedOpportunity(null)}>
                  Close
                </Button>
                <Button>
                  Edit Opportunity
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
