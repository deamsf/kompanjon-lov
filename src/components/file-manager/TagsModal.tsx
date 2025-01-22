import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TagsInput } from "./TagsInput";

interface TagsModalProps {
  fileIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TagsModal = ({ fileIds, isOpen, onClose, onSuccess }: TagsModalProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateTags = async () => {
    if (tags.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one tag",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      // First, ensure all tags exist
      const { data: existingTags, error: tagsError } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', tags);

      if (tagsError) throw tagsError;

      const existingTagNames = existingTags.map(t => t.name);
      const newTags = tags.filter(t => !existingTagNames.includes(t));

      // Create new tags
      let allTagIds = [...existingTags];
      if (newTags.length > 0) {
        const { data: createdTags, error: createError } = await supabase
          .from('tags')
          .insert(newTags.map(name => ({ name })))
          .select();

        if (createError) throw createError;
        allTagIds = [...allTagIds, ...createdTags];
      }

      // Create file_tags associations
      const fileTagsToCreate = fileIds.flatMap(fileId =>
        allTagIds.map(tag => ({
          file_id: fileId,
          tag_id: tag.id
        }))
      );

      const { error: linkError } = await supabase
        .from('file_tags')
        .insert(fileTagsToCreate);

      if (linkError) throw linkError;

      toast({
        title: "Success",
        description: "Tags added successfully",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Tag update error:', error);
      toast({
        title: "Error",
        description: "Failed to update tags",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tags to Files</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <TagsInput
            value={tags}
            onChange={setTags}
            placeholder="Add tags..."
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdateTags} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Add Tags"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};