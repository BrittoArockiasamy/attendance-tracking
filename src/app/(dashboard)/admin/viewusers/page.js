'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import FileUpload from '@/components/FileUpload';
import UserExcelTable from '@/components/userExcelTable'

export default function ViewUsers() {


    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [notification, setNotification] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [userExcelData, setUserExcelData] = useState('');

    const [newUser, setNewUser] = useState({
        name: '',
        phone: '',
        email: '',
        team: '',
        role: 'employee',
    });



    const fetchData = () => {
        fetch('/api/users')
            .then((res) => res.json())
            .then(setData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        await fetch('/api/users', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
            headers: { 'Content-Type': 'application/json' },
        });
        fetchData();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await fetch('/api/users', {
            method: 'PUT',
            body: JSON.stringify({
                id: editUser._id,
                name: editUser.name,
                phone: editUser.phone,
                email: editUser.email,
                team: editUser.team,
                role: editUser.role,
            }),
            headers: { 'Content-Type': 'application/json' },
        });
        setEditUser(null);
        fetchData();
        setNotification('User updated successfully!');

        setTimeout(() => {
            setNotification('');
        }, 3000);

    };

    const columns = useMemo(
        () => [
            { accessorKey: 'name', header: 'Name' },
            { accessorKey: 'phone', header: 'Phone' },
            { accessorKey: 'email', header: 'Email' },
            { accessorKey: 'team', header: 'Team' },
            { accessorKey: 'role', header: 'Role' },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button className="bg-yellow-300 px-2 rounded" onClick={() => setEditUser(row.original)}>Edit</button>


                        <button
                            className="bg-red-400 px-2 rounded"
                            onClick={() => setUserToDelete(row.original)}
                        >
                            Delete
                        </button>

                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) =>
            String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase()),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleDataUpload = (parsedData) => {
        setUserExcelData(parsedData);
        // setFilteredData(parsedData);
        // setChartFilteredData(parsedData);

        // const initialFilters = {};
        // Object.keys(parsedData[0] || {}).forEach((key) => {
        //     initialFilters[key] = '';
        // });
        // setFilters(initialFilters);
        // setPendingFilters(initialFilters);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">All Users</h1>

            <FileUpload onUploadSuccess={handleDataUpload} />

            <UserExcelTable data={userExcelData} />


            <section className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="border p-2 mb-4 w-full max-w-sm"
                />

                <button
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setShowAddModal(true)}
                >
                    Add User
                </button>

            </section>


            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="border border-gray-300 p-2 text-left">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-100">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="border border-gray-300 p-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex gap-4 mt-4">
                <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-2 bg-gray-300 rounded">
                    Previous
                </button>
                <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-2 bg-gray-300 rounded">
                    Next
                </button>
            </div>

            {editUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
                        <h2 className="text-xl font-bold">Edit User</h2>
                        <input name="name" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} className="border w-full p-2" />
                        <input name="phone" value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} className="border w-full p-2" />
                        <input name="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} className="border w-full p-2" />
                        <input name="team" value={editUser.team} onChange={(e) => setEditUser({ ...editUser, team: e.target.value })} className="border w-full p-2" />
                        <select name="role" value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value })} className="border w-full p-2">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
                            <button type="button" onClick={() => setEditUser(null)} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {notification && (
                <div className="p-3 mb-4 bg-green-100 text-green-800 rounded">
                    {notification}
                </div>
            )}

            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-md space-y-4">
                        <h2 className="text-xl font-bold">Confirm Delete</h2>
                        <p>Are you sure you want to delete <strong>{userToDelete.name}</strong>?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={async () => {
                                    await fetch('/api/users', {
                                        method: 'DELETE',
                                        body: JSON.stringify({ id: userToDelete._id }),
                                        headers: { 'Content-Type': 'application/json' },
                                    });
                                    setUserToDelete(null);
                                    fetchData();
                                    setNotification('User deleted successfully!');
                                    setTimeout(() => setNotification(''), 3000);
                                }}
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="bg-gray-400 text-white p-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await fetch('/api/users', {
                                method: 'POST',
                                body: JSON.stringify(newUser),
                                headers: { 'Content-Type': 'application/json' },
                            });
                            setShowAddModal(false);
                            fetchData();
                            setNotification('User added successfully!');
                            setTimeout(() => setNotification(''), 3000);
                            setNewUser({ name: '', phone: '', email: '', team: '', role: 'employee' });
                        }}
                        className="bg-white p-6 rounded shadow-md space-y-4"
                    >
                        <h2 className="text-xl font-bold">Add New User</h2>
                        <input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="border w-full p-2" />
                        <input placeholder="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="border w-full p-2" />
                        <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border w-full p-2" />
                        <input placeholder="Team" value={newUser.team} onChange={(e) => setNewUser({ ...newUser, team: e.target.value })} className="border w-full p-2" />
                        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border w-full p-2">
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add</button>
                            <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );


}



/*

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminUserTable from '@/components/AdminUserTable';
import AddUserModal from '@/components/AddUserModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import NotificationToast from '@/components/NotificationToast';

export default function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });
      setNotification('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Delete failed:', error);
      setNotification('Error deleting user');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      setNotification('User added successfully');
      fetchUsers();
    } catch (error) {
      console.error('Add user failed:', error);
      setNotification('Error adding user');
    } finally {
      setShowAddModal(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin User Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name"
        className="mb-4 p-2 border rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <AdminUserTable users={filteredUsers} onDeleteClick={handleDeleteClick} />

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAddUser={handleAddUser}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          user={selectedUser}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {notification && (
        <NotificationToast
          message={notification}
          onClose={() => setNotification('')}
        />
      )}
    </div>
  );
}
*/