
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, DollarSign, Calendar, User } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  contact: string;
  value: number;
  probability: number;
  closeDate: Date;
  tags: string[];
  assignedTo: string;
}

interface PipelineStage {
  id: string;
  title: string;
  opportunities: Opportunity[];
  color: string;
}

const initialStages: PipelineStage[] = [
  {
    id: 'lead',
    title: 'New Leads',
    color: 'bg-blue-500',
    opportunities: [
      {
        id: '1',
        title: 'Website Design Project',
        contact: 'Sarah Johnson',
        value: 5000,
        probability: 20,
        closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        tags: ['Web Design', 'New Client'],
        assignedTo: 'John Doe'
      },
      {
        id: '2',
        title: 'Marketing Automation Setup',
        contact: 'Michael Brown',
        value: 3500,
        probability: 30,
        closeDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        tags: ['Automation', 'Monthly Retainer'],
        assignedTo: 'Jane Smith'
      }
    ]
  },
  {
    id: 'qualified',
    title: 'Qualified',
    color: 'bg-yellow-500',
    opportunities: [
      {
        id: '3',
        title: 'CRM Implementation',
        contact: 'Emma Davis',
        value: 8000,
        probability: 50,
        closeDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tags: ['CRM', 'Enterprise'],
        assignedTo: 'John Doe'
      }
    ]
  },
  {
    id: 'proposal',
    title: 'Proposal Sent',
    color: 'bg-orange-500',
    opportunities: [
      {
        id: '4',
        title: 'Full Marketing Package',
        contact: 'James Wilson',
        value: 12000,
        probability: 75,
        closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        tags: ['Full Service', 'High Value'],
        assignedTo: 'Jane Smith'
      }
    ]
  },
  {
    id: 'negotiation',
    title: 'Negotiation',
    color: 'bg-purple-500',
    opportunities: [
      {
        id: '5',
        title: 'E-commerce Platform',
        contact: 'Olivia Smith',
        value: 15000,
        probability: 90,
        closeDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tags: ['E-commerce', 'Priority'],
        assignedTo: 'John Doe'
      }
    ]
  },
  {
    id: 'closed-won',
    title: 'Closed Won',
    color: 'bg-green-500',
    opportunities: [
      {
        id: '6',
        title: 'Brand Identity Package',
        contact: 'William Taylor',
        value: 4500,
        probability: 100,
        closeDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        tags: ['Branding', 'Completed'],
        assignedTo: 'Jane Smith'
      }
    ]
  }
];

export function OpportunityPipeline() {
  const [stages, setStages] = useState(initialStages);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same stage
      const stage = stages.find(s => s.id === source.droppableId);
      if (!stage) return;

      const newOpportunities = Array.from(stage.opportunities);
      const [reorderedItem] = newOpportunities.splice(source.index, 1);
      newOpportunities.splice(destination.index, 0, reorderedItem);

      setStages(prev => prev.map(s => 
        s.id === source.droppableId 
          ? { ...s, opportunities: newOpportunities }
          : s
      ));
    } else {
      // Moving between stages
      const sourceStage = stages.find(s => s.id === source.droppableId);
      const destStage = stages.find(s => s.id === destination.droppableId);
      if (!sourceStage || !destStage) return;

      const sourceOpportunities = Array.from(sourceStage.opportunities);
      const destOpportunities = Array.from(destStage.opportunities);
      const [movedItem] = sourceOpportunities.splice(source.index, 1);
      destOpportunities.splice(destination.index, 0, movedItem);

      setStages(prev => prev.map(s => {
        if (s.id === source.droppableId) {
          return { ...s, opportunities: sourceOpportunities };
        }
        if (s.id === destination.droppableId) {
          return { ...s, opportunities: destOpportunities };
        }
        return s;
      }));
    }
  };

  const getTotalValue = (opportunities: Opportunity[]) => {
    return opportunities.reduce((sum, opp) => sum + opp.value, 0);
  };

  const getWeightedValue = (opportunities: Opportunity[]) => {
    return opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Pipeline</h2>
          <p className="text-muted-foreground">Track opportunities through your sales process</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stages.map((stage) => (
          <Card key={stage.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <h3 className="font-medium">{stage.title}</h3>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {stage.opportunities.length} opportunities
                </p>
                <p className="text-lg font-bold">
                  ${getTotalValue(stage.opportunities).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Weighted: ${getWeightedValue(stage.opportunities).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${stage.color}`} />
                  {stage.title} ({stage.opportunities.length})
                </h3>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] space-y-2 p-2 rounded-lg border-2 border-dashed ${
                      snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-gray-200'
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
                            className={`cursor-move ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <CardContent className="p-4">
                              <h4 className="font-medium text-sm mb-2">
                                {opportunity.title}
                              </h4>
                              
                              <div className="space-y-2">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <User className="h-3 w-3 mr-1" />
                                  {opportunity.contact}
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm font-medium">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    ${opportunity.value.toLocaleString()}
                                  </div>
                                  <Badge variant="secondary">
                                    {opportunity.probability}%
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {opportunity.closeDate.toLocaleDateString()}
                                </div>
                                
                                <div className="flex flex-wrap gap-1">
                                  {opportunity.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <div className="flex items-center">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {opportunity.assignedTo.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs ml-2">{opportunity.assignedTo}</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
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
    </div>
  );
}
