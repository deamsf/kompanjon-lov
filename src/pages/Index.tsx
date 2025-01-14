import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileUploadButton } from "@/components/file-manager/FileUploadButton";
import { ShareModal } from "@/components/file-manager/ShareModal";
import { FileList } from "@/components/file-manager/FileList";
import { FileSearch } from "@/components/file-manager/FileSearch";
import { FileSidebar } from "@/components/file-manager/FileSidebar";
import { FileItem } from "@/types/files";

const Index = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'name' | 'size' | 'type'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [sortField, sortDirection, searchTerm, selectedTags]);

  const fetchFiles = async () => {
    try {
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

      const formattedFiles = data.map((file: any) => ({
        ...file,
        tags: file.file_tags?.map((ft: any) => ft.tags.name) || [],
      }));

      const sortedFiles = formattedFiles.sort((a: any, b: any) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;

        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });

      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex gap-4">
          <FileUploadButton
            onUploadComplete={() => fetchFiles()}
            tags={selectedTags}
          />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <FileSidebar
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>

        <div className="col-span-9">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-4">
                <FileSearch
                  searchTerm={searchTerm}
                  onSearch={setSearchTerm}
                />
              </div>
              <FileList
                files={files}
                isLoading={isLoading}
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
                onShare={handleShare}
                onSort={handleSort}
              />
            </CardContent>
          </Card>
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

export default Index;