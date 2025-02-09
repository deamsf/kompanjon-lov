
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { FileUploadZone } from "./FileUploadZone";
import { FileToolbar } from "./FileToolbar";
import { FileFilter } from "./FileFilter";
import { supabase } from "@/integrations/supabase/client";
import { FileItem, ViewMode } from "@/types/files";
import { toast } from "sonner";

interface FileManagerProps {
  fileType: 'document' | 'bill' | 'offer' | 'photo';
  showDocumentCategories?: boolean;
}

export const FileManager = ({ fileType, showDocumentCategories = false }: FileManagerProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'architect_report' | 'permit' | 'photo' | 'offer' | 'bill' | 'other' | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files', fileType, searchTerm, selectedTags, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('files')
        .select(`
          id,
          name,
          description,
          content_type,
          size,
          thumbnail_url,
          document_category,
          file_type,
          storage_path,
          file_tags (
            tags (
              name
            )
          )
        `)
        .eq('file_type', fileType);

      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      if (selectedTags.length > 0) {
        query = query.contains('file_tags.tags.name', selectedTags);
      }

      if (selectedCategory) {
        query = query.eq('document_category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((file: any) => ({
        ...file,
        tags: file.file_tags?.map((ft: any) => ft.tags.name) || [],
      }));
    },
  });

  const handleUpdateFileType = async (fileIds: string[], newType: 'document' | 'bill' | 'offer' | 'photo') => {
    try {
      const { error } = await supabase
        .from('files')
        .update({ file_type: newType })
        .in('id', fileIds);

      if (error) throw error;

      toast.success(`Successfully moved ${fileIds.length} file(s)`);
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setSelectedFiles([]);
    } catch (error: any) {
      toast.error("Failed to move files");
      console.error('Error moving files:', error);
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="space-y-6">
      <FileToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedFiles.length}
        onUpdateFileType={handleUpdateFileType}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <FileFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            showCategories={showDocumentCategories}
          />
        </div>
        
        <div className="md:col-span-3">
          <FileUploadZone
            fileType={fileType}
            onUploadComplete={() => {
              queryClient.invalidateQueries({ queryKey: ['files'] });
            }}
          />
          
          {viewMode === 'grid' ? (
            <FileGrid
              files={files}
              isLoading={isLoading}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
            />
          ) : (
            <FileList
              files={files}
              isLoading={isLoading}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;
