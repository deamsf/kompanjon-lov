
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { TagsInput } from "./TagsInput";

interface FileFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  showCategories?: boolean;
}

const DOCUMENT_CATEGORIES = [
  { value: 'architect_report', label: "Architect's Report" },
  { value: 'permit', label: 'Permit' },
  { value: 'photo', label: 'Photo' },
  { value: 'offer', label: 'Offer' },
  { value: 'bill', label: 'Bill' },
  { value: 'other', label: 'Other' },
];

export const FileFilter = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagsChange,
  selectedCategory,
  onCategoryChange,
  showCategories = false,
}: FileFilterProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Filter by Tags</Label>
        <TagsInput
          value={selectedTags}
          onChange={onTagsChange}
          placeholder="Add tags to filter..."
        />
      </div>

      {showCategories && (
        <div className="space-y-2">
          <Label>Document Categories</Label>
          <div className="space-y-2">
            {DOCUMENT_CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onCategoryChange(
                  selectedCategory === category.value ? null : category.value
                )}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {(selectedTags.length > 0 || selectedCategory) && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onTagsChange(selectedTags.filter(t => t !== tag))}
                />
              </Badge>
            ))}
            {selectedCategory && (
              <Badge
                variant="secondary"
                className="gap-1"
              >
                {DOCUMENT_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => onCategoryChange(null)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
