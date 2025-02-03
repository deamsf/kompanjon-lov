import { Bold, Italic, Underline, Link, List, ListOrdered } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

interface EmailTemplateToolbarProps {
  onFormat: (format: string) => void;
  isHtmlMode: boolean;
  onModeToggle: () => void;
}

export const EmailTemplateToolbar = ({
  onFormat,
  isHtmlMode,
  onModeToggle,
}: EmailTemplateToolbarProps) => {
  return (
    <div className="flex justify-between items-center">
      <ToggleGroup type="multiple" className="justify-start">
        <ToggleGroupItem value="bold" onClick={() => onFormat("bold")}>
          <Bold className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" onClick={() => onFormat("italic")}>
          <Italic className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" onClick={() => onFormat("underline")}>
          <Underline className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="link" onClick={() => onFormat("link")}>
          <Link className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" onClick={() => onFormat("list")}>
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="ordered-list" onClick={() => onFormat("ordered-list")}>
          <ListOrdered className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
      <Button type="button" variant="outline" onClick={onModeToggle}>
        {isHtmlMode ? "Preview" : "HTML"}
      </Button>
    </div>
  );
};