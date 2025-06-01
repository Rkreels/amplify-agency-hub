
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  GitBranch,
  Grip
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Workflow } from '@/store/useWorkflowStore';

interface ActionType {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  category: string;
  description: string;
}

interface ActionsPanelProps {
  actionTypes: ActionType[];
  draggedAction: ActionType | null;
  handleDragStart: (action: ActionType, e: React.DragEvent) => void;
  handleDragEnd: () => void;
  addTrigger: () => void;
  currentWorkflow: Workflow | null;
}

// Category icons mapping
const categoryIcons = {
  communication: 'Mail',
  contact: 'User',
  sales: 'Target',
  automation: 'Workflow',
  scheduling: 'Calendar',
  flow: 'GitBranch'
};

// Category display names
const categoryNames = {
  communication: 'Communication',
  contact: 'Contact Management',
  sales: 'Sales & Opportunities',
  automation: 'Workflow Management',
  scheduling: 'Scheduling',
  flow: 'Flow Control'
};

export function ActionsPanel({
  actionTypes,
  draggedAction,
  handleDragStart,
  handleDragEnd,
  addTrigger,
  currentWorkflow
}: ActionsPanelProps) {
  // Group actions by category
  const groupedActions = actionTypes.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, ActionType[]>);

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wider">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addTrigger}
              className="h-auto flex-col gap-1 p-3 hover:bg-orange-50 hover:border-orange-300"
            >
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-xs">Add Trigger</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-auto flex-col gap-1 p-3 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => GitBranch}
            >
              <GitBranch className="h-4 w-4 text-blue-500" />
              <span className="text-xs">Add Condition</span>
            </Button>
          </div>
        </div>

        {/* Workflow Stats */}
        {currentWorkflow && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wider">Workflow Stats</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded border">
                <div className="text-lg font-bold text-blue-600">{currentWorkflow.nodes.length}</div>
                <div className="text-xs text-blue-600">Nodes</div>
              </div>
              <div className="bg-green-50 p-2 rounded border">
                <div className="text-lg font-bold text-green-600">{currentWorkflow.connections.length}</div>
                <div className="text-xs text-green-600">Connections</div>
              </div>
              <div className="bg-purple-50 p-2 rounded border">
                <div className="text-lg font-bold text-purple-600">{currentWorkflow.stats.triggered}</div>
                <div className="text-xs text-purple-600">Triggered</div>
              </div>
              <div className="bg-orange-50 p-2 rounded border">
                <div className="text-lg font-bold text-orange-600">{currentWorkflow.stats.completed}</div>
                <div className="text-xs text-orange-600">Completed</div>
              </div>
            </div>
          </div>
        )}

        {/* Available Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wider">Available Actions</h3>
          <div className="text-xs text-gray-500 mb-2">
            Drag and drop actions to the canvas
          </div>
          
          {Object.entries(groupedActions).map(([category, actions]) => {
            // For each category, import the icon dynamically
            const CategoryIconName = categoryIcons[category as keyof typeof categoryIcons] || 'Settings';
            // Get proper display name for the category
            const categoryName = categoryNames[category as keyof typeof categoryNames] || category;
            
            // Import the icon component from lucide-react
            const { Mail, User, Target, Workflow, Calendar, GitBranch, Settings } = require('lucide-react');
            const CategoryIcon = {
              'Mail': Mail,
              'User': User,
              'Target': Target,
              'Workflow': Workflow,
              'Calendar': Calendar,
              'GitBranch': GitBranch,
              'Settings': Settings
            }[CategoryIconName];
            
            return (
              <Collapsible key={category} defaultOpen={category === 'communication'} className="mb-2">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="h-4 w-4" />
                    <h4 className="font-medium text-sm">{categoryName}</h4>
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-2">
                  <div className="grid gap-2">
                    {actions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <div
                          key={action.id}
                          draggable
                          onDragStart={(e) => handleDragStart(action, e)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-gray-200 hover:border-gray-300 hover:shadow-sm ${
                            draggedAction?.id === action.id ? 'opacity-50 scale-95' : ''
                          }`}
                        >
                          <div className="flex items-center justify-center mr-3">
                            <Grip className="h-3 w-3 text-gray-400 mr-1" />
                            <div className="bg-gray-700 text-white p-2 rounded">
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{action.label}</div>
                            <div className="text-xs text-gray-500 truncate">{action.description}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

// Helper component for the dropdown chevron
export const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
