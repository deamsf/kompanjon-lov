import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TagsInput } from "@/components/file-manager/TagsInput";

interface FileSidebarProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const FileSidebar = ({ selectedTags, onTagsChange }: FileSidebarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <TagsInput
          value={selectedTags}
          onChange={onTagsChange}
          placeholder="Filter by tags..."
        />
      </CardContent>
    </Card>
  );
};