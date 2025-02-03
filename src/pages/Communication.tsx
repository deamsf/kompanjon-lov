import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EmailTemplateEditor from "@/components/email/EmailTemplateEditor";
import { EmailTemplateList } from "@/components/email/EmailTemplateList";
import { Card, CardContent } from "@/components/ui/card";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  user_id: string;
}

const Communication = () => {
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
      
      if (error) throw error;
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
      id: '',
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
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent>
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
        <EmailTemplateList
          templates={emailTemplates}
          onEdit={(template) => {
            setEditingTemplate(template);
            setIsDialogOpen(true);
          }}
          onDelete={(id) => deleteMutation.mutate(id)}
          onCopy={handleCopyTemplate}
        />
      )}
    </div>
  );
};

export default Communication;