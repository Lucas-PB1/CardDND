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
                    <label htmlFor={id} className="mb-1 block text-sm font-medium text-muted-foreground">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={id}
                    className={`w-full appearance-none rounded-lg border bg-dnd-bg p-2.5 text-dnd-fg placeholder-muted-foreground transition-all focus:ring-1 focus:outline-none ${error
                            ? "border-destructive focus:border-destructive focus:ring-destructive"
                            : "border-border focus:border-ring focus:ring-ring"
                        } ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-dnd-bg text-dnd-fg"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
            </div>
        );
    },
);

Select.displayName = "Select";
