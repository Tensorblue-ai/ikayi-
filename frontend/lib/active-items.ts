import type { SortableItem } from "./homepage-sections";

export function getActiveItems<T extends SortableItem>(items: T[] = []): T[] {
  return items
    .filter((item) => item.isActive !== false)
    .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0));
}
