
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  CalendarClock,
  Users,
  Briefcase,
  CreditCard,
  Megaphone,
  Zap,
  Globe,
  UserPlus,
  Award,
  BarChart3,
  ShoppingBag,
  Smartphone,
  Settings,
  Search
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const navigation = [
    {
      name: "Launchpad",
      href: "/launchpad",
      icon: Zap,
      active: location.pathname === "/launchpad",
    },
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: location.pathname === "/",
    },
    {
      name: "Conversations",
      href: "/conversations",
      icon: MessageSquare,
      active: location.pathname.startsWith("/conversations"),
    },
    {
      name: "Calendars",
      href: "/calendars",
      icon: CalendarClock,
      active: location.pathname.startsWith("/calendars"),
    },
    {
      name: "Contacts",
      href: "/contacts",
      icon: Users,
      active: location.pathname.startsWith("/contacts"),
    },
    {
      name: "Opportunities",
      href: "/pipelines",
      icon: Briefcase,
      active: location.pathname.startsWith("/pipelines"),
    },
    {
      name: "Payments",
      href: "/payments",
      icon: CreditCard,
      active: location.pathname.startsWith("/payments"),
    },
    {
      name: "Marketing",
      href: "/marketing",
      icon: Megaphone,
      active: location.pathname.startsWith("/marketing"),
    },
    {
      name: "Automation",
      href: "/automation",
      icon: Zap,
      active: location.pathname.startsWith("/automation"),
    },
    {
      name: "Sites",
      href: "/sites",
      icon: Globe,
      active: location.pathname.startsWith("/sites"),
    },
    {
      name: "Memberships",
      href: "/memberships",
      icon: UserPlus,
      active: location.pathname.startsWith("/memberships"),
    },
    {
      name: "Reputation",
      href: "/reputation",
      icon: Award,
      active: location.pathname.startsWith("/reputation"),
    },
    {
      name: "Reporting",
      href: "/reporting",
      icon: BarChart3,
      active: location.pathname.startsWith("/reporting"),
    },
    {
      name: "App Marketplace",
      href: "/marketplace",
      icon: ShoppingBag,
      active: location.pathname.startsWith("/marketplace"),
    },
    {
      name: "Mobile App",
      href: "/mobile",
      icon: Smartphone,
      active: location.pathname.startsWith("/mobile"),
    },
  ];

  return (
    <div className={cn("flex h-screen flex-col bg-[#1A1F2C] text-white", className)}>
      <div className="p-4 border-b border-gray-700">
        <div className="bg-white text-[#1A1F2C] rounded w-24 px-4 py-1 font-medium">
          Agency
        </div>
      </div>
      <div className="p-4 flex flex-col text-sm border-b border-gray-700">
        <p className="font-semibold text-white mb-1">HighLevel</p>
        <p className="text-gray-400 text-xs">Eugene, OR</p>
      </div>
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input className="w-full bg-[#13171F] border-gray-700 text-white pl-9 placeholder-gray-400" placeholder="Search" />
          <div className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400">⌘ K</div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 px-3 py-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-700 hover:text-white",
                item.active ? "bg-gray-700 text-white" : "text-gray-300"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto p-3 border-t border-gray-700">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </div>
  );
}
