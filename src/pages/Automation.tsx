
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Zap, Plus, Play, Pause, Settings, PenTool, Workflow, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Automation() {
  const workflows = [
    {
      id: 1,
      name: "New Lead Follow-up",
      description: "Automatically send emails when new leads are added",
      status: "active",
      triggers: ["New Contact Created", "Form Submission"],
      actions: ["Send Email", "Add Tag", "Create Task"],
      stats: {
        runs: 124,
        completed: 118,
        active: 6,
      },
    },
    {
      id: 2,
      name: "Appointment Reminder",
      description: "Send SMS reminders before scheduled appointments",
      status: "active",
      triggers: ["Appointment Scheduled"],
      actions: ["Send SMS", "Update Contact"],
      stats: {
        runs: 89,
        completed: 86,
        active: 3,
      },
    },
    {
      id: 3,
      name: "Abandoned Cart Recovery",
      description: "Follow up with customers who abandoned their carts",
      status: "draft",
      triggers: ["Cart Abandoned"],
      actions: ["Wait", "Send Email", "Conditional"],
      stats: {
        runs: 0,
        completed: 0,
        active: 0,
      },
    },
    {
      id: 4,
      name: "Re-engagement Campaign",
      description: "Re-engage with inactive customers after 30 days",
      status: "paused",
      triggers: ["Contact Inactive"],
      actions: ["Send Email Sequence", "Add Tag"],
      stats: {
        runs: 42,
        completed: 42,
        active: 0,
      },
    },
  ];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automation</h1>
          <p className="text-muted-foreground">
            Create and manage automated workflows and marketing sequences
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Total Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.length}</div>
            <p className="text-xs text-muted-foreground">
              {workflows.filter(w => w.status === "active").length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Automations Run</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((acc, w) => acc + w.stats.runs, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +43 from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">Active Workflows</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workflows.reduce((acc, w) => acc + w.stats.active, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle>{workflow.name}</CardTitle>
                  <Badge 
                    variant={workflow.status === "active" ? "default" : workflow.status === "draft" ? "outline" : "secondary"}
                  >
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{workflow.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                {workflow.status === "active" ? (
                  <Button variant="outline" size="sm">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <PenTool className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2">Triggers</h3>
                  <div className="space-y-2">
                    {workflow.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center bg-muted/50 py-2 px-3 rounded-md text-sm">
                        <Zap className="h-4 w-4 mr-2 text-primary" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2">Actions</h3>
                  <div className="space-y-2">
                    {workflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {index > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                        <div className="flex items-center bg-muted/50 py-2 px-3 rounded-md text-sm">
                          {action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2">Performance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-medium">{workflow.stats.runs}</div>
                      <div className="text-xs text-muted-foreground">Total Runs</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-medium">{workflow.stats.completed}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="text-2xl font-medium">{workflow.stats.active}</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
