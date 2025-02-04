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
<<<<<<< HEAD
  const [selectedText, setSelectedText] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  
=======
>>>>>>> 0104bb2661fdc46bd8c7bcad192f063066464fe4
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

<<<<<<< HEAD
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyText(e.target.value);
=======
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
>>>>>>> 0104bb2661fdc46bd8c7bcad192f063066464fe4
  };

<<<<<<< HEAD
  const handleTextFormat = (format: string) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const text = textareaRef.value;

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `<b>${selectedText}</b>`;
        break;
      case "italic":
        formattedText = `<i>${selectedText}</i>`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "link":
        const url = prompt("Enter URL:");
        if (url) {
          formattedText = `<a href="${url}">${selectedText}</a>`;
        }
        break;
      case "list":
        formattedText = `<ul><li>${selectedText}</li></ul>`;
        break;
      case "ordered-list":
        formattedText = `<ol><li>${selectedText}</li></ol>`;
        break;
    }

    if (formattedText) {
      const newText = text.substring(0, start) + formattedText + text.substring(end);
      setBodyText(newText);
      textareaRef.value = newText;
    }
=======
  const handleCopyTemplate = (template: EmailTemplate) => {
    setEditingTemplate({
      ...template,
      id: '',
      name: `${template.name} (Copy)`,
    });
    setIsDialogOpen(true);
>>>>>>> 0104bb2661fdc46bd8c7bcad192f063066464fe4
  };

  return (
    <div className="container mx-auto p-6">
<<<<<<< HEAD
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingTemplate(null)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Email Template" : "Add Email Template"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="body">Body</Label>
              <div className="mb-2">
                <ToggleGroup type="multiple" className="justify-start">
                  <ToggleGroupItem value="bold" onClick={() => handleTextFormat("bold")}>
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" onClick={() => handleTextFormat("italic")}>
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" onClick={() => handleTextFormat("underline")}>
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="link" onClick={() => handleTextFormat("link")}>
                    <Link className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" onClick={() => handleTextFormat("list")}>
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="ordered-list" onClick={() => handleTextFormat("ordered-list")}>
                    <ListOrdered className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <textarea
                id="body"
                name="body"
                ref={(ref) => setTextareaRef(ref)}
                value={bodyText}
                required
                className="w-full min-h-[200px] p-2 border rounded-md"
                onChange={handleTextChange}
              />
            </div>
            <Button type="submit">
              {editingTemplate ? "Update Template" : "Create Template"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
=======
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
>>>>>>> 0104bb2661fdc46bd8c7bcad192f063066464fe4
    </div>
  );
};

export default Communication;
