import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Inbox } from 'lucide-react';
import Pagination from './Pagination';

export default function DataTable({
  columns,
  data = [],
  searchable = true,
  itemsPerPage = 8,
  emptyMessage = 'No records found'
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colKey);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [data, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3.5 ${col.sortable !== false ? 'cursor-pointer hover:text-slate-900 dark:hover:text-white select-none' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {sortColumn === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={row.id || rIdx}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 font-medium whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key] || '—'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <Inbox className="w-10 h-10 mb-2 opacity-50 stroke-[1.5]" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{emptyMessage}</p>
                    <p className="text-xs text-slate-400 mt-1">Try refining your search or filter options</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {sortedData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
