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

export interface TestimonialFiltersState {
  search: string;
  featured: 'ALL' | 'true' | 'false';
}

interface TestimonialFiltersProps {
  filters: TestimonialFiltersState;
  onChange: (filters: TestimonialFiltersState) => void;
}

export function TestimonialFilters({ filters, onChange }: TestimonialFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search client, company, content..."
          className="pl-9"
        />
      </div>
      <Select
        value={filters.featured}
        onValueChange={(value) => onChange({ ...filters, featured: value as TestimonialFiltersState['featured'] })}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Featured filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All testimonials</SelectItem>
          <SelectItem value="true">Featured only</SelectItem>
          <SelectItem value="false">Not featured</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
