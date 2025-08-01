'use client';

import React, { useRef, useState } from 'react';

export default function FileUpload({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name); // Show file name after selection

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    onUploadSuccess(result.data);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={triggerFileInput}
        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        📁 Upload Excel File (.xlsx)
      </button>

      {fileName && (
        <p className="mt-2 text-sm text-gray-600">
          ✅ <span className="font-medium">Selected:</span> {fileName}
        </p>
      )}
    </div>
  );
}
