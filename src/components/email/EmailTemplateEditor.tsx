
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TiptapEditor from "./TiptapEditor";

interface EmailTemplateEditorProps {
  defaultValues?: {
    name?: string;
    subject?: string;
    body?: string;
  };
  onSubmit: (data: { name: string; subject: string; body: string }) => void;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  defaultValues,
  onSubmit,
}) => {
  const [name, setName] = useState(defaultValues?.name || "");
  const [subject, setSubject] = useState(defaultValues?.subject || "");
  const [body, setBody] = useState(defaultValues?.body || "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, subject, body });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="body">Body</Label>
        <TiptapEditor
          onChange={setBody}
          initialValue={body}
        />
      </div>
      <Button type="submit">
        {defaultValues ? "Update Template" : "Create Template"}
      </Button>
    </form>
  );
};

export default EmailTemplateEditor;
