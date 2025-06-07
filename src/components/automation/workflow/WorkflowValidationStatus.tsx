
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';

export function WorkflowValidationStatus() {
  const { currentWorkflow } = useWorkflowStore();

  if (!currentWorkflow) return null;

  const nodes = currentWorkflow.nodes || [];
  const connections = currentWorkflow.connections || [];
  
  const totalNodes = nodes.length;
  const configuredNodes = nodes.filter(n => n.data?.isConfigured).length;
  const unconfiguredNodes = totalNodes - configuredNodes;
  const totalConnections = connections.length;

  const hasErrors = unconfiguredNodes > 0 || totalNodes === 0;
  const isValid = totalNodes > 0 && unconfiguredNodes === 0;

  return (
    <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur shadow-lg border">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {isValid ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : hasErrors ? (
            <XCircle className="h-5 w-5 text-red-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          )}
          
          <div className="flex items-center gap-3 text-sm">
            <Badge variant={totalNodes > 0 ? "default" : "secondary"}>
              {totalNodes} Nodes
            </Badge>
            
            <Badge variant={totalConnections > 0 ? "default" : "secondary"}>
              {totalConnections} Connections
            </Badge>
            
            {unconfiguredNodes > 0 && (
              <Badge variant="destructive">
                {unconfiguredNodes} Unconfigured
              </Badge>
            )}
            
            {isValid && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Ready to Deploy
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
