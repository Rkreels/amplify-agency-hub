
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, FolderKanban } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function SalesPipeline() {
  const pipelineStages = [
    {
      id: 1,
      name: "Qualification",
      count: 12,
      value: 45000,
      progress: 80,
      color: "#3498db"
    },
    {
      id: 2,
      name: "Meeting",
      count: 8,
      value: 32000,
      progress: 60,
      color: "#2ecc71"
    },
    {
      id: 3,
      name: "Proposal",
      count: 5,
      value: 28000,
      progress: 40,
      color: "#9b59b6"
    },
    {
      id: 4,
      name: "Negotiation",
      count: 3,
      value: 18000,
      progress: 25,
      color: "#e74c3c"
    },
    {
      id: 5,
      name: "Closed Won",
      count: 2,
      value: 12000,
      progress: 15,
      color: "#f1c40f"
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-0.5">
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>
            Overview of your deals by stage.
          </CardDescription>
        </div>
        <FolderKanban className="w-4 h-4 ml-auto text-muted-foreground" />
      </CardHeader>
      <CardContent className="grid gap-4">
        {pipelineStages.map((stage) => (
          <div key={stage.id} className="grid gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{stage.name}</span>
                <Badge variant="outline">{stage.count}</Badge>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                ${stage.value.toLocaleString()}
              </span>
            </div>
            <Progress value={stage.progress} className="h-2" style={{ 
              "--progress-background": stage.color
            } as React.CSSProperties} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
