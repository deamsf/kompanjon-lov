import { FileItem } from "@/types/files";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileIcon, ImageIcon } from "lucide-react";

interface FileGridProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'N/A';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const FileGrid = ({
  files,
  isLoading,
  selectedFiles,
  onFileSelect,
}: FileGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="w-full h-32 bg-muted rounded-lg mb-2" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No files uploaded yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className={`relative cursor-pointer hover:shadow-md transition-shadow ${
            selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onFileSelect(file.id)}
        >
          <CardContent className="p-4">
            <div className="absolute top-2 right-2">
              <Checkbox
                checked={selectedFiles.includes(file.id)}
                onCheckedChange={() => onFileSelect(file.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="flex flex-col items-center">
              {file.content_type?.startsWith('image/') ? (
                <ImageIcon className="w-16 h-16 text-muted-foreground mb-2" />
              ) : (
                <FileIcon className="w-16 h-16 text-muted-foreground mb-2" />
              )}
              <h3 className="font-medium text-sm mb-1 text-center">{file.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {formatFileSize(file.size)}
              </p>
              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {file.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};