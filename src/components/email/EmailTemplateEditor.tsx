import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [editorState, setEditorState] = useState({ html: "", selectionStart: 0, selectionEnd: 0 });

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
      setBody(newText);
      
      // Maintain cursor position after update
      requestAnimationFrame(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + formattedText.length;
        textarea.focus();
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, subject, body });
  };

  const handleContentEditableChange = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setBody(html);
    setEditorState(prev => ({
      ...prev,
      html,
    }));
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
              onInput={handleContentEditableChange}
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}
        </div>
      </div>
      <Button type="submit">
        {defaultValues ? "Update Template" : "Create Template"}
      </Button>
    </form>
  );
};

export default EmailTemplateEditor;