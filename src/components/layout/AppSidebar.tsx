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

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
    });
  }, []);

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
        <div className="flex items-center space-x-2">
          <Construction className="h-6 w-6" />
          <span className="text-lg font-semibold">Kompanjon</span>
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
            <button className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span>User</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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