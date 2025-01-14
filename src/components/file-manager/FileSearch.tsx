import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FileSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const FileSearch = ({ searchTerm, onSearch }: FileSearchProps) => {
  return (
    <div className="flex-1">
      <Input
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
        prefix={<Search className="w-4 h-4 text-muted-foreground" />}
      />
    </div>
  );
};