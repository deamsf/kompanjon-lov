import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, ArrowUpDown } from "lucide-react";
import { FileItem } from "@/types/files";

interface FileListProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onSort: (field: 'name' | 'size' | 'type') => void;
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

export const FileList = ({
  files,
  isLoading,
  selectedFiles,
  onFileSelect,
  onShare,
  onSort,
}: FileListProps) => {
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading files...</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (files.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-8">
            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground">No files uploaded yet</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return files.map((file) => (
      <TableRow key={file.id}>
        <TableCell>
          <Checkbox
            checked={selectedFiles.includes(file.id)}
            onCheckedChange={() => onFileSelect(file.id)}
          />
        </TableCell>
        <TableCell>{file.name}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {file.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </TableCell>
        <TableCell>{file.content_type}</TableCell>
        <TableCell>{formatFileSize(file.size)}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onShare(file.id)}
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox />
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('name')}>
            <div className="flex items-center gap-2">
              Name
              <ArrowUpDown className="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead>Tags</TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('type')}>
            <div className="flex items-center gap-2">
              Type
              <ArrowUpDown className="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => onSort('size')}>
            <div className="flex items-center gap-2">
              Size
              <ArrowUpDown className="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderTableContent()}
      </TableBody>
    </Table>
  );
};