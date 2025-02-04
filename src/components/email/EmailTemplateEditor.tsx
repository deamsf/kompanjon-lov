import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Bold, Italic, Underline, Link, List, ListOrdered } from "lucide-react";

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
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [name, setName] = useState(defaultValues?.name || "");
  const [subject, setSubject] = useState(defaultValues?.subject || "");
  const [body, setBody] = useState(defaultValues?.body || "");
  const [selectedVariable, setSelectedVariable] = useState<string>("");

  const handleTextFormat = (format: string) => {
    const textarea = document.querySelector("textarea[name='body']") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

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
      const newText = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
      textarea.value = newText;
      setBody(newText);
    }
  };

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector("textarea[name='body']") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = textarea.value;
    const newText = text.substring(0, start) + `{{${variable}}}` + text.substring(start);
    textarea.value = newText;
    setBody(newText);
    setSelectedVariable(""); // Reset the variable selector
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, subject, body });
  };

  const previewHtml = () => {
    return { __html: body };
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
        <div className="flex gap-2">
          <Input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <Select value={selectedVariable} onValueChange={(value) => insertVariable(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Insert variable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="partner.name">Partner Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="body">Body</Label>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsHtmlMode(!isHtmlMode)}
            >
              {isHtmlMode ? "Preview" : "HTML"}
            </Button>
          </div>
          <div className="flex gap-2">
            {isHtmlMode ? (
              <textarea
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full min-h-[200px] p-2 border rounded-md bg-background text-foreground"
                required
              />
            ) : (
              <div
                className="w-full min-h-[200px] p-2 border rounded-md bg-background text-foreground prose prose-sm max-w-none"
                contentEditable
                onInput={(e) => setBody(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={previewHtml()}
              />
            )}
            <Select value={selectedVariable} onValueChange={(value) => insertVariable(value)}>
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Insert variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="partner.name">Partner Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Button type="submit">
        {defaultValues ? "Update Template" : "Create Template"}
      </Button>
    </form>
  );
};

export default EmailTemplateEditor;