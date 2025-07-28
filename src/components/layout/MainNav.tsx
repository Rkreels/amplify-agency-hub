
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { UserAccountNav } from "./UserAccountNav";
import { Input } from "@/components/ui/input";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="border-b border-border bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link to="/" className="hidden md:flex md:mr-8">
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
          <ThemeToggle />
          <UserAccountNav />
        </div>
      </div>
    </div>
  );
}
