'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface KnowledgeBaseFiltersState {
  search: string;
  category: string;
  active: 'ALL' | 'true' | 'false';
}

interface KnowledgeBaseFiltersProps {
  filters: KnowledgeBaseFiltersState;
  onChange: (filters: KnowledgeBaseFiltersState) => void;
  categories: string[];
}

export function KnowledgeBaseFilters({ filters, onChange, categories }: KnowledgeBaseFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search title or content..."
          className="pl-9"
        />
      </div>
      <Select
        value={filters.category}
        onValueChange={(value) => onChange({ ...filters, category: value })}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.active}
        onValueChange={(value) => onChange({ ...filters, active: value as KnowledgeBaseFiltersState['active'] })}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All entries</SelectItem>
          <SelectItem value="true">Active only</SelectItem>
          <SelectItem value="false">Inactive only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
