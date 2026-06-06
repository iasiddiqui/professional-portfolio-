'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, Loader2, Plus } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
import { BLOG_SUGGESTED_CATEGORIES } from '@/features/blog/config/blog.config';
import { blogCategoryService } from '@/features/blog/services/blog-category.service';
import type { BlogCategory } from '@/features/blog/types/blog.types';
import { QUERY_KEYS } from '@/constants/query-keys';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { getErrorMessage } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { slugify } from '@/utils/string';

const NONE_VALUE = '__none__';
const SUGGEST_DEBOUNCE_MS = 1000;

interface CategorySelectorProps {
  categories: BlogCategory[];
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
  className?: string;
}

function findCategoryByName(categories: BlogCategory[], name: string): BlogCategory | undefined {
  const normalized = name.trim().toLowerCase();
  const slug = slugify(name);

  return categories.find(
    (category) => category.name.toLowerCase() === normalized || category.slug === slug
  );
}

function buildOptionPool(categories: BlogCategory[]): string[] {
  const seen = new Set<string>();
  const options: string[] = [];

  for (const name of [...BLOG_SUGGESTED_CATEGORIES, ...categories.map((c) => c.name)]) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      options.push(name);
    }
  }

  return options;
}

function filterDirectMatches(query: string, pool: string[]): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return pool;

  return pool.filter((name) => name.toLowerCase().includes(normalized));
}

function filterRelatedMatches(query: string, pool: string[], directMatches: string[]): string[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  const directKeys = new Set(directMatches.map((name) => name.toLowerCase()));
  const tokens = normalized.split(/[\s&+/]+/).filter((token) => token.length >= 2);

  return pool
    .filter((name) => {
      if (directKeys.has(name.toLowerCase())) return false;

      const lower = name.toLowerCase();
      return (
        tokens.some((token) => lower.includes(token)) ||
        lower.split(/[\s&+/]+/).some((word) => word.startsWith(normalized))
      );
    })
    .slice(0, 10);
}

export function CategorySelector({
  categories,
  value,
  onChange,
  error,
  className,
}: CategorySelectorProps) {
  const queryClient = useQueryClient();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebouncedValue(inputValue, SUGGEST_DEBOUNCE_MS);

  const optionPool = useMemo(() => buildOptionPool(categories), [categories]);

  const selectedCategory = value === NONE_VALUE ? null : categories.find((c) => c.id === value);

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => blogCategoryService.create({ name: name.trim() }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.categories.all });
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create category')),
  });

  const isPending = createCategoryMutation.isPending;

  useEffect(() => {
    if (open) return;

    if (value === NONE_VALUE) {
      setInputValue('');
      return;
    }

    const category = categories.find((item) => item.id === value);
    if (category) {
      setInputValue(category.name);
    }
  }, [categories, open, value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const trimmedInput = inputValue.trim();
  const directMatches = useMemo(
    () => filterDirectMatches(trimmedInput, optionPool),
    [optionPool, trimmedInput]
  );

  const relatedMatches = useMemo(() => {
    if (!trimmedInput) return [];
    if (debouncedQuery.trim() !== trimmedInput) return [];
    return filterRelatedMatches(trimmedInput, optionPool, directMatches);
  }, [debouncedQuery, directMatches, optionPool, trimmedInput]);

  const exactMatch = trimmedInput
    ? optionPool.some((name) => name.toLowerCase() === trimmedInput.toLowerCase())
    : false;

  const showCreateOption = trimmedInput.length > 0 && !exactMatch;

  const resolveCategory = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      onChange(NONE_VALUE);
      setInputValue('');
      setOpen(false);
      return;
    }

    const existing = findCategoryByName(categories, trimmed);
    if (existing) {
      onChange(existing.id);
      setInputValue(existing.name);
      setOpen(false);
      return;
    }

    try {
      const created = await createCategoryMutation.mutateAsync(trimmed);
      onChange(created.id);
      setInputValue(created.name);
      setOpen(false);
    } catch {
      // Error toast handled by mutation
    }
  };

  const selectNone = () => {
    onChange(NONE_VALUE);
    setInputValue('');
    setOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={`${listboxId}-input`}>Category</Label>

      <div ref={containerRef} className="relative">
        <input
          id={`${listboxId}-input`}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          autoComplete="off"
          value={inputValue}
          disabled={isPending}
          placeholder="Select or type a category..."
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background py-2 pl-3 pr-9 text-sm ring-offset-background',
            'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive'
          )}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setInputValue(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (directMatches.length > 0) {
                void resolveCategory(directMatches[0]!);
              } else if (showCreateOption) {
                void resolveCategory(trimmedInput);
              }
            }

            if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        <ChevronDown
          className={cn(
            'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 transition-transform',
            open && 'rotate-180'
          )}
        />
        {isPending ? (
          <Loader2 className="absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}

        {open ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            <DropdownOption
              label="No category"
              selected={value === NONE_VALUE}
              onSelect={selectNone}
            />

            {trimmedInput ? (
              <>
                {directMatches.length > 0 ? (
                  <DropdownGroup label="Matches">
                    {directMatches.map((name) => (
                      <DropdownOption
                        key={name}
                        label={name}
                        selected={selectedCategory?.name.toLowerCase() === name.toLowerCase()}
                        onSelect={() => void resolveCategory(name)}
                      />
                    ))}
                  </DropdownGroup>
                ) : null}

                {relatedMatches.length > 0 ? (
                  <DropdownGroup label="Related">
                    {relatedMatches.map((name) => (
                      <DropdownOption
                        key={`related-${name}`}
                        label={name}
                        selected={selectedCategory?.name.toLowerCase() === name.toLowerCase()}
                        onSelect={() => void resolveCategory(name)}
                      />
                    ))}
                  </DropdownGroup>
                ) : null}

                {showCreateOption ? (
                  <DropdownOption
                    label={`Create "${trimmedInput}"`}
                    icon={<Plus className="h-4 w-4" />}
                    onSelect={() => void resolveCategory(trimmedInput)}
                  />
                ) : null}

                {directMatches.length === 0 && relatedMatches.length === 0 && !showCreateOption ? (
                  <p className="px-2 py-3 text-sm text-muted-foreground">No categories found.</p>
                ) : null}
              </>
            ) : (
              <DropdownGroup label="Tech categories">
                {directMatches.map((name) => (
                  <DropdownOption
                    key={name}
                    label={name}
                    selected={selectedCategory?.name.toLowerCase() === name.toLowerCase()}
                    onSelect={() => void resolveCategory(name)}
                  />
                ))}
              </DropdownGroup>
            )}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

interface DropdownGroupProps {
  label: string;
  children: ReactNode;
}

function DropdownGroup({ label, children }: DropdownGroupProps) {
  return (
    <div className="py-1">
      <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

interface DropdownOptionProps {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onSelect: () => void;
}

function DropdownOption({ label, selected, icon, onSelect }: DropdownOptionProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none',
        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        selected && 'bg-accent/50'
      )}
    >
      <span className="flex-1 truncate">{label}</span>
      {icon}
      {selected ? <Check className="h-4 w-4 shrink-0 opacity-70" /> : null}
    </button>
  );
}
