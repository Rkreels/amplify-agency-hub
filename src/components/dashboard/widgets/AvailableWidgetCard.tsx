
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { WidgetConfig } from "./types";

interface AvailableWidgetCardProps {
  widget: WidgetConfig;
  onAdd: (widgetId: string) => void;
  disabled?: boolean;
}

export const AvailableWidgetCard: React.FC<AvailableWidgetCardProps> = ({
  widget,
  onAdd,
  disabled = false
}) => {
  return (
    <Card className={`border ${disabled ? 'bg-muted/30 border-dashed' : 'hover:border-primary/50 hover:shadow-sm'} transition-all duration-200`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-md">
            {widget.icon || <div className="w-5 h-5 bg-primary/20 rounded-sm" />}
          </div>
          <h3 className="font-medium">{widget.name}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {widget.description}
        </p>
        
        <Button 
          onClick={() => onAdd(widget.id)} 
          disabled={disabled} 
          variant={disabled ? "outline" : "default"}
          className="w-full"
        >
          {disabled ? (
            "Already Added"
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to Dashboard
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
