import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = "", id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-300">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={`w-full appearance-none rounded-lg border bg-gray-600/10 p-2.5 text-white placeholder-gray-400 transition-all focus:ring-1 focus:outline-none ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-600/50 focus:border-blue-500 focus:ring-blue-500"
                    } ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-800 text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
            </div>
        );
    },
);

Select.displayName = "Select";
