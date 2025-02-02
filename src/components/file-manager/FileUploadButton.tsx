import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadButtonProps {
  onUploadComplete?: (file: any) => void;
  folderId?: string;
  tags?: string[];
  fileType: string;
}

export const FileUploadButton = ({ 
  onUploadComplete,
  folderId,
  tags = [],
  fileType,
}: FileUploadButtonProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      // Create a blob from the file
      const blob = new Blob([file], { type: file.type });
      
      // Create FormData and append file as blob
      const formData = new FormData();
      formData.append('file', blob, file.name);
      if (folderId) formData.append('folderId', folderId);
      if (tags.length > 0) formData.append('tags', tags.join(','));
      formData.append('type', fileType);

      const { data, error } = await supabase.functions.invoke('upload-file', {
        body: formData,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success("File uploaded successfully");

      if (onUploadComplete) {
        onUploadComplete(data.file);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <Button
      variant="default"
      className="relative"
      disabled={isUploading}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <Upload className="w-4 h-4 mr-2" />
      {isUploading ? "Uploading..." : "Upload"}
    </Button>
  );
};