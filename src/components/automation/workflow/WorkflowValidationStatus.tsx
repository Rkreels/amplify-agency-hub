
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function WorkflowValidationStatus() {
  const { validateWorkflow, currentWorkflow } = useWorkflowStore();
  const validation = validateWorkflow();
  
  if (!currentWorkflow) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <Info className="h-4 w-4" />
        <span className="text-sm">No workflow selected</span>
      </div>
    );
  }
  
  if (validation.isValid) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Workflow is valid and ready to run</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">
            {currentWorkflow.nodes.length} nodes • {currentWorkflow.connections.length} connections
          </span>
        </div>
      </div>
    );
  }
  
  const showDetails = () => {
    toast.info(
      <div className="space-y-2">
        <div className="font-medium">Workflow Validation Issues:</div>
        <ul className="list-disc pl-5 text-sm">
          {validation.errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">
          {validation.errors.length} issue{validation.errors.length > 1 ? 's' : ''} need{validation.errors.length === 1 ? 's' : ''} to be resolved
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-6 px-2 hover:bg-red-50"
          onClick={showDetails}
        >
          View Details
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-xs text-slate-500">
          {currentWorkflow.nodes.length} nodes • {currentWorkflow.connections.length} connections
        </span>
      </div>
    </div>
  );
}
