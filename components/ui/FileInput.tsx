"use client";

import { useState, ChangeEvent } from "react";

interface FileInputProps {
  label: string;
  error?: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export function FileInput({ label, error, onChange, accept = "image/*" }: FileInputProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer flex items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-gray-600 hover:border-blue-500 bg-gray-800/50 overflow-hidden transition-colors">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-xs text-center px-1">Upload Photo</span>
          )}
          <input type="file" className="hidden" accept={accept} onChange={handleFileChange} />
        </label>
        <div className="flex-1 text-xs text-gray-500">
           Click to upload a profile picture. JPG/PNG enabled.
           {error && <p className="text-red-400 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}
