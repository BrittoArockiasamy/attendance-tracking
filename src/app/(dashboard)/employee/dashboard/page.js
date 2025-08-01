'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function EmployeeDashboard() {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch('/api/leave-history');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setEmployeeName(data[0].name);  // Assuming all rows are for same employee
        }
        setLeaveHistory(data);
      }
    };
    fetchHistory();
  }, []);

  const columns = useMemo(
    () => [
      { header: 'Dates', accessorKey: 'dates' },
      { header: 'Reason', accessorKey: 'reason' },
    ],
    []
  );

  const table = useReactTable({
    data: leaveHistory,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Leave History</h1>
      {employeeName && <h2 className="text-lg font-semibold mb-4">for: {employeeName}</h2>}

      <input
        type="text"
        placeholder="Search..."
        className="border p-2 mb-4 w-full max-w-sm"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border px-4 py-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
