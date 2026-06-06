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
import { LEAD_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from '@/features/leads/config/lead.config';
import type { LeadStatus } from '@/features/leads/types/lead.types';

export interface LeadFiltersState {
  search: string;
  status: LeadStatus | 'ALL';
  projectType: string;
}

interface LeadFiltersProps {
  filters: LeadFiltersState;
  onChange: (filters: LeadFiltersState) => void;
}

export function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search name, email, company..."
          className="pl-9"
        />
      </div>
      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value as LeadStatus | 'ALL' })}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {LEAD_STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.projectType}
        onValueChange={(value) => onChange({ ...filters, projectType: value })}
      >
        <SelectTrigger className="w-full lg:w-[180px]">
          <SelectValue placeholder="Project type" />
        </SelectTrigger>
        <SelectContent>
          {PROJECT_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
