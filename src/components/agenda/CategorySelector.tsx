import { Badge } from "@/components/ui/badge";

interface CategorySelectorProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export const CategorySelector = ({
  categories,
  selectedCategories,
  onToggleCategory,
}: CategorySelectorProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Partner Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/80 transition-colors"
            onClick={() => onToggleCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};