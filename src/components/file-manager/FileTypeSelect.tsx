import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FileTypeSelectProps {
  onTypeChange: (type: string) => void;
  currentType: string;
}

const FILE_TYPES = [
  { value: "documents", label: "Documents" },
  { value: "bills", label: "Bills" },
  { value: "offers", label: "Offers" },
  { value: "photos", label: "Photos" },
];

export const FileTypeSelect = ({ onTypeChange, currentType }: FileTypeSelectProps) => {
  return (
    <Select value={currentType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Change type to..." />
      </SelectTrigger>
      <SelectContent>
        {FILE_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};