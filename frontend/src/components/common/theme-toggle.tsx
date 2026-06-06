'use client';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/providers/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme, toggleTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" className="relative">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light {theme === 'light' && '✓'}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark {theme === 'dark' && '✓'}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System {theme === 'system' && '✓'}</DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>Quick toggle</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
