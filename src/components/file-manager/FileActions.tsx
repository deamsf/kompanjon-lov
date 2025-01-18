import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { FileUploadButton } from "./FileUploadButton";

interface FileActionsProps {
  onUploadComplete: () => void;
  selectedTags: string[];
}

export const FileActions = ({ onUploadComplete, selectedTags }: FileActionsProps) => {
  return (
    <div className="flex gap-4">
      <FileUploadButton
        onUploadComplete={onUploadComplete}
        tags={selectedTags}
      />
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        Filter
      </Button>
    </div>
  );
};