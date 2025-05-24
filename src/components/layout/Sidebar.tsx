
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  Users, 
  Target,
  CreditCard,
  Megaphone,
  Zap,
  Globe,
  Crown,
  Star,
  BarChart3,
  Store,
  Smartphone,
  Settings,
  Home
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Launchpad", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Conversations", href: "/conversations", icon: MessageSquare },
  { name: "Calendars", href: "/calendars", icon: Calendar },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Opportunities", href: "/opportunities", icon: Target },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Marketing", href: "/marketing", icon: Megaphone },
  { name: "Automation", href: "/automation", icon: Zap },
  { name: "Sites", href: "/sites", icon: Globe },
  { name: "Memberships", href: "/memberships", icon: Crown },
  { name: "Reputation", href: "/reputation", icon: Star },
  { name: "Reporting", href: "/reporting", icon: BarChart3 },
  { name: "App Marketplace", href: "/app-marketplace", icon: Store },
  { name: "Mobile App", href: "/mobile-app", icon: Smartphone },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-[#1A1F2C] text-white">
      <div className="flex h-16 items-center px-6">
        <Link to="/" className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mr-2">A</div>
          <h1 className="text-xl font-bold">Amplify</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
