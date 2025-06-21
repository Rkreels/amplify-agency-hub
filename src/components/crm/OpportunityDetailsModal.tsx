
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Calendar, User, Target, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export interface Opportunity {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  source: string;
  description: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    date: Date;
  }>;
}

interface OpportunityDetailsModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (opportunity: Opportunity) => void;
}

export function OpportunityDetailsModal({ opportunity, isOpen, onClose, onSave }: OpportunityDetailsModalProps) {
  const [editedOpportunity, setEditedOpportunity] = useState<Opportunity | null>(opportunity);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setEditedOpportunity(opportunity);
    setIsEditing(false);
  }, [opportunity]);

  if (!editedOpportunity) return null;

  const handleSave = () => {
    onSave(editedOpportunity);
    setIsEditing(false);
    toast.success('Opportunity updated successfully');
  };

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

  const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
  const currentStageIndex = stages.indexOf(editedOpportunity.stage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5" />
              {editedOpportunity.title}
              <Badge className={getStageColor(editedOpportunity.stage)}>
                {editedOpportunity.stage.replace('-', ' ')}
              </Badge>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pipeline Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stage Progress</span>
                  <span>{Math.round((currentStageIndex / (stages.length - 1)) * 100)}%</span>
                </div>
                <Progress value={(currentStageIndex / (stages.length - 1)) * 100} />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  {stages.map((stage, index) => (
                    <span 
                      key={stage} 
                      className={index <= currentStageIndex ? 'text-blue-600 font-medium' : ''}
                    >
                      {stage.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Opportunity Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={editedOpportunity.title}
                    onChange={(e) => setEditedOpportunity({...editedOpportunity, title: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label>Contact</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <Input
                      value={editedOpportunity.contactName}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label>Value</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Input
                      type="number"
                      value={editedOpportunity.value}
                      onChange={(e) => setEditedOpportunity({...editedOpportunity, value: Number(e.target.value)})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label>Stage</Label>
                  <Select
                    value={editedOpportunity.stage}
                    onValueChange={(value) => setEditedOpportunity({...editedOpportunity, stage: value as any})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed-won">Closed Won</SelectItem>
                      <SelectItem value="closed-lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Probability (%)</Label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedOpportunity.probability}
                      onChange={(e) => setEditedOpportunity({...editedOpportunity, probability: Number(e.target.value)})}
                      disabled={!isEditing}
                    />
                    <Progress value={editedOpportunity.probability} />
                  </div>
                </div>

                <div>
                  <Label>Expected Close Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Input
                      type="date"
                      value={editedOpportunity.expectedCloseDate.toISOString().split('T')[0]}
                      onChange={(e) => setEditedOpportunity({
                        ...editedOpportunity, 
                        expectedCloseDate: new Date(e.target.value)
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Source</Label>
                  <Input
                    value={editedOpportunity.source}
                    onChange={(e) => setEditedOpportunity({...editedOpportunity, source: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label>Assigned To</Label>
                  <Input
                    value={editedOpportunity.assignedTo}
                    onChange={(e) => setEditedOpportunity({...editedOpportunity, assignedTo: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editedOpportunity.description}
                    onChange={(e) => setEditedOpportunity({...editedOpportunity, description: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={editedOpportunity.notes}
                    onChange={(e) => setEditedOpportunity({...editedOpportunity, notes: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                {/* Key Metrics */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Created</span>
                      <p className="font-medium">{editedOpportunity.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated</span>
                      <p className="font-medium">{editedOpportunity.updatedAt.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Days in Stage</span>
                      <p className="font-medium">
                        {Math.floor((new Date().getTime() - editedOpportunity.updatedAt.getTime()) / (1000 * 60 * 60 * 24))}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Revenue</span>
                      <p className="font-medium text-green-600">
                        ${Math.round(editedOpportunity.value * (editedOpportunity.probability / 100)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products/Services */}
          <Card>
            <CardHeader>
              <CardTitle>Products & Services</CardTitle>
            </CardHeader>
            <CardContent>
              {editedOpportunity.products.length > 0 ? (
                <div className="space-y-2">
                  {editedOpportunity.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${product.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          Total: ${(product.quantity * product.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>No products added yet</p>
                  {isEditing && (
                    <Button className="mt-2" variant="outline">Add Product</Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
