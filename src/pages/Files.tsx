import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShareModal } from "@/components/file-manager/ShareModal";
import { FileSidebar } from "@/components/file-manager/FileSidebar";
import { FileActions } from "@/components/file-manager/FileActions";
import { FileContainer } from "@/components/file-manager/FileContainer";
import { FileItem } from "@/types/files";

const Files = () => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'size' | 'type'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState<string | null>(null);
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

  const handleSort = (field: 'name' | 'size' | 'type') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleShare = (fileId: string) => {
    setSelectedFileForShare(fileId);
    setShareModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Files</h1>
        <FileActions
          onUploadComplete={() => refetch()}
          selectedTags={selectedTags}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <FileSidebar
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        <div className="col-span-9">
          <FileContainer
            files={files}
            isLoading={isLoading}
            selectedFiles={selectedFiles}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onFileSelect={handleFileSelect}
            onShare={handleShare}
            onSort={handleSort}
          />
        </div>
      </div>

      {selectedFileForShare && (
        <ShareModal
          fileId={selectedFileForShare}
          isOpen={shareModalOpen}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedFileForShare(null);
          }}
        />
      )}
    </div>
  );
};

export default Files;