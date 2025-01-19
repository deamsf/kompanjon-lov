import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  email: string;
  components: string[];
  tags: string[];
  user_id: string;
}

const projectComponents = [
  "Frontend Development",
  "Backend Development",
  "UI/UX Design",
  "Project Management",
  "Quality Assurance",
];

const Partners = () => {
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const userId = sessionData?.user?.id;

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Partner[];
    },
    enabled: !!userId,
  });

  const addPartnerMutation = useMutation({
    mutationFn: async (newPartner: Omit<Partner, 'id' | 'user_id'>) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('partners')
        .insert([{ ...newPartner, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add partner');
      console.error('Error:', error);
    },
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async (partner: Partner) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('partners')
        .update(partner)
        .eq('id', partner.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner updated successfully');
      setEditingPartner(null);
    },
    onError: (error) => {
      toast.error('Failed to update partner');
      console.error('Error:', error);
    },
  });

  const deletePartnerMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete partner');
      console.error('Error:', error);
    },
  });

  const filteredPartners = selectedComponent === "all"
    ? partners
    : partners.filter((partner) => partner.components.includes(selectedComponent));

  const handleSavePartner = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error('Please log in to manage partners');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const components = projectComponents.filter(
      (component) => formData.get(component) === "on"
    );
    const tags = formData
      .get("tags")
      ?.toString()
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

    const partnerData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      components,
      tags,
    };

    if (editingPartner) {
      updatePartnerMutation.mutate({ ...editingPartner, ...partnerData });
    } else {
      addPartnerMutation.mutate(partnerData);
    }
  };

  const handleDeletePartner = (id: string) => {
    deletePartnerMutation.mutate(id);
  };

  if (!userId) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="text-xl">Please log in to manage partners</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Project Partners</h1>
        <div className="flex gap-4">
          <Select value={selectedComponent} onValueChange={setSelectedComponent}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by component" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Components</SelectItem>
              {projectComponents.map((component) => (
                <SelectItem key={component} value={component}>
                  {component}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPartner ? "Edit Partner" : "Add New Partner"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const components = projectComponents.filter(
                    (component) => formData.get(component) === "on"
                  );
                  const tags = formData
                    .get("tags")
                    ?.toString()
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean) || [];
                  handleSavePartner({
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    components,
                    tags,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingPartner?.name}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={editingPartner?.email}
                    required
                  />
                </div>
                <div>
                  <Label>Project Components</Label>
                  <div className="space-y-2">
                    {projectComponents.map((component) => (
                      <div key={component} className="flex items-center space-x-2">
                        <Checkbox
                          id={component}
                          name={component}
                          defaultChecked={editingPartner?.components.includes(
                            component
                          )}
                        />
                        <Label htmlFor={component}>{component}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={editingPartner?.tags.join(", ")}
                  />
                </div>
                <Button type="submit">
                  {editingPartner ? "Save Changes" : "Add Partner"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="font-semibold">{partner.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {partner.email}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.components.map((component) => (
                      <Badge key={component} variant="secondary">
                        {component}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {partner.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPartner(partner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Partner</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this partner? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePartner(partner.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Partners;
