'use client';

export default function DeleteUserModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md space-y-4">
        <h2 className="text-xl font-bold">Confirm Delete</h2>
        <p>Are you sure you want to delete <strong>{user.name}</strong>?</p>
        <div className="flex gap-4">
          <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded">Confirm</button>
          <button onClick={onCancel} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}
