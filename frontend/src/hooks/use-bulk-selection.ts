import { useCallback, useMemo, useState } from 'react';

export function useBulkSelection(itemIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected = itemIds.length > 0 && itemIds.every((id) => selectedIds.includes(id));
  const someSelected = itemIds.some((id) => selectedIds.includes(id));

  const toggleAll = useCallback(() => {
    if (allSelected) {
      const pageIds = new Set(itemIds);
      setSelectedIds((current) => current.filter((id) => !pageIds.has(id)));
      return;
    }

    setSelectedIds((current) => [...new Set([...current, ...itemIds])]);
  }, [allSelected, itemIds]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectionProps = useMemo(
    () => ({
      selectedIds,
      setSelectedIds,
      allSelected,
      someSelected,
      toggleAll,
      toggleOne,
      clearSelection,
    }),
    [allSelected, clearSelection, selectedIds, someSelected, toggleAll, toggleOne]
  );

  return selectionProps;
}
