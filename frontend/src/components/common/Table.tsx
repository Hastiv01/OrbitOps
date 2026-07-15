import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from './index';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  width?: string;
}

interface TableProps<T extends { id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  hoverable?: boolean;
  striped?: boolean;
  compact?: boolean;
  maxHeight?: string;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  onEdit,
  onDelete,
  sortConfig,
  onSort,
  isLoading = false,
  emptyMessage = 'No data available',
  hoverable = true,
  striped = true,
  compact = false,
  maxHeight,
}: TableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(sortConfig?.key || null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>(sortConfig?.direction || 'asc');

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey as keyof T];
      const bVal = b[sortKey as keyof T];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key);
    } else {
      if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKey(key);
        setSortDirection('asc');
      }
    }
  };

  const padding = compact ? 'px-4 py-2' : 'px-6 py-4';

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5 print:hidden">
        <div className={`space-y-3 p-6`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-slate-100 dark:bg-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5 print:border-slate-300">
        <p className="text-slate-500 dark:text-slate-400 print:text-black">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 print:border-slate-300 print:overflow-visible ${maxHeight ? 'overflow-y-auto' : ''}`} style={{ maxHeight }}>
      <table className="w-full text-left print:break-inside-avoid">
        <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 backdrop-blur dark:border-white/10 dark:bg-white/5 print:bg-white print:border-slate-300">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`${padding} text-left text-sm font-semibold text-slate-700 dark:text-slate-300 print:text-black`}
                style={{ width: col.width }}
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(String(col.key))}
                    className="flex items-center gap-2 transition hover:text-slate-900 dark:hover:text-white print:text-black print:hover:text-black"
                  >
                    {col.label}
                    {sortKey === String(col.key) && (
                      <motion.span initial={{ rotate: 0 }} animate={{ rotate: sortDirection === 'asc' ? 0 : 180 }} className="print:hidden">
                        {sortDirection === 'asc' ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </motion.span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {(onEdit || onDelete) && <th className={`${padding} text-right text-sm font-semibold text-slate-700 dark:text-slate-300 print:hidden`}>Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 print:divide-slate-300">
          {sortedData.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`transition ${
                hoverable ? 'hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer print:hover:bg-transparent' : ''
              } ${striped && index % 2 === 1 ? 'bg-slate-50/50 dark:bg-white/5' : ''}`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className={`${padding} text-sm text-slate-700 dark:text-slate-200 print:text-black`} style={{ width: col.width }}>
                  {col.render ? col.render(item[col.key], item, index) : String(item[col.key] || '-')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className={`${padding} text-right print:hidden`}>
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(item);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ==================== DATA TABLE WITH PAGINATION & FILTERING ====================
interface DataTableProps<T extends { id: string }> extends TableProps<T> {
  filteredData?: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  data: initialData,
  filteredData,
  pagination,
  searchValue,
  onSearchChange,
  filters,
  ...tableProps
}: DataTableProps<T>) {
  const displayData = filteredData || initialData;

  return (
    <div className="space-y-4">
      {(onSearchChange || filters) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center print:hidden">
          {onSearchChange && (
            <input
              type="text"
              placeholder="Search..."
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500"
            />
          )}
          {filters && <div className="flex flex-wrap gap-2">{filters}</div>}
        </div>
      )}

      <Table columns={columns} data={displayData} {...tableProps} />

      {pagination && (
        <div className="flex items-center justify-between print:hidden">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrevPage}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              <FiChevronLeft /> Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNextPage}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              Next <FiChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
