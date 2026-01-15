import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    isLoading?: boolean;
}

export function Button({
    children,
    variant = "primary",
    isLoading = false,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "border-transparent bg-dnd-red text-white hover:bg-dnd-crimson focus:ring-dnd-red/40",
        secondary: "border-transparent bg-muted text-dnd-fg hover:bg-muted/80 focus:ring-ring",
        outline: "border-border text-dnd-fg hover:bg-muted focus:ring-ring",
        ghost: "border-transparent text-muted-foreground hover:text-dnd-fg hover:bg-muted focus:ring-ring",
    };

    return (
        <button
            disabled={isLoading || disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}
