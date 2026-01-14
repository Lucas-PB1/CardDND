import { ChangeEvent, useState } from "react";

import Image from "next/image";

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
            <label className="mb-1 block text-sm font-medium text-gray-300">{label}</label>
            <div className="flex items-center gap-4">
                <label className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-600 bg-gray-800/50 transition-colors hover:border-blue-500">
                    {preview ? (
                        <Image
                            src={preview}
                            alt="Avatar preview"
                            width={96}
                            height={96}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="px-1 text-center text-xs text-gray-500">Upload Photo</span>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileChange}
                    />
                </label>
                <div className="flex-1 text-xs text-gray-500">
                    Click to upload a profile picture. JPG/PNG enabled.
                    {error && <p className="mt-1 text-red-400">{error}</p>}
                </div>
            </div>
        </div>
    );
}
