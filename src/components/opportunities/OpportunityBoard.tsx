
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, DollarSign, Calendar, User } from "lucide-react";
import { useOpportunitiesStore, type Opportunity } from "@/store/useOpportunitiesStore";
import { formatDistanceToNow } from "date-fns";

const stages = [
  { key: 'lead', title: 'Lead', color: 'bg-gray-100' },
  { key: 'qualified', title: 'Qualified', color: 'bg-blue-100' },
  { key: 'proposal', title: 'Proposal', color: 'bg-yellow-100' },
  { key: 'negotiation', title: 'Negotiation', color: 'bg-orange-100' },
  { key: 'closed-won', title: 'Closed Won', color: 'bg-green-100' },
  { key: 'closed-lost', title: 'Closed Lost', color: 'bg-red-100' }
];

export function OpportunityBoard() {
  const { opportunities, setSelectedOpportunity, updateOpportunityStage } = useOpportunitiesStore();

  const getOpportunitiesByStage = (stage: string) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    e.dataTransfer.setData('text/plain', opportunity.id);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData('text/plain');
    updateOpportunityStage(opportunityId, stage as Opportunity['stage']);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stages.map((stage) => {
        const stageOpportunities = getOpportunitiesByStage(stage.key);
        const totalValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0);

        return (
          <div
            key={stage.key}
            className="space-y-4"
            onDrop={(e) => handleDrop(e, stage.key)}
            onDragOver={handleDragOver}
          >
            <Card className={`${stage.color} border-2 border-dashed`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <span>{stage.title}</span>
                  <Badge variant="secondary">{stageOpportunities.length}</Badge>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  ${totalValue.toLocaleString()}
                </p>
              </CardHeader>
            </Card>

            <div className="space-y-3">
              {stageOpportunities.map((opportunity) => (
                <Card
                  key={opportunity.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity)}
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight">{opportunity.title}</h4>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{opportunity.contactName}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <DollarSign className="h-3 w-3" />
                          <span>${opportunity.value.toLocaleString()}</span>
                        </div>
                        <div className={`text-xs font-medium ${getProbabilityColor(opportunity.probability)}`}>
                          {opportunity.probability}%
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(opportunity.expectedCloseDate, { addSuffix: true })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {opportunity.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {opportunity.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{opportunity.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {opportunity.assignedTo.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
