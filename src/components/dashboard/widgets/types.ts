
import { ReactNode } from "react";

export interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  icon?: ReactNode;
  defaultSize: {
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
  };
  component: React.ComponentType<DashboardWidgetProps>;
}

export interface DashboardWidgetProps {
  className?: string;
  data?: any;
}
