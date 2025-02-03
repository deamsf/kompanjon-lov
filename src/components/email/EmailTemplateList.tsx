import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Copy } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  user_id: string;
}

interface EmailTemplateListProps {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onCopy: (template: EmailTemplate) => void;
}

export const EmailTemplateList = ({
  templates,
  onEdit,
  onDelete,
  onCopy,
}: EmailTemplateListProps) => {
  return (
    <div className="grid gap-4">
      {templates.map((template) => (
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
                  onClick={() => onCopy(template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(template)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(template.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};