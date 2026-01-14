import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`w-full rounded-lg border bg-gray-600/10 p-2.5 text-white placeholder-gray-400 transition-all focus:ring-1 focus:outline-none ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-600/50 focus:border-blue-500 focus:ring-blue-500"
                    } ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>
        );
    },
);

Input.displayName = "Input";
