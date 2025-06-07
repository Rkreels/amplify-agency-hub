
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Users, 
  Zap,
  Building,
  Star,
  BarChart3,
  ShoppingBag,
  Smartphone,
  Settings,
  ChevronRight,
  Phone,
  Mail,
  Share2,
  CreditCard,
  Brain,
  Globe,
  Workflow,
  UserCheck,
  Target,
  BookOpen,
  Shield,
  Headphones
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "AI Features",
    href: "/ai-features",
    icon: Brain,
    badge: "New"
  },
  {
    name: "Conversations",
    href: "/conversations",
    icon: MessageSquare,
  },
  {
    name: "Calendar",
    href: "/calendars",
    icon: Calendar,
    children: [
      { name: "Calendars", href: "/calendars" },
      { name: "Create Calendar", href: "/calendar/create" },
      { name: "Settings", href: "/calendar/settings" },
      { name: "Availability", href: "/calendar/availability" },
      { name: "Appointment Types", href: "/calendar/appointment-types" },
      { name: "Integrations", href: "/calendar/integrations" },
    ]
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: Users,
  },
  {
    name: "CRM",
    href: "/crm",
    icon: Target,
  },
  {
    name: "Opportunities",
    href: "/opportunities",
    icon: UserCheck,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    name: "Marketing",
    href: "/marketing",
    icon: Target,
    children: [
      { name: "Overview", href: "/marketing" },
      { name: "SMS Campaigns", href: "/marketing/sms-campaigns" },
      { name: "Email Marketing", href: "/email-marketing" },
      { name: "Social Media", href: "/social-media" },
    ]
  },
  {
    name: "Automation",
    href: "/automation",
    icon: Zap,
    children: [
      { name: "Overview", href: "/automation" },
      { name: "SMS Automations", href: "/automation/sms" },
      { name: "Workflow Builder", href: "/automation/builder" },
    ]
  },
  {
    name: "Phone System",
    href: "/phone-system",
    icon: Phone,
    badge: "Pro"
  },
  {
    name: "Messaging",
    href: "/messaging",
    icon: MessageSquare,
  },
  {
    name: "Sites & Funnels",
    href: "/sites",
    icon: Globe,
  },
  {
    name: "Reputation",
    href: "/reputation-management",
    icon: Star,
  },
  {
    name: "Memberships",
    href: "/memberships",
    icon: BookOpen,
  },
  {
    name: "Reporting",
    href: "/reporting",
    icon: BarChart3,
  },
  {
    name: "Integrations",
    href: "/integrations",
    icon: Workflow,
  },
  {
    name: "App Marketplace",
    href: "/app-marketplace",
    icon: ShoppingBag,
  },
  {
    name: "Mobile App",
    href: "/mobile-app",
    icon: Smartphone,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GH</span>
            </div>
            <span className="text-lg font-semibold">GoHighLevel</span>
          </div>
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isExpanded = expandedItems.includes(item.name);
                const isActive = location.pathname === item.href || 
                  (item.children && item.children.some(child => location.pathname === child.href));
                
                return (
                  <div key={item.name}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive && "bg-secondary"
                      )}
                      onClick={() => {
                        if (item.children) {
                          toggleExpanded(item.name);
                        }
                      }}
                      asChild={!item.children}
                    >
                      {item.children ? (
                        <div className="flex items-center w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-90"
                            )} 
                          />
                        </div>
                      ) : (
                        <Link to={item.href} className="flex items-center w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )}
                    </Button>
                    
                    {item.children && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Button
                            key={child.href}
                            variant={location.pathname === child.href ? "secondary" : "ghost"}
                            className="w-full justify-start text-sm"
                            asChild
                          >
                            <Link to={child.href}>
                              {child.name}
                            </Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
