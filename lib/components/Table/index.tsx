import { createContext, useContext, useMemo, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import clsx from 'clsx'
import { ASCENDING, nextSort, type SortDirection, type TableSort } from './sort'
import styles from './Table.module.css'
import Button from '../Button'

export {
  ASCENDING,
  DESCENDING
} from './sort'
export type {
  SortDirection,
  TableSort,
  TableSortValues
} from './sort'

interface TableContextValue {
  sortBy: (key: string, firstDirection?: SortDirection) => void
  directionOf: (key?: string) => SortDirection | undefined
}

const TableContext = createContext<TableContextValue | null>(null)
const ColumnContext = createContext<string | undefined>(undefined)

function useTableContext (part: string): TableContextValue {
  const table = useContext(TableContext)

  if (!table) throw new Error(`<Table.${part}> must be rendered inside <Table>`)

  return table
}

export interface TableProps extends ComponentPropsWithoutRef<'table'> {
  /** The column the rows are in the order of, and which way. Always controlled. */
  sort?: TableSort
  /**
   * Called with the sort a SortButton click asks for, the column already
   * sorted by flipping direction. Ordering the rows to match is the caller's
   * responsibility.
   */
  onSortChange?: (sort: TableSort) => void
}

export type TableHeadProps = ComponentPropsWithoutRef<'thead'>
export type TableBodyProps = ComponentPropsWithoutRef<'tbody'>
export type TableRowProps = ComponentPropsWithoutRef<'tr'>

export interface TableHeadCellProps extends ComponentPropsWithoutRef<'th'> {
  /** Marks this header as the one sorted by, and supplies the column to a nested SortButton */
  column?: string
}

export interface TableCellProps extends ComponentPropsWithoutRef<'td'> {
  column?: string
}

export interface TableSortButtonState {
  isSorted: boolean
  direction?: SortDirection
}

export interface TableSortButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  /** Defaults to the enclosing HeadCell's column */
  column?: string
  /** The direction applied when this column is first sorted by */
  firstDirection?: SortDirection
  /** Render the sort button contents. May be a function, which receives this column's sort state */
  children?: ReactNode | ((state: TableSortButtonState) => ReactNode)
}

export interface TableEmptyProps extends ComponentPropsWithoutRef<'td'> {
  colSpan: number
}

const TableBase = ({ sort, onSortChange, className, ...props }: TableProps) => {
  const context = useMemo<TableContextValue>(() => ({
    sortBy: (key, firstDirection) => { onSortChange?.(nextSort(sort, key, firstDirection)) },
    directionOf: (key) => key !== undefined && sort?.key === key ? sort.direction : undefined
  }), [sort, onSortChange])

  return (
    <TableContext.Provider value={context}>
      <table className={clsx(styles.table, className)} {...props} />
    </TableContext.Provider>
  )
}

const Head = ({ className, ...props }: TableHeadProps) => (
  <thead className={clsx(styles.head, className)} {...props} />
)

const Body = ({ className, ...props }: TableBodyProps) => (
  <tbody className={clsx(styles.body, className)} {...props} />
)

const Row = ({ className, ...props }: TableRowProps) => (
  <tr className={clsx(styles.row, className)} {...props} />
)

const HeadCell = ({ column, className, ...props }: TableHeadCellProps) => {
  const { directionOf } = useTableContext('HeadCell')
  const direction = directionOf(column)

  return (
    <ColumnContext.Provider value={column}>
      <th
        scope='col'
        aria-sort={direction}
        data-sorted={direction ? true : undefined}
        className={clsx(styles.headCell, className)}
        {...props}
      />
    </ColumnContext.Provider>
  )
}

const Cell = ({ column, className, ...props }: TableCellProps) => {
  const { directionOf } = useTableContext('Cell')

  return (
    <td
      data-sorted={directionOf(column) ? true : undefined}
      className={clsx(styles.cell, className)}
      {...props}
    />
  )
}

const SortButton = ({
  column,
  firstDirection = ASCENDING,
  className,
  children,
  ...props
}: TableSortButtonProps) => {
  const { sortBy, directionOf } = useTableContext('SortButton')
  const headCellColumn = useContext(ColumnContext)
  const key = column ?? headCellColumn

  if (key === undefined) throw new Error('<Table.SortButton> needs a column, either its own or a HeadCell\'s')

  const direction = directionOf(key)

  return (
    <Button
      className={clsx(styles.sortButton, className)}
      onClick={() => { sortBy(key, firstDirection) }}
      {...props}
    >
      {typeof children === 'function'
        ? children({ isSorted: direction !== undefined, direction })
        : children}
    </Button>
  )
}

const Empty = ({ colSpan, className, ...props }: TableEmptyProps) => (
  <tr className={styles.row}>
    <td colSpan={colSpan} className={clsx(styles.cell, styles.emptyCell, className)} {...props} />
  </tr>
)

type TableComponent = ((props: TableProps) => ReactNode) & {
  Head: typeof Head
  Body: typeof Body
  Row: typeof Row
  HeadCell: typeof HeadCell
  Cell: typeof Cell
  SortButton: typeof SortButton
  Empty: typeof Empty
}

const Table: TableComponent = Object.assign(TableBase, {
  Head,
  Body,
  Row,
  HeadCell,
  Cell,
  SortButton,
  Empty
})

export { Table }
export default Table
