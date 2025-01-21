import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { FileItem } from "@/types/files";
import { FileTableContent } from "./FileTableContent";

interface FileListProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onShare: (fileId: string) => void;
  onSort: (field: 'name' | 'size' | 'type') => void;
}

export const FileList = ({
  files,
  isLoading,
  selectedFiles,
  onFileSelect,
  onShare,
  onSort,
}: FileListProps) => {
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
        <FileTableContent
          files={files}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          onFileSelect={onFileSelect}
          onShare={onShare}
        />
      </TableBody>
    </Table>
  );
};