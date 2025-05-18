import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDownUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DashboardWidgetProps, WidgetConfig } from "./types";
import { StatCard } from "../StatCard";
import { SalesPipeline } from "../SalesPipeline";
import { LeadsBySource } from "../LeadsBySource";
import { RecentActivities } from "../RecentActivities";
import { UpcomingTasks } from "../UpcomingTasks";
import { AvailableWidgetCard } from "./AvailableWidgetCard";
import { EmptyDashboard } from "./EmptyDashboard";
import { useLocalStorage } from "@/hooks/use-local-storage";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// All available widgets that can be added to the dashboard
const availableWidgets: WidgetConfig[] = [
  {
    id: "stats",
    name: "Key Metrics",
    description: "Display key business metrics",
    defaultSize: { w: 12, h: 2, minW: 6, minH: 2 },
    component: (props: DashboardWidgetProps) => (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        <StatCard
          title="Total Revenue"
          value="$245,300"
          icon="dollar-sign"
          description="From all sources"
          change={12}
        />
        <StatCard
          title="New Leads"
          value="1,450"
          icon="users"
          description="This month"
          change={5}
        />
        <StatCard
          title="Active Deals"
          value="324"
          icon="file-text"
          description="Currently in progress"
          change={-2}
        />
        <StatCard
          title="Tasks Completed"
          value="2,876"
          icon="list-checks"
          description="This quarter"
          change={15}
        />
      </div>
    )
  },
  {
    id: "sales-pipeline",
    name: "Sales Pipeline",
    description: "Overview of your deals by stage",
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: SalesPipeline
  },
  {
    id: "leads-by-source",
    name: "Leads by Source",
    description: "Lead distribution across channels",
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: LeadsBySource
  },
  {
    id: "recent-activities",
    name: "Recent Activities",
    description: "Latest activities in your account",
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: RecentActivities
  },
  {
    id: "upcoming-tasks",
    name: "Upcoming Tasks",
    description: "Tasks scheduled for the next few days",
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: UpcomingTasks
  },
  {
    id: "opportunity-status",
    name: "Opportunity Status",
    description: "Status of all opportunities",
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Opportunity Status"
        value="63,608"
        variant="chart"
        chart="pie"
        description="Total opportunities"
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "conversion-rate",
    name: "Conversion Rate",
    description: "Lead to customer conversion percentage",
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Conversion Rate"
        value="4.3%"
        variant="chart"
        chart="radial"
        description="Lead to customer"
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "opportunity-value",
    name: "Opportunity Value",
    description: "Value of all opportunities",
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Opportunity Value"
        value="$23.77M"
        variant="chart"
        chart="bar"
        description="Total opportunity value"
        className="h-full"
        {...props}
      />
    )
  }
];

// Default layout for first time users
const defaultLayout = [
  { i: "stats", x: 0, y: 0, w: 12, h: 2 },
  { i: "sales-pipeline", x: 0, y: 2, w: 6, h: 4 },
  { i: "leads-by-source", x: 6, y: 2, w: 6, h: 4 },
  { i: "recent-activities", x: 0, y: 6, w: 6, h: 4 },
  { i: "upcoming-tasks", x: 6, y: 6, w: 6, h: 4 }
];

export const WidgetManager: React.FC = () => {
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [layouts, setLayouts] = useLocalStorage("dashboard-layout", { lg: defaultLayout });
  const [activeWidgets, setActiveWidgets] = useLocalStorage("active-widgets", defaultLayout.map(item => item.i));
  const [isDragging, setIsDragging] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleLayoutChange = (currentLayout: any[], allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const handleAddWidget = (widgetId: string) => {
    if (activeWidgets.includes(widgetId)) {
      toast.error("This widget is already on your dashboard");
      return;
    }

    const widgetConfig = availableWidgets.find(w => w.id === widgetId);
    if (!widgetConfig) return;

    const { defaultSize } = widgetConfig;
    
    // Find the highest y value in the current layout to place the new widget below
    const maxY = Math.max(...(layouts.lg || []).map(item => item.y + item.h), 0);
    
    const newWidget = {
      i: widgetId,
      x: 0, // Start at the beginning of the row
      y: maxY, // Place below the lowest widget
      w: defaultSize.w,
      h: defaultSize.h
    };
    
    const newLayouts = {
      ...layouts,
      lg: [...(layouts.lg || []), newWidget]
    };
    
    setLayouts(newLayouts);
    setActiveWidgets([...activeWidgets, widgetId]);
    setIsAddWidgetOpen(false);
    
    toast.success("Widget added to dashboard");
  };

  const handleRemoveWidget = (widgetId: string) => {
    setLayouts({
      ...layouts,
      lg: (layouts.lg || []).filter(item => item.i !== widgetId)
    });
    
    setActiveWidgets(activeWidgets.filter(id => id !== widgetId));
    toast.success("Widget removed from dashboard");
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      toast.success("Dashboard saved");
    } else {
      toast.info("Edit mode activated. Drag widgets to rearrange or resize them.");
    }
  };

  const resetDashboard = () => {
    setLayouts({ lg: defaultLayout });
    setActiveWidgets(defaultLayout.map(item => item.i));
    toast.success("Dashboard reset to default layout");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          {activeWidgets.length > 0 && (
            <>
              <Button 
                variant={isEditMode ? "default" : "outline"} 
                onClick={toggleEditMode}
              >
                {isEditMode ? "Save Changes" : "Customize Dashboard"}
              </Button>
              <Button variant="outline" onClick={resetDashboard}>
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Reset Layout
              </Button>
            </>
          )}
          <Button onClick={() => setIsAddWidgetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>
      
      {activeWidgets.length === 0 ? (
        <EmptyDashboard onAddWidgets={() => setIsAddWidgetOpen(true)} />
      ) : (
        <div className={`transition-all duration-200 ${isDragging ? "opacity-75" : ""}`}>
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            onDragStart={() => setIsDragging(true)}
            onDragStop={() => setIsDragging(false)}
            margin={[16, 16]}
          >
            {(layouts.lg || [])
              .filter(item => activeWidgets.includes(item.i))
              .map(item => {
                const widgetConfig = availableWidgets.find(w => w.id === item.i);
                if (!widgetConfig) return null;
                
                const WidgetComponent = widgetConfig.component;
                
                return (
                  <div key={item.i} className="bg-white rounded-lg shadow">
                    <div className="h-full flex flex-col">
                      {isEditMode && (
                        <div className="bg-muted/60 p-2 flex justify-between items-center border-b cursor-move">
                          <span className="text-sm font-medium">{widgetConfig.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveWidget(item.i)}
                          >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </div>
                      )}
                      <div className={`flex-1 p-4 ${isEditMode ? 'pointer-events-none opacity-80' : ''}`}>
                        <WidgetComponent />
                      </div>
                    </div>
                  </div>
                );
              })}
          </ResponsiveGridLayout>
        </div>
      )}
      
      <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Widget</DialogTitle>
            <DialogDescription>
              Choose widgets to add to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {availableWidgets.map(widget => (
              <AvailableWidgetCard
                key={widget.id}
                widget={widget}
                onAdd={handleAddWidget}
                disabled={activeWidgets.includes(widget.id)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
