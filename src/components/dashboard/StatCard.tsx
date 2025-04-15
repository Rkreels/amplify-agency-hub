
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  positive?: boolean;
  negative?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  positive,
  negative,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("transition-all shadow-sm hover:shadow-md border-l-4", 
      positive && "border-l-green-500",
      negative && "border-l-red-500",
      !positive && !negative && "border-l-primary",
      className)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-primary/10 p-1.5 rounded-full">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p
            className={cn(
              "text-xs",
              positive && "text-green-600 dark:text-green-400",
              negative && "text-red-600 dark:text-red-400",
              !positive && !negative && "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
