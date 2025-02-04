import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

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
  const [isWysiwyg, setIsWysiwyg] = useState(true);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Email Templates</h1>
      <div className="space-y-4">
        {emailTemplates.map((template) => (
          <Card key={template.id}>
            <CardContent>
              <h2 className="font-semibold">{template.name}</h2>
              <p className="text-sm text-gray-600">{template.subject}</p>
              <p className="text-sm text-gray-400 mt-2">{template.body.slice(0, 200)}...</p>
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => { setEditingTemplate(template); setBodyText(template.body); setIsDialogOpen(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" onClick={() => { /* delete logic here */ }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => { setEditingTemplate(null); setBodyText(""); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </DialogTrigger>
        <DialogContent className="dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Email Template" : "Add Email Template"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={editingTemplate?.name || ""} required />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" defaultValue={editingTemplate?.subject || ""} required />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <ToggleGroup className="mb-2" value={isWysiwyg ? "wysiwyg" : "html"} onValueChange={(val) => setIsWysiwyg(val === "wysiwyg")}>
                <ToggleGroupItem value="wysiwyg">WYSIWYG</ToggleGroupItem>
                <ToggleGroupItem value="html">HTML</ToggleGroupItem>
              </ToggleGroup>
              {isWysiwyg ? (
                <Editor value={bodyText} onChange={setBodyText} className="dark:bg-gray-900" />
              ) : (
                <textarea
                  id="body"
                  name="body"
                  value={bodyText}
                  required
                  className="w-full min-h-[200px] p-2 border rounded-md dark:bg-gray-900 text-white"
                  onChange={(e) => setBodyText(e.target.value)}
                />
              )}
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
