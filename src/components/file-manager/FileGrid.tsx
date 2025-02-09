
import { FileCard } from "./FileCard";
import { FileItem } from "@/types/files";

interface FileGridProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  onFileSelect: (fileIds: string[]) => void;
}

export const FileGrid = ({
  files,
  isLoading,
  selectedFiles,
  onFileSelect,
}: FileGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No files found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selectedFiles.includes(file.id)}
          onSelect={() => {
            const newSelected = selectedFiles.includes(file.id)
              ? selectedFiles.filter(id => id !== file.id)
              : [...selectedFiles, file.id];
            onFileSelect(newSelected);
          }}
        />
      ))}
    </div>
  );
};
