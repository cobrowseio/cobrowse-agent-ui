export const ASCENDING = 'ascending'
export const DESCENDING = 'descending'

export type SortDirection = typeof ASCENDING | typeof DESCENDING

export interface TableSort {
  key: string
  direction: SortDirection
}

/** Reads a column off a row for sorting. Memoise a set of these - they are a dependency of the sort. */
export type TableSortValues<TRow> = Record<string, (row: TRow) => unknown>

/**
 * What clicking a column asks for: the column already sorted by flips
 * direction, and any other takes `firstDirection`.
 */
export function nextSort (sort: TableSort | undefined, key: string, firstDirection: SortDirection = ASCENDING): TableSort {
  if (sort?.key !== key) return { key, direction: firstDirection }

  return { key, direction: sort.direction === ASCENDING ? DESCENDING : ASCENDING }
}
