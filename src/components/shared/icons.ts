import { Search, Crown, Sparkles } from 'lucide-react';

export const icons = {
  Search,
  Crown,
  Sparkles
} as const;

export type IconName = keyof typeof icons;