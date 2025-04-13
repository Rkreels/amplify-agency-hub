
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Check, List } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export function UpcomingTasks() {
  const tasks: Task[] = [
    {
      id: 1,
      title: "Follow up with Sarah Johnson",
      dueDate: "Today, 2:00 PM",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Prepare proposal for Michael Brown",
      dueDate: "Tomorrow, 10:00 AM",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "Review marketing campaign results",
      dueDate: "Wed, Apr 15",
      priority: "low",
      completed: false,
    },
    {
      id: 4,
      title: "Update CRM with new contacts",
      dueDate: "Thu, Apr 16",
      priority: "medium",
      completed: true,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-0.5">
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>
            Tasks scheduled for the next few days.
          </CardDescription>
        </div>
        <List className="w-4 h-4 ml-auto text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 rounded-md p-2.5 hover:bg-muted/50 transition-colors",
              task.completed && "opacity-60"
            )}
          >
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              className="mt-0.5"
            />
            <div className="grid gap-1">
              <label
                htmlFor={`task-${task.id}`}
                className={cn(
                  "text-sm font-medium cursor-pointer",
                  task.completed && "line-through"
                )}
              >
                {task.title}
              </label>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{task.dueDate}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    task.priority === "high" && "border-red-500 text-red-500",
                    task.priority === "medium" && "border-amber-500 text-amber-500",
                    task.priority === "low" && "border-green-500 text-green-500"
                  )}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
