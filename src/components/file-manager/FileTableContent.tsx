import { TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { FileItem } from "@/types/files";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileTableContentProps {
  files: FileItem[];
  isLoading: boolean;
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onShare: (fileId: string) => void;
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

export const FileTableContent = ({
  files,
  isLoading,
  selectedFiles,
  onFileSelect,
}: FileTableContentProps) => {
  const { toast } = useToast();

  const handleDelete = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (fileId: string) => {
    // Trigger file input click
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('No active session');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileId', fileId);

        const { data, error } = await supabase.functions.invoke('update-file', {
          body: formData,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "File updated successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update file",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

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

  return (
    <>
      {files.map((file) => (
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
                onClick={() => handleEdit(file.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};