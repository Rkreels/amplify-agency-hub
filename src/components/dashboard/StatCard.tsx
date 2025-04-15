
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  positive?: boolean;
  negative?: boolean;
  className?: string;
  color?: string;
  variant?: "default" | "simple";
  children?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  positive,
  negative,
  className,
  color,
  variant = "default",
  children
}: StatCardProps) {
  if (variant === "simple") {
    return (
      <Card className={cn("shadow-sm border", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-center py-4">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground text-center">{description}</p>
          )}
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("transition-all shadow-sm border", 
      positive && "border-l-green-500",
      negative && "border-l-red-500",
      color && `border-l-[${color}]`,
      !positive && !negative && !color && "border-l-primary",
      className)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className="bg-primary/10 p-1.5 rounded-full">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
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
        {children}
      </CardContent>
    </Card>
  );
}
