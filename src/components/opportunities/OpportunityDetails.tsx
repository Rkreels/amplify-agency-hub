
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DollarSign, Calendar, User, Tag, Edit, Trash2, Plus } from "lucide-react";
import { type Opportunity } from "@/store/useOpportunitiesStore";
import { formatDistanceToNow } from "date-fns";
import { OpportunityForm } from "./OpportunityForm";

interface OpportunityDetailsProps {
  opportunity: Opportunity;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function OpportunityDetails({ opportunity, onClose, onDelete }: OpportunityDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <OpportunityForm
        opportunity={opportunity}
        onComplete={() => {
          setIsEditing(false);
          onClose();
        }}
      />
    );
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-100 text-gray-800';
      case 'qualified': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{opportunity.title}</h2>
          <p className="text-muted-foreground">{opportunity.contactName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onDelete(opportunity.id);
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Value</span>
            </div>
            <p className="text-2xl font-bold">${opportunity.value.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Stage</span>
            </div>
            <Badge className={getStageColor(opportunity.stage)}>
              {opportunity.stage.replace('-', ' ').toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Probability</span>
            </div>
            <p className={`text-2xl font-bold ${getProbabilityColor(opportunity.probability)}`}>
              {opportunity.probability}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Close Date</span>
            </div>
            <p className="text-sm font-medium">
              {formatDistanceToNow(opportunity.expectedCloseDate, { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="mt-1">{opportunity.description}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Source</p>
                <p className="mt-1">{opportunity.source}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {opportunity.assignedTo.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{opportunity.assignedTo}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activities</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </CardHeader>
          <CardContent>
            {opportunity.activities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No activities yet</p>
            ) : (
              <div className="space-y-4">
                {opportunity.activities.map((activity) => (
                  <div key={activity.id} className="border-l-2 border-primary pl-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{activity.title}</h4>
                      <Badge variant={activity.completed ? 'default' : 'secondary'}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.date, { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
