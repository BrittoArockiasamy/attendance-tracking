// // /app/upload/components/DashboardTable.js

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// Editable config
const COLUMN_VISIBILITY_CONFIG = {
  'Opportunity ID': true,
  'Opportunity Split: Opportunity Split I D': false,
  'English Account Name': true,
  'Opportunity Name': true,
  'Opportunity Leader': true,
  'Split Leader': true,
  'Stage': true,
  'Expected Close Date': true,
  'Jupiter Split Amount': true,
  'Win Probability': true,
  'Offering ( C S L 3)': false,
  'Offering ( C S L 4)': false,
  'Commit Value': true,
  'Remarks': false,
  'Quarter Detail': false,
  'Closed Won': false,
  'Closed Month': true,
  'Geography': true,
  'Vertical': true,
  'Filter': false,
  'Tab': false,
};

const LOCAL_STORAGE_KEY = 'user_column_visibility';

export default function UserExcelTable({ data, showToggleUI = true }) {



console.log('data in excel tble::',data)


  const initialColumns = useMemo(() => {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0]).map((key) => {
      return {
        accessorKey: key,
        header: key.replace(/([A-Z])/g, ' $1'),
        cell: (info) => {
          const value = info.getValue();

          // ✅ Match against the raw key, not formatted header
          if (key === 'Expected Close Date' && typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date)) {
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            }
          }

          return value;
        },
      };
    });
  }, [data]);


  const [columnVisibility, setColumnVisibility] = useState({});

  // Load localStorage or fallback to config
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let visibility = {};
    if (stored) {
      visibility = JSON.parse(stored);
    } else {
      visibility = Object.fromEntries(
        initialColumns.map((col) => [
          col.accessorKey,
          COLUMN_VISIBILITY_CONFIG[col.accessorKey] ?? true,
        ])
      );
    }
    setColumnVisibility(visibility);
  }, [initialColumns]);


  // Filter visible columns
  const visibleColumnsGlobal = useMemo(
    () => initialColumns.filter((col) => columnVisibility[col.accessorKey]),
    [initialColumns, columnVisibility]
  );

  // Notify parent of visible columns
//   useEffect(() => {
//     if (typeof onVisibleColumnsChange === 'function') {
//       const visibleKeys = visibleColumnsGlobal.map((col) => col.accessorKey);
//       onVisibleColumnsChange(visibleKeys);
//     }
//   }, [visibleColumnsGlobal, onVisibleColumnsChange]);

  // Save to localStorage
  useEffect(() => {
    if (Object.keys(columnVisibility).length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(columnVisibility));
    }
  }, [columnVisibility]);

  // Filter visible columns
  const visibleColumns = useMemo(
    () => initialColumns.filter((col) => columnVisibility[col.accessorKey]),
    [initialColumns, columnVisibility]
  );

  const table = useReactTable({
    data,
    columns: visibleColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (initialColumns.length === 0) return <div className="mt-4 text-gray-500">No data to display</div>;

  const handleToggle = (key) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="mt-4">
      {showToggleUI && (
        <div className="mb-4 p-3 border rounded bg-gray-50 max-h-64 overflow-auto">
          <h3 className="font-semibold mb-2">Toggle Columns</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {initialColumns.map((col) => (
              <label key={col.accessorKey} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={columnVisibility[col.accessorKey] ?? true}
                  onChange={() => handleToggle(col.accessorKey)}
                />
                <span>{col.accessorKey}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            {table.getHeaderGroups().map((headerGroup, i) => (
              <tr key={headerGroup.id + i}>
                {headerGroup.headers.map((header, inx) => (
                  <th key={header.id + inx} className="px-4 py-2 border-b">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, inx) => (
              <tr key={row.id + inx} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell, index) => (
                  <td key={cell.id + index} className="px-4 py-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

