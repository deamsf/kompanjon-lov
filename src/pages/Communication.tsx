import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Bold, Italic, Underline, Link, List, ListOrdered } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

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
  const [selectedText, setSelectedText] = useState("");
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);
  
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
    mutationFn: async (newTemplate: Omit<EmailTemplate, 'id'>) => {
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
        .update({ ...template, user_id: user.id })
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const templateData = {
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      body: formData.get('body') as string,
    };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    if (editingTemplate) {
      updateMutation.mutate({ ...templateData, id: editingTemplate.id, user_id: user.id });
    } else {
      createMutation.mutate({ ...templateData, user_id: user.id });
    }
  };

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
      textareaRef.value = newText;
      const event = new Event('input', { bubbles: true });
      textareaRef.dispatchEvent(event);
    }
  };

  const handleTextSelect = () => {
    if (!textareaRef) return;
    const selectedText = textareaRef.value.substring(
      textareaRef.selectionStart,
      textareaRef.selectionEnd
    );
    setSelectedText(selectedText);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Email Templates</h1>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingTemplate?.name}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  defaultValue={editingTemplate?.subject}
                  required
                />
              </div>
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
                  defaultValue={editingTemplate?.body}
                  required
                  className="w-full min-h-[200px] p-2 border rounded-md"
                  onSelect={handleTextSelect}
                />
              </div>
              <Button type="submit">
                {editingTemplate ? "Update Template" : "Create Template"}
              </Button>
            </form>
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
                      className="text-sm text-muted-foreground mt-2"
                      dangerouslySetInnerHTML={{ __html: template.body }}
                    />
                  </div>
                  <div className="flex gap-2">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default Communication;