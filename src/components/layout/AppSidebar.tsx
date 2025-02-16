
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
import { Building2, FolderKanban, Users, MessageSquare, Bot, Settings, SwitchCamera, Construction, Minus, Plus, LayoutTemplate, Gauge, ProjectorIcon as ProjectIcon, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showProjectAddress, setShowProjectAddress] = useState(true);

  const toggleSubmenu = (menuName: string) => {
    setOpenMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const isSubmenuOpen = (menuName: string) => openMenus.includes(menuName);

  if (location.pathname === "/") {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Construction className="h-6 w-6" />
            <span className="text-2xl font-semibold">Kompanjon</span>
          </div>
          
          <div className="flex flex-col space-y-2 bg-muted p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Project</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate("/project-selection")}
                  className="text-muted-foreground hover:text-primary"
                  title="Switch Project"
                >
                  <SwitchCamera className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => navigate("/project-settings")}
                  className="text-muted-foreground hover:text-primary"
                  title="Project Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setShowProjectAddress(!showProjectAddress)}
                  className="text-muted-foreground hover:text-primary"
                  title={showProjectAddress ? "Minimize" : "Expand"}
                >
                  {showProjectAddress ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {showProjectAddress && (
              <div className="flex items-center space-x-2">
                <a 
                  href="https://maps.google.com/?q=123+Main+St+City" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  123 Main St, City
                </a>
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarMenuButton onClick={() => navigate("/dashboard")}>
              <Gauge className="h-4 w-4" />
              <span>Dashboard</span>
            </SidebarMenuButton>

            <div>
              <SidebarMenuButton onClick={() => toggleSubmenu("organization")}>
                <ProjectIcon className="h-4 w-4" />
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
                  <SidebarMenuSubItem onClick={() => navigate("/files")}>
                    Library
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem onClick={() => navigate("/shares")}>
                    Shares
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </div>

            <SidebarMenuButton onClick={() => navigate("/partners")}>
              <Users className="h-4 w-4" />
              <span>Team</span>
            </SidebarMenuButton>

            <SidebarMenuButton onClick={() => navigate("/communication")}>
              <LayoutTemplate className="h-4 w-4" />
              <span>Templates</span>
            </SidebarMenuButton>

            <SidebarMenuButton onClick={() => navigate("/advice")}>
              <Bot className="h-4 w-4" />
              <span>Advice</span>
              <Badge variant="secondary" className="ml-auto">Beta</Badge>
            </SidebarMenuButton>
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
