"use client";

import { forwardRef } from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="flex cursor-pointer items-center space-x-3">
                    <input
                        ref={ref}
                        type="checkbox"
                        className={`h-5 w-5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900 ${className}`}
                        {...props}
                    />
                    <span className="text-sm text-gray-300">{label}</span>
                </label>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    },
);

Checkbox.displayName = "Checkbox";
