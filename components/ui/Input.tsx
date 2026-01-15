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
                    <label htmlFor={id} className="mb-1 block text-sm font-medium text-muted-foreground">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={`w-full rounded-lg border bg-dnd-bg p-2.5 text-dnd-fg placeholder-muted-foreground transition-all focus:ring-1 focus:outline-none ${error
                        ? "border-destructive focus:border-destructive focus:ring-destructive"
                        : "border-border focus:border-ring focus:ring-ring"
                        } ${className}`}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
            </div>
        );
    },
);

Input.displayName = "Input";
