import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { path: "/agenda", label: "Agenda" },
    { path: "/planning", label: "Planning" },
    { path: "/todo", label: "To Do" },
    { path: "/communication", label: "Communication" },
    { path: "/partners", label: "Partners" },
    { path: "/advice", label: "Advice" },
  ];

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="flex items-center gap-2 mr-8">
          <Shield className="h-6 w-6" />
          <span className="font-bold text-2xl">Kompanjon</span>
        </Link>

        <NavigationMenu className="mx-6 flex-1">
          <NavigationMenuList className="gap-6">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">User</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/preferences")}>
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;