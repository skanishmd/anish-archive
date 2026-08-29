import { type ClassValue, clsx } from 'clsx';
// Note: We won't use clsx, just a simple cn function
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function formatYear(date: string | Date): string {
  return new Date(date).getFullYear().toString();
}

export function formatMonthShort(date: string | Date): string {
  return String(new Date(date).getMonth() + 1).padStart(2, '0');
}

export function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const group = key(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function sortByDate<T extends { data: { date: Date } }>(items: T[], order: 'asc' | 'desc' = 'desc'): T[] {
  return [...items].sort((a, b) => {
    const diff = new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    return order === 'desc' ? diff : -diff;
  });
}

export function getReadingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}
