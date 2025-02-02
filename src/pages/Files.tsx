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
import { TagsModal } from "@/components/file-manager/TagsModal";
import { FileGrid } from "@/components/file-manager/FileGrid";

interface FilesProps {
  fileType: string;
}

const Files = ({ fileType }: FilesProps) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'size' | 'type'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const { toast } = useToast();

  const { data: files = [], isLoading, refetch } = useQuery({
    queryKey: ['files', sortField, sortDirection, searchTerm, selectedTags, fileType],
    queryFn: async () => {
      let query = supabase
        .from('files')
        .select(`
          id,
          name,
          size,
          content_type,
          created_at,
          type,
          file_tags (
            tags (
              name
            )
          )
        `)
        .eq('type', fileType);

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

  const handleTypeChange = async (newType: string) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ type: newType })
        .in('id', selectedFiles);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File types updated successfully",
      });

      refetch();
      setSelectedFiles([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update file types",
        variant: "destructive",
      });
    }
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {selectedFiles.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={() => setShareModalOpen(true)}
              >
                <Share className="w-4 h-4 mr-2" />
                Share Selected
              </Button>
              <Button
                variant="outline"
                onClick={() => setTagsModalOpen(true)}
              >
                <Tag className="w-4 h-4 mr-2" />
                Add Tags
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
        </div>
        <FileActions
          onUploadComplete={() => refetch()}
          selectedTags={selectedTags}
          selectedFiles={selectedFiles}
          onViewChange={setView}
          currentView={view}
          onTypeChange={handleTypeChange}
          fileType={fileType}
        />
      </div>

      {view === 'list' ? (
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
      ) : (
        <FileGrid
          files={files}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
        />
      )}

      {shareModalOpen && (
        <ShareModal
          fileIds={selectedFiles}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedFiles([]);
          }}
        />
      )}

      {tagsModalOpen && (
        <TagsModal
          fileIds={selectedFiles}
          isOpen={tagsModalOpen}
          onClose={() => {
            setTagsModalOpen(false);
            setSelectedFiles([]);
          }}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default Files;