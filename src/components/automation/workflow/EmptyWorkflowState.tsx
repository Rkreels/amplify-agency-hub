
import { Zap } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { toast } from 'sonner';

export function EmptyWorkflowState() {
  const { addNode, openConfigModal } = useWorkflowStore();
  
  const addTrigger = () => {
    const newNode = {
      id: `trigger-${Date.now()}`,
      type: 'trigger' as const,
      position: { x: 400, y: 200 },
      data: {
        label: 'New Trigger',
        icon: Zap,
        isConfigured: false,
        handles: {
          source: ['default'],
          target: []
        }
      }
    };
    addNode(newNode);
    setTimeout(() => openConfigModal(newNode), 100);
    toast.success('Trigger added to workflow');
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full pointer-events-none">
      <div 
        className="bg-white border-2 border-dashed border-orange-400 rounded-lg p-8 cursor-pointer hover:border-orange-500 transition-colors hover:shadow-lg pointer-events-auto"
        onClick={addTrigger}
      >
        <div className="text-center">
          <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <div className="text-gray-600 text-xl font-medium">
            Add Workflow Trigger
          </div>
          <div className="text-gray-400 text-sm mt-2">
            Every workflow starts with a trigger that determines when it will run
          </div>
        </div>
      </div>
    </div>
  );
}
