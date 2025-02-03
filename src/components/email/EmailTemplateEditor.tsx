import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmailTemplateToolbar } from "./EmailTemplateToolbar";
import { EmailTemplateBody } from "./EmailTemplateBody";

interface EmailTemplateEditorProps {
  defaultValues?: {
    name?: string;
    subject?: string;
    body?: string;
  };
  onSubmit: (data: { name: string; subject: string; body: string }) => void;
}

const EmailTemplateEditor = ({
  defaultValues,
  onSubmit,
}: EmailTemplateEditorProps) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [name, setName] = useState(defaultValues?.name || "");
  const [subject, setSubject] = useState(defaultValues?.subject || "");
  const [body, setBody] = useState(defaultValues?.body || "");
  const [selectedVariable, setSelectedVariable] = useState<string>("");

  const handleTextFormat = (format: string) => {
    if (!isHtmlMode) return;
    
    const selectedText = window.getSelection()?.toString() || "";
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
      setBody(body.replace(selectedText, formattedText));
    }
  };

  const insertVariable = (variable: string) => {
    const variableText = `{{${variable}}}`;
    
    if (isHtmlMode) {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(variableText);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      setBody((prev) => prev + variableText);
    } else {
      setBody((prev) => prev + variableText);
    }
    
    setSelectedVariable("");
  };

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
        <div className="flex gap-2">
          <Input
            id="subject"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <Select value={selectedVariable} onValueChange={insertVariable}>
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
          <EmailTemplateToolbar
            onFormat={handleTextFormat}
            isHtmlMode={isHtmlMode}
            onModeToggle={() => setIsHtmlMode(!isHtmlMode)}
          />
          <EmailTemplateBody
            isHtmlMode={isHtmlMode}
            body={body}
            onBodyChange={setBody}
            onVariableSelect={insertVariable}
            selectedVariable={selectedVariable}
          />
        </div>
      </div>
      <Button type="submit">
        {defaultValues ? "Update Template" : "Create Template"}
      </Button>
    </form>
  );
};

export default EmailTemplateEditor;