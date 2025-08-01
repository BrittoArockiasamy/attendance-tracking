'use client';
import { useEffect, useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { parseISO, format } from 'date-fns';

function groupLeavesByMonthDynamic(data) {
  const allMonthsSet = new Set();

  data.forEach(user => {
    user.dates.split(',').forEach(dateStr => {
      if (!dateStr.trim()) return;
      const date = parseISO(dateStr.trim());
      allMonthsSet.add(format(date, 'MMMM yyyy'));
    });
  });

  const allMonths = Array.from(allMonthsSet).sort((a, b) => {
    const aDate = new Date(a.split(' ')[1], new Date(`${a.split(' ')[0]} 1`).getMonth());
    const bDate = new Date(b.split(' ')[1], new Date(`${b.split(' ')[0]} 1`).getMonth());
    return aDate - bDate;
  });

  const result = data.map(user => {
    const groupedDates = {};
    allMonths.forEach(month => groupedDates[month] = []);

    user.dates.split(',').forEach(dateStr => {
      if (!dateStr.trim()) return;
      const date = parseISO(dateStr.trim());
      const key = format(date, 'MMMM yyyy');
      groupedDates[key].push(format(date, 'yyyy-MM-dd'));
    });

    const row = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      team: user.team,
      reason: user.reason,
    };

    allMonths.forEach(month => {
      row[month] = groupedDates[month].join(', ');
    });

    return row;
  });

  return { processedData: result, allMonths };
}

export default function AdminLeaves() {
  const [data, setData] = useState([]);

  const fetchLeaves = async (team = '') => {
    const url = team ? `/api/admin/leave-history?team=${team}` : `/api/admin/leave-history`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      setData(data);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);


  const { processedData, allMonths } = useMemo(() => groupLeavesByMonthDynamic(data), [data]);

  const columns = useMemo(() => [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Phone', accessorKey: 'phone' },
  { header: 'Team', accessorKey: 'team' },
  ...allMonths.map(month => ({
    header: month,
    accessorKey: month,
  })),
  { header: 'Reason', accessorKey: 'reason' },
], [allMonths]);

  const [globalFilter, setGlobalFilter] = useState('');
  const table = useReactTable({
    data: processedData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border p-2 w-full max-w-sm"
        />
        <select
          onChange={(e) => fetchLeaves(e.target.value)}
          className="border p-2 ml-4"
        >
          <option value="">All Teams</option>
          <option value="paypal">Paypal</option>
          <option value="amazon">Amazon</option>
          <option value="ford">Ford</option>
        </select>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border p-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
