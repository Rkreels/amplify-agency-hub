
import { cn } from "@/lib/utils";
import { Bell, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { UserAccountNav } from "./UserAccountNav";
import { Input } from "@/components/ui/input";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="hidden md:flex items-center mr-8">
          <span className="font-bold text-xl text-primary">Amplify</span>
        </Link>
        <nav
          className={cn("flex items-center space-x-4 lg:space-x-6", className)}
          {...props}
        >
          <div className="hidden md:flex relative w-[200px] lg:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 bg-muted/30"
            />
          </div>
        </nav>
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />
          <UserAccountNav />
        </div>
      </div>
    </div>
  );
}
