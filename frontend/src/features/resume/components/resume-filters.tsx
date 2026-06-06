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

export interface ResumeFiltersState {
  search: string;
  isActive: 'ALL' | 'true' | 'false';
}

interface ResumeFiltersProps {
  filters: ResumeFiltersState;
  onChange: (filters: ResumeFiltersState) => void;
}

export function ResumeFilters({ filters, onChange }: ResumeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search title or version..."
          className="pl-9"
        />
      </div>
      <Select
        value={filters.isActive}
        onValueChange={(value) => onChange({ ...filters, isActive: value as ResumeFiltersState['isActive'] })}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Active filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All versions</SelectItem>
          <SelectItem value="true">Active only</SelectItem>
          <SelectItem value="false">Inactive only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
