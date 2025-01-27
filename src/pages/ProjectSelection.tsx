import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ProjectSelection = () => {
  const navigate = useNavigate();

  const handleProjectSelect = (projectId: string) => {
    // In a real app, you would store the selected project ID
    // For now, just navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Select a Project</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
              onClick={() => handleProjectSelect("project1")}>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Project 1</h2>
            <p className="text-muted-foreground mb-4">123 Main St, City</p>
            <Button variant="outline" className="w-full">
              Select Project
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProjectSelect("project2")}>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Project 2</h2>
            <p className="text-muted-foreground mb-4">456 Oak Ave, Town</p>
            <Button variant="outline" className="w-full">
              Select Project
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProjectSelect("project3")}>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Project 3</h2>
            <p className="text-muted-foreground mb-4">789 Pine St, Village</p>
            <Button variant="outline" className="w-full">
              Select Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSelection;