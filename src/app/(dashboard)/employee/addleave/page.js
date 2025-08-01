'use client';

import { useState } from 'react';
import MultiDateSelector from '@/components/MultiDateSelector';
export default function AddLeave() {
  const [dates, setDates] = useState([]);
  const [reason, setReason] = useState('');
  const [notification, setNotification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/leave', {
      method: 'POST',
      body: JSON.stringify({ dates, reason }),
      headers: { 'Content-Type': 'application/json' },
    });
    setNotification('Leave submitted successfully!');
    setDates([]);
    setReason('');
    setTimeout(() => setNotification(''), 3000);
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Apply for Leave</h1>

      {notification && (
        <div className="p-3 mb-4 bg-green-100 text-green-800 rounded">{notification}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <MultiDateSelector onSelect={setDates} />

        <div>
          <label className="block mb-1 font-medium">Reason (Optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border p-2 w-full"
            rows={3}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
