import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  Users,
  Mail,
  AlertOctagon,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Construction,
  Calendar,
  ListTodo,
  ClipboardList,
  FileText,
  Receipt,
  FileCheck,
  Camera,
  SwitchCamera,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);

  // Hide sidebar on login page
  if (location.pathname === "/") {
    return null;
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
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
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const displayName = profile?.first_name || 'User';

  // Mock project data - this would come from your project management system
  const projectData = {
    name: "123 Main Street Renovation",
    address: "123 Main Street, Springfield, IL",
    phone: "(555) 123-4567",
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Logo Section */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Kompanjon</h1>
          </div>
        </div>

        {/* Project Info Section */}
        <div className="px-6 py-4 border-b bg-muted/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{projectData.name}</h2>
            <button className="text-muted-foreground hover:text-primary">
              <SwitchCamera className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{projectData.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{projectData.phone}</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Organization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Building2 className="h-4 w-4" />
                  <span>Organization</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/agenda')}>
                      <Calendar className="h-4 w-4" />
                      <span>Agenda</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/todo')}>
                      <ListTodo className="h-4 w-4" />
                      <span>To Do</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/planning')}>
                      <ClipboardList className="h-4 w-4" />
                      <span>Planning</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FolderKanban className="h-4 w-4" />
                  <span>Resources</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/documents')}>
                      <FileText className="h-4 w-4" />
                      <span>Documents</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/bills')}>
                      <Receipt className="h-4 w-4" />
                      <span>Bills</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/offers')}>
                      <FileCheck className="h-4 w-4" />
                      <span>Offers</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton onClick={() => navigate('/photos')}>
                      <Camera className="h-4 w-4" />
                      <span>Photos</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/team')}>
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/templates')}>
                  <Mail className="h-4 w-4" />
                  <span>Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate('/advice')}>
                  <AlertOctagon className="h-4 w-4" />
                  <span>Advice</span>
                  <Badge variant="secondary" className="ml-2">Beta</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 w-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  {displayName[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                Welcome, {displayName}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/project-settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Project Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/preferences")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => supabase.auth.signOut().then(() => navigate("/"))}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}