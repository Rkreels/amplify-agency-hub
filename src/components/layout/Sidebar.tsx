
import { cn } from "@/lib/utils";
import {
  BarChart3,
  CalendarClock,
  Contact2,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Settings,
  Users,
  Crown,
  Megaphone,
  Globe,
  Briefcase,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: location.pathname === "/",
    },
    {
      name: "CRM",
      href: "/crm",
      icon: Contact2,
      active: location.pathname.startsWith("/crm"),
    },
    {
      name: "Pipelines",
      href: "/pipelines",
      icon: FolderKanban,
      active: location.pathname.startsWith("/pipelines"),
    },
    {
      name: "Marketing",
      href: "/marketing",
      icon: Megaphone,
      active: location.pathname.startsWith("/marketing"),
    },
    {
      name: "Email & SMS",
      href: "/messaging",
      icon: Mail,
      active: location.pathname.startsWith("/messaging"),
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: CalendarClock,
      active: location.pathname.startsWith("/calendar"),
    },
    {
      name: "Funnels",
      href: "/funnels",
      icon: Globe,
      active: location.pathname.startsWith("/funnels"),
    },
    {
      name: "Forms",
      href: "/forms",
      icon: FileText,
      active: location.pathname.startsWith("/forms"),
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      active: location.pathname.startsWith("/reports"),
    },
  ];

  const secondaryNavigation = [
    {
      name: "Agency Hub",
      href: "/agency",
      icon: Briefcase,
      active: location.pathname.startsWith("/agency"),
    },
    {
      name: "Upgrade",
      href: "/upgrade",
      icon: Crown,
      active: location.pathname.startsWith("/upgrade"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: location.pathname.startsWith("/settings"),
    },
    {
      name: "Help",
      href: "/help",
      icon: LifeBuoy,
      active: location.pathname.startsWith("/help"),
    },
  ];
  
  return (
    <div className={cn("pb-12 bg-sidebar", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link to="/" className="flex items-center">
            <span className="sr-only">Amplify</span>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2">A</div>
            <h1 className="text-xl font-bold">Amplify</h1>
          </Link>
          <div className="mt-3 flex items-center gap-2 rounded-md bg-sidebar-accent p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground/80">Agency</p>
              <p className="text-sm font-semibold">Agency Name</p>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "sidebar-link",
                  item.active && "active"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <div className="px-3">
              <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-sidebar-foreground/70">
                Management
              </h2>
            </div>
            <div className="space-y-1 px-2">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "sidebar-link",
                    item.active && "active"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
