
import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowDownUp, MoveHorizontal, Grid, Maximize, Minimize, Calendar, BarChart, MessageSquare, DollarSign, Users, Target, TrendingUp, Clock, Mail, Phone, Star, Zap, Globe, Heart, Award, Activity } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Comprehensive widget collection
const availableWidgets: WidgetConfig[] = [
  {
    id: "stats",
    name: "Key Metrics",
    description: "Display key business metrics",
    icon: <BarChart className="h-5 w-5" />,
    defaultSize: { w: 12, h: 2, minW: 6, minH: 2 },
    component: (props: DashboardWidgetProps) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
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
    icon: <Target className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: SalesPipeline
  },
  {
    id: "leads-by-source",
    name: "Leads by Source",
    description: "Lead distribution across channels",
    icon: <Users className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: LeadsBySource
  },
  {
    id: "recent-activities",
    name: "Recent Activities",
    description: "Latest activities in your account",
    icon: <Clock className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: RecentActivities
  },
  {
    id: "upcoming-tasks",
    name: "Upcoming Tasks",
    description: "Tasks scheduled for the next few days",
    icon: <Calendar className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: UpcomingTasks
  },
  {
    id: "email-performance",
    name: "Email Performance",
    description: "Email campaign metrics and open rates",
    icon: <Mail className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Email Open Rate"
        value="24.7%"
        variant="chart"
        chart="bar"
        description="Last 30 days"
        change={3.2}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "sms-performance",
    name: "SMS Performance",
    description: "SMS delivery and response rates",
    icon: <MessageSquare className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="SMS Response Rate"
        value="67.3%"
        variant="chart"
        chart="radial"
        description="Last 30 days"
        change={8.1}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "social-engagement",
    name: "Social Engagement",
    description: "Social media engagement metrics",
    icon: <Heart className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Social Engagement"
        value="12.4K"
        variant="chart"
        chart="pie"
        description="Total interactions"
        change={15.6}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "call-analytics",
    name: "Call Analytics",
    description: "Phone call metrics and statistics",
    icon: <Phone className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Call Volume"
        value="456 calls"
        variant="chart"
        chart="bar"
        description="This week"
        change={12}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "conversation-analytics",
    name: "Conversation Analytics",
    description: "Multi-channel conversation metrics",
    icon: <MessageSquare className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Avg Response Time"
        value="4.2 min"
        variant="chart"
        chart="radial"
        description="Across all channels"
        change={-12.5}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "lead-scoring",
    name: "Lead Scoring",
    description: "Top scored leads and scoring trends",
    icon: <Star className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Avg Lead Score"
        value="67.8"
        description="Current average"
        change={4.2}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "automation-performance",
    name: "Automation Performance",
    description: "Workflow and automation metrics",
    icon: <Zap className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Active Automations"
        value="23"
        description="Running workflows"
        change={3}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "website-analytics",
    name: "Website Analytics",
    description: "Website traffic and conversion data",
    icon: <Globe className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Website Visitors"
        value="12.4K"
        variant="chart"
        chart="bar"
        description="This month"
        change={18.5}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "funnel-analytics",
    name: "Funnel Analytics",
    description: "Conversion funnel performance",
    icon: <TrendingUp className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Funnel Conversion"
        value="3.2%"
        variant="chart"
        chart="pie"
        description="Visitor to customer"
        change={0.4}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "review-management",
    name: "Review Management",
    description: "Online reviews and reputation metrics",
    icon: <Award className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Avg Rating"
        value="4.7/5"
        description="Across all platforms"
        change={0.2}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "team-performance",
    name: "Team Performance",
    description: "Team productivity and performance metrics",
    icon: <Users className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Team Productivity"
        value="87%"
        variant="chart"
        chart="radial"
        description="Overall efficiency"
        change={5}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "appointment-analytics",
    name: "Appointment Analytics",
    description: "Booking and appointment statistics",
    icon: <Calendar className="h-5 w-5" />,
    defaultSize: { w: 4, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Appointments Today"
        value="18"
        description="Scheduled meetings"
        change={2}
        className="h-full"
        {...props}
      />
    )
  },
  {
    id: "attribution-analytics",
    name: "Attribution Analytics",
    description: "Multi-touch attribution insights",
    icon: <Activity className="h-5 w-5" />,
    defaultSize: { w: 6, h: 4, minW: 3, minH: 4 },
    component: (props: DashboardWidgetProps) => (
      <StatCard
        title="Attribution ROI"
        value="324%"
        variant="chart"
        chart="bar"
        description="Marketing attribution"
        change={23.1}
        className="h-full"
        {...props}
      />
    )
  }
];

