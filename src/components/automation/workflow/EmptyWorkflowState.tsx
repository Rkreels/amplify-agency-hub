
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, PlayCircle, FileText } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';

export function EmptyWorkflowState() {
  const { createNewWorkflow } = useWorkflowStore();

  const handleCreateWorkflow = () => {
    createNewWorkflow({
      name: 'New Workflow',
      description: 'A new automation workflow',
      isActive: false
    });
  };

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Create Your First Workflow
          </h3>
          
          <p className="text-gray-600 mb-6">
            Build powerful automation workflows to streamline your business processes.
          </p>
          
          <div className="space-y-3">
            <Button onClick={handleCreateWorkflow} className="w-full">
              <PlayCircle className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
            
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              View Templates
            </Button>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            Start with triggers, add actions, and connect them to create powerful automations.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
