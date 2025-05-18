
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WidgetConfig } from "./types";
import { Plus } from "lucide-react";

interface AvailableWidgetCardProps {
  widget: WidgetConfig;
  onAdd: (widgetId: string) => void;
  disabled?: boolean;
}

export const AvailableWidgetCard: React.FC<AvailableWidgetCardProps> = ({ widget, onAdd, disabled }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{widget.name}</CardTitle>
        <CardDescription className="text-xs">{widget.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-20 bg-muted/30 rounded flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Widget Preview</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full" 
          size="sm"
          onClick={() => onAdd(widget.id)} 
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          {disabled ? "Added" : "Add Widget"}
        </Button>
      </CardFooter>
    </Card>
  );
};
