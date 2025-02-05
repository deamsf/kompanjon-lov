import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
}

const ProjectSelection = () => {
  const navigate = useNavigate();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', user.user.id);
      
      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
        throw error;
      }
      
      return data as Project[];
    },
  });

  const handleProjectSelect = async (projectId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('You must be logged in to select a project');
        return;
      }

      // Verify user is a member of the project
      const { data: membership, error: membershipError } = await supabase
        .from('project_members')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.user.id)
        .single();

      if (membershipError || !membership) {
        toast.error('You do not have access to this project');
        return;
      }

      localStorage.setItem('selectedProjectId', projectId);
      toast.success('Project selected successfully');
      navigate("/dashboard");
    } catch (error) {
      console.error('Error selecting project:', error);
      toast.error('Failed to select project');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-500">Error loading projects. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Select a Project</h1>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProjectSelect(project.id)}
            >
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-muted-foreground mb-4">
                  {project.description || 'No description'}
                </p>
                <Button variant="outline" className="w-full">
                  Select Project
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSelection;