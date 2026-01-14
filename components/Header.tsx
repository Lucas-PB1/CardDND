"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button"; // Assuming you have a reusable Button
import { useState } from "react";
import { NotificationBell } from "./notifications/NotificationBell";

export function Header() {
  const { user, logout, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black/50 px-6 backdrop-blur-md">
         <div className="h-6 w-24 animate-pulse rounded bg-gray-700/50"></div>
         <div className="h-8 w-8 animate-pulse rounded-full bg-gray-700/50"></div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black/50 px-6 backdrop-blur-md">
      <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        CardND
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="relative">
            <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-full ring-2 ring-transparent transition-all hover:ring-blue-500/50 focus:outline-none focus:ring-blue-500"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="h-9 w-9 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white uppercase border border-white/10">
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
                    <div className="absolute right-0 mt-2 z-50 w-48 rounded-xl border border-white/10 bg-gray-900 p-2 shadow-2xl backdrop-blur-xl">
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                            <p className="text-sm font-medium text-white truncate">{user.displayName || "User"}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link 
                            href="/profile"
                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            Profile
                        </Link>
                        <Link 
                            href="/social"
                            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            Social
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                setIsDropdownOpen(false);
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors"
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
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link href="/register">
                <Button className="h-9 px-4 text-sm">
                    Get Started
                </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
