import { Card, CardContent } from "@/components/ui/card";
import { FileSearch } from "./FileSearch";
import { FileList } from "./FileList";
import { FileItem } from "@/types/files";
import { TagsInput } from "./TagsInput";

interface FileContainerProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  searchTerm: string;
  selectedTags: string[];
  onSearch: (term: string) => void;
  onFileSelect: (fileId: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSort: (field: 'name' | 'size' | 'type') => void;
}

export const FileContainer = ({
  files,
  isLoading,
  selectedFiles,
  searchTerm,
  selectedTags,
  onSearch,
  onFileSelect,
  onTagsChange,
  onSort,
}: FileContainerProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4 mb-4">
          <FileSearch
            searchTerm={searchTerm}
            onSearch={onSearch}
          />
          <TagsInput
            value={selectedTags}
            onChange={onTagsChange}
            placeholder="Filter by tags..."
            className="flex-1"
          />
        </div>
        <FileList
          files={files}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          onFileSelect={onFileSelect}
          onSort={onSort}
        />
      </CardContent>
    </Card>
  );
};