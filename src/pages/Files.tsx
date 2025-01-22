import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShareModal } from "@/components/file-manager/ShareModal";
import { FileActions } from "@/components/file-manager/FileActions";
import { FileContainer } from "@/components/file-manager/FileContainer";
import { FileItem } from "@/types/files";
import { Button } from "@/components/ui/button";
import { Share, Tag, Trash } from "lucide-react";

const Files = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'size' | 'type'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ['files', sortField, sortDirection, searchTerm, selectedTags],
    queryFn: async () => {
      let query = supabase
        .from('files')
        .select(`
          id,
          name,
          size,
          content_type,
          created_at,
          file_tags (
            tags (
              name
            )
          )
        `);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedTags.length > 0) {
        query = query.contains('file_tags.tags.name', selectedTags);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((file: any) => ({
        ...file,
        tags: file.file_tags?.map((ft: any) => ft.tags.name) || [],
      })).sort((a: any, b: any) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;

        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });
    }
  });

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSort = (field: 'name' | 'size' | 'type') => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleBulkShare = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to share",
        variant: "destructive",
      });
      return;
    }
    setShareModalOpen(true);
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to delete",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .in('id', selectedFiles);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Files deleted successfully",
      });
      
      refetch();
      setSelectedFiles([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete files",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Files</h1>
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={handleBulkShare}
              >
                <Share className="w-4 h-4 mr-2" />
                Share Selected
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkDelete}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}
          <FileActions
            onUploadComplete={() => refetch()}
            selectedTags={selectedTags}
          />
        </div>
      </div>

      <div className="w-full">
        <FileContainer
          files={files}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onFileSelect={handleFileSelect}
          onSort={handleSort}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          onShare={() => setShareModalOpen(true)}
        />
      </div>

      {shareModalOpen && (
        <ShareModal
          fileIds={selectedFiles}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Files;