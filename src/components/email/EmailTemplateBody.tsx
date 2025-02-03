import React, { useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmailTemplateBodyProps {
  isHtmlMode: boolean;
  body: string;
  onBodyChange: (value: string) => void;
  onVariableSelect: (variable: string) => void;
  selectedVariable: string;
}

export const EmailTemplateBody = ({
  isHtmlMode,
  body,
  onBodyChange,
  onVariableSelect,
  selectedVariable,
}: EmailTemplateBodyProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isHtmlMode && contentEditableRef.current) {
      contentEditableRef.current.innerHTML = body;
    }
  }, [isHtmlMode, body]);

  const handleContentEditableChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    if (newContent !== body) {
      onBodyChange(newContent);
    }
  };

  return (
    <div className="flex gap-2">
      {isHtmlMode ? (
        <textarea
          ref={textareaRef}
          name="body"
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          className="w-full min-h-[200px] p-2 border rounded-md bg-background text-foreground"
          required
        />
      ) : (
        <div
          ref={contentEditableRef}
          className="w-full min-h-[200px] p-2 border rounded-md bg-background text-foreground prose prose-sm max-w-none"
          contentEditable
          onInput={handleContentEditableChange}
          suppressContentEditableWarning
        />
      )}
      <Select value={selectedVariable} onValueChange={onVariableSelect}>
        <SelectTrigger className="w-[180px] h-10">
          <SelectValue placeholder="Insert variable" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="partner.name">Partner Name</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};