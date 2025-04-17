import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

import { useEffect, useState } from "react";

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue]);

  return (
    <form
      className="flex items-center gap-2 mb-4"
      onSubmit={e => e.preventDefault()}
      role="search"
    >
      <Input
        type="text"
        placeholder="Search by SKU or Title"
        value={localValue}
        onChange={e => setLocalValue(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="outline" size="icon" aria-label="Search">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
