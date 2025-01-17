import { Link, useLocation, useNavigate } from "react-router-dom";
import { Shield, Sun, Moon } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { path: "/files", label: "Files" },
    { path: "/agenda", label: "Agenda" },
    { path: "/planning", label: "Planning" },
    { path: "/todo", label: "To Do" },
    { path: "/communication", label: "Communication" },
    { path: "/partners", label: "Partners" },
    { path: "/advice", label: "Advice" },
  ];

  if (location.pathname === "/") return null;

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/files" className="flex items-center gap-2 mr-8">
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

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

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
    </div>
  );
};

export default Navbar;