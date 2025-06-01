
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ChevronDown, Clock, Search, X } from 'lucide-react';
import { useWorkflowStore, WorkflowExecution } from '@/store/useWorkflowStore';

export function WorkflowHistory() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  
  // Get workflow executions from store
  const { executionLogs } = useWorkflowStore();

  // Filter and search executions
  const filteredExecutions = executionLogs.filter(execution => {
    if (filter !== 'all' && execution.status !== filter) {
      return false;
    }
    
    if (searchTerm) {
      return (
        execution.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        execution.contactId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

  // Generate random executions if no real ones exist
  const sampleExecutions: WorkflowExecution[] = executionLogs.length > 0 ? executionLogs : Array.from({ length: 10 }).map((_, i) => ({
    id: `sample-${1000 + i}`,
    workflowId: 'default-workflow',
    contactId: `contact-${2000 + i}`,
    status: ['completed', 'running', 'failed'][Math.floor(Math.random() * 3)] as 'running' | 'completed' | 'failed',
    currentNode: `node-${i}`,
    startedAt: new Date(Date.now() - i * 3600000),
    completedAt: Math.random() > 0.3 ? new Date(Date.now() - i * 3000000) : undefined,
    logs: []
  }));

  const displayedExecutions = filteredExecutions.length > 0 ? filteredExecutions : sampleExecutions;

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600"><Check className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-600"><Clock className="h-3 w-3 mr-1 animate-spin" /> Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-600"><X className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'paused':
        return <Badge variant="outline" className="border-amber-600 text-amber-600">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Execution History</h2>
        <Button variant="outline">Export History</Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by ID or contact..."
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-6">
          <Card>
            <ScrollArea className="h-[60vh]">
              <CardContent className="p-0">
                <div className="divide-y">
                  {displayedExecutions.map((execution) => (
                    <Collapsible
                      key={execution.id}
                      open={expandedExecution === execution.id}
                      onOpenChange={() => {
                        if (expandedExecution === execution.id) {
                          setExpandedExecution(null);
                        } else {
                          setExpandedExecution(execution.id);
                        }
                      }}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                          <div>
                            <div className="font-medium">Execution #{execution.id}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <span className="mr-4">Started {formatDate(execution.startedAt)}</span>
                              <span>Contact ID: {execution.contactId}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(execution.status)}
                            <ChevronDown className={`h-4 w-4 transition-transform ${
                              expandedExecution === execution.id ? 'transform rotate-180' : ''
                            }`} />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="px-4 pb-4 bg-gray-50">
                          <div className="p-4 bg-white rounded border">
                            <h4 className="font-medium mb-2">Execution Details</h4>
                            <table className="w-full text-sm">
                              <tbody>
                                <tr>
                                  <td className="py-1 text-gray-500">Workflow ID:</td>
                                  <td>{execution.workflowId}</td>
                                </tr>
                                <tr>
                                  <td className="py-1 text-gray-500">Status:</td>
                                  <td>{getStatusBadge(execution.status)}</td>
                                </tr>
                                <tr>
                                  <td className="py-1 text-gray-500">Started:</td>
                                  <td>{formatDate(execution.startedAt)}</td>
                                </tr>
                                {execution.completedAt && (
                                  <tr>
                                    <td className="py-1 text-gray-500">Completed:</td>
                                    <td>{formatDate(execution.completedAt)}</td>
                                  </tr>
                                )}
                                <tr>
                                  <td className="py-1 text-gray-500">Duration:</td>
                                  <td>
                                    {execution.completedAt 
                                      ? `${((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000).toFixed(2)} seconds` 
                                      : 'In progress'}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-1 text-gray-500">Current/Last Node:</td>
                                  <td>{execution.currentNode}</td>
                                </tr>
                              </tbody>
                            </table>
                            
                            {execution.logs.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium mb-2">Execution Logs</h4>
                                <ScrollArea className="h-60 border rounded">
                                  <div className="p-2 space-y-1">
                                    {execution.logs.map((log, index) => (
                                      <div key={index} className="text-xs font-mono p-1 border-l-2 border-gray-300">
                                        <span className="text-gray-500">{new Date(log.timestamp).toISOString()}</span>
                                        <span className={`ml-2 ${log.result === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                          [{log.result}]
                                        </span>
                                        <span className="ml-2 text-blue-600">{log.nodeId}</span>
                                        <span className="ml-2">{log.message}</span>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            )}
                            
                            <div className="flex justify-end mt-4 space-x-2">
                              {execution.status === 'running' && (
                                <Button variant="outline" size="sm">
                                  Pause Execution
                                </Button>
                              )}
                              {execution.status === 'paused' && (
                                <Button variant="outline" size="sm">
                                  Resume Execution
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Execution Timeline</CardTitle>
            </CardHeader>
            <CardContent className="h-[60vh] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>Timeline view is coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
