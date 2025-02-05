import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Files, Calendar, ListTodo, Users, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user and selected project
    const initializeData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
      const projectId = localStorage.getItem('selectedProjectId');
      setSelectedProjectId(projectId);
    };

    initializeData();
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

  const { data: recentFiles } = useQuery({
    queryKey: ['recent-files', userId, selectedProjectId],
    queryFn: async () => {
      if (!userId || !selectedProjectId) return [];
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('created_by', userId)
        .eq('project_id', selectedProjectId) // Filter by project
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!selectedProjectId,
  });

  const { data: upcomingTodos } = useQuery({
    queryKey: ['upcoming-todos', userId, selectedProjectId],
    queryFn: async () => {
      if (!userId || !selectedProjectId) return [];
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .eq('project_id', selectedProjectId) // Filter by project
        .order('deadline', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!selectedProjectId,
  });

  // If no project is selected, redirect to project selection
  useEffect(() => {
    if (userId && !selectedProjectId) {
      navigate('/project-selection');
    }
  }, [userId, selectedProjectId, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, {profile?.first_name || 'User'}
      </h1>
      <p className="text-muted-foreground mb-8">
        Here's an overview of your workspace
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Files</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFiles?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No files yet</p>
              ) : (
                recentFiles?.map((file) => (
                  <div key={file.id} className="text-sm text-muted-foreground">
                    {file.name}
                  </div>
                ))
              )}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/files')}
            >
              View all files
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingTodos?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet</p>
              ) : (
                upcomingTodos?.map((todo) => (
                  <div key={todo.id} className="text-sm text-muted-foreground">
                    {todo.title}
                  </div>
                ))
              )}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => navigate('/todo')}
            >
              View all tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/agenda')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/partners')}
              >
                <Users className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/communication')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;