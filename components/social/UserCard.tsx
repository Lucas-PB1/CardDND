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
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
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
                    <h3 className="font-semibold text-white">{user.displayName}</h3>
                    <p className="text-sm text-gray-400">{user.email}</p>
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
