"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

import { NotificationBell } from "./notifications/NotificationBell";

export function Header() {
    const { user, logout, loading } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (loading) {
        return (
            <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black/50 px-6 backdrop-blur-md">
                <div className="h-6 w-24 animate-pulse rounded bg-gray-700/50"></div>
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700/50"></div>
            </header>
        );
    }

    return (
        <header className="fixed top-0 right-0 left-0 z-50 flex h-25 items-center justify-between border-b-4 border-dnd-gold bg-gradient-to-r from-neutral-900 via-dnd-crimson to-neutral-900 px-6 shadow-xl transition-all">
            <Link
                href="/"
                className="relative h-20 w-20 transition-transform hover:scale-105 z-10 -my-2"
            >
                <div className="absolute inset-0 rounded-full border-2 border-dnd-gold bg-dnd-parchment shadow-[0_0_15px_rgba(212,175,55,0.3)] overflow-hidden">
                    <Image
                        src="/logo.jpg"
                        alt="CardND"
                        fill
                        className="object-cover"
                    />
                </div>
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 rounded-full ring-2 ring-dnd-gold/50 transition-all hover:ring-dnd-gold focus:ring-dnd-gold focus:outline-none shadow-lg"
                            >
                                {user.photoURL ? (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 rounded-full border border-white/10 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-dnd-azure text-sm font-bold text-white uppercase">
                                        {user.displayName ? user.displayName.charAt(0) : "U"}
                                    </div>
                                )}
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-border bg-dnd-card p-2 shadow-2xl backdrop-blur-xl">
                                        <div className="mb-1 border-b border-border px-3 py-2">
                                            <p className="truncate text-sm font-medium text-dnd-fg">
                                                {user.displayName || "User"}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-dnd-fg transition-colors hover:bg-muted/50"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/social"
                                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-dnd-fg transition-colors hover:bg-muted/50"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Social
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-bold text-dnd-parchment hover:text-white transition-colors"
                        >
                            Sign in
                        </Link>
                        <Link href="/register">
                            <Button className="h-9 px-6 text-sm bg-dnd-gold text-dnd-crimson hover:bg-white hover:text-dnd-crimson font-bold border-none shadow-lg">Get Started</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header >
    );
}
