
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TagsInput } from "./TagsInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploadZoneProps {
  fileType: string;
  onUploadComplete: () => void;
}

export const FileUploadZone = ({ fileType, onUploadComplete }: FileUploadZoneProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setShowDialog(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);
        if (tags.length > 0) {
          formData.append('tags', tags.join(','));
        }
        if (description) {
          formData.append('description', description);
        }
        if (category) {
          formData.append('category', category);
        }

        const { error } = await supabase.functions.invoke('upload-file', {
          body: formData,
        });

        if (error) throw error;
      }

      toast.success(`${files.length} file(s) uploaded successfully`);
      onUploadComplete();
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    setFiles([]);
    setTags([]);
    setDescription("");
    setCategory("");
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select files"}
        </p>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selected Files</Label>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="truncate flex-1">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {fileType === 'document' && (
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="architect_report">Architect's Report</SelectItem>
                    <SelectItem value="permit">Permit</SelectItem>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="bill">Bill</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Tags</Label>
              <TagsInput
                value={tags}
                onChange={setTags}
                placeholder="Add tags..."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