// Enhanced default layout with more widgets
const defaultLayout = [
  { i: "stats", x: 0, y: 0, w: 12, h: 2 },
  { i: "sales-pipeline", x: 0, y: 2, w: 6, h: 4 },
  { i: "leads-by-source", x: 6, y: 2, w: 6, h: 4 },
  { i: "recent-activities", x: 0, y: 6, w: 6, h: 4 },
  { i: "upcoming-tasks", x: 6, y: 6, w: 6, h: 4 },
  { i: "email-performance", x: 0, y: 10, w: 4, h: 4 },
  { i: "sms-performance", x: 4, y: 10, w: 4, h: 4 },
  { i: "call-analytics", x: 8, y: 10, w: 4, h: 4 }
];

// Layout breakpoints
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const cols = { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 };

export const WidgetManager: React.FC = () => {
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [layouts, setLayouts] = useLocalStorage("dashboard-layout", { lg: defaultLayout });
  const [activeWidgets, setActiveWidgets] = useLocalStorage("active-widgets", defaultLayout.map(item => item.i));
  const [isDragging, setIsDragging] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("lg");
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  
  // Set mounted state after component mounts to prevent SSR issues with window sizing
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLayoutChange = (currentLayout: any[], allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const handleBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
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
    const maxY = Math.max(...(layouts[currentBreakpoint] || []).map(item => item.y + item.h), 0);
    
    const newWidget = {
      i: widgetId,
      x: 0, // Start at the beginning of the row
      y: maxY, // Place below the lowest widget
      w: isMobile ? Math.min(cols[currentBreakpoint as keyof typeof cols], defaultSize.w) : defaultSize.w,
      h: defaultSize.h
    };
    
    const currentLayoutArray = layouts[currentBreakpoint] || [];
    
    const newLayouts = {
      ...layouts,
      [currentBreakpoint]: [...currentLayoutArray, newWidget]
    };
    
    setLayouts(newLayouts);
    setActiveWidgets([...activeWidgets, widgetId]);
    setIsAddWidgetOpen(false);
    
    toast.success("Widget added to dashboard");
  };

  const handleRemoveWidget = (widgetId: string) => {
    // Remove from all responsive layouts
    const updatedLayouts = { ...layouts };
    
    Object.keys(updatedLayouts).forEach(breakpoint => {
      if (updatedLayouts[breakpoint]) {
        updatedLayouts[breakpoint] = updatedLayouts[breakpoint].filter(
          (item: any) => item.i !== widgetId
        );
      }
    });
    
    setLayouts(updatedLayouts);
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

  // Don't render until component is mounted to avoid SSR hydration issues
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          {activeWidgets.length > 0 && (
            <>
              <Button 
                variant={isEditMode ? "default" : "outline"} 
                onClick={toggleEditMode}
                size={isMobile ? "sm" : "default"}
                className="flex items-center"
              >
                <MoveHorizontal className="h-4 w-4 mr-2" />
                {isEditMode ? "Save Changes" : "Customize"}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetDashboard}
                size={isMobile ? "sm" : "default"}
              >
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          )}
          <Button 
            onClick={() => setIsAddWidgetOpen(true)}
            size={isMobile ? "sm" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>
      
      {activeWidgets.length === 0 ? (
        <EmptyDashboard onAddWidgets={() => setIsAddWidgetOpen(true)} />
      ) : (
        <div 
          className={`transition-all duration-200 ${isDragging ? "opacity-75" : ""}`}
          data-edit-mode={isEditMode ? "true" : "false"}
        >
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={60}
            onLayoutChange={handleLayoutChange}
            onBreakpointChange={handleBreakpointChange}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            onDragStart={() => setIsDragging(true)}
            onDragStop={() => setIsDragging(false)}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            useCSSTransforms={true}
            compactType="vertical"
            draggableHandle={isEditMode ? ".widget-drag-handle" : undefined}
          >
            {(layouts[currentBreakpoint] || [])
              .filter(item => activeWidgets.includes(item.i))
              .map(item => {
                const widgetConfig = availableWidgets.find(w => w.id === item.i);
                if (!widgetConfig) return null;
                
                const WidgetComponent = widgetConfig.component;
                
                return (
                  <div key={item.i} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="h-full flex flex-col">
                      {isEditMode && (
                        <div className="widget-drag-handle bg-muted/60 p-2 flex justify-between items-center border-b cursor-move">
                          <div className="flex items-center gap-2">
                            <Grid className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{widgetConfig.name}</span>
                          </div>
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
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Widget</DialogTitle>
            <DialogDescription>
              Choose from our comprehensive collection of widgets to customize your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
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
