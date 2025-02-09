
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Copy, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import EmailTemplateEditor from "@/components/email/EmailTemplateEditor";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  user_id: string;
}

const CommunicationPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const queryClient = useQueryClient();

  const { data: emailTemplates = [], isLoading } = useQuery({
    queryKey: ['emailTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at');
      
      if (error) {
        toast.error("Failed to fetch email templates");
        throw error;
      }
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newTemplate: Omit<EmailTemplate, 'id' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('email_templates')
        .insert([{ ...newTemplate, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Email template created successfully");
      setIsDialogOpen(false);
      setEditingTemplate(null);
    },
    onError: (error) => {
      toast.error("Failed to create email template");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (template: EmailTemplate) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('email_templates')
        .update({ 
          name: template.name,
          subject: template.subject,
          body: template.body,
          user_id: user.id 
        })
        .eq('id', template.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Email template updated successfully");
      setIsDialogOpen(false);
      setEditingTemplate(null);
    },
    onError: (error) => {
      toast.error("Failed to update email template");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success("Email template deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete email template");
      console.error(error);
    },
  });

  const handleSubmit = (templateData: { name: string; subject: string; body: string }) => {
    if (editingTemplate?.id) {
      updateMutation.mutate({ ...templateData, id: editingTemplate.id, user_id: editingTemplate.user_id });
    } else {
      createMutation.mutate(templateData);
    }
  };

  const handleCopyTemplate = (template: EmailTemplate) => {
    setEditingTemplate({
      ...template,
      id: '', // Clear ID for new template
      name: `${template.name} (Copy)`,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTemplate(null);
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate?.id ? "Edit Email Template" : "Add Email Template"}
              </DialogTitle>
            </DialogHeader>
            <EmailTemplateEditor
              defaultValues={editingTemplate || undefined}
              onSubmit={handleSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">Loading...</CardContent>
          </Card>
        ) : emailTemplates.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No email templates yet. Create one to get started.
            </CardContent>
          </Card>
        ) : (
          emailTemplates.map((template: EmailTemplate) => (
            <Card key={template.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm font-medium">Subject: {template.subject}</p>
                    <div 
                      className="text-sm text-muted-foreground mt-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: template.body }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTemplate(template);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Template?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the email template.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(template.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// Wrap the component with ProtectedRoute
const Communication = () => (
  <ProtectedRoute>
    <CommunicationPage />
  </ProtectedRoute>
);

export default Communication;
