import { useState, useRef } from "react";
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
  const [bodyText, setBodyText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  
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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBodyText(e.target.value);
  };

  return (
    <div className="container mx-auto p-6">
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
              <textarea
                id="body"
                name="body"
                ref={textareaRef}
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
    </div>
  );
};

export default Communication;
