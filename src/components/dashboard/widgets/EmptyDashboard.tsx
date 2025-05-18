
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard } from "lucide-react";

interface EmptyDashboardProps {
  onAddWidgets: () => void;
}

export const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onAddWidgets }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg bg-muted/30">
      <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Your dashboard is empty</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Add widgets to create a personalized dashboard that shows the information most relevant to your business.
      </p>
      <Button onClick={onAddWidgets}>
        <Plus className="h-4 w-4 mr-2" />
        Add Widgets
      </Button>
    </div>
  );
};
