
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { SmsAutomationBuilder } from "@/components/automation/SmsAutomationBuilder";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function SmsAutomations() {
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Example automations list
  const automations = [
    {
      id: "1",
      name: "Appointment Reminder",
      trigger: "Appointment Booked",
      status: "active",
      lastRun: "2 hours ago",
      sentCount: 156
    },
    {
      id: "2",
      name: "Follow-up After Service",
      trigger: "Tag Applied: Service Completed",
      status: "active",
      lastRun: "6 days ago",
      sentCount: 89
    },
    {
      id: "3",
      name: "Reactivation Campaign",
      trigger: "Contact Created",
      status: "inactive",
      lastRun: "Never",
      sentCount: 0
    }
  ];
  
  const filteredAutomations = searchQuery 
    ? automations.filter(automation => 
        automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.trigger.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : automations;

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SMS Automations</h1>
          <p className="text-muted-foreground">
            Create and manage automated SMS sequences for your contacts
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create SMS Automation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <SmsAutomationBuilder />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search automations..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
          <div className="col-span-4">Name</div>
          <div className="col-span-3">Trigger</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last Run</div>
          <div className="col-span-1 text-right">Sent</div>
        </div>
        
        {filteredAutomations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No automations match your search.
          </div>
        ) : (
          filteredAutomations.map((automation) => (
            <div key={automation.id} className="grid grid-cols-12 gap-4 p-4 border-t hover:bg-muted/20 cursor-pointer">
              <div className="col-span-4 font-medium">{automation.name}</div>
              <div className="col-span-3">{automation.trigger}</div>
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  automation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {automation.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="col-span-2 text-muted-foreground">{automation.lastRun}</div>
              <div className="col-span-1 text-right">{automation.sentCount}</div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
