import { Button } from "@/components/ui/button";
import { Filter, LayoutGrid, List } from "lucide-react";
import { FileUploadButton } from "./FileUploadButton";
import { FileTypeSelect } from "./FileTypeSelect";

interface FileActionsProps {
  onUploadComplete: () => void;
  selectedTags: string[];
  selectedFiles: string[];
  onViewChange: (view: 'list' | 'grid') => void;
  currentView: 'list' | 'grid';
  onTypeChange: (type: string) => void;
  fileType: string;
}

export const FileActions = ({
  onUploadComplete,
  selectedTags,
  selectedFiles,
  onViewChange,
  currentView,
  onTypeChange,
  fileType,
}: FileActionsProps) => {
  return (
    <div className="flex gap-4 items-center">
      <FileUploadButton
        onUploadComplete={onUploadComplete}
        tags={selectedTags}
        fileType={fileType}
      />
      {selectedFiles.length > 0 && (
        <FileTypeSelect
          onTypeChange={onTypeChange}
          currentType={fileType}
        />
      )}
      <Button variant="outline">
        <Filter className="w-4 h-4 mr-2" />
        Filter
      </Button>
      <div className="flex gap-2">
        <Button
          variant={currentView === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant={currentView === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewChange('grid')}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};