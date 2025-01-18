import { Card, CardContent } from "@/components/ui/card";
import { FileSearch } from "./FileSearch";
import { FileList } from "./FileList";
import { FileItem } from "@/types/files";

interface FileContainerProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onFileSelect: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onSort: (field: 'name' | 'size' | 'type') => void;
}

export const FileContainer = ({
  files,
  isLoading,
  selectedFiles,
  searchTerm,
  onSearch,
  onFileSelect,
  onShare,
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
        </div>
        <FileList
          files={files}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          onFileSelect={onFileSelect}
          onShare={onShare}
          onSort={onSort}
        />
      </CardContent>
    </Card>
  );
};