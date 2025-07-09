
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useOpportunityStore, type Opportunity } from '@/store/useOpportunityStore';
import { useVoiceTraining } from '@/components/voice/VoiceTrainingProvider';
import { toast } from 'sonner';

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
    setSelectedPipeline,
    setSearchQuery,
    setFilters,
    getOpportunitiesByStage,
    getTotalValue
  } = useOpportunityStore();

  const { announceFeature } = useVoiceTraining();
  const [isAddingOpportunity, setIsAddingOpportunity] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    value: 0,
    stage: 'qualification',
    probability: 25,
    expectedCloseDate: new Date(),
    source: '',
    assignedTo: '',
    tags: [] as string[],
    notes: '',
    activities: []
  });

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline);

  useEffect(() => {
    announceFeature(
      'Opportunity Pipeline',
      'Manage your sales opportunities through different stages. Drag and drop deals between stages, add new opportunities, and track your sales progress with real-time metrics.'
    );
  }, [announceFeature]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    moveOpportunity(draggableId, destination.droppableId);
    toast.success('Opportunity moved successfully');
  };

  const handleAddOpportunity = () => {
    if (!newOpportunity.name || !newOpportunity.company) {
      toast.error('Please fill in required fields');
      return;
    }

    addOpportunity(newOpportunity);
    setNewOpportunity({
      name: '',
      company: '',
      contactPerson: '',
      email: '',
      phone: '',
      value: 0,
      stage: 'qualification',
      probability: 25,
      expectedCloseDate: new Date(),
      source: '',
      assignedTo: '',
      tags: [],
      notes: '',
      activities: []
    });
    setIsAddingOpportunity(false);
    toast.success('Opportunity added successfully');
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    if (!editingOpportunity) return;
    
    updateOpportunity(editingOpportunity.id, editingOpportunity);
    setEditingOpportunity(null);
    toast.success('Opportunity updated successfully');
  };

  const handleDeleteOpportunity = (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      deleteOpportunity(id);
      toast.success('Opportunity deleted successfully');
    }
  };

  const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => (
    <Card className="mb-3 cursor-move hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm">{opportunity.name}</h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingOpportunity(opportunity)}
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
        
        <p className="text-xs text-muted-foreground mb-2">{opportunity.company}</p>
        
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-xs">
            <DollarSign className="h-3 w-3 mr-1" />
            ${opportunity.value.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {opportunity.expectedCloseDate.toLocaleDateString()}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {opportunity.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {opportunity.assignedTo.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">
          {opportunity.probability}% probability
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sales Pipeline</h1>
          <p className="text-muted-foreground">
            Track and manage opportunities through your sales process
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddingOpportunity} onOpenChange={setIsAddingOpportunity}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Opportunity</DialogTitle>
                <DialogDescription>
                  Create a new sales opportunity
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Opportunity Name *</Label>
                  <Input
                    id="name"
                    value={newOpportunity.name}
                    onChange={(e) => setNewOpportunity({...newOpportunity, name: e.target.value})}
                    placeholder="Website Redesign"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={newOpportunity.company}
                    onChange={(e) => setNewOpportunity({...newOpportunity, company: e.target.value})}
                    placeholder="ABC Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newOpportunity.value}
                    onChange={(e) => setNewOpportunity({...newOpportunity, value: Number(e.target.value)})}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={newOpportunity.stage} onValueChange={(value) => setNewOpportunity({...newOpportunity, stage: value})}>
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
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddingOpportunity(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOpportunity}>
                    Add Opportunity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filters.assignedTo} onValueChange={(value) => setFilters({assignedTo: value})}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Assigned to" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Assignees</SelectItem>
            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
            <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground">Total Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${getTotalValue().toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Pipeline Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(opportunities.reduce((acc, opp) => acc + opp.probability, 0) / opportunities.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Avg. Probability</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {opportunities.filter(opp => opp.stage === 'closed-won').length}
            </div>
            <p className="text-xs text-muted-foreground">Closed Won</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {currentPipeline?.stages.map((stage) => (
            <div key={stage.id} className="min-w-80 bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: stage.color }}
                  />
                  {stage.name}
                </h3>
                <Badge variant="outline">
                  {getOpportunitiesByStage(stage.id).length}
                </Badge>
              </div>
              
              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-32 ${snapshot.isDraggingOver ? 'bg-muted/50' : ''} rounded-md transition-colors`}
                  >
                    {getOpportunitiesByStage(stage.id).map((opportunity, index) => (
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
                            className={snapshot.isDragging ? 'rotate-2 shadow-lg' : ''}
                          >
                            <OpportunityCard opportunity={opportunity} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Edit Dialog */}
      {editingOpportunity && (
        <Dialog open={!!editingOpportunity} onOpenChange={() => setEditingOpportunity(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Opportunity Name</Label>
                <Input
                  id="edit-name"
                  value={editingOpportunity.name}
                  onChange={(e) => setEditingOpportunity({...editingOpportunity, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-value">Value</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editingOpportunity.value}
                  onChange={(e) => setEditingOpportunity({...editingOpportunity, value: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingOpportunity.notes}
                  onChange={(e) => setEditingOpportunity({...editingOpportunity, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingOpportunity(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleEditOpportunity(editingOpportunity)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
