import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { UserProfile } from "@/services/userService";

interface UserCardProps {
    user: UserProfile;
    actionLabel: string;
    onAction: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    variant?: "default" | "request";
    loading?: boolean;
}

export function UserCard({
    user,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    variant = "default",
    loading = false,
}: UserCardProps) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-border bg-dnd-card p-4 transition-all hover:border-dnd-red/30">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/20 text-lg font-bold text-dnd-fg">
                    {user.photoURL ? (
                        <Image
                            src={user.photoURL}
                            alt={user.displayName || "User Avatar"}
                            width={48}
                            height={48}
                            className="h-full w-full rounded-full object-cover"
                        />
                    ) : (
                        user.displayName?.charAt(0).toUpperCase() || "?"
                    )}
                </div>
                <div>
                    <h3 className="font-semibold text-dnd-fg">{user.displayName}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {secondaryActionLabel && onSecondaryAction && (
                    <Button
                        onClick={onSecondaryAction}
                        variant="secondary"
                        className="h-8 px-3 text-xs"
                        disabled={loading}
                    >
                        {secondaryActionLabel}
                    </Button>
                )}
                <Button
                    onClick={onAction}
                    variant={variant === "request" ? "primary" : "secondary"}
                    className="h-8 px-3 text-xs"
                    disabled={loading}
                >
                    {loading ? "..." : actionLabel}
                </Button>
            </div>
        </div>
    );
}
