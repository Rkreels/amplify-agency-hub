
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  GitBranch,
  Grip,
  Mail,
  User,
  Target,
  Workflow,
  Calendar,
  Settings,
  ChevronDown,
  X
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { WorkflowNode } from '@/store/useWorkflowStore';

interface ActionsPanelProps {
  node: WorkflowNode | undefined;
  onClose: () => void;
}

export function ActionsPanel({ node, onClose }: ActionsPanelProps) {
  if (!node) return null;

  return (
    <div className="p-4 border-l bg-white h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Node Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Node Details</h4>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <p className="font-medium">{node.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Label</label>
                <p className="font-medium">{node.data.label}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <Badge variant={node.data.isConfigured ? "default" : "outline"}>
                  {node.data.isConfigured ? "Configured" : "Setup Required"}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Position</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <label className="text-gray-600">X:</label>
                <span className="ml-1">{Math.round(node.position.x)}</span>
              </div>
              <div>
                <label className="text-gray-600">Y:</label>
                <span className="ml-1">{Math.round(node.position.y)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Configuration</h4>
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Configure Node
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
