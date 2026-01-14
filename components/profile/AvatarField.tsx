"use client";

import { useFilePreview } from "@/hooks/useFilePreview";

export interface AvatarFieldProps {
    error?: string;
    onChange: (file: File | null) => void;
    value?: File;
    currentPhotoURL?: string | null;
    displayName?: string;
}

export function AvatarField({ 
    error, 
    onChange, 
    value, 
    currentPhotoURL, 
    displayName 
}: AvatarFieldProps) {
    const preview = useFilePreview(value, currentPhotoURL);

    return (
         <div className="flex flex-col items-center gap-4 mb-2">
            <div className="relative w-32 h-32">
                {preview ? (
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="w-full h-full rounded-full object-cover border-4 border-gray-800 shadow-lg"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-4xl font-bold text-gray-600 border-4 border-gray-800">
                        {displayName ? displayName.charAt(0) : "U"}
                    </div>
                )}
                <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors border border-gray-900"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            onChange(e.target.files[0]);
                        }
                    }}
                />
            </div>
             {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>
    );
}
