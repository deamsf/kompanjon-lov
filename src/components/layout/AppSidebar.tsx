import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Building2,
  FolderKanban,
  LayoutDashboard,
  Users,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Construction,
  Settings,
  Minus,
  Switch,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showProjectAddress, setShowProjectAddress] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
    });
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuOpen = (menuName: string) => openMenus.includes(menuName);

  // Move the conditional return after all hooks are defined
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Construction className="h-6 w-6" />
            <span className="text-lg font-semibold">Kompanjon</span>
          </div>
          
          {showProjectAddress && (
            <div className="flex flex-col space-y-2 bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Project Address</span>
                <button 
                  onClick={() => setShowProjectAddress(false)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Switch className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">123 Main St, City</span>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarMenuButton onClick={() => navigate("/dashboard")}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>

            <div>
              <SidebarMenuButton onClick={() => toggleSubmenu("organization")}>
                <Building2 className="h-4 w-4" />
                <span>Organization</span>
                {isSubmenuOpen("organization") ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </SidebarMenuButton>
              {isSubmenuOpen("organization") && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => navigate("/agenda")}>
                    Agenda
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => navigate("/todo")}>
                    To Do
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => navigate("/planning")}>
                    Planning
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </div>

            <div>
              <SidebarMenuButton onClick={() => toggleSubmenu("resources")}>
                <FolderKanban className="h-4 w-4" />
                <span>Resources</span>
                {isSubmenuOpen("resources") ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </SidebarMenuButton>
              {isSubmenuOpen("resources") && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem onClick={() => navigate("/documents")}>
                    Documents
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => navigate("/bills")}>
                    Bills
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => navigate("/offers")}>
                    Offers
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => navigate("/photos")}>
                    Photos
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </div>

            <SidebarMenuButton onClick={() => navigate("/partners")}>
              <Users className="h-4 w-4" />
              <span>Team</span>
            </SidebarMenuButton>

            <SidebarMenuButton onClick={() => navigate("/communication")}>
              <MessageSquare className="h-4 w-4" />
              <span>Templates</span>
            </SidebarMenuButton>

            <SidebarMenuButton onClick={() => navigate("/advice")}>
              <HelpCircle className="h-4 w-4" />
              <span>Advice</span>
            </SidebarMenuButton>

            <SidebarMenuButton onClick={() => navigate("/project-settings")}>
              <Settings className="h-4 w-4" />
              <span>Project Settings</span>
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 w-full">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {profile?.first_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">
                  Welcome, {profile?.first_name || 'User'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {profile?.email || ''}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => navigate("/preferences")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}